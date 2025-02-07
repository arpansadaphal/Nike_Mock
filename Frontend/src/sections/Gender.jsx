import { Link } from "react-router-dom";

const Gender = ({ imageSrc, title }) => {
  return (
    <div className="relative bg-white shadow-md rounded-md overflow-hidden transform transition-transform duration-300 hover:scale-105">
      {/* Aspect Ratio Container */}
      <div className="relative pt-[133.33%]">
        {" "}
        {/* 9:12 ratio */}
        <img
          src={imageSrc}
          alt={title}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>
      {/* Overlay for the text */}
      <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <h3 className="text-white text-2xl font-bold">{title}</h3>
      </div>
    </div>
  );
};

const GenderSection = () => {
  return (
    <div className="py-10 px-4 max-w-screen-xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Corrected gender link as string */}
        <Link to={"/products?gender=men"}>
          <Gender imageSrc="https://static.nike.com/a/images/f_auto,cs_srgb/w_1536,c_limit/a22e7bb8-4517-4349-80d4-fc184c4c72db/men-s-shoes-clothing-accessories.jpg" title="Men" />
        </Link>
        <Link to={"/products?gender=women"}>
          <Gender imageSrc="/images/women.png" title="Women" />
        </Link>
        <Link to={"/products?gender=kids"}>
          <Gender imageSrc="/images/kids.png" title="Kids" />
        </Link>
      </div>
    </div>
  );
};

export default GenderSection;
