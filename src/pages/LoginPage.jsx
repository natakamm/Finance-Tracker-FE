import React from "react";
import loginImg from "../assets/LoginPage.png";

const LoginPage = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[#121428] to-[#000036]">
      {/* First Background Curve */}
      <div className="absolute top-0 left-0 w-[1853px] h-[780.46px] bg-gradient-to-b from-[#121428] to-[#000036]">
        {/* Upper Curve */}
        <div
          className="absolute top-0 left-0 w-full h-dull bg-gradient-to-r from-[#121428] to-[#000036]"
          style={{ clipPath: "ellipse(80% 50% at 50% 0%)" }}
        ></div>
      </div>

      {/* Second Background Curve */}
      <div
        className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-l from-[#121428] to-[#000036]"
        style={{ clipPath: "ellipse(80% 60% at 50% 100%)" }}
      ></div>

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

            <h2 className="text-2xl mb-20 mt-20 font-normal text-[36px] text-white">
              Hello there, <br />
              welcome back
            </h2>

            <form className="relative z-10">
              <div className="mb-4">
                <input
                  type="email"
                  placeholder="E-mail"
                  className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-normal text-[20px] text-[#969696]"
                />
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-normal text-[20px] text-[#969696]"
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
                <button className="w-[150px] h-[55px] bg-gradient-to-b from-[#833ac9] to-[#5c40da] hover:bg-purple-700 font-normal text-[24px] text-white p-2 mt-5 rounded-lg transition duration-300">
                  Sign In
                </button>
              </div>
            </form>

            <div className="mt-6 text-center relative z-10">
              <p className="font-normal text-[16px] text-[#969696]">
                New here?{" "}
                <a
                  href="#"
                  className="font-normal text-[16px] text-purple-400 hover:underline"
                >
                  Sign Up
                </a>
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
