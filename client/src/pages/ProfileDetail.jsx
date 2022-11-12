import React from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { loadingFinish, loadingStart } from "../redux/loadSlicer";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const ProfileDetail = () => {
  const dispatch = useDispatch();
  const { token, currentUser } = useSelector((store) => store.currentUser);
  console.log(currentUser);
  const [currentPassType, setCurrentPassType] = useState(false);
  const [newpassType, setNewPassType] = useState(false);
  const [confPassType, setConfPassType] = useState(false);
  const [pwdCredentials, setPwdCredentials] = useState({
    current_password: "",
    new_password: "",
    conf_password: "",
  });
  const { current_password, new_password, conf_password } = pwdCredentials;

  const handleInput = (e) => {
    const { name, value } = e.target;
    setPwdCredentials({ ...pwdCredentials, [name]: value });
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    if (new_password === conf_password) {
      try {
        dispatch(loadingStart());
        const { data } = await axios.patch(
          `/api/v1/auth/update_pwd/${currentUser._id}`,
          { current_password, new_password },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        dispatch(loadingFinish());
        toast.success(data.message);
        setPwdCredentials({
          ...pwdCredentials,
          current_password: "",
          new_password: "",
          conf_password: "",
        });
      } catch (error) {
        dispatch(loadingFinish());
        toast.error(error.response.data.message);
      }
    } else {
      toast.error("Passwords do not match!");
    }
  };

  return (
    <div className="profile_detail_box">
      <div className="profile_detail_header">
        <h4>Manage Your Account</h4>
      </div>
      <div className="profile_detail_general">
        <div className="profile_detail_general-left">
          <p className="profile_header">Profile</p>
          <p className="profile_explain">
            Your email address is your identity on our page and is used to log
            in.
          </p>
        </div>
        <div className="profile_detail_general-right">
          <img src={currentUser?.avatar?.url} alt="" />
          <form>
            <label htmlFor="email">Email Address</label>
            <input type="email" readOnly placeholder={currentUser.email} />
            <label htmlFor="name">Name</label>
            <input type="text" placeholder={currentUser.name} />
            <p>
              You can make changes on your <Link to="#!">account</Link>.
            </p>
          </form>
        </div>
      </div>
      <div className="profile_detail_password">
        <div className="profile_detail_password-left">
          <p className="password_header">Password</p>
          <p className="password_explain">
            Changing your password may also reset your some activites. And your
            old password will be completely disabled.
          </p>
        </div>
        <div className="profile_detail_password-right">
          <form onSubmit={updatePassword}>
            <div className="current_p">
              <label htmlFor="current_password">Current Password</label>
              <input
                name="current_password"
                id="current_password"
                type={currentPassType ? "text" : "password"}
                placeholder="Enter your current password"
                value={current_password}
                onChange={handleInput}
              />
              <small onClick={() => setCurrentPassType(!currentPassType)}>
                {currentPassType ? (
                  <AiOutlineEye size={20} />
                ) : (
                  <AiOutlineEyeInvisible size={20} />
                )}
              </small>
            </div>

            <div className="updadet_p">
              <label className="new_password_label" htmlFor="new_password">
                New Password
              </label>
              <input
                name="new_password"
                id="new_password"
                type={newpassType ? "text" : "password"}
                placeholder="Enter a password"
              />
              <small
                className="small_new"
                onClick={() => setNewPassType(!newpassType)}
              >
                {newpassType ? (
                  <AiOutlineEye size={20} />
                ) : (
                  <AiOutlineEyeInvisible size={20} />
                )}
              </small>
              <label htmlFor="conf_password">Confirm New Password</label>
              <input
                name="conf_password"
                id="conf_password"
                type={confPassType ? "text" : "password"}
                placeholder="Enter the password again"
              />
              <small
                className="small_conf"
                onClick={() => setConfPassType(!confPassType)}
              >
                {confPassType ? (
                  <AiOutlineEye size={20} />
                ) : (
                  <AiOutlineEyeInvisible size={20} />
                )}
              </small>
              <button type="submit" className="update_password">
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="profile_detail_dltaccount">
        <div className="profile_detail_dltaccount-left">
          <p className="dltaccount_header">Close Account</p>
          <p className="password_explain">
            <span>Warning:</span> Closing your account is irreversible.
          </p>
        </div>
        <div className="profile_detail_dltaccount-right">
          <button className="close_account">Close this account...</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;
