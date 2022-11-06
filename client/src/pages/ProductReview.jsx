import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { loadingFinish, loadingStart } from "../redux/loadSlicer";
import { BsCurrencyDollar } from "react-icons/bs";
import { getProducts } from "../redux/productsSlicer";
import ProductItem from "../components/ProductItem";

const ProductReview = () => {
  const { id } = useParams();

  console.log(id);

  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [reviewProduct, setReviewProduct] = useState(null);

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

  useEffect(() => {
    fetchProducts();
  }, []);

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

  useEffect(() => {
    if (id) {
      fetchViewProduct();
    }
  }, [id]);

  return (
    <>
      <div className="product_review_main">
        <img src={reviewProduct?.images[0].url} alt="" />
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
      <div className="related_products">
        <h2>Related Products</h2>
        <div className="products">
          {products?.map(
            (product) =>
              product.category.name === reviewProduct?.category.name && (
                <ProductItem key={product._id} {...product} />
              )
          )}
        </div>
      </div>
    </>
  );
};

export default ProductReview;
