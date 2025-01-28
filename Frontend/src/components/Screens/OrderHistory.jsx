import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import axiosInstance from "../../utils/axiosInstance";
// import getCsrfToken from "../../utils/csrf";
import Layout from "../Layout";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useSelector((state) => state.userLogin);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        // const config = {
        //   headers: {
        //     "Content-Type": "application/json",
        //     Authorization: `Bearer ${userInfo.token}`,
        //     // "X-CSRFToken": getCsrfToken(),
        //   },
        // };

        const response = await axiosInstance.get("order_history/");
        setOrders(
          Array.isArray(response.data.orders) ? response.data.orders : []
        );
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userInfo, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <ClipLoader color="#F04F47" size={60} />
        </div>
      </Layout>
    );
  }

  if (!orders.length) {
    return (
      <Layout>
        <div className="min-h-screen flex justify-center items-center">
          <h1 className="text-2xl font-bold text-gray-700">No orders found.</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-white p-6">
        <h2 className="text-3xl font-bold text-center mb-6">Order History</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto bg-white shadow-md rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="text-left px-6 py-4 font-medium">Order ID</th>
                <th className="text-left px-6 py-4 font-medium">Date</th>
                <th className="text-left px-6 py-4 font-medium">Total Price</th>
                <th className="text-left px-6 py-4 font-medium">Status</th>
                <th className="text-left px-6 py-4 font-medium">
                  Shipping Details
                </th>
                <th className="text-left px-6 py-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="px-6 py-4">
                    <Link
                      to={`/order/${order.razorpay_order_id}`}
                      className="text-blue-500 hover:underline"
                    >
                      {order.id}
                    </Link>
                  </td>
                  <td className="px-6 py-4">{order.order_date}</td>
                  <td className="px-6 py-4">₹{order.total_price}</td>
                  <td className="px-6 py-4">{order.order_status}</td>
                  <td className="px-6 py-4">
                    {order.shipping_details ? (
                      <div>
                        <p>{order.shipping_details.address},</p>
                        <p>{order.shipping_details.city},</p>
                        <p>{order.shipping_details.pincode},</p>
                        <p>{order.shipping_details.country}</p>
                      </div>
                    ) : (
                      <p>No Address Provided</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/order/${order.razorpay_order_id}`}
                      className="text-blue-500 hover:underline"
                    >
                      More Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

export default OrderHistory;
