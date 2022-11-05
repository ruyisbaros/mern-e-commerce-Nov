import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { BsCurrencyDollar } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { addToCartItems } from "../redux/cartBoxSlicer";
import { loadingFinish, loadingStart } from "../redux/loadSlicer";

const Product = ({
  _id,
  images,
  category,
  title,
  description,
  price,
  checked,
  isAdmin,
}) => {
  const dispatch = useDispatch();
  const { token, currentUser } = useSelector((store) => store.currentUser);
  const { cartItems } = useSelector((store) => store.cartItems);
  //console.log(token, currentUser);
  const [cartItem, setCartItem] = useState({
    quantity: 1,
    owner: "",
    product: _id,
  });

  useEffect(() => {
    setCartItem({ ...cartItem, owner: currentUser._id });
  }, [currentUser]);

  const addCart = async () => {
    if (localStorage.getItem("firstLogin")) {
      try {
        dispatch(loadingStart());
        const { data } = await axios.post(
          "/api/v1/carts/create",
          { ...cartItem },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        dispatch(addToCartItems(data));
        dispatch(loadingFinish());
      } catch (error) {
        dispatch(loadingFinish());
        toast.error(error.response.data.message);
      }
    } else {
      toast.error("You should log in!");
    }
  };

  const [itemInBaset, setItemInBaseket] = useState(false);

  useEffect(() => {
    setItemInBaseket(cartItems?.find((item) => item.product._id === _id));
  }, [cartItems.length, _id]);

  return (
    <div className="product_item">
      {isAdmin && <input type="checkbox" checked={checked} />}
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
        {isAdmin ? (
          <>
            <Link id="btn_buy" className="link_class" to="#!">
              Delete
            </Link>
            <Link
              id="btn_view"
              className="link_class"
              to={`/edit_product/${_id}`}
            >
              Edit
            </Link>
          </>
        ) : (
          <>
            {itemInBaset ? (
              <Link id="btn_buy" className="link_class" to="/cart">
                Go Cart
              </Link>
            ) : (
              <Link
                onClick={addCart}
                id="btn_buy"
                className="link_class"
                to="#!"
              >
                Add Cart
              </Link>
            )}
            <Link id="btn_view" className="link_class" to={`/products/${_id}`}>
              View
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Product;
