import React from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { FaTimes } from "react-icons/fa";
import { BsCart4 } from "react-icons/bs";
import { Link } from "react-router-dom";

const HeaderClient = () => {
  return (
    <div className="header">
      <div className="header_menu">
        <AiOutlineMenu size={30} />
      </div>
      <div className="header_logo">
        <h1>
          <Link to="/" className="link_class">
            AhmetShop
          </Link>
        </h1>
      </div>
      <ul className="header_list">
        <li>
          <Link to="/products" className="link_class">
            Products
          </Link>
        </li>
        <li>
          <Link to="/login" className="link_class">
            Login
          </Link>
        </li>
        <li className="header_list-close">
          <FaTimes size={25} />
        </li>
      </ul>
      <div className="header_cart-icon">
        <span>0</span>
        <Link to="/cart" className="link_class">
          <BsCart4 size={25} />
        </Link>
      </div>
    </div>
  );
};

export default HeaderClient;
