import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Loading from "./utils/Loading.jsx";
import { useDispatch, useSelector } from "react-redux";
import NotFound from "./pages/NotFound.jsx";
import Header from "./components/Header.jsx";
import HomeClient from "./pages/HomeClient.jsx";
import Products from "./pages/Products.jsx";
import ProductReview from "./pages/ProductReview";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import CreateProduct from "./pages/adminPages/CreateProduct";
import CreateCategory from "./pages/adminPages/CreateCategory";
import EditProduct from "./pages/adminPages/EditProduct";
import EditCategory from "./pages/adminPages/EditCategory";
import Categories from "./pages/adminPages/Categories";
import AdminHome from "./pages/adminPages/AdminHome";
import axios from "axios";
import { refreshToken, userLoggedFinish } from "./redux/currentUserSlicer.js";
import OrderHistory from "./pages/OrderHistory.jsx";
import AdminHeader from "./components/AdminHeader.jsx";
import { fetchCartItems } from "./redux/cartBoxSlicer.js";
import CheckOut from "./pages/CheckOut.jsx";
import CheckOutSingle from "./pages/CheckOutSingle";

function App() {
  const dispatch = useDispatch();
  const { loading } = useSelector((store) => store.loadStatus);
  const { logging } = useSelector((store) => store.currentUser);
  const { token, currentUser } = useSelector((store) => store.currentUser);
  const { cartItems } = useSelector((store) => store.cartItems);
  //console.log(cartItems);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const refreshTokenFunc = async () => {
      try {
        const { data } = await axios.get("/api/v1/auth/refresh_token");
        console.log(data);
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
    if (localStorage.getItem("firstLogin")) {
      refreshTokenFunc();

      setTimeout(() => {
        refreshTokenFunc();
      }, 6 * 24 * 60 * 60 * 1000); //6 days
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role.find((val) => val === "Admin")) {
        setIsAdmin(true);
      }
    }
  }, [currentUser]);

  console.log(currentUser);

  /* Fetch Cart Box */

  const fetchCartBox = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/users/get_cart/${currentUser._id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(data);
      dispatch(fetchCartItems(data));
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchCartBox();
    }
  }, [token, dispatch, currentUser]);

  return (
    <BrowserRouter>
      <ToastContainer position="bottom-center" limit={1} />

      {loading && <Loading />}
      {logging && <Loading />}
      <div className="App">
        {isAdmin ? <AdminHeader /> : <Header />}
        <div className="main">
          <Routes>
            <Route
              path="/"
              element={isAdmin ? <AdminHome /> : <Products isAdmin={isAdmin} />} //Later I will design a HomePage. Just now let it not browse empty!!!
            />
            <Route path="/products" element={<Products isAdmin={isAdmin} />} />
            <Route
              path="/products/:id"
              element={<ProductReview currentUser={currentUser} />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/history" element={<OrderHistory />} />
            <Route
              path="/check_out"
              element={<CheckOut token={token} currentUser={currentUser} />}
            />
            <Route
              path="/check_out_single/:id"
              element={
                <CheckOutSingle token={token} currentUser={currentUser} />
              }
            />
            {/* Admin */}
            <Route
              path="/categories"
              element={isAdmin ? <Categories /> : <HomeClient />}
            />
            <Route
              path="/create_product"
              element={isAdmin ? <CreateProduct /> : <HomeClient />}
            />
            <Route
              path="/create_category"
              element={isAdmin ? <CreateCategory /> : <HomeClient />}
            />
            <Route
              path="/edit_product/:id"
              element={isAdmin ? <EditProduct /> : <HomeClient />}
            />
            <Route
              path="/edit_category/:id"
              element={isAdmin ? <EditCategory /> : <HomeClient />}
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
