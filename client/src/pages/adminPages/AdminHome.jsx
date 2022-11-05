import React from "react";
import adminImg from "../../images/admin-panel.png";

const AdminHome = () => {
  return (
    <div className="admin-home">
      <h2>Welcome to Admin dashboard page</h2>
      <img src={adminImg} alt="" />
    </div>
  );
};

export default AdminHome;
