import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { BsImageFill } from "react-icons/bs";
import loadingGif from "../images/loading.gif";
import defaultImage from "../images/default-user.png";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  userLoggedFinish,
  userLoggedStart,
  userLoggedSucces,
} from "../redux/currentUserSlicer";

import { AiOutlineGoogle } from "react-icons/ai";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [signUpUser, setSignUpUser] = useState({
    name: "",
    email: "",
    password: "",
    confPassword: "",
    avatar: "63668c73fec5be4a0446f8a1",
  });
  const { name, avatar, email, confPassword, password } = signUpUser;
  const [passType, setPassType] = useState(false);
  const [confPassType, setConfPassType] = useState(false);
  const [isCreated, setIsCreated] = useState(false);

  const handleInput = (e) => {
    setSignUpUser({ ...signUpUser, [e.target.name]: e.target.value });
  };

  //console.log(signUpUser);

  //Profile image settings start
  const [selectedFile, setSelectedFile] = useState("");
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const [selectedImageId, setSelectedImageId] = useState("");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    setIsCreated(true);

    if (!file) return alert("Please select an image");
    if (file.size > 1024 * 1024 * 1) {
      alert("Your file is too large (max 1mb allowed)");
      setSelectedFile("");
      return;
    }
    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      alert("Only jpeg, jpg or PNG images are allowed");
      setSelectedFile("");
      return;
    }

    try {
      setSelectedFile(file);
      let formData = new FormData();
      formData.append("file", file);

      const { data } = await axios.post("/api/v1/images/upload", formData);
      setIsCreated(false);
      console.log(data);
      setSelectedImageId(data.public_id);
      setSignUpUser({ ...signUpUser, avatar: data._id });
    } catch (error) {
      setIsCreated(false);
      toast.error(error.response.data.message);
    }
  };

  const deleteImage = async () => {
    setSelectedFile("");
    const { data } = await axios.delete(
      `/api/v1/images/delete/${selectedImageId}`
      /* { headers: { Authorization: `Bearer ${token}` } } */
    );
    setSignUpUser({ ...signUpUser, avatar: "63668c73fec5be4a0446f8a1" });
    //console.log(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (confPassword === password) {
      try {
        dispatch(userLoggedStart());
        const { data } = await axios.post("/api/v1/auth/register", {
          name,
          email,
          password,
          avatar,
        });
        console.log(data);
        dispatch(userLoggedFinish());
        dispatch(
          userLoggedSucces({
            email: data[0].email,
            firstName: data[0].firstName,
            profileImage: data[0].image.imageUrl,
            token: data[1],
          })
        );
        /* localStorage.setItem("token", data[1]);

        localStorage.setItem("currentUser", JSON.stringify(data[0]));
        /* toast.success("Welcome to e-commer page"); */
        navigate("/");
        window.location.reload();
      } catch (error) {
        dispatch(userLoggedFinish());
        toast.error(error.response.data.message);
      }
    } else {
      toast.error("Passwords do not match");
    }
  };

  /* const handleCancel = () => {
    setSignUpUser({ ...signUpUser, email: "", password: "" });
  }; */

  return (
    <div className="register">
      <div className="register_sorround">
        <form onSubmit={handleSubmit} className="register_form">
          <h2>Sign up</h2>
          <input
            required
            name="name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={handleInput}
          />

          <input
            required
            name="email"
            type="email"
            placeholder="Your email"
            value={email}
            onChange={handleInput}
          />
          <div className="pass_box">
            <input
              name="password"
              required
              type={passType ? "text" : "password"}
              placeholder="Your password"
              value={password}
              onChange={handleInput}
            />
            <small
              style={{ color: passType ? "red" : "teal" }}
              onClick={() => setPassType(!passType)}
            >
              {passType ? "Hide" : "Show"}
            </small>
          </div>
          <div className="conf_pass_box">
            <input
              name="confPassword"
              required
              type={confPassType ? "text" : "password"}
              placeholder="Re Type your password"
              value={confPassword}
              onChange={handleInput}
            />
            <small
              style={{ color: confPassType ? "red" : "teal" }}
              onClick={() => setConfPassType(!confPassType)}
            >
              {confPassType ? "Hide" : "Show"}
            </small>
          </div>
          <div className="upload_image">
            <label htmlFor="imageUpload">
              <p>Profile image:</p>
              {isCreated ? (
                <img
                  className="loading_gif"
                  src={loadingGif}
                  alt="profile avatar"
                />
              ) : (
                <img
                  className="uploaded_image"
                  src={preview ? preview : defaultImage}
                  alt="profile avatar"
                />
              )}
            </label>
            {preview && (
              <span onClick={deleteImage} className="delete_image">
                X
              </span>
            )}
            <input
              id="imageUpload"
              type="file"
              maxLength={1024 * 1024}
              accept="image/png/* , image/jpeg/*"
              //value={newUser.photos}
              onChange={handleImageUpload}
            />
          </div>
          <div className="btn_box">
            <button type="submit">Register</button>
            <Link to="/login" className="link_class">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
