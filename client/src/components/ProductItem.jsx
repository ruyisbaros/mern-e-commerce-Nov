import React from "react";
import { BsCurrencyDollar } from "react-icons/bs";
import { Link } from "react-router-dom";

const Product = ({ _id, images, category, title, description, price }) => {
  return (
    <div className="product_item">
      <img src={images[0].url} alt="product item" />
      <div className="product_item-box">
        <h4 title={title}>{title}</h4>
        <span>
          <BsCurrencyDollar />
          {price}
        </span>
        <p>{description}</p>
      </div>
      <div className="row_btn">
        <Link id="btn_buy" className="link_class" to="#!">
          Buy
        </Link>
        <Link id="btn_view" className="link_class" to={`/products/${_id}`}>
          View
        </Link>
      </div>
    </div>
  );
};

export default Product;
