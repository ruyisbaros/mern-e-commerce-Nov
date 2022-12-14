import React, { useEffect, useState } from "react";
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
  const [productReviews, setProductReviews] = useState([]);

  useEffect(() => {
    const fetchProductRates = async () => {
      try {
        const { data } = await axios.get(
          `/api/v1/products/get_reviews/${product._id}`
        );
        console.log(data);
        setProductReviews(data);
      } catch (error) {}
    };
    fetchProductRates();
  }, [_id]);

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
      <div className="shop_cart_items-left">
        <Link to={`/products/${product._id}`}>
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
            rating={
              productReviews.reduce((a, b) => a + b.rate_value, 0) /
              productReviews.length
            }
            numReviews={productReviews.length}
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
