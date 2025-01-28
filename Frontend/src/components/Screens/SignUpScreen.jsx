import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../../Slices/signupSlice";
import { login } from "../../Slices/loginSlice"; // Import the login action
import Layout from "../Layout";
import ClipLoader from "react-spinners/ClipLoader";

const SignupScreen = () => {
  const navigate = useNavigate();
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [message, setMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const dispatch = useDispatch();
  const location = useLocation();
  const redirect = location.search ? location.search.split("=")[1] : "/";

  const userSignup = useSelector((state) => state.userSignup);
  const { error, loading, userInfo } = userSignup;

  useEffect(() => {
    if (userInfo) {
      // Dispatch login after successful signup
      dispatch(login({ email, password: pass1 }));
      console.log("sign up success");
      setSuccessMessage("Signup successful! You are now logged in.");
      setTimeout(() => {
        navigate(redirect); // Navigate to the desired page after login
      }, 100);
    }
  }, [userInfo, redirect, navigate, dispatch, email, pass1]);

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must be at least 8 characters long, include an uppercase letter, a number, and a special character."
      );
      return false;
    }
    setPasswordError("");
    return true;
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (pass1 !== pass2) {
      setMessage("Passwords do not match");
    } else if (!validatePassword(pass1)) {
      setMessage("Please fix password issues before submitting");
    } else {
      setMessage("");
      dispatch(signup({ fname, lname, email, password: pass1 }));
    }
  };

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
            Sign Up
          </h2>
          {message && (
            <div className="bg-red-100 text-red-800 p-2 rounded mb-4 text-center">
              {message}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-100 text-green-800 p-2 rounded mb-4 text-center">
              {successMessage}
            </div>
          )}
          {loading && (
            <div className="flex justify-center items-center">
              <ClipLoader color="#F04F47" size={50} />
            </div>
          )}
          <form onSubmit={submitHandler}>
            <div className="mb-4">
              <label
                htmlFor="fname"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                type="text"
                id="fname"
                value={fname}
                onChange={(e) => setFname(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="lname"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lname"
                value={lname}
                onChange={(e) => setLname(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
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
                htmlFor="pass1"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="pass1"
                value={pass1}
                onChange={(e) => setPass1(e.target.value)}
                onBlur={() => validatePassword(pass1)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              {passwordError && (
                <div className="text-red-600 text-sm mt-1">{passwordError}</div>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="pass2"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="pass2"
                value={pass2}
                onChange={(e) => setPass2(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Sign Up
            </button>
          </form>
          <div className="mt-4 text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SignupScreen;
