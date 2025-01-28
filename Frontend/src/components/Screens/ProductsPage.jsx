// ProductsPage.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { fetchProducts, setFilters } from "../../Slices/productsSlice";
import ProductCard from "../ProductCard";
import Layout from "../Layout";
import FilterComponent from "../FilterComponent";
import { useDebouncedCallback } from "use-debounce";
import ClipLoader from "react-spinners/ClipLoader";
const ProductsPage = () => {
  
  const dispatch = useDispatch();
  const { products, filters, loading, error } = useSelector(
    (state) => state.products
  );
  const [isFilterVisible, setIsFilterVisible] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const newFilters = {
      category: queryParams.get("category") || "",
      gender: queryParams.get("gender") || "",
      price_min: queryParams.get("price_min") || "",
      price_max: queryParams.get("price_max") || "",
      new_arrivals: queryParams.get("new_arrivals") === "true",
      pricelowtohigh: queryParams.get("pricelowtohigh") === "true",
      pricehightolow: queryParams.get("pricehightolow") === "true",
    };

    if (JSON.stringify(filters) !== JSON.stringify(newFilters)) {
      dispatch(setFilters(newFilters));
    }
  }, [location.search, dispatch]);

  const fetchProductsDebounced = useDebouncedCallback(() => {
    dispatch(fetchProducts(filters));
  }, 300);

  useEffect(() => {
    fetchProductsDebounced(); // Call debounced function
  }, [filters, fetchProductsDebounced]);

  // useEffect(() => {
  //   fetchProductsDebounced();
  // }, [filters, fetchProductsDebounced]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (filters[name] !== value) {
      dispatch(setFilters({ ...filters, [name]: value }));
    }
  };

  const toggleFilterVisibility = () => {
    setIsFilterVisible(!isFilterVisible);
  };
  // useEffect(() => {
  //   // Simulate a loading delay (e.g., fetching data)
  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 2000);

  //   return () => clearTimeout(timer);
  // }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-6 p-6">
        {/* Filters Sidebar */}
        {isFilterVisible && (
          <div className="w-full lg:w-1/4">
            <FilterComponent
              filters={filters}
              handleFilterChange={handleFilterChange}
            />
          </div>
        )}

        {/* Products Grid */}
        <div
          className={`flex-grow ${
            isFilterVisible ? "lg:w-3/4" : "w-full"
          } transition-all duration-300`}
        >
          <button
            onClick={toggleFilterVisibility}
            className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition duration-300 mb-4"
          >
            {isFilterVisible ? "Hide Filters" : "Filters"}
          </button>

          {/* {loading && <p>Loading...</p>} */}
          {error && <p>{error}</p>}
          {/* {loading ? (
            <div className="flex justify-center items-center w-full h-screen">
              <ClipLoader color="#F04F47" size={60} />
            </div>
          ) : ( */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          {/* )} */}
        </div>
      </div>
    </Layout>
  );
};

export default ProductsPage;
