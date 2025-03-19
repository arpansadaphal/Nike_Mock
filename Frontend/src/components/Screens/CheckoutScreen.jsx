import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout";
import axiosInstance from "../../utils/axiosInstance";

const Checkout = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.userLogin);

  const [shippingDetails, setShippingDetails] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    country: "",
    pincode: "",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  // Autofill Shipping Details from userInfo
  useEffect(() => {
    const savedDetails = localStorage.getItem("shippingDetails");
    
    if (savedDetails) {
      setShippingDetails(JSON.parse(savedDetails));
    } else if (userInfo) {
      setShippingDetails({
        name: userInfo.name || "",
        email: userInfo.email || "",
        address: "",
        city: "",
        country: "",
        pincode: "",
        phone: "",
      });
    }

    const savedPaymentMethod = localStorage.getItem("paymentMethod");
    if (savedPaymentMethod) {
      setPaymentMethod(savedPaymentMethod);
    }
  }, [userInfo]);

  // Validate form before submitting
  const validateForm = () => {
    const newErrors = {};
    
    if (!shippingDetails.name.trim()) newErrors.name = "Name is required";
    if (!shippingDetails.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(shippingDetails.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!shippingDetails.address.trim()) newErrors.address = "Address is required";
    if (!shippingDetails.city.trim()) newErrors.city = "City is required";
    if (!shippingDetails.country.trim()) newErrors.country = "Country is required";
    if (!shippingDetails.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{5,6}$/.test(shippingDetails.pincode)) {
      newErrors.pincode = "Pincode must be 5-6 digits";
    }
    if (!shippingDetails.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(shippingDetails.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form changes
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prev) => ({ ...prev, [name]: value }));
    localStorage.setItem(
      "shippingDetails",
      JSON.stringify({ ...shippingDetails, [name]: value })
    );

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
    }
  };

  // Calculate total price
  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  };

  // Handle payment process
  const handlePayment = async () => {
    if (!validateForm()) {
      alert("Please fix the errors before proceeding.");
      return;
    }

    const orderData = {
      cartItems,
      shippingDetails,
      totalPrice: calculateTotal(),
    };

    setIsPaymentProcessing(true);

    try {
      console.log("Initiating payment with order data:", orderData);
      const { data: razorpayOrder } = await axiosInstance.post(
        "/create_razorpay_order/", 
        orderData
      );

      console.log("Razorpay Order Created:", razorpayOrder);

      const options = {
        key_id: razorpayOrder.key_id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Nike",
        description: "Payment for Order",
        order_id: razorpayOrder.razorpay_order_id,
        handler: async (response) => {
          try {
            console.log("Payment success response:", response);
            await axiosInstance.post("/verify-payment/", response);
            alert("Payment Successful!");
            navigate(`/order/${razorpayOrder.razorpay_order_id}`);
          } catch (verificationError) {
            console.error("Payment Verification Failed:", verificationError.response?.data || verificationError);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: shippingDetails.name || userInfo.name,
          email: shippingDetails.email || userInfo.email,
          contact: shippingDetails.phone,
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new Razorpay(options);
      rzp.on("payment.failed", (response) => {
        console.error("Payment Failed:", response.error);
        alert(`Payment failed: ${response.error.description}`);
      });

      rzp.open();
    } catch (error) {
      console.error("Payment Initialization Error:", error.response?.data || error);
      alert(`Payment Initialization Error: ${JSON.stringify(error.response?.data || error.message)}`);
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="checkout-page p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Checkout
        </h2>

        <div className="cart-summary bg-white p-6 rounded-lg shadow-lg mb-8">
          <h3 className="text-2xl font-semibold text-gray-700">Order Summary</h3>
          <ul className="space-y-4 mt-4">
            {cartItems.map((item) => (
              <li key={item.product} className="flex justify-between">
                <div className="flex items-center">
                  <img src={item.image} alt={item.productname} className="w-24 h-24 object-cover rounded-md" />
                  <span className="ml-4 text-gray-700">{item.productname}</span>
                </div>
                <span className="text-gray-700">Qty: {item.qty}</span>
                <span className="text-gray-700">₹ {item.price * item.qty}</span>
              </li>
            ))}
          </ul>
          <h4 className="text-xl font-semibold text-gray-700 mt-4">Total: ₹ {calculateTotal()}</h4>
        </div>

        <div className="shipping-details bg-white p-6 rounded-lg shadow-lg mb-8">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">Shipping Details</h3>
          {Object.keys(shippingDetails).map((field) => (
            <div key={field}>
              <input
                type={field === "email" ? "email" : "text"}
                name={field}
                value={shippingDetails[field]}
                onChange={handleShippingChange}
                placeholder={`Enter ${field}`}
                className="w-full p-3 mb-2 border border-gray-300 rounded-md"
              />
              {errors[field] && <p className="text-red-600">{errors[field]}</p>}
            </div>
          ))}
        </div>

        <button
          onClick={handlePayment}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700"
          disabled={isPaymentProcessing}
        >
          {isPaymentProcessing ? "Processing Payment..." : "Place Order and Pay"}
        </button>
      </div>
    </Layout>
  );
};

export default Checkout;
