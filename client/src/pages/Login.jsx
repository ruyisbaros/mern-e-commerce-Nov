import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { loadingFinish, loadingStart } from "../redux/loadSlicer";
import axios from "axios";
import { Link } from "react-router-dom";
import { userLoggedFinish, userLoggedStart } from "../redux/currentUserSlicer";

const Login = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState({ email: "", password: "" });

  const handleInput = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      dispatch(userLoggedStart());
      const { data } = await axios.post("/api/v1/auth/login", { ...user });
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
      <form onSubmit={handleLogin}>
        <h4>Login your account</h4>
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
        <div className="btn_box">
          <button type="submit">Login</button>
          <Link to="/register" className="link_class">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
