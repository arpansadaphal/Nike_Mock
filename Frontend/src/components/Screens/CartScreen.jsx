import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addToCart, removeFromCart } from "../../Slices/cartSlice";
import Layout from "../Layout";

const CartScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);

  const removeItemHandler = (id) => {
    dispatch(removeFromCart(id));
  };
  console.log(cartItems);
  const checkoutHandler = () => {
    navigate("/checkout");
  };

  return (
    <Layout>
      <div className=" min-h-screen">
        <div className="max-w-7xl mx-auto p-4 pt-24">
          {/* <h1 className="text-3xl text-center font-bold mb-8">Cart</h1> */}
          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-xl font-semibold mb-4">
                Your cart is empty...
              </h2>
              <Link to="/" className="text-blue-500 hover:underline text-lg">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cart Items Section */}
              <div className="flex-1 bg-white shadow-md rounded-md p-4">
                {cartItems.map((item) => (
                  <div
                    key={item.product}
                    className="flex items-center gap-4 border-b pb-4 mb-4"
                  >
                    <img
  src={item.image.startsWith("http") ? item.image : `https://res.cloudinary.com/dnl8xcyir/${item.image}`}
  alt={item.productname}
  className="w-24 h-24 object-cover rounded-md"
/>

                   
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold">
                        {item.productname}
                      </h2>
                      <p className="text-gray-500">
                        ₹ {Number(item.price).toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-gray-700">Qty:</span>
                        <select
                          value={item.qty}
                          onChange={(e) =>
                            dispatch(
                              addToCart({
                                id: item.product,
                                qty: Number(e.target.value),
                              })
                            )
                          }
                          className="border rounded-md px-2 py-1"
                        >
                          {[...Array(10).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItemHandler(item.product)}
                      className="text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* Summary Section */}
              <div className="w-full lg:w-1/3 bg-white shadow-md rounded-md p-4">
                <h2 className="text-lg font-bold mb-6">Summary</h2>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-700">Subtotal</span>
                  <span className="font-semibold">
                    ₹
                    {cartItems
                      .reduce((acc, item) => acc + item.price * item.qty, 0)
                      .toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-700">Estimated Shipping</span>
                  <span className="font-semibold">₹ 450.00</span>
                </div>
                <div className="flex justify-between border-t pt-4 font-bold text-lg">
                  <span>Total</span>
                  <span>
                    ₹
                    {(
                      cartItems.reduce(
                        (acc, item) => acc + item.price * item.qty,
                        0
                      ) + 450
                    ).toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={checkoutHandler}
                  className="w-full mt-6 bg-black text-white py-3 rounded-md text-lg font-semibold hover:bg-gray-800"
                >
                  Checkout
                </button>
                <p className="text-sm text-center text-gray-500 mt-2">
                  Or{" "}
                  <Link
                    to="/products"
                    className="text-blue-500 hover:underline"
                  >
                    Continue Shopping
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CartScreen;
