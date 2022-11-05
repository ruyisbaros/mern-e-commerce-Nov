import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Loading from "./utils/Loading.jsx";
import { useDispatch, useSelector } from "react-redux";
import NotFound from "./pages/NotFound.jsx";
import HeaderClient from "./components/HeaderClient.jsx";
import HomeClient from "./pages/HomeClient.jsx";
import Products from "./pages/Products.jsx";
import ProductReview from "./pages/ProductReview";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import axios from "axios";
import { refreshToken, userLoggedFinish } from "./redux/currentUserSlicer.js";

function App() {
  const dispatch = useDispatch();
  const { loading } = useSelector((store) => store.loadStatus);
  const { logging } = useSelector((store) => store.currentUser);
  const { token, currentUser } = useSelector((store) => store.currentUser);
  //console.log(token);
  const refreshTokenFunc = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/refresh_token");
      dispatch(
        refreshToken({
          token: data.accessToken,
          currentUser: data.current_user,
        })
      );
    } catch (error) {
      dispatch(userLoggedFinish());
      alert(error.response.data.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("firstLogin")) {
      refreshTokenFunc();

      setTimeout(() => {
        refreshTokenFunc();
      }, 6 * 24 * 60 * 60 * 1000); //6 days
    }
  }, [token, localStorage.getItem("firstLogin")]);

  return (
    <BrowserRouter>
      <ToastContainer position="bottom-center" limit={1} />

      {loading && <Loading />}
      {logging && <Loading />}
      <div className="App">
        <HeaderClient />
        <div className="main">
          <Routes>
            <Route path="/" element={<HomeClient />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductReview />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
