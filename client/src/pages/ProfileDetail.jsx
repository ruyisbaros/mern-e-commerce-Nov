import React from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { loadingFinish, loadingStart } from "../redux/loadSlicer";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useEffect } from "react";
import { GrStatusWarning } from "react-icons/gr";
import { MdOutlineOpenInNew, MdOutlineOpenInNewOff } from "react-icons/md";

const ProfileDetail = () => {
  const dispatch = useDispatch();
  const { token, currentUser } = useSelector((store) => store.currentUser);
  //console.log(currentUser);
  const [currentPassType, setCurrentPassType] = useState(false);
  const [newpassType, setNewPassType] = useState(false);
  const [confPassType, setConfPassType] = useState(false);
  const [mustWarn, setMustWarn] = useState(false);
  const [moreChanges, setMoreChanges] = useState(false);
  //const [gender, setGender] = useState("");
  const [pwdCredentials, setPwdCredentials] = useState({
    current_password: "",
    new_password: "",
    conf_password: "",
  });
  const { current_password, new_password, conf_password } = pwdCredentials;

  useEffect(() => {
    if (currentUser?.address?.street === "") {
      setMustWarn(true);
    }
  }, [currentUser?.address?.street]);

  /* UPDATE ADDRESS AND OTHER INFO FUNCS */
  const [updateDetailInfo, setUpdateDetailInfo] = useState({
    street: "",
    zipCode: "",
    city: "",
    country: "",
    gender: currentUser?.address?.gender,
    avatar: currentUser?.avatar?._id,
  });
  const { street, zipCode, city, country, gender, avatar } = updateDetailInfo;

  useEffect(() => {
    setUpdateDetailInfo({
      ...updateDetailInfo,
      street: currentUser?.address?.street,
      zipCode: currentUser?.address?.zipCode,
      city: currentUser?.address?.city,
      country: currentUser?.address?.country,
      gender: currentUser?.address?.gender,
      avatar: currentUser?.avatar?._id,
    });
  }, [token]);

  const handleUpdateValues = (e) => {
    const { name, value } = e.target;
    setUpdateDetailInfo({ ...updateDetailInfo, [name]: value });
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
  const [isCreated, setIsCreated] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    setIsCreated(true);

    if (!file) return alert("Please select an image");
    if (file.size > 1024 * 1024 * 1) {
      alert("Your file is too large (max 1mb allowed)");
      setSelectedFile("");
      return;
    }
    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      alert("Only jpeg, jpg or PNG images are allowed");
      setSelectedFile("");
      return;
    }

    try {
      setSelectedFile(file);
      let formData = new FormData();
      formData.append("file", file);

      const { data } = await axios.post("/api/v1/images/upload", formData);
      setIsCreated(false);
      //console.log(data);
      setSelectedImageId(data.public_id);
      setUpdateDetailInfo({ ...updateDetailInfo, avatar: data._id });
    } catch (error) {
      setIsCreated(false);
      toast.error(error.response.data.message);
    }
  };

  const deleteImage = async () => {
    setSelectedFile("");
    const { data } = await axios.delete(
      `/api/v1/images/delete/${selectedImageId}`
      /* { headers: { Authorization: `Bearer ${token}` } } */
    );
    setUpdateDetailInfo({
      ...updateDetailInfo,
      avatar: currentUser?.avatar?._id,
    });
  };

  /* Update submit */
  const handleUpdatedChanges = async (e) => {
    e.preventDefault();
    try {
      dispatch(loadingStart());
      const { data } = await axios.patch(
        `/api/v1/users/update_user/${currentUser._id}`,
        { street, zipCode, city, country, gender, avatar },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      dispatch(loadingFinish());
      window.location.reload();
    } catch (error) {
      dispatch(loadingFinish());
      toast.error(error.response.data.message);
    }
  };

  /* UPDATE PASSWORD FUNCS */
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
        setPwdCredentials({
          ...pwdCredentials,
          current_password: "",
          new_password: "",
          conf_password: "",
        });
        toast.success(data.message);
      } catch (error) {
        dispatch(loadingFinish());
        toast.error(error.response.data.message);
      }
    } else {
      toast.error("Passwords do not match!");
    }
  };
  console.log(updateDetailInfo);
  return (
    <div className="profile_detail_box">
      <div className="profile_detail_header">
        <h4>Manage Your Account</h4>
      </div>
      {mustWarn && (
        <div className="must_warn">
          <span>
            <GrStatusWarning size={20} />
          </span>
          Address information has not been specified in your profile yet. If you
          make a purchase on our website, we do not have a chance to deliver the
          product/products to you. Please update your address information.
        </div>
      )}
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
          <form onSubmit={handleUpdatedChanges}>
            <label htmlFor="email">Email Address</label>
            <input type="email" readOnly placeholder={currentUser.email} />
            <label htmlFor="name">Name</label>
            <input type="text" placeholder={currentUser.name} />
            <p>
              Update your address etc. information{" "}
              <Link to="#!" onClick={() => setMoreChanges(!moreChanges)}>
                {moreChanges ? (
                  <MdOutlineOpenInNewOff size={20} />
                ) : (
                  <MdOutlineOpenInNew size={20} />
                )}
              </Link>
              .
            </p>
            {moreChanges && (
              <div className="more_changes">
                <div className="more_changes-address">
                  <h4>Address Info</h4>
                  <label htmlFor="">Street</label>
                  <input
                    required
                    name="street"
                    type="text"
                    placeholder="Street"
                    value={street}
                    onChange={handleUpdateValues}
                  />
                  <label htmlFor="zipCode">Zip Code</label>
                  <input
                    required
                    name="zipCode"
                    type="text"
                    placeholder="Zip code"
                    value={zipCode}
                    onChange={handleUpdateValues}
                  />
                  <label htmlFor="">City</label>
                  <input
                    required
                    name="city"
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={handleUpdateValues}
                  />
                  <label htmlFor="" style={{ display: "block" }}>
                    Country
                  </label>
                  <select
                    required
                    name="country"
                    value={country}
                    onChange={handleUpdateValues}
                  >
                    <option value="">Select Your Country</option>
                    <option value="AF">Afghanistan</option>
                    <option value="AX">Åland Islands</option>
                    <option value="AL">Albania</option>
                    <option value="DZ">Algeria</option>
                    <option value="AS">American Samoa</option>
                    <option value="AD">Andorra</option>
                    <option value="AO">Angola</option>
                    <option value="AI">Anguilla</option>
                    <option value="AQ">Antarctica</option>
                    <option value="AG">Antigua and Barbuda</option>
                    <option value="AR">Argentina</option>
                    <option value="AM">Armenia</option>
                    <option value="AW">Aruba</option>
                    <option value="AU">Australia</option>
                    <option value="AT">Austria</option>
                    <option value="AZ">Azerbaijan</option>
                    <option value="BS">Bahamas</option>
                    <option value="BH">Bahrain</option>
                    <option value="BD">Bangladesh</option>
                    <option value="BB">Barbados</option>
                    <option value="BY">Belarus</option>
                    <option value="BE">Belgium</option>
                    <option value="BZ">Belize</option>
                    <option value="BJ">Benin</option>
                    <option value="BM">Bermuda</option>
                    <option value="BT">Bhutan</option>
                    <option value="BO">Bolivia, Plurinational State of</option>
                    <option value="BQ">Bonaire, Sint Eustatius and Saba</option>
                    <option value="BA">Bosnia and Herzegovina</option>
                    <option value="BW">Botswana</option>
                    <option value="BV">Bouvet Island</option>
                    <option value="BR">Brazil</option>
                    <option value="IO">British Indian Ocean Territory</option>
                    <option value="BN">Brunei Darussalam</option>
                    <option value="BG">Bulgaria</option>
                    <option value="BF">Burkina Faso</option>
                    <option value="BI">Burundi</option>
                    <option value="KH">Cambodia</option>
                    <option value="CM">Cameroon</option>
                    <option value="CA">Canada</option>
                    <option value="CV">Cape Verde</option>
                    <option value="KY">Cayman Islands</option>
                    <option value="CF">Central African Republic</option>
                    <option value="TD">Chad</option>
                    <option value="CL">Chile</option>
                    <option value="CN">China</option>
                    <option value="CX">Christmas Island</option>
                    <option value="CC">Cocos (Keeling) Islands</option>
                    <option value="CO">Colombia</option>
                    <option value="KM">Comoros</option>
                    <option value="CG">Congo</option>
                    <option value="CD">
                      Congo, the Democratic Republic of the
                    </option>
                    <option value="CK">Cook Islands</option>
                    <option value="CR">Costa Rica</option>
                    <option value="CI">Côte d'Ivoire</option>
                    <option value="HR">Croatia</option>
                    <option value="CU">Cuba</option>
                    <option value="CW">Curaçao</option>
                    <option value="CY">Cyprus</option>
                    <option value="CZ">Czech Republic</option>
                    <option value="DK">Denmark</option>
                    <option value="DJ">Djibouti</option>
                    <option value="DM">Dominica</option>
                    <option value="DO">Dominican Republic</option>
                    <option value="EC">Ecuador</option>
                    <option value="EG">Egypt</option>
                    <option value="SV">El Salvador</option>
                    <option value="GQ">Equatorial Guinea</option>
                    <option value="ER">Eritrea</option>
                    <option value="EE">Estonia</option>
                    <option value="ET">Ethiopia</option>
                    <option value="FK">Falkland Islands (Malvinas)</option>
                    <option value="FO">Faroe Islands</option>
                    <option value="FJ">Fiji</option>
                    <option value="FI">Finland</option>
                    <option value="FR">France</option>
                    <option value="GF">French Guiana</option>
                    <option value="PF">French Polynesia</option>
                    <option value="TF">French Southern Territories</option>
                    <option value="GA">Gabon</option>
                    <option value="GM">Gambia</option>
                    <option value="GE">Georgia</option>
                    <option value="DE">Germany</option>
                    <option value="GH">Ghana</option>
                    <option value="GI">Gibraltar</option>
                    <option value="GR">Greece</option>
                    <option value="GL">Greenland</option>
                    <option value="GD">Grenada</option>
                    <option value="GP">Guadeloupe</option>
                    <option value="GU">Guam</option>
                    <option value="GT">Guatemala</option>
                    <option value="GG">Guernsey</option>
                    <option value="GN">Guinea</option>
                    <option value="GW">Guinea-Bissau</option>
                    <option value="GY">Guyana</option>
                    <option value="HT">Haiti</option>
                    <option value="HM">
                      Heard Island and McDonald Islands
                    </option>
                    <option value="VA">Holy See (Vatican City State)</option>
                    <option value="HN">Honduras</option>
                    <option value="HK">Hong Kong</option>
                    <option value="HU">Hungary</option>
                    <option value="IS">Iceland</option>
                    <option value="IN">India</option>
                    <option value="ID">Indonesia</option>
                    <option value="IR">Iran, Islamic Republic of</option>
                    <option value="IQ">Iraq</option>
                    <option value="IE">Ireland</option>
                    <option value="IM">Isle of Man</option>
                    <option value="IL">Israel</option>
                    <option value="IT">Italy</option>
                    <option value="JM">Jamaica</option>
                    <option value="JP">Japan</option>
                    <option value="JE">Jersey</option>
                    <option value="JO">Jordan</option>
                    <option value="KZ">Kazakhstan</option>
                    <option value="KE">Kenya</option>
                    <option value="KI">Kiribati</option>
                    <option value="KP">
                      Korea, Democratic People's Republic of
                    </option>
                    <option value="KR">Korea, Republic of</option>
                    <option value="KW">Kuwait</option>
                    <option value="KG">Kyrgyzstan</option>
                    <option value="LA">Lao People's Democratic Republic</option>
                    <option value="LV">Latvia</option>
                    <option value="LB">Lebanon</option>
                    <option value="LS">Lesotho</option>
                    <option value="LR">Liberia</option>
                    <option value="LY">Libya</option>
                    <option value="LI">Liechtenstein</option>
                    <option value="LT">Lithuania</option>
                    <option value="LU">Luxembourg</option>
                    <option value="MO">Macao</option>
                    <option value="MK">
                      Macedonia, the former Yugoslav Republic of
                    </option>
                    <option value="MG">Madagascar</option>
                    <option value="MW">Malawi</option>
                    <option value="MY">Malaysia</option>
                    <option value="MV">Maldives</option>
                    <option value="ML">Mali</option>
                    <option value="MT">Malta</option>
                    <option value="MH">Marshall Islands</option>
                    <option value="MQ">Martinique</option>
                    <option value="MR">Mauritania</option>
                    <option value="MU">Mauritius</option>
                    <option value="YT">Mayotte</option>
                    <option value="MX">Mexico</option>
                    <option value="FM">Micronesia, Federated States of</option>
                    <option value="MD">Moldova, Republic of</option>
                    <option value="MC">Monaco</option>
                    <option value="MN">Mongolia</option>
                    <option value="ME">Montenegro</option>
                    <option value="MS">Montserrat</option>
                    <option value="MA">Morocco</option>
                    <option value="MZ">Mozambique</option>
                    <option value="MM">Myanmar</option>
                    <option value="NA">Namibia</option>
                    <option value="NR">Nauru</option>
                    <option value="NP">Nepal</option>
                    <option value="NL">Netherlands</option>
                    <option value="NC">New Caledonia</option>
                    <option value="NZ">New Zealand</option>
                    <option value="NI">Nicaragua</option>
                    <option value="NE">Niger</option>
                    <option value="NG">Nigeria</option>
                    <option value="NU">Niue</option>
                    <option value="NF">Norfolk Island</option>
                    <option value="MP">Northern Mariana Islands</option>
                    <option value="NO">Norway</option>
                    <option value="OM">Oman</option>
                    <option value="PK">Pakistan</option>
                    <option value="PW">Palau</option>
                    <option value="PS">Palestinian Territory, Occupied</option>
                    <option value="PA">Panama</option>
                    <option value="PG">Papua New Guinea</option>
                    <option value="PY">Paraguay</option>
                    <option value="PE">Peru</option>
                    <option value="PH">Philippines</option>
                    <option value="PN">Pitcairn</option>
                    <option value="PL">Poland</option>
                    <option value="PT">Portugal</option>
                    <option value="PR">Puerto Rico</option>
                    <option value="QA">Qatar</option>
                    <option value="RE">Réunion</option>
                    <option value="RO">Romania</option>
                    <option value="RU">Russian Federation</option>
                    <option value="RW">Rwanda</option>
                    <option value="BL">Saint Barthélemy</option>
                    <option value="SH">
                      Saint Helena, Ascension and Tristan da Cunha
                    </option>
                    <option value="KN">Saint Kitts and Nevis</option>
                    <option value="LC">Saint Lucia</option>
                    <option value="MF">Saint Martin (French part)</option>
                    <option value="PM">Saint Pierre and Miquelon</option>
                    <option value="VC">Saint Vincent and the Grenadines</option>
                    <option value="WS">Samoa</option>
                    <option value="SM">San Marino</option>
                    <option value="ST">Sao Tome and Principe</option>
                    <option value="SA">Saudi Arabia</option>
                    <option value="SN">Senegal</option>
                    <option value="RS">Serbia</option>
                    <option value="SC">Seychelles</option>
                    <option value="SL">Sierra Leone</option>
                    <option value="SG">Singapore</option>
                    <option value="SX">Sint Maarten (Dutch part)</option>
                    <option value="SK">Slovakia</option>
                    <option value="SI">Slovenia</option>
                    <option value="SB">Solomon Islands</option>
                    <option value="SO">Somalia</option>
                    <option value="ZA">South Africa</option>
                    <option value="GS">
                      South Georgia and the South Sandwich Islands
                    </option>
                    <option value="SS">South Sudan</option>
                    <option value="ES">Spain</option>
                    <option value="LK">Sri Lanka</option>
                    <option value="SD">Sudan</option>
                    <option value="SR">Suriname</option>
                    <option value="SJ">Svalbard and Jan Mayen</option>
                    <option value="SZ">Swaziland</option>
                    <option value="SE">Sweden</option>
                    <option value="CH">Switzerland</option>
                    <option value="SY">Syrian Arab Republic</option>
                    <option value="TW">Taiwan, Province of China</option>
                    <option value="TJ">Tajikistan</option>
                    <option value="TZ">Tanzania, United Republic of</option>
                    <option value="TH">Thailand</option>
                    <option value="TL">Timor-Leste</option>
                    <option value="TG">Togo</option>
                    <option value="TK">Tokelau</option>
                    <option value="TO">Tonga</option>
                    <option value="TT">Trinidad and Tobago</option>
                    <option value="TN">Tunisia</option>
                    <option value="TR">Turkey</option>
                    <option value="TM">Turkmenistan</option>
                    <option value="TC">Turks and Caicos Islands</option>
                    <option value="TV">Tuvalu</option>
                    <option value="UG">Uganda</option>
                    <option value="UA">Ukraine</option>
                    <option value="AE">United Arab Emirates</option>
                    <option value="GB">United Kingdom</option>
                    <option value="US">United States</option>
                    <option value="UM">
                      United States Minor Outlying Islands
                    </option>
                    <option value="UY">Uruguay</option>
                    <option value="UZ">Uzbekistan</option>
                    <option value="VU">Vanuatu</option>
                    <option value="VE">
                      Venezuela, Bolivarian Republic of
                    </option>
                    <option value="VN">Viet Nam</option>
                    <option value="VG">Virgin Islands, British</option>
                    <option value="VI">Virgin Islands, U.S.</option>
                    <option value="WF">Wallis and Futuna</option>
                    <option value="EH">Western Sahara</option>
                    <option value="YE">Yemen</option>
                    <option value="ZM">Zambia</option>
                    <option value="ZW">Zimbabwe</option>
                  </select>
                </div>
                <div className="more_changes-gender">
                  <h4>Gender</h4>
                  <div className="more_changes-gender_sorround">
                    <label htmlFor="gender">Male</label>
                    <input
                      value={"Male"}
                      type="radio"
                      name="gender"
                      id=""
                      onChange={handleUpdateValues}
                    />
                    <label htmlFor="gender">Female</label>
                    <input
                      value={"Female"}
                      type="radio"
                      name="gender"
                      id=""
                      onChange={handleUpdateValues}
                    />
                    <label htmlFor="gender">Other</label>
                    <input
                      value={"Other"}
                      type="radio"
                      name="gender"
                      id=""
                      onChange={handleUpdateValues}
                    />
                  </div>
                </div>
                <div className="more_changes-avatar">
                  <h4>Profile Image</h4>
                  <div className="more_changes-avatar_sorround">
                    <img
                      src={preview ? preview : currentUser?.avatar?.url}
                      alt=""
                    />
                    <label htmlFor="change_photo">Change your image</label>
                    <input
                      type="file"
                      id="change_photo"
                      maxLength={1024 * 1024}
                      accept="image/png/* , image/jpeg/*"
                      onChange={handleImageUpload}
                    />
                    {preview && (
                      <span onClick={deleteImage} className="delete_image">
                        X
                      </span>
                    )}
                  </div>
                </div>
                <button type="submit" className="profile_detail_changes-btn">
                  Submit Changes
                </button>
              </div>
            )}
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
                value={new_password}
                onChange={handleInput}
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
                value={conf_password}
                onChange={handleInput}
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
