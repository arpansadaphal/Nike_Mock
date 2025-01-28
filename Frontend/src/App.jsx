import { Route, BrowserRouter, Routes } from "react-router-dom";
import { getCsrfToken } from "./utils/csrf";
import { useEffect } from "react";
import {
  Nav,
  SignupScreen,
  LoginScreen,
  ProductScreen,
  CartScreen,
  CheckoutScreen,
  OrderDetails,
  ProductsPage,
  OrderHistory,
} from "./components";
import {
  CustomerReviews,
  Footer,
  Hero,
  Services,
  SpecialOffer,
  Subscribe,
  SuperQuality,
  Categories,
  NewArrivals,
  Gender,
  MensSection,
  WomensSection,
  KidsSection,
} from "./sections";
import Checkout from "./components/Screens/CheckoutScreen";

const App = () => {
  useEffect(() => {
    getCsrfToken();
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <main className="relative">
              <Nav />
              <section className="xl:padding-l wide:padding-r padding-b">
                <Hero />
              </section>
              <section>
                <Gender />
              </section>
              <section>
                <Categories />
              </section>
              <section className="padding">
                <NewArrivals />
              </section>
              <section className="padding">
                <MensSection />
              </section>
              <section className="padding">
                <WomensSection />
              </section>
              <section className="padding">
                <KidsSection />
              </section>
              <section className="padding">
                <SuperQuality />
              </section>
              <section className="padding-x py-10">
                <Services />
              </section>
              <section className="padding">
                <SpecialOffer />
              </section>
              <section className="bg-pale-blue padding">
                <CustomerReviews />
              </section>
              <section className="padding-x sm:py-32 py-16 w-full">
                <Subscribe />
              </section>
              <section className=" bg-black padding-x padding-t pb-8">
                <Footer />
              </section>
            </main>
          }
        />
        <Route path="/signup" element={<SignupScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/product/:id" element={<ProductScreen />} />
        <Route path="/cart/:id" element={<CartScreen />} />
        <Route path="/cart" element={<CartScreen />} />
        <Route path="/checkout" element={<CheckoutScreen />} />
        <Route path="/checkoutS" element={<Checkout />} />
        <Route path="/order/:order_id" element={<OrderDetails />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/newarrivals" element={<NewArrivals />} />
        <Route path="/orders" element={<OrderHistory />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
