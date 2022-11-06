import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreateProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token, currentUser } = useSelector((store) => store.currentUser);

  return <div>CreateProduct</div>;
};

export default CreateProduct;
