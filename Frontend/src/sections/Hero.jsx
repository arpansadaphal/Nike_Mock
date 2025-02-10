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
      className="relative flex flex-col xl:flex-row items-center justify-between w-full min-h-screen px-6 md:px-12 xl:px-24 py-16 bg-gradient-to-br from-gray-100 to-white"
    >
      {/* Left Content - Large Text */}
      <div className="xl:w-2/5 flex flex-col justify-center items-start w-full max-xl:px-8 pt-20">
        <p className="text-2xl font-semibold text-coral-red">
          Our Summer Collection
        </p>

        <h1 className="mt-6 text-7xl md:text-8xl font-bold text-gray-900 leading-tight">
          <span className="relative z-10 pr-10 pl-2">New Arrival</span>
          <br />
          <span className="text-coral-red inline-block mt-3">Nike</span> Shoes
        </h1>

        <p className="font-montserrat text-gray-700 text-lg leading-8 mt-6 mb-12 sm:max-w-sm">
          Experience the ultimate blend of comfort and style with our latest Nike collection.
        </p>

        <Link to={"/products"}>
          <Button label="Shop Now" iconURL={arrowRight} />
        </Link>
      </div>

      {/* Right Content - Shoe Image & Selection */}
      <div className="relative flex-1 flex flex-col items-center xl:items-end xl:justify-center xl:w-1/2">
        {/* Shoe Image - Adjusting size for different screens */}
        <div className="relative w-[350px] md:w-[400px] xl:w-[450px] h-[350px] md:h-[400px] xl:h-[450px] bg-white shadow-xl rounded-full flex items-center justify-center">
          <img
            src={bigShoeImg}
            alt="shoe collection"
            className="w-4/5 object-contain drop-shadow-lg"
          />
        </div>

        {/* Shoe Selection */}
        <div className="flex gap-4 md:gap-6 mt-6 md:mt-8 xl:mt-10 max-sm:px-4 sm:px-6 md:px-8">
          {shoes.map((image, index) => (
            <ShoeCard
              key={index}
              index={index}
              imgURL={image}
              changeBigShoeImage={(shoe) => setBigShoeImg(shoe)}
              bigShoeImg={bigShoeImg}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;




