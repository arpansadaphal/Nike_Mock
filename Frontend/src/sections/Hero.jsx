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
      className="relative w-full flex xl:flex-row flex-col justify-between min-h-screen max-container pt-28 pb-20 px-8"
    >
      {/* TEXT CONTENT */}
      <div className="relative xl:w-2/5 flex flex-col justify-center items-start max-xl:w-full max-xl:text-center">
        <p className="text-lg font-montserrat text-coral-red uppercase tracking-wide">
          Our Summer Collections
        </p>

        <h1 className="relative mt-6 font-palanquin text-7xl max-sm:text-[60px] max-sm:leading-[70px] font-bold leading-tight">
          <span className="xl:bg-white xl:whitespace-nowrap relative z-10 px-5 py-1 shadow-md">
            New Arrival
          </span>
          <br />
          <span className="text-coral-red inline-block mt-3">Nike</span> Shoes
        </h1>

        <p className="font-montserrat text-gray-600 text-lg leading-8 mt-6 mb-8 sm:max-w-md">
          This is a personal project/mock-up and is not affiliated with or
          endorsed by Nike, Inc. The content and design are for demonstration
          purposes only.
        </p>

        <div className="flex max-xl:justify-center">
          <Link to={"/products"}>
            <Button label="Shop Now" iconURL={arrowRight} />
          </Link>
        </div>
      </div>

      {/* IMAGE SECTION */}
      <div className="relative flex-1 flex justify-center items-center xl:min-h-screen max-xl:py-40 bg-primary bg-hero bg-cover bg-center">
        {/* Shadow behind shoe */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-20"></div>

        <img
          src={bigShoeImg}
          alt="shoe collection"
          width={620}
          height={520}
          className="object-contain relative z-10 drop-shadow-xl"
        />

        {/* Small shoe selector */}
        <div className="flex sm:gap-6 gap-4 absolute bottom-10 sm:left-[10%] max-sm:px-6">
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

