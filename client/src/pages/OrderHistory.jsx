import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { loadingFinish, loadingStart } from "../redux/loadSlicer";
import { fetchMyOrders } from "../redux/ordersSlicer";

const OrderHistory = () => {
  const dispatch = useDispatch();
  const { myOrders } = useSelector((store) => store.myOrders);
  const { token, currentUser } = useSelector((store) => store.currentUser);
  console.log(currentUser);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        dispatch(loadingStart());
        const { data } = await axios.get(
          `/api/v1/orders/my_orders/${currentUser._id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        dispatch(fetchMyOrders(data));
        dispatch(loadingFinish());
      } catch (error) {
        dispatch(loadingFinish());
        toast.error(error.response.data.message);
      }
    };
    if (currentUser) {
      fetchUserOrders();
    }
  }, [token, dispatch, currentUser]);

  return (
    <div className="order_history">
      {myOrders.length === 0 ? (
        <h2 className="text-center mb-4">No Orders</h2>
      ) : (
        <>
          <h2 className="text-center mb-4">My Orders</h2>
          <table className="table table-bordered table-striped table-hover table-responsive-xl">
            <thead className="thead-dark">
              <tr>
                <th>Image</th>
                <th>ID</th>
                <th>Value</th>
                <th>Status</th>
                <th>actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ass</td>
                <td>ass</td>
                <td>ass</td>
                <td>ass</td>
                <td>ass</td>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default OrderHistory;
