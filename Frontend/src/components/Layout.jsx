// src/layouts/ProductsLayout.jsx
import React from "react";
import Nav from "./Nav";
import Footer from "../sections/Footer";

const Layout = ({ children }) => {
  return (
    <div className="product-layout">
      <Nav className="fixed top-0 left-0 right-0 z-50  shadow-md" />
      <div className="container mx-auto px-4 pt-24 pb-8">{children}</div>
   
      <div className="bg-black padding-x padding-t pt-5 pb-8">
                <Footer />
              

      </div>
    </div>
  );
};

export default Layout;
