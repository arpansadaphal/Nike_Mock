import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Layout from "../Layout";
import ClipLoader from "react-spinners/ClipLoader";
import axiosInstance from "../../utils/axiosInstance";

const OrderDetails = () => {
  const { order_id } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axiosInstance.get(`order/${order_id}`);
        setOrderDetails(response.data.order);
      } catch (error) {
        console.error("Error fetching order details:", error);
        setError("Failed to fetch order details. Please try again.");
      }
    };
    fetchOrderDetails();
  }, [order_id]);

  const renderOrderDetails = () => {
    if (error) {
      return <div className="text-center text-red-500 py-16">{error}</div>;
    }

    if (orderDetails === null) {
      return (
        <div className="flex justify-center items-center h-screen">
          <ClipLoader color="#F04F47" size={60} />
        </div>
      );
    }
    console.log(orderDetails);
    const {
      id,
      shipping_details,
      payment_method,
      total_price,
      is_paid,
      paid_at,
      razorpay_order_id,
      items,
      payment_id,
      order_status,
    } = orderDetails;
    const handleRefund = async (payment_id) => {
      if (!payment_id) {
        alert("Payment ID is missing!");
        return;
      }

      const confirmRefund = confirm(
        "Are you sure you want to process the refund?"
      );
      if (!confirmRefund) return;

      try {
        const response = await axiosInstance.post("/refund/", { payment_id });

        if (response.status === 200) {
          alert("Refund successful!");
        } else {
          console.error(response.data);
          alert(
            "Refund failed: " +
              (response.data.error || "Unknown error occurred.")
          );
        }
      } catch (error) {
        console.error(error);
        alert("Something went wrong. Please try again later.");
      }
    };

    return (
      <div className="min-h-screen bg-white py-16 px-6 sm:px-8">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Order Details
          </h1>
          <div className="border-b border-gray-300 pb-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Order ID
            </h2>
            <p className="text-lg text-gray-700">{id}</p>
          </div>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Shipping Details
            </h2>
            <ul className="space-y-2 text-lg text-gray-700">
              <li>Name: {shipping_details?.name}</li>
              <li>Address: {shipping_details?.address}</li>
              <li>City: {shipping_details?.city}</li>
              <li>Country: {shipping_details?.country}</li>
              <li>Pincode: {shipping_details?.pincode}</li>
              <li>Phone: {shipping_details?.phone}</li>
              <li>Email: {shipping_details?.email}</li>
            </ul>
          </div>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Payment Details
            </h2>
            <ul className="space-y-2 text-lg text-gray-700">
              <li>Payment Method: {payment_method}</li>
              <li>
                Payment Status:{" "}
                {order_status === "paid"
                  ? "Paid"
                  : order_status === "Refunded"
                  ? "Refunded"
                  : "Unpaid"}
              </li>

              <li>Paid At: {paid_at}</li>
              <li>Payment ID: {payment_id}</li>
              <li>Order ID: {razorpay_order_id}</li>
            </ul>
          </div>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Ordered Items
            </h2>
            <ul className="space-y-2 text-lg text-gray-700">
              {items && items.length > 0 ? (
                items.map((item) => (
                  <li key={item.product}>
                    <span>{item.product_name}</span>, Quantity: {item.quantity},
                    Price: ₹{item.price * item.quantity}
                  </li>
                ))
              ) : (
                <li>No items in the order.</li>
              )}
            </ul>
          </div>
          <div className="border-t border-gray-300 pt-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Total Price
            </h2>
            <p className="text-lg text-gray-700 font-semibold">
              ₹ {total_price}
            </p>
          </div>
          <div className="text-center py-16">
            <Link
              to="/products"
              className="text-blue-500 hover:underline text-lg"
            >
              Shop More
            </Link>
          </div>
          {order_status === "paid" ? (
            <div className="text-center ">
              <button onClick={() => handleRefund(payment_id)}>
                Cancel Order
              </button>
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  return <Layout>{renderOrderDetails()}</Layout>;
};

export default OrderDetails;
