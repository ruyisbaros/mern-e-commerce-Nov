import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { loadingFinish, loadingStart } from "../redux/loadSlicer";
import axios from "axios";
import ProductItem from "../components/ProductItem";
import { getProducts } from "../redux/productsSlicer";
import Filters from "../components/Filters";

const Products = ({ isAdmin }) => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);

  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      dispatch(loadingStart());
      const { data } = await axios.get("/api/v1/categories/all_cats");
      console.log(data);
      setCategories(data);
      dispatch(loadingFinish());
    } catch (error) {
      dispatch(loadingFinish());
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  /* Filtering */
  const [callback, setCallback] = useState(false);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(0);
  /* &category=${category} */
  const fetchProducts = async () => {
    try {
      dispatch(loadingStart());
      const { data } = await axios.get(
        `/api/v1/products/get_all?limit=${
          page * 9
        }&sort=${sort}&title[regex]=${search}`
      );
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
      <Filters
        products={products}
        categories={categories}
        setCallback={setCallback}
        setCategory={setCategory}
        setSort={setSort}
        setSearch={setSearch}
        setPage={setPage}
      />
      <div className="products-sorround">
        {products?.map((product) => (
          <ProductItem
            fetchProducts={fetchProducts}
            isAdmin={isAdmin}
            key={product._id}
            {...product}
          />
        ))}
      </div>
    </div>
  );
};

export default Products;
