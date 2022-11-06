import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { loadingFinish, loadingStart } from "../redux/loadSlicer";
import axios from "axios";
import ProductItem from "../components/ProductItem";
import { getProducts } from "../redux/productsSlicer";

const Products = ({ isAdmin }) => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);

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

  return (
    <div className="products">
      {products?.map((product) => (
        <ProductItem
          fetchProducts={fetchProducts}
          isAdmin={isAdmin}
          key={product._id}
          {...product}
        />
      ))}
    </div>
  );
};

export default Products;
