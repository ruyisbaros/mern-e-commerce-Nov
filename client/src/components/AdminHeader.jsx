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

const AdminHeader = () => {
  const dispatch = useDispatch();
  const [isLogged, setIsLogged] = useState(false);

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
            Admin Dashboard
          </Link>
        </h1>
      </div>
      <ul style={styleResponsive} className="header_list">
        {isLogged ? (
          <>
            <li>
              <Link
                onClick={() => setMenu(false)}
                to="/products"
                className="link_class"
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                onClick={() => setMenu(false)}
                to="/create_product"
                className="link_class"
              >
                Create Product
              </Link>
            </li>
            <li>
              <Link
                onClick={() => setMenu(false)}
                to="/categories"
                className="link_class"
              >
                Categories
              </Link>
            </li>
            <li>
              <Link
                onClick={() => setMenu(false)}
                to="/create_category"
                className="link_class"
              >
                Create Category
              </Link>
            </li>
            <li>
              <Link
                onClick={() => {
                  setMenu(false);
                  logout();
                }}
                to="/"
                className="link_class"
              >
                Logout
              </Link>
            </li>
          </>
        ) : (
          <li>
            <Link
              onClick={() => setMenu(false)}
              to="/login"
              className="link_class"
            >
              Login
            </Link>
          </li>
        )}

        <li className="header_list-close" onClick={toggle}>
          <FaTimes size={25} />
        </li>
      </ul>
    </div>
  );
};

export default AdminHeader;
