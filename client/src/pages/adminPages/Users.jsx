import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";

import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Avatar from "../../images/default-user.png";
import { loadingFinish, loadingStart } from "../../redux/loadSlicer";
import { fetchUsers } from "../../redux/usersSlicer";

const Users = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users } = useSelector((store) => store.users);
  const { token, currentUser } = useSelector((store) => store.currentUser);

  const [alert, setAlert] = useState(false);
  const [deletedUserInfo, setDeletedUserInfo] = useState({
    id: null,
    firstName: "",
  });

  //console.log(localStorage.getItem("token"));
  //Pagination Sorting Filter
  const [keyword, setKeyword] = useState("");
  /* const [pageEmpty, setPageEmpty] = useState(false);

  useEffect(() => {
    if (users.length === 0) {
      setPageEmpty(true);
    } else {
      setPageEmpty(false);
    }
  }, [users.length]); */

  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        dispatch(loadingStart());
        const { data } = await axios.get(`/api/v1/users/get_users_admin`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log(data);

        dispatch(fetchUsers(data));
        dispatch(loadingFinish());
      } catch (error) {
        dispatch(loadingFinish());
      }
    };
    fetchActiveUsers();
  }, [token, keyword]);

  console.log(users);

  //DELETE USER!
  const getDeleteUserInfo = async (id, firstName) => {
    setAlert(true);
    setDeletedUserInfo({ ...deletedUserInfo, id: id, firstName: firstName });
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `/api/v1/users/admin/delete_user/${deletedUserInfo.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("User has been deleted successufully");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
    setAlert(false);
  };

  return (
    <div className="users_container">
      <div className="profile_detail_header">
        <h4>Manage Your Account</h4>
      </div>

      <div className="search_actions">
        <p>Search By keyword:</p>
        <input
          type="text"
          placeholder="Keyword..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button onClick={fetchUsers} className="btn btn-primary">
          Search
        </button>
        <button className="btn btn-danger" onClick={() => setKeyword("")}>
          Cancel
        </button>
      </div>

      <table className="table table-bordered table-striped table-hover table-responsive-xl">
        <thead className="thead-dark">
          <tr>
            <th>User Id</th>
            <th>Photo</th>
            <th>Email</th>
            <th>Name</th>
            <th>Roles</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              {/* <td>{user.photo}</td> */}
              <td>
                <img
                  className="avatar"
                  src={user.avatar ? user.avatar.url : Avatar}
                  alt="photoname"
                />
              </td>
              <td>{user.email}</td>
              <td className="table_responsive">{user.name}</td>

              <td>{user.role?.map((role) => role + " ")}</td>
              <td className="text-center">
                {user.enabled ? (
                  <i className="fa-solid fa-check-circle icon_green"></i>
                ) : (
                  <i className="fa-solid fa-check-circle icon_dark"></i>
                )}
              </td>
              <td className="text-center d-flex justify-content-around border-bottom-0">
                <i
                  onClick={() => getDeleteUserInfo(user._id, user.name)}
                  className="fa-solid fa-trash icon_red"
                ></i>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {alert && (
        <div className="warning_box-delete">
          <p>
            Are you sure do you want to delete " {deletedUserInfo.firstName} "
            with " {deletedUserInfo.id} " ID
          </p>
          <div className="text-center">
            <button
              onClick={handleDelete}
              className="btn btn-primary m-4"
              type="submit"
            >
              Yes
            </button>
            <button
              onClick={() => setAlert(false)}
              className="btn btn-danger"
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
