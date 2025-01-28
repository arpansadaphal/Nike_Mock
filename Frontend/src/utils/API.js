import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api",
});

// export const fetchProducts = async () => {
//   const response = await API.get("/products");
//   return response.data;
// };
export const fetchProducts = async (filters) => {
  const queryString = new URLSearchParams(filters).toString();
  const response = await fetch(`/api/products/?${queryString}`);
  return await response.json();
};

export const fetchNewProducts = async () => {
  const response = await API.get("/new_products");
  return response.data;
};

export const fetchProductById = async (id) => {
  const response = await API.get(`/product/${id}`);
  return response.data;
};

export default API;
