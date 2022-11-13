import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ShopCartItem from "../components/ShopCartItem";
import { BiEuro } from "react-icons/bi";
import { Link } from "react-router-dom";
import { fetchCartItems, getTotalValue } from "../redux/cartBoxSlicer";
import axios from "axios";

const ShopCard = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((store) => store.cartItems);
  const { token, currentUser } = useSelector((store) => store.currentUser);
  const [total, setTotal] = useState(0);

  useEffect(() => {
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
    if (currentUser) {
      fetchCartBox();
    }
  }, [token, dispatch, currentUser]);

  console.log(cartItems, currentUser);

  useEffect(() => {
    setTotal(cartItems.reduce((a, b) => a + b.product.price * b.quantity, 0));
    dispatch(getTotalValue(total));
  }, [cartItems, dispatch, total]);

  return (
    <div className="shop_cart_main">
      {cartItems.length === 0 ? (
        <h1>You Have No Item in your Cart</h1>
      ) : (
        <>
          <h2 className="shop_cart_main-title">
            {currentUser?.name}, Welcome to Your Shopping Cart
          </h2>
          <p className="item_count">{cartItems.length} Item(s) in Cart</p>
          <div className="shop_cart-sorround">
            <div className="shop_cart-left">
              {cartItems.length > 0 &&
                cartItems.map((cart, index) => (
                  <ShopCartItem token={token} key={cart._id} {...cart} />
                ))}
            </div>
            <div className="shop_cart-right">
              <div className="shop_cart-right-summary">
                <h2>Summary</h2>
                <div className="shop_cart-right-price">
                  <div className="shop_cart-right-price1">
                    <p>Original Price:</p>
                    <p>
                      <BiEuro />
                      {total}
                    </p>
                  </div>
                  <div className="shop_cart-right-price2">
                    <p>Credits applied:</p>
                    <p>
                      <BiEuro /> 0.0
                    </p>
                  </div>
                </div>
                <div className="shop_cart-right-payment">
                  <div className="shop_cart-right-total">
                    <p className="right-total-text">Total:</p>
                    <p className="right-total-value">
                      {" "}
                      <BiEuro />
                      {total}
                    </p>
                  </div>
                  <div className="shop_cart-right-credits">
                    <p className="right-credits-text">Credits Left:</p>
                    <p className="right-credits-value">
                      <BiEuro /> 0.0
                    </p>
                  </div>
                  <button className="shop_cart-right-checkout">
                    <Link to="/check_out" className="link_class">
                      Checkout
                    </Link>
                  </button>
                </div>
                <div className="shop_cart-right-promotions">
                  <p className="promotions">Promotions:</p>
                  <div className="shop_cart-right-promotions-cupon">
                    <input type="text" placeholder="Enter Cupon ID" />
                    <button className="shop_cart-right-apply">Apply</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ShopCard;
