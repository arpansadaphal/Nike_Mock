import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Slider from "react-slick";
import { fetchProductById } from "../../Slices/productSlice";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Layout from "../Layout";
import { addToCart } from "../../Slices/cartSlice";
import ClipLoader from "react-spinners/ClipLoader";

const ProductScreen = () => {
  useEffect(() => {
    window.scrollTo(190, 190);
  }, []);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const qty = 1;
  const {
    products: product,
    loading,
    error,
  } = useSelector((state) => state.product);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

  // if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };
  console.log("Product ID:", id);

  const addToCartHandler = (id, qty) => {
    if (!id) {
      console.error("Product ID is invalid");
      return;
    }
    dispatch(addToCart({ id, qty }));
    navigate(`/cart/${id}?qty=${qty}`);
  };

  return (
    <Layout>
      {/* {loading ? (
        <div className="flex justify-center items-center w-full h-screen">
          <ClipLoader color="#F04F47" size={60} />
        </div>
      ) : ( */}
      <div className="max-w-screen-xl mx-auto px-4 pt-24">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Product Image Slider */}

          <div className="md:w-1/2 w-full">
  {product?.images?.length > 0 ? (
    <Slider {...sliderSettings} className="rounded-lg shadow-lg">
      {product.images.map((image, index) => (
        <div key={index} className="p-4">
          <img
            src={image.image} // Direct Cloudinary URL
            alt={`Product Image ${index + 1}`}
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>
      ))}
    </Slider>
  ) : (
    <div className="p-4">
      <img
        src={product.image} // Direct Cloudinary URL
        alt="Default Product"
        className="w-full h-auto object-cover rounded-lg shadow-lg"
      />
    </div>
  )}
</div>


          {/* Product Details */}
          <div className="md:w-1/2 w-full p-4 pt-10">
            <h1 className="text-4xl font-bold mb-2 tracking-wide flex items-center">
              {product?.productname || "No name available"}
              {product?.is_new && (
                <span className="ml-4 bg-gray-100 text-white rounded-full py-1 px-3 text-xs font-semibold">
                  New
                </span>
              )}
            </h1>
            <p className="text-lg text-gray-500 mb-6 pt-2">
              Category:{" "}
              <span className="font-semibold">
                {product?.productcategory || "Uncategorized"}
              </span>
            </p>
            <p className="text-2xl font-semibold mb-6 text-gray-900">
              ₹ {product?.price ? Number(product.price).toFixed(2) : "0.00"}
            </p>
            <p className="text-base text-gray-600 leading-relaxed mb-8">
              {product?.productinfo || "No description available."}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Available for:{" "}
              <span className="font-semibold">
                {product?.gender || "Unisex"}
              </span>
            </p>
            <button
              onClick={() => addToCartHandler(product._id, qty)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      {/* )} */}
    </Layout>
  );
};

export default ProductScreen;
