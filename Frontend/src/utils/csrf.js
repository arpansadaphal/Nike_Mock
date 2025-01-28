import axios from "axios";

export const getCsrfToken = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8000/api/get_csrf_token/",
      { withCredentials: true }
    );
    // console.log("CSRF token fetched successfully");
  } catch (error) {
    console.error("Error fetching CSRF token:", error);
  }
};
export default getCsrfToken;
