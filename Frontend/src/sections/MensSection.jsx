import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Slider from "react-slick"; // Import react-slick carousel
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductCard from "../components/ProductCard";
import styles from "../styles/Categories.module.css"; // Importing custom CSS module
import { Link } from "react-router-dom";

const MensSection = () => {
  const [products, setProducts] = useState([]);
  const sliderRef = useRef(null); // Create a ref for the slider

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/mens_products/"
        );
        setProducts(response.data);
        console.log("Fetched products:", response.data);
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
      }
    };

    fetchProducts();
  }, []);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    centerPadding: "20px", // Adds padding between slides
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section id="new_arrivals" className="py-10">
      <div className={styles.header}>
        <h2 className="text-4xl font-palanquin font-bold">
          <span className="text-coral-red"> Men's </span>Section
        </h2>
        <div className="flex items-center">
          <button
            className={`${styles.topRightButton} mr-2`}
            onClick={() => sliderRef.current.slickPrev()} // Go to previous slide
          >
            ←
          </button>
          <button
            className={`${styles.topRightButton} mr-2`}
            onClick={() => sliderRef.current.slickNext()} // Go to next slide
          >
            →
          </button>
          <Link
            to={"/products?gender=men"}
          >
            <button className={styles.topRightButton}>View All</button>
          </Link>
        </div>
      </div>

      {/* Carousel Implementation */}
      <Slider {...settings} ref={sliderRef} className="max-w-7xl mx-auto px-4">
        {products.map((product) => (
          <div key={product._id} className="px-2">
            <ProductCard product={product} showAddToCart={false}  />
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default MensSection;
