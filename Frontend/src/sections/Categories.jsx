import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "../styles/Categories.module.css";
import { Link } from "react-router-dom";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const sliderRef = useRef(null); // Ref to control the slider

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/categories/"
        );
        setCategories(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getCategories();
  }, []);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false, 
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // Custom arrow handlers
  const goNext = () => sliderRef.current.slickNext();
  const goPrev = () => sliderRef.current.slickPrev();

  return (
    <section className={styles.carouselSection}>
      <div className={styles.header}>
        {/* <h2 className={styles.carouselTitle}>Shop By Category</h2> */}
        <h2 className="text-4xl font-palanquin font-bold">
          Shop By <span className="text-coral-red"> Category </span>
        </h2>
        <div className={styles.customArrows}>
          <button className={`${styles.topRightButton} mx-2`} onClick={goPrev}>
            ←
          </button>
          <button className={styles.topRightButton} onClick={goNext}>
            →
          </button>
        </div>
      </div>
      <Slider ref={sliderRef} {...settings}>
        {categories.map((category) => (
          <Link
            to={`/products?category=${category.name}`} // Add query parameter for the selected category
            key={category.id}
          >
            <div className={styles.categoryCard}>
              <img
                src={`http://localhost:8000${category.image}`}
                alt={category.name}
                className={styles.categoryImage}
              />
              <div className={styles.categoryName}>{category.name}</div>
            </div>
          </Link>
        ))}
      </Slider>
    </section>
  );
};

export default Categories;
