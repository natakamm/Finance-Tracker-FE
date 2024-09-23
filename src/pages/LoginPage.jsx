import loginImg from "../assets/LoginPage.png";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState();
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const validateEmail = (emailValue) => {
    setEmail(emailValue);

    if (emailValue === "") {
      setEmailError("");
      return;
    }
    const atIndex = emailValue.indexOf("@");
    if (atIndex === -1) {
      setEmailError("Email must include '@'.");
      return;
    }
    //Check that there's a "." after the "@" and there's at least one character before the "."
    const dotIndex = emailValue.indexOf(".", atIndex);
    if (dotIndex === -1) {
      setEmailError("Email must include a domain like '.com'.");
      return;
    } else if (dotIndex - atIndex < 2) {
      setEmailError(
        "There must be at least one character between '@' and '.'."
      );
      return;
    }
    const domainPart = emailValue.substring(dotIndex + 1);
    if (domainPart.length < 2 || domainPart.length > 4) {
      setEmailError("Invalid domain after the dot.");
      return;
    }
    setEmailError("");
  };

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    validateEmail(emailValue);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  //Login Authentication:
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);

    const res = await fetch("http://localhost:5000/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setIsLoading(false);
      setError(data.error);
      alert("login failed: " + data.error);
    }

    if (res.ok) {
      localStorage.setItem("user", JSON.stringify(data.token));
      setIsLoading(false);
      alert("Loged in!");
    }
  };
  const isFormInvalid =
    !email || !password || emailError || feedback.length > 0 || passwordError;
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[#121428] to-[#000036]">
      {/* Content Area */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center">
        {/* Left Side (Login Form) */}
        <div className="flex flex-col justify-center items-center md:w-1/2 w-full p-10 ">
          {/* Used w-full instead of  w-[434px] for being responsive for mobile view*/}
          <div className="p-8 rounded-lg shadow-lg w-full max-w-md h-[729px] bg-[#161a40] relative overflow-hidden border border-indigo-400">
            {/* Decorative Shape */}
            <div
              className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-r from-purple-600 to-indigo-900 transform -translate-y-1/2 rounded-t-lg"
              style={{ clipPath: "ellipse(80% 60% at 50% 0%)" }}
            ></div>

            {/* Corrected SVG Wave at the top */}
            <div className="absolute top-0 left-0 w-full">
              <svg
                viewBox="0 0 1440 320"
                className="w-full h-[100px]"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="waveGradient"
                    gradientTransform="rotate(1)"
                  >
                    <stop offset="0%" stopColor="#7F3BCB" />
                    <stop offset="100%" stopColor="#633FD7" />
                  </linearGradient>
                </defs>
                <path
                  fill="url(#waveGradient)"
                  fillOpacity="1"
                  d="M0,320L48,293.3C96,267,192,213,288,202.7C384,192,480,224,576,234.7C672,245,768,235,864,218.7C960,203,1056,181,1152,186.7C1248,192,1344,224,1392,240L1440,256L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
                />
              </svg>
            </div>
            <h2 className="text-2xl mb-20 mt-20 font-normal text-[36px] text-white">
              Hello there, <br />
              welcome back
            </h2>

            <form className="relative z-10" onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="email"
                  placeholder="E-mail"
                  className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-normal text-[20px] text-[#969696]"
                  value={email}
                  onChange={handleEmailChange}
                />
                {emailError && <p className="text-red-500">{emailError}</p>}
              </div>
              <div className="mb-4 relative flex items-center">
                <input
                  type={passwordVisible ? "password" : "text"}
                  placeholder="Password"
                  className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-normal text-[20px] text-[#969696]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {passwordError && (
                  <p className="text-red-500">{passwordError}</p>
                )}
                <FontAwesomeIcon
                  icon={passwordVisible ? faEyeSlash : faEye}
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400"
                />
              </div>
              <div className="mb-4 text-center">
                <a
                  href="#"
                  className="font-normal text-[16px] text-[#969696] hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <div className="flex justify-center">
                <button
                  className={`w-[200px] h-[55px] font-normal text-[24px] text-white p-2 rounded-lg transition duration-300 ${
                    isFormInvalid || isLoading
                      ? "bg-gradient-to-b from-[#833ac9] to-[#5c40da] opacity-40 shadow-inner text-gray-300 cursor-not-allowed"
                      : "bg-gradient-to-b from-[#833ac9] to-[#5c40da] hover:bg-purple-700"
                  }`}
                  disabled={isFormInvalid || isLoading}
                >
                  Sign In
                </button>
              </div>
            </form>

            <div className="mt-6 text-center relative z-10">
              <p className="font-normal text-[16px] text-[#969696]">
                New here?{" "}
                <Link to="/signup" className="text-purple-400 hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side (image) */}
        <div className="hidden md:flex md:w-1/2 w-full justify-center items-center p-10 ml-60">
          <img
            src={loginImg}
            alt="Finance illustration"
            className="w-full max-w-xs md:max-w-lg h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
