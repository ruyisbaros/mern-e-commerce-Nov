import React from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { FaTimes } from "react-icons/fa";
import { BsCart4 } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { authLogout } from "../redux/currentUserSlicer";

const HeaderClient = () => {
  const dispatch = useDispatch();
  const [isLogged, setIsLogged] = useState(false);
  const { cartItems } = useSelector((store) => store.cartItems);

  useEffect(() => {
    if (localStorage.getItem("firstLogin")) {
      setIsLogged(true);
    } else {
      setIsLogged(false);
    }
  }, [localStorage.getItem("firstLogin")]);

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/logout");
      console.log(data);
      localStorage.clear();
      toast.success(data.message);
      dispatch(authLogout());
      window.location.reload();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  /* Responsive css func */
  const [menu, setMenu] = useState(false);
  const toggle = () => setMenu(!menu);
  const styleResponsive = {
    left: menu ? "0%" : "-100%",
  };

  return (
    <div className="header">
      <div className="header_menu" onClick={toggle}>
        <AiOutlineMenu size={30} />
      </div>
      <div className="header_logo">
        <h1>
          <Link to="/" className="link_class">
            @hmetShop
          </Link>
        </h1>
      </div>
      <ul style={styleResponsive} className="header_list">
        {isLogged ? (
          <>
            <li>
              <Link to="/products" className="link_class">
                Shop
              </Link>
            </li>
            <li>
              <Link to="/history" className="link_class">
                Order History
              </Link>
            </li>
            <li>
              <Link onClick={logout} to="/" className="link_class">
                Logout
              </Link>
            </li>
          </>
        ) : (
          <li>
            <Link to="/login" className="link_class">
              Login
            </Link>
          </li>
        )}

        <li onClick={toggle} className="header_list-close">
          <FaTimes size={25} />
        </li>
      </ul>
      <div className="header_cart-icon">
        <span>{cartItems.length}</span>
        <Link to="/cart" className="link_class">
          <BsCart4 size={25} />
        </Link>
      </div>
    </div>
  );
};

export default HeaderClient;
