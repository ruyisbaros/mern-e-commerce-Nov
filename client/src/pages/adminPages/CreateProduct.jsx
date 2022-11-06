import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import loadingImg from "../../images/loading.gif";
import { loadingFinish, loadingStart } from "../../redux/loadSlicer";

const CreateProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, currentUser } = useSelector((store) => store.currentUser);
  const [isCreated, setIsCreated] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: "",
    quantity: 0,
    sold: 0,
    category: "",
    images: [],
  });
  const { title, description, price, quantity, category, images } = newProduct;
  const [upldImages, setupldImages] = useState([]);
  const [index, setIndex] = useState(0);
  const [activeImg, setActiveImg] = useState(upldImages[index]);

  //console.log('target', targetOfUpdatePost);
  //console.log(upldImages);
  useEffect(() => {
    setActiveImg(upldImages[index]);
  }, [index, upldImages]);

  const fetchCategories = async () => {
    try {
      dispatch(loadingStart());
      const { data } = await axios.get("/api/v1/categories/all_cats");
      console.log(data);
      setCategories(data);
      dispatch(loadingFinish());
    } catch (error) {
      dispatch(loadingFinish());
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleInput = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

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

  let newupldImages = [];
  const imageUpload = async (dt) => {
    const { data } = await axios.post(
      "/api/v1/images/upload",
      dt /* {
          headers: { "content-type": "multipart/form-data", authorization: token }
      } */
    );
    //console.log(data);
    newupldImages.push(data);
    setupldImages([...upldImages, ...newupldImages]);
  };
  useEffect(() => {
    setNewProduct({
      ...newProduct,
      images: upldImages.map((i) => i._id),
    });
  }, [setupldImages, upldImages]);
  console.log(upldImages);
  console.log(newProduct);
  //console.log(upldImages);
  //console.log(upldImages);

  const handleupldImages = async (e) => {
    const files = [...e.target.files];

    //console.log(files);

    files.forEach((file) => {
      if (!file) return alert("Please select an image");
      if (file.size > 1024 * 1024 * 5)
        return alert("Your file is too large (max 1mb allowed)");
      if (
        file.type !== "image/jpeg" &&
        file.type !== "video/mp4" &&
        file.type !== "image/png"
      )
        return alert("Only jpeg, jpg or PNG images are allowed");
      let formData = new FormData();
      formData.append("file", file);
      imageUpload(formData);
    });
  };

  const deleteImage = async (id) => {
    setSelectedFile("");
    await axios.delete(
      `/api/v1/images/delete/${id}`
      /* { headers: { Authorization: `Bearer ${token}` } } */
    );
    setupldImages(upldImages.filter((img) => img.public_id !== id));
    setNewProduct({
      ...newProduct,
      images: upldImages,
    });
    //console.log(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(loadingStart());
      const { data } = await axios.post(
        "/api/v1/products/create",
        {
          ...newProduct,
        },
        { headers: { Authorization: token } }
      );
      console.log(data);
      dispatch(loadingFinish());
      navigate("/products");
    } catch (error) {
      toast.error(error.response.data.message);
      dispatch(loadingFinish());
    }
  };

  return (
    <div className="add_product">
      <div className="add_product_sorround">
        <h2 className="text-center my-3">Create a New Product</h2>
        <form onSubmit={handleSubmit} className="add_product_form">
          <input
            type="text"
            placeholder="Product Name"
            required
            name="title"
            value={title}
            onChange={handleInput}
          />
          <textarea
            name="description"
            id="description"
            placeholder="Description"
            required
            cols="51"
            rows="5"
            value={description}
            onChange={handleInput}
          ></textarea>
          <input
            type="text"
            placeholder="Product Price"
            required
            name="price"
            value={price}
            onChange={handleInput}
          />
          <input
            type="text"
            placeholder="Product Quantity"
            required
            name="quantity"
            value={quantity}
            onChange={handleInput}
          />

          <div className="cats_contents">
            {categories?.map((cat) => (
              <div key={cat._id} className="cats">
                <label htmlFor="category">{cat.name}</label>
                <input
                  value={cat._id}
                  type="radio"
                  name="category"
                  onChange={handleInput}
                />
              </div>
            ))}
          </div>
          <div className="show_upldImages">
            <div className="input_upldImages">
              <div className="file_upload">
                <i className="fas fa-image"></i>
                <input
                  type="file"
                  name="file"
                  id="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleupldImages}
                />
              </div>
            </div>
            <div className="show_upldImages_box">
              {isCreated && (
                <img
                  src={loadingImg}
                  alt="loading"
                  className="d-block mx-auto"
                />
              )}
              <div className="sml_img_box">
                {upldImages.map((img, i) => (
                  <div
                    key={i}
                    id="file_img"
                    className={index === i ? "file_img active_img" : "file_img"}
                  >
                    <img
                      src={img?.url}
                      alt="upldImages"
                      onClick={() =>
                        setIndex(i)
                      } /* className={i = index && "active_img"} */
                    />
                    <span
                      onClick={() => deleteImage(img.public_id)}
                      className="times"
                    >
                      &times;
                    </span>
                  </div>
                ))}
                {/* Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nisi est quos recusandae dolorum facere enim eaque, quasi modi voluptatibus possimus. */}
              </div>
              {upldImages.length > 0 && (
                <div className="img_big_box">
                  <img src={activeImg?.url} alt="" />
                </div>
              )}
            </div>
          </div>
          <div className="product_submit">
            <button className="btn btn-primary">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
