import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { loadingFinish, loadingStart } from "../redux/loadSlicer";
import axios from "axios";
import ProductItem from "../components/ProductItem";
import { getProducts } from "../redux/productsSlicer";
import infiniteImg from "../images/loading.35b947f5.gif";

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
          page * 3
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

  const [loaadImageSeen, setloaadImageSeen] = useState(false);

  const loadingActions = () => {
    setPage(page + 1);
    setloaadImageSeen(true);
    setTimeout(() => {
      setloaadImageSeen(false);
      window.scrollTo(0, document.body.scrollHeight);
    }, 2000);
  };

  return (
    <div className="products">
      {/* Filter options */}
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

        <input
          type="text"
          placeholder="Type your key word"
          value={search}
          onChange={(e) => setSearch(e.target.value.toLowerCase())}
        />

        <div className="filter_content">
          <span>Sort By:</span>
          <select
            name="sort"
            id=""
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="-price">Price: Highg to Low</option>
            <option value="price">Price: Low to Highg</option>
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
      {loaadImageSeen && (
        <div className="infinite_loading">
          <img src={infiniteImg} alt="" />
        </div>
      )}
      <button className="load_more_btn" onClick={loadingActions}>
        Load More
      </button>
    </div>
  );
};

export default Products;

/* 
 const handleColor = () => {
    if (window.scrollY >= document.documentElement.clientWidth) {
      setColor(true);
    } else {
      setColor(false);
    }
  };
document.documentElement.clientWidth
  window.addEventListener("scroll", handleColor); */
