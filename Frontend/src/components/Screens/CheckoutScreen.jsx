import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout";
// import { createOrder } from "../../Slices/createOrderSlice";
// import { createRazorpayOrder } from "../../Slices/razorPaySlice";
// import getCSRFToken from "../../utils/csrf";
import axiosInstance from "../../utils/axiosInstance";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const { order, loading, error, orderdetails } = useSelector(
    (state) => state.order
  );
  // const { razorpayOrder } = useSelector((state) => state.razorPay);
useEffect(() => {
    window.scrollTo(190, 190);
  }, []);
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

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prev) => ({ ...prev, [name]: value }));
    localStorage.setItem(
      "shippingDetails",
      JSON.stringify({ ...shippingDetails, [name]: value })
    );
  };

  const validateForm = () => {
    const requiredFields = [
      "name",
      "email",
      "address",
      "city",
      "country",
      "pincode",
      "phone",
    ];
    for (let field of requiredFields) {
      if (!shippingDetails[field]) return `Please fill out the ${field} field.`;
    }
    return "";
  };

  /*const handlePayment = async () => {
    const errorMessage = validateForm();
    if (errorMessage) {
      alert(errorMessage);
      return;
    }

    const orderData = {
      cartItems,
      shippingDetails,
      totalPrice: calculateTotal(),
    };

    setIsPaymentProcessing(true);*/
    
   /* const handlePayment = async () => {
  try {
    const { data } = await axiosInstance.post("/create_razorpay_order/", orderData);
    console.log("Order Created:", data);  // Add this
    alert(`Order created: ${JSON.stringify(data)}`);
  } catch (error) {
    console.error("Payment Error:", error.response?.data);
    alert(`Error: ${JSON.stringify(error.response?.data)}`);
  }
};


    try {
      // const config = {
      //   headers: {
      //     "Content-Type": "application/json",
      //     // Authorization: `Bearer ${userInfo.token}`,
      //     "X-CSRFToken": getCSRFToken(),
      //   },
      // };

      //const { data: razorpayOrder } = await axiosInstance.post(
       // "https://nike-mock.onrender.com/api/create_razorpay_order/",
      //  "/api/create_razorpay_order/",
        //orderData
        // config
      //);
      const { data: razorpayOrder } = await axiosInstance.post(
       "/create_razorpay_order/",  // Removed extra "/api"
       orderData
      );

      const options = {
        key_id: razorpayOrder.key_id || "rzp_test_RO1zXBvs9Vy5Yy",
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Nike",
        description: "Payment for Order",
        order_id: razorpayOrder.razorpay_order_id,
        handler: async (response) => {
          try {
          //  const verificationResponse = await axiosInstance.post(
          //  "https://nike-mock.onrender.com/api/verify-payment/",
           // "/api/verify-payment/",
              //response
              // config
           // );
           const verificationResponse = await axiosInstance.post(
            "/verify-payment/",  // Removed extra "/api"
            response
           );
            alert("Payment Successful!");
            navigate(`/order/${razorpayOrder.razorpay_order_id}`);
          } catch (verificationError) {
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: shippingDetails.name || userInfo.name,
          email: shippingDetails.email || userInfo.email,
          contact: shippingDetails.phone,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new Razorpay(options);
      rzp.on("payment.failed", (response) => {
        alert(`Payment failed: ${response.error.description}`);
      });

      rzp.open();
    } catch (error) {
      alert("Payment Initialization Error. Please try again.");
    } finally {
      setIsPaymentProcessing(false);
    }
  };*/

  
const handlePayment = async () => {
    const errorMessage = validateForm();
    if (errorMessage) {
      alert(errorMessage);
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
        "/create_razorpay_order/", // Removed extra "/api"
        orderData
      );

      console.log("Razorpay Order Created:", razorpayOrder);

      const options = {
        key_id: razorpayOrder.key_id || "rzp_test_RO1zXBvs9Vy5Yy",
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Nike",
        description: "Payment for Order",
        order_id: razorpayOrder.razorpay_order_id,
        handler: async (response) => {
          try {
            console.log("Payment success response:", response);

            const verificationResponse = await axiosInstance.post(
              "/verify-payment/", // Removed extra "/api"
              response
            );

            console.log("Payment Verified:", verificationResponse.data);
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
        theme: {
          color: "#3399cc",
        },
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



  useEffect(() => {
    const savedDetails = localStorage.getItem("shippingDetails");
    if (savedDetails) {
      setShippingDetails(JSON.parse(savedDetails));
    }

    const savedPaymentMethod = localStorage.getItem("paymentMethod");
    if (savedPaymentMethod) {
      setPaymentMethod(savedPaymentMethod);
    }
  }, []);

  useEffect(() => {
    if (order) {
      navigate(`/payment/${order.id}`);
    }
  }, [order, navigate]);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login?redirect=/checkout");
    }
  }, [userInfo, navigate]);

  return (
    <Layout>
      <div className="checkout-page  p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Checkout
        </h2>
        {error && <p className="error-message text-red-600 mb-4">{error}</p>}

        <div className="cart-summary bg-white p-6 rounded-lg shadow-lg mb-8">
          <h3 className="text-2xl font-semibold text-gray-700">
            Order Summary
          </h3>
          <ul className="space-y-4 mt-4">
            {cartItems.map((item) => (
              <li
                key={item.product}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <img
                    src={item.image}
                    alt={item.productname}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <span className="ml-4 text-gray-700">{item.productname}</span>
                </div>
                <span className="text-gray-700">Qty: {item.qty}</span>
                <span className="text-gray-700">₹ {item.price * item.qty}</span>
              </li>
            ))}
          </ul>
          <h4 className="text-xl font-semibold text-gray-700 mt-4">
            Total: ₹ {calculateTotal()}
          </h4>
        </div>

        <div className="shipping-details bg-white p-6 rounded-lg shadow-lg mb-8">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">
            Shipping Details
          </h3>
          {[...Object.keys(shippingDetails)].map((field) => (
            <input
              key={field}
              type={field === "email" ? "email" : "text"}
              name={field}
              value={shippingDetails[field]}
              onChange={handleShippingChange}
              placeholder={`Enter ${field}`}
              className="input-field w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        <div className="order-action text-center">
          <button
            onClick={handlePayment}
            className="pay-now-button bg-blue-600 text-white py-3 px-6 rounded-lg w-full hover:bg-blue-700 transition-all"
            disabled={isPaymentProcessing}
          >
            {isPaymentProcessing
              ? "Processing Payment..."
              : "Place Order and Pay"}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
