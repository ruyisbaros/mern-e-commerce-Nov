import React from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const ProfileDetail = () => {
  const dispatch = useDispatch();
  const { token, currentUser } = useSelector((store) => store.currentUser);
  console.log(currentUser);

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
          <form>
            <div className="current_p">
              <label htmlFor="password">Current Password</label>
              <input
                name="password"
                id="password"
                type="password"
                placeholder="Enter your current password"
              />
            </div>

            <div className="updadet_p">
              <label className="new_password_label" htmlFor="new_password">
                New Password
              </label>
              <input
                name="new_password"
                id="new_password"
                type="password"
                placeholder="Enter a password"
              />

              <label htmlFor="conf_password">Confirm New Password</label>
              <input
                name="conf_password"
                id="conf_password"
                type="password"
                placeholder="Enter the password again"
              />
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
