import axios from "axios";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { loadingFinish, loadingStart } from "../../redux/loadSlicer";

const Categories = () => {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      dispatch(loadingStart());
      const { data } = await axios.get("/api/v1/categories/all_cats");
      console.log(data);
      dispatch(loadingFinish());
    } catch (error) {
      dispatch(loadingFinish());
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return <div>Categories</div>;
};

export default Categories;
