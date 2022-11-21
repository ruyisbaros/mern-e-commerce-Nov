import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { loadingFinish, loadingStart } from "../redux/loadSlicer";
import { BsCurrencyDollar } from "react-icons/bs";
import { FaTimes } from "react-icons/fa";
import { getProducts } from "../redux/productsSlicer";
import ProductItem from "../components/ProductItem";
import Rating from "../utils/Rating";
import Rate from "../utils/Rate";

const ProductReview = ({ currentUser }) => {
  const { id } = useParams();
  const { token } = useSelector((store) => store.currentUser);
  //console.log(id);
  //console.log(currentUser);

  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [productReviews, setProductReviews] = useState([]);
  const [reviewProduct, setReviewProduct] = useState(null);
  const [bigImageIndex, setBigImageIndex] = useState(null);
  const [reviewBoxSeen, setReviewBoxSeen] = useState(false);

  useEffect(() => {
    setBigImageIndex(0);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        dispatch(loadingStart());
        const { data } = await axios.get("/api/v1/products/get_all");
        console.log(data);
        setProducts(data.products);
        dispatch(getProducts(data.products));
        dispatch(loadingFinish());
      } catch (error) {
        dispatch(loadingFinish());
        toast.error(error.response.data.message);
      }
    };
    fetchProducts();
  }, [dispatch]);

  useEffect(() => {
    const fetchViewProduct = async () => {
      try {
        dispatch(loadingStart());
        const { data } = await axios.get(`/api/v1/products/get_one/${id}`);
        console.log(data);
        setReviewProduct(data);
        dispatch(loadingFinish());
      } catch (error) {
        dispatch(loadingFinish());
        toast.error(error.response.data.message);
      }
    };
    if (id) {
      fetchViewProduct();
    }
  }, [id, dispatch]);
  const [bigImage, setBigImage] = useState("");
  useEffect(() => {
    setBigImage(reviewProduct?.images[bigImageIndex]?.url);
  }, [bigImageIndex, id, reviewProduct?.images]);
  /* REVIEW FUNCS (RATING) */

  useEffect(() => {
    const fetchProductRates = async () => {
      try {
        const { data } = await axios.get(`/api/v1/products/get_reviews/${id}`);
        console.log(data);
        setProductReviews(data);
      } catch (error) {}
    };
    fetchProductRates();
  }, [id]);

  const [rateCredentials, setRateCredentials] = useState({
    rate_value: 0,
    rate_comment: "",
    rater: "",
    rated: "",
  });

  useEffect(() => {
    setRateCredentials({
      ...rateCredentials,
      rater: currentUser._id,
      rated: id,
    });
  }, [id, currentUser._id]);

  const handleReviewCredentials = (e) => {
    const { name, value } = e.target;
    setRateCredentials({ ...rateCredentials, [name]: value });
  };
  //console.log(rateCredentials);

  const handleRateSubmit = async (e) => {
    e.preventDefault();
    if (token) {
      try {
        dispatch(loadingStart());
        const { data } = await axios.post(
          "/api/v1/rates/create",
          { ...rateCredentials },
          { headers: { Authorization: token } }
        );
        console.log(data);
        setReviewProduct(data);
        dispatch(loadingFinish());
        window.location.reload();
      } catch (error) {
        dispatch(loadingFinish());
        toast.error(error.response.data.message);
      }
    } else {
      toast.error("You must log in");
    }
  };

  return (
    <div className="product_review_container">
      <div className="product_review_main">
        {/* <img src={reviewProduct?.images[0].url} alt="" /> */}
        <div className="product_review-left">
          <div className="product_review-left-1">
            {reviewProduct?.images?.map((img, i) => (
              <div
                key={img._id}
                className={
                  bigImageIndex === i ? "images-box active" : "images-box"
                }
              >
                <img onClick={() => setBigImageIndex(i)} src={img.url} alt="" />
              </div>
            ))}
          </div>
          <div className="product_review-left-2">
            <img src={bigImage} alt="" />
          </div>
        </div>
        <div className="product_review-box">
          <div className="pr_title">
            <h2>{reviewProduct?.title}</h2>
            <h6>#id: {reviewProduct?._id.slice(0, 4)}</h6>
          </div>
          <span className="product_review-price">
            <BsCurrencyDollar />
            {reviewProduct?.price}
          </span>
          <p>{reviewProduct?.description}</p>
          <p className="product_view-sold">Sold: {reviewProduct?.sold}</p>

          <Link to={`/check_out_single/${id}`} className="link_class cart">
            Buy Now
          </Link>
        </div>
      </div>
      {/* Reviews comments rates */}
      <div className="product_ratings_reviews">
        <h3>Product Reviews</h3>
        <div className="product_reviews_sorround">
          <div className="product_rate_result">
            <Rating
              rating={
                productReviews.reduce((a, b) => a + b.rate_value, 0) /
                productReviews.length
              }
              numReviews={productReviews.length}
            />
          </div>
          <div className="comments_evaluation">
            <p className="evaluation_size">
              {productReviews.length} Eveluations
            </p>
            <span>|</span>
            <p className="comment_size">{productReviews.length} comments</p>
            <p
              className="rate_button"
              onClick={() => setReviewBoxSeen(!reviewBoxSeen)}
            >
              Rate and Review
            </p>
          </div>
        </div>
        {reviewBoxSeen && (
          <div className="make_rate_comment">
            <div className="make_rate_comment_sorround">
              <form onSubmit={handleRateSubmit}>
                <input
                  type="number"
                  min={1}
                  max={5}
                  name="rate_value"
                  placeholder="Rate product between 0-5"
                  value={rateCredentials.rate_value}
                  onChange={handleReviewCredentials}
                />
                <textarea
                  name="rate_comment"
                  id="rate_comment"
                  cols="30"
                  rows="5"
                  value={rateCredentials.rate_comment}
                  onChange={handleReviewCredentials}
                ></textarea>
                <button type="submit">Submit</button>
              </form>
              <span
                onClick={() => setReviewBoxSeen(false)}
                className="review_close"
              >
                <FaTimes size={20} />
              </span>
            </div>
          </div>
        )}
      </div>
      {/* Review user's Comments reviews */}
      {productReviews.length > 0 && (
        <div className="see_product_reviews">
          {productReviews.map((rew) => (
            <div key={rew._id} className="see_product_reviews-box">
              <img src={rew.rater.avatar.url} alt="" />
              <p className="rater_name">{rew.rater?.name}</p>
              <Rate rating={rew.rate_value} />
              <p className="rater_says">{rew.rate_comment}</p>
            </div>
          ))}
        </div>
      )}
      {/* Related Products */}
      <div className="related_products">
        <h3>Related Products</h3>
        <div className="products">
          {products?.map(
            (product) =>
              product.category.name === reviewProduct?.category?.name && (
                <ProductItem key={product._id} {...product} />
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductReview;
