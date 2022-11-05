import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { loadingFinish, loadingStart } from "../redux/loadSlicer";
import axios from "axios";
import { Link } from "react-router-dom";
import { userLoggedFinish, userLoggedStart } from "../redux/currentUserSlicer";

const Register = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    avatar: "63668c73fec5be4a0446f8a1",
  });

  const handleInput = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      dispatch(userLoggedStart());
      const { data } = await axios.post("/api/v1/auth/register", { ...user });
      console.log(data);
      dispatch(userLoggedFinish());
      localStorage.setItem("firstLogin", true);
      window.location.href = "/";
    } catch (error) {
      dispatch(userLoggedFinish());
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleRegister}>
        <h4>Create your account</h4>
        <input
          name="text"
          type="name"
          placeholder="Type your name"
          required
          value={user.name}
          onChange={handleInput}
        />
        <input
          name="email"
          type="email"
          placeholder="Type your email"
          required
          value={user.email}
          onChange={handleInput}
        />
        <input
          name="password"
          type="password"
          placeholder="Type your password"
          required
          autoComplete="on"
          value={user.password}
          onChange={handleInput}
        />
        <input type="file" />
        <div className="btn_box">
          <button type="submit">Register</button>
          <Link to="/login" className="link_class">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
