import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../Slices/loginSlice";
import Layout from "../Layout";
import ClipLoader from "react-spinners/ClipLoader";

const LoginScreen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const location = useLocation();
  const redirect = location.search ? location.search.split("=")[1] : "/";

  const userLogin = useSelector((state) => state.userLogin);
  const { error, loading, userInfo } = userLogin;

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Please fill in all fields");
    } else {
      dispatch(login({ email, password }));
    }
  };

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-screen ">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
            Log In
          </h2>
          {message && (
            <div className="bg-red-100 text-red-800 p-2 rounded mb-4 text-center">
              {message}
            </div>
          )}
          {/* {loading && <div className="text-center">Loading...</div>} */}
          {loading && (
            <div className="flex justify-center items-center">
              <ClipLoader color="#F04F47" size={50} />
            </div>
          )}
          {error && (
            <div className="bg-red-100 text-red-800 p-2 rounded mb-4 text-center">
              {error}
            </div>
          )}
          <form onSubmit={submitHandler}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Log In
            </button>
          </form>
          <div className="mt-4 text-center">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginScreen;
