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
      {/* Left Content */}
      <div className="relative xl:w-2/5 flex flex-col justify-center items-start w-full max-xl:padding-x pt-28">
        <p className="text-xl font-montserrat text-coral-red">
          Our Summer Collection
        </p>

        <h1 className="mt-10 text-7xl max-sm:text-[72px] max-sm:leading-[82px] font-bold text-gray-900">
          <span className="xl:bg-white xl:whitespace-nowrap relative z-10 pr-10 pl-5">
            New Arrival
          </span>
          <br />
          <span className="text-coral-red inline-block mt-3 pl-5">
            Nike
          </span>{" "}
          Shoes
        </h1>

        <p className="font-montserrat text-gray-600 text-lg leading-8 mt-6 mb-14 sm:max-w-sm">
          Discover the latest Nike arrivals with unmatched style, comfort, and
          innovation. Designed for every adventure.
        </p>

        <div>
          <Link to={"/products"}>
            <Button label="Shop Now" iconURL={arrowRight} />
          </Link>
        </div>
      </div>

      {/* Right Content - Shoe Image & Selection */}
      <div className="relative flex-1 flex justify-center items-center xl:min-h-screen max-xl:py-40">
        <div className="relative w-[350px] h-[350px] sm:w-[450px] sm:h-[450px] bg-white shadow-lg rounded-full flex items-center justify-center">
          <img
            src={bigShoeImg}
            alt="shoe collection"
            className="w-3/4 sm:w-4/5 object-contain drop-shadow-lg"
          />
        </div>

        {/* Shoe Selection */}
        <div className="flex sm:gap-6 gap-4 absolute -bottom-[5%] sm:left-[10%] max-sm:px-6">
          {shoes.map((image, index) => (
            <div key={index}>
              <ShoeCard
                index={index}
                imgURL={image}
                changeBigShoeImage={(shoe) => setBigShoeImg(shoe)}
                bigShoeImg={bigShoeImg}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;



