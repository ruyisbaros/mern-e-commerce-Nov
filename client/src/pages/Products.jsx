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
  const fetchProductsWithCategory = async () => {
    try {
      dispatch(loadingStart());
      const { data } = await axios.get(
        `/api/v1/products/get_all?limit=${
          page * 9
        }&category=${category}&sort=${sort}&title[regex]=${search}`
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
    if (category) {
      fetchProductsWithCategory();
    } else {
      fetchProducts();
    }
  }, [category, sort, search, page]);

  return (
    <div className="products">
      <div className="filetrs-main">
        <div className="filter_content">
          <span>Filter:</span>
          <select
            name="category"
            id=""
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Products</option>
            {categories?.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>
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
