// import axios from "axios";
// import Cookies from "js-cookie"; // Install using `npm install js-cookie`

// // Create an axios instance
// const axiosInstance = axios.create({
//   baseURL: "http://localhost:8000/api/",
//   withCredentials: true, // Include cookies in requests
// });

// // Add interceptors
// axiosInstance.interceptors.request.use(
//   (config) => {
//     // Attach the CSRF token to the request headers
//     const csrfToken = Cookies.get("csrftoken");
//     if (csrfToken) {
//       config.headers["X-CSRFToken"] = csrfToken;
//     }

//     // Attach the Authorization token (if exists)
//     const token = localStorage.getItem("access_token");
//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Handle expired tokens or other errors
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       const userInfo = JSON.parse(localStorage.getItem("userInfo"));
//       const refreshToken = userInfo?.refresh;

//       if (refreshToken) {
//         try {
//           const { data } = await axios.post(
//             "http://localhost:8000/api/token/refresh/",
//             { refresh: refreshToken }
//           );

//           // Update access token in localStorage
//           localStorage.setItem("access_token", data.access);

//           // Retry the original request with the new token
//           error.config.headers["Authorization"] = `Bearer ${data.access}`;
//           return axiosInstance.request(error.config);
//         } catch (refreshError) {
//           console.error("Token refresh failed. Redirecting to login.");
//           localStorage.clear();
//           window.location.href = "/login";
//         }
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;

import axios from "axios";
import Cookies from "js-cookie"; // Install using `npm install js-cookie`

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/",
  withCredentials: true, // Include cookies in requests
});

// Add interceptors
axiosInstance.interceptors.request.use(
  (config) => {
    // Attach the CSRF token to the request headers
    const csrfToken = Cookies.get("csrftoken"); // Fetch directly from cookies
    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
    }

    // Attach the Authorization token (if exists)
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle expired tokens or other errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const refreshToken = userInfo?.refresh;

      if (refreshToken) {
        try {
          const { data } = await axios.post(
            "http://localhost:8000/api/token/refresh/",
            { refresh: refreshToken }
          );

          // Update access token in localStorage
          localStorage.setItem("access_token", data.access);

          // Retry the original request with the new token
          error.config.headers["Authorization"] = `Bearer ${data.access}`;
          return axiosInstance.request(error.config);
        } catch (refreshError) {
          console.error("Token refresh failed. Redirecting to login.");
          localStorage.clear();
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
