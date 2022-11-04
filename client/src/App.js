import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Loading from "./utils/Loading.jsx";
import { useDispatch, useSelector } from "react-redux";
import NotFound from "./pages/NotFound.jsx";

function App() {
  const dispatch = useDispatch();
  const { loading } = useSelector((store) => store.loadStatus);
  return (
    <BrowserRouter>
      <ToastContainer position="bottom-center" limit={1} />

      {loading && <Loading />}
      <div className="App">
        <div className="main">
          <Routes>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
