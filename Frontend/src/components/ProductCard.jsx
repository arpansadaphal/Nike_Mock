import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product, label }) => {
  const { _id, productname, productcategory, price, main_image, is_new } =
    product;

  return (
    <div className="max-w-xs bg-white rounded-lg shadow-lg transform transition hover:scale-105 hover:shadow-xl">
      {/* Product Image */}
      <Link to={`/product/${_id}`}>
        <div className="relative">
          <img
            src={`http://localhost:8000${main_image}`}
            alt={productname}
            className="w-full h-64 object-cover rounded-t-lg"
          />
        </div>

        {/* Product Details */}
        <div className="p-4">
          <h3 className="text-md font-medium text-gray-800 truncate uppercase">
            {productname || "No Name"}
          </h3>
          <p className="text-xs text-gray-500 tracking-wide uppercase mt-1">
            {productcategory || "No Category"}
          </p>

          {/* Price */}
          <div className="flex justify-between items-center mt-4">
            <span className="text-lg font-bold text-gray-900">
              ₹ {price || "N/A"}
            </span>
          </div>
        </div>
      </Link>

      {/* "New" label */}
      {is_new && (
        <div className="absolute top-2 right-2 bg-white text-black rounded-full py-1 px-2 text-xs font-semibold shadow-lg">
          New
        </div>
      )}

      {/* Action Buttons */}
      {/* 
      <div className="p-4 border-t border-gray-200 flex justify-center">
        <button className="w-full bg-black text-white py-2 text-sm rounded-lg font-medium hover:bg-gray-800 transition duration-300">
          Add to Cart
        </button>
      </div> 
      */}
      {/* 
      {label && (
        <div className="absolute top-2 right-2 bg-white text-black rounded-full py-1 px-2 text-xs font-semibold shadow-lg">
          {label}
        </div>
      )} 
      */}
    </div>
  );
};

export default ProductCard;

// import React from "react";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { Link } from "react-router-dom";
// const ProductCard = ({ product, label }) => {
//   const { _id, productname, productcategory, price } = product;
//   const sliderSettings = {
//     dots: false,
//     infinite: true,
//     speed: 1000,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     arrows: false,
//     autoplay: false,
//     autoplaySpeed: 3000,
//   };

//   return (
//     <div className="max-w-xs bg-white rounded-lg shadow-lg transform transition hover:scale-105 hover:shadow-xl">
//       {/* Product Image Carousel */}
//       <Link to={`/product/${_id}`}>
//         <Slider {...sliderSettings}>
//           {product?.images?.map((image, index) => (
//             <div key={index} className="relative">
//               <img
//                 src={`http://localhost:8000${image.image}`}
//                 alt={`${productname} - ${index + 1}`}
//                 className="w-full h-64 object-cover rounded-t-lg"
//               />
//             </div>
//           ))}
//         </Slider>

//         {/* Product Details */}
//         <div className="p-4">
//           <h3 className="text-md font-medium text-gray-800 truncate uppercase">
//             {productname || "No Name"}
//           </h3>
//           <p className="text-xs text-gray-500 tracking-wide uppercase mt-1">
//             {product?.productcategory || "No Category"}
//           </p>

//           {/* Price */}
//           <div className="flex justify-between items-center mt-4">
//             <span className="text-lg font-bold text-gray-900">
//               ₹ {price || "N/A"}
//             </span>
//           </div>
//         </div>
//       </Link>

//       {product.is_new && (
//         <div className="absolute top-2 right-2 bg-white text-black rounded-full py-1 px-2 text-xs font-semibold shadow-lg">
//           New
//         </div>
//       )}

//       {/* Action Buttons */}
//       {/* <div className="p-4 border-t border-gray-200 flex justify-center">
//         <button className="w-full bg-black text-white py-2 text-sm rounded-lg font-medium hover:bg-gray-800 transition duration-300">
//           Add to Cart
//         </button>
//       </div> */}
//       {/*
//       {label && (
//         <div className="absolute top-2 right-2 bg-white text-black rounded-full py-1 px-2 text-xs font-semibold shadow-lg">
//           {label}
//         </div>
//       )} */}
//     </div>
//   );
// };

// export default ProductCard;
