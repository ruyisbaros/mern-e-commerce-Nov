import React from "react";
import moment from "moment";
import Rating from "../utils/Rating";
import { BiEuro } from "react-icons/bi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch } from "react-redux";
import { removeFromCartItems } from "../redux/cartBoxSlicer";

/* <span>{moment(post.createdDate).fromNow()}</span> */

const ShopCartItem = ({
  _id,
  quantity,
  createdAt,
  appUser,
  product,
  token,
}) => {
  const dispatch = useDispatch();

  const removeItem = async () => {
    try {
      const { data } = await axios.delete(`/api/v1/carts/delete/${_id}`, {
        headers: {
          Authorization: token,
        },
      });
      console.log(data);
      dispatch(removeFromCartItems(_id));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="shop_cart_items">
      <div className="shop_cart_items-Sleft">
        <Link to={`/product/view/${product.id}`}>
          <img src={product.images && product.images[0].url} alt="" />
        </Link>
      </div>
      <div className="shop_cart_items-right">
        <span>
          <p>Added:</p>
          {moment(createdAt).fromNow()}
        </span>
        <div className="category">
          <p className="category_title">Category:</p>
          <span>Category</span>
        </div>
        <div className="description">
          <p className="description_title">{product.productName}</p>
          <span>{product?.description}</span>
        </div>
        <div className="cart_item-rating">
          <Rating
            rating={product?.rate / product?.rate_times}
            numReviews={product?.rate_times}
          />
        </div>
        <div className="cart_item-price">
          <BiEuro size={15} />
          <span>{product.price}</span>
        </div>
      </div>
      <button onClick={removeItem} className="shop_cart_items-remove">
        Remove
      </button>
    </div>
  );
};

export default ShopCartItem;
