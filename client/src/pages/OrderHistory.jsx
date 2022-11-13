import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { loadingFinish, loadingStart } from "../redux/loadSlicer";
import {
  fetchMyOrders,
  removeAllOrders,
  removeFromMyOrders,
} from "../redux/ordersSlicer";
import { MdEuro } from "react-icons/md";

const OrderHistory = () => {
  const dispatch = useDispatch();
  const { myOrders } = useSelector((store) => store.myOrders);
  const { token, currentUser } = useSelector((store) => store.currentUser);
  console.log(currentUser);
  console.log(myOrders);
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
        console.log(data);
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

  /* Delete-Cancel Order */
  const deleteOrder = async (id) => {
    try {
      dispatch(loadingStart());
      const { data } = await axios.delete(
        `/api/v1/orders/cancel_order/${id}`,

        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(data);
      dispatch(removeFromMyOrders(id));
      dispatch(loadingFinish());
    } catch (error) {
      dispatch(loadingFinish());
      toast.error(error.response.data.message);
    }
  };

  /* Delete all orders */

  const deleteAllOrders = async (e) => {
    try {
      dispatch(loadingStart());
      const { data } = await axios.post(
        `/api/v1/orders/cancel_orders`,
        { myOrders },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(data);
      dispatch(removeAllOrders());
      dispatch(loadingFinish());
    } catch (error) {
      dispatch(loadingFinish());
      toast.error(error.response.data.message);
    }
  };

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
                <th>Order ID</th>
                <th>Total Value</th>
                <th>Total Quantity</th>
                <th>Order Delivery Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {myOrders?.map((order) => (
                <tr key={order._id}>
                  <td className="table_responsive">
                    {order.products.map((prd) => (
                      <Link key={prd._id} to={`/products/${prd._id}`}>
                        <img
                          className="history_image"
                          src={prd.images[0].url}
                          alt=""
                        />
                      </Link>
                    ))}
                  </td>
                  <td className="table_responsive ">{order._id}</td>
                  <td className="table_responsive ">
                    {order.value} <MdEuro />
                  </td>
                  <td className="table_responsive ">
                    {order.products.length} Item(s)
                  </td>
                  <td className="table_responsive ">{order.status}</td>
                  <td className="table_responsive pl-3">
                    <i
                      onClick={() => deleteOrder(order._id)}
                      className="fa-solid fa-trash icon_red"
                    ></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={deleteAllOrders} className="delete_all_orders">
            Delete All Orders
          </button>
          <ul className="info_about_orders">
            <h6>SOME INFO:</h6>
            <li>
              If your order status does not change for a long time, please{" "}
              <Link to="!#">contact with us</Link>.
            </li>
            <li>
              When the order/orders are cancelled, your money will be refunded
              within 3 days at the latest.
            </li>
            <li>
              The product can be returned unconditionally within 15 days of
              delivery.
            </li>
          </ul>
        </>
      )}
    </div>
  );
};

export default OrderHistory;
