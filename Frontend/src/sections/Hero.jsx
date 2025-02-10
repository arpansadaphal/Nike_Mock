import { useState } from "react";
import { Link } from "react-router-dom";
import { shoes } from "../constants";
import { Button, ShoeCard } from "../components";
import { arrowRight } from "../assets/icons";

const Hero = () => {
  const [bigShoeImg, setBigShoeImg] = useState(
    "https://res.cloudinary.com/dnl8xcyir/image/upload/v1738952449/pngwing.com_4_wgavhx.png"
  );

  return (
    <section
      id="home"
      className="relative flex flex-col lg:flex-row items-center justify-between w-full min-h-screen px-6 md:px-12 lg:px-24 py-16 bg-gradient-to-br from-gray-100 to-white"
    >
      {/* Left Content */}
      <div className="w-full lg:w-1/2 text-center lg:text-left">
        <h1 className="text-5xl sm:text-6xl font-bold leading-tight text-gray-900">
          Elevate Your <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-400">
            Sneaker Game
          </span>
        </h1>

        <p className="mt-6 text-lg text-gray-600 max-w-md mx-auto lg:mx-0">
          Discover the latest Nike arrivals with unmatched style, comfort, and
          innovation. Designed for every adventure.
        </p>

        <div className="mt-8 flex justify-center lg:justify-start">
          <Link to={"/products"}>
            <Button label="Shop Now" iconURL={arrowRight} />
          </Link>
        </div>
      </div>

      {/* Right Content - Shoe Image */}
      <div className="w-full lg:w-1/2 flex justify-center items-center mt-12 lg:mt-0">
        <div className="relative w-[350px] h-[350px] sm:w-[450px] sm:h-[450px] bg-white shadow-lg rounded-full flex items-center justify-center">
          <img
            src={bigShoeImg}
            alt="shoe collection"
            className="w-3/4 sm:w-4/5 object-contain drop-shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;


