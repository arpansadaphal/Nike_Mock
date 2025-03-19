import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout";
import axiosInstance from "../../utils/axiosInstance";

const countries = {
  India: ["Ahmedabad",
  "Bengaluru",
  "Bhopal",
  "Bhubaneswar",
  "Chandigarh",
  "Chennai",
  "Coimbatore",
  "Dehradun",
  "Delhi",
  "Faridabad",
  "Ghaziabad",
  "Guwahati",
  "Hyderabad",
  "Indore",
  "Jaipur",
  "Jamshedpur",
  "Kanpur",
  "Kochi",
  "Kolkata",
  "Lucknow",
  "Ludhiana",
  "Madurai",
  "Meerut",
  "Mumbai",
  "Mysuru",
  "Nagpur",
  "Nashik",
  "Noida",
  "Patna",
  "Pune",
  "Raipur",
  "Rajkot",
  "Ranchi",
  "Surat",
  "Thane",
  "Thiruvananthapuram",
  "Vadodara",
  "Varanasi",
  "Vijayawada",
  "Visakhapatnam"],
  //USA: ["New York", "Los Angeles", "Chicago"],
};

const Checkout = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  
  const [shippingDetails, setShippingDetails] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    country: "",
    pincode: "",
    phone: "",
  });
  
  const [errors, setErrors] = useState({});
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  };

  useEffect(() => {
    const savedDetails = localStorage.getItem("shippingDetails");
    if (savedDetails) {
      setShippingDetails(JSON.parse(savedDetails));
    }
  }, []);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login?redirect=/checkout");
    }
  }, [userInfo, navigate]);

  const validateForm = () => {
    let newErrors = {};
    if (!shippingDetails.name) newErrors.name = "Name is required.";
    if (!shippingDetails.email) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingDetails.email)) {
      newErrors.email = "Invalid email format.";
    }
    if (!shippingDetails.address) newErrors.address = "Address is required.";
    if (!shippingDetails.country) newErrors.country = "Country is required.";
    if (!shippingDetails.city) newErrors.city = "City is required.";
    if (!shippingDetails.pincode) {
      newErrors.pincode = "Pincode is required.";
    } else if (!/^\d{6}$/.test(shippingDetails.pincode)) {
      newErrors.pincode = "Invalid pincode format (6 digits required).";
    }
    if (!shippingDetails.phone) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(shippingDetails.phone)) {
      newErrors.phone = "Invalid phone number (10 digits required).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prev) => ({ ...prev, [name]: value }));
    localStorage.setItem("shippingDetails", JSON.stringify({ ...shippingDetails, [name]: value }));
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    setIsPaymentProcessing(true);
    try {
      const { data: razorpayOrder } = await axiosInstance.post(
        "/create_razorpay_order/", 
        { cartItems, shippingDetails, totalPrice: calculateTotal() }
      );

      const options = {
        key_id: razorpayOrder.key_id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Nike",
        description: "Payment for Order",
        order_id: razorpayOrder.razorpay_order_id,
        handler: async (response) => {
          try {
            await axiosInstance.post("/verify-payment/", response);
            alert("Payment Successful!");
            navigate(`/order/${razorpayOrder.razorpay_order_id}`);
          } catch {
            alert("Payment verification failed.");
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
        alert(`Payment failed: ${response.error.description}`);
      });

      rzp.open();
    } catch (error) {
      alert("Payment Initialization Error.");
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="checkout-page p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">Checkout</h2>

        <div className="cart-summary bg-white p-6 rounded-lg shadow-lg mb-8">
          <h3 className="text-2xl font-semibold text-gray-700">Order Summary</h3>
          <ul className="space-y-4 mt-4">
            {cartItems.map((item) => (
              <li key={item.product} className="flex items-center justify-between">
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

          {["name", "email", "address", "phone"].map((field) => (
            <div key={field} className="mb-4">
              <input
                type={field === "email" ? "email" : "text"}
                name={field}
                value={shippingDetails[field]}
                onChange={handleInputChange}
                placeholder={`Enter ${field}`}
                className="input-field w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
              {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
            </div>
          ))}

          <select name="country" value={shippingDetails.country} onChange={handleInputChange} className="w-full p-3 mb-4 border border-gray-300 rounded-md">
            <option value="">Select Country</option>
            {Object.keys(countries).map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
          {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}

          <select name="city" value={shippingDetails.city} onChange={handleInputChange} className="w-full p-3 mb-4 border border-gray-300 rounded-md">
            <option value="">Select City</option>
            {(countries[shippingDetails.country] || []).map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}

          <input type="text" name="pincode" value={shippingDetails.pincode} onChange={handleInputChange} placeholder="Enter Pincode" className="w-full p-3 border border-gray-300 rounded-md" />
          {errors.pincode && <p className="text-red-500 text-sm">{errors.pincode}</p>}
        </div>

        <button onClick={handlePayment} className="pay-now-button bg-blue-600 text-white py-3 px-6 rounded-lg w-full hover:bg-blue-700" disabled={isPaymentProcessing}>
          {isPaymentProcessing ? "Processing..." : "Place Order and Pay"}
        </button>
      </div>
    </Layout>
  );
};

export default Checkout;
