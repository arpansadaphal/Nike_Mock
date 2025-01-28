import axios from "axios";
// import Razorpay from "razorpay";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout";
import { createOrder } from "../../Slices/createOrderSlice";
import { createRazorpayOrder } from "../../Slices/razorPaySlice";
import getCSRFToken from "../../utils/csrf";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const { order, loading, error, orderdetails } = useSelector(
    (state) => state.order
  );
  const { razorpayOrder } = useSelector((state) => state.razorPay);

  console.log(razorpayOrder);
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

  const handleSubmitOrder = () => {
    const errorMessage = validateForm();
    if (errorMessage) {
      alert(errorMessage);
      return;
    }

    const orderData = {
      cartItems,
      shippingDetails,
      paymentMethod,
      totalPrice: calculateTotal(),
    };
    // console.log(orderData);
    dispatch(createRazorpayOrder(orderData));
  };

  // Make API call to your backend to create a Razorpay order
  //   const { data: orderData } = await axios.post(
  //     "/api/create_razorpay_order/",
  //     config
  //   );
  //   console.log(window.Razorpay);
  const handlePayment = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCSRFToken(), // Add the CSRF token
      },
    };
    setIsPaymentProcessing(true);
    try {
      const options = {
        key_id: razorpayOrder.key_id || "rzp_test_RO1zXBvs9Vy5Yy",
        amount: razorpayOrder.amount, // Amount in paise
        currency: razorpayOrder.currency,
        name: "Your Company Name",
        description: "Payment for Order",
        order_id: razorpayOrder.razorpay_order_id, // Correct ID here
        handler: async (response) => {
          console.log("Razorpay Response:", response);
          try {
            const verificationResponse = await axios.post(
              "/api/verify-payment/",
              response, // Pass response as the body
              config // Pass headers as the config
            );
            alert("Payment Successful!");
            console.log(verificationResponse.data);
            navigate(`/order/${razorpayOrder.razorpay_order_id}`);
          } catch (verificationError) {
            console.error("Verification failed:", verificationError);
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
        alert(
          `Payment failed due to: ${
            response.error.description || "Unknown error"
          }`
        );
      });

      rzp.open();
    } catch (error) {
      console.error("Payment Initialization Error:", error);
      alert("Failed to initialize payment. Please try again.");
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  //   const handlePayment = async () => {
  //     setIsPaymentProcessing(true);

  //     try {
  //       // Validate Razorpay availability
  //       if (typeof Razorpay === "undefined") {
  //         throw new Error("Razorpay library not loaded");
  //       }

  //       const options = {
  //         key_id: razorpayOrder.key_id || "rzp_test_RO1zXBvs9Vy5Yy",
  //         amount: razorpayOrder.amount,
  //         currency: razorpayOrder.currency || "INR",
  //         name: "Your Company Name",
  //         description: "Payment for Order",
  //         order_id: razorpayOrder.razorpay_order_id,
  //         // prefill: {
  //         //   name: shippingDetails.name || userInfo.name,
  //         //   email: shippingDetails.email || userInfo.email,
  //         //   contact: shippingDetails.phone || "",
  //         // },
  //         prefill: {
  //           name: "John Doe",
  //           email: "john.doe@example.com",
  //           contact: "9876543210",
  //         },
  //         theme: {
  //           color: "#3399cc",
  //         },
  //       };

  //       console.log("Razorpay options:", options);

  //       const rzp = new Razorpay(options);

  //       console.log("Razorpay instance created:", rzp);

  //       rzp.open();
  //     } catch (error) {
  //       console.error("Payment Initialization Error:", error);
  //       alert("Failed to initialize payment. Please try again.");
  //     } finally {
  //       setIsPaymentProcessing(false);
  //     }
  //   };

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
      <div className="checkout-page">
        <h2>Checkout</h2>
        {error && <p className="error-message text-red-600">{error}</p>}

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <ul>
            {cartItems.map((item) => (
              <li key={item.product}>
                <div>
                  <img
                    src={`http://localhost:8000${item.image}`}
                    alt={item.productname}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <span>{item.productname}</span>
                  <span>Qty: {item.qty}</span>
                  <span>Price:₹ {item.price * item.qty}</span>
                </div>
              </li>
            ))}
          </ul>
          <h4>Total: ${calculateTotal()}</h4>
        </div>

        <div className="shipping-details">
          <h3>Shipping Details</h3>
          {[
            "name",
            "email",
            "address",
            "city",
            "country",
            "pincode",
            "phone",
          ].map((field) => (
            <input
              key={field}
              type={field === "email" ? "email" : "text"}
              name={field}
              value={shippingDetails[field]}
              onChange={handleShippingChange}
              placeholder={`Enter ${field}`}
              className="input-field"
            />
          ))}
        </div>

        {/* <div className="payment-method">
          <h3>Payment Method</h3>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="select-field"
          >
            <option value="credit-card">Credit Card</option>
            <option value="paypal">PayPal</option>
          </select>
        </div> */}

        <div className="order-action">
          <button
            onClick={handleSubmitOrder}
            className="submit-button"
            disabled={loading || isPaymentProcessing}
          >
            {loading ? "Placing Order..." : "Place order"}
          </button>
          <button
            onClick={handlePayment}
            className="pay-now-button"
            disabled={isPaymentProcessing}
          >
            {isPaymentProcessing ? "Processing Payment..." : "Proceed to payment"}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
