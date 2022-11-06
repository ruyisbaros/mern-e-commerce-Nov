import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { loadingFinish, loadingStart } from "../../redux/loadSlicer";

const Categories = () => {
  const dispatch = useDispatch();
  const { token, currentUser } = useSelector((store) => store.currentUser);
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

  const deleteHandle = async (id) => {
    try {
      const { data } = await axios.delete(`/api/v1/categories/delete/${id}`, {
        headers: {
          Authorization: token,
        },
      });
      toast.success(data.message);
      fetchCategories();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="categories">
      {categories?.map((cat) => (
        <div key={cat._id} className="category_item">
          <img src={cat.cat_image.url} alt="category item" />
          <div className="category_item-box">
            <h4 title={cat.name}>{cat.name}</h4>

            <p>{cat.description}</p>
          </div>
          <div className="row_btn">
            <Link
              id="btn_buy"
              onClick={() => deleteHandle(cat._id)}
              className="link_class"
              to="#!"
            >
              Delete
            </Link>
            <Link
              id="btn_view"
              className="link_class"
              to={`/edit_category/${cat._id}`}
            >
              Edit
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Categories;
