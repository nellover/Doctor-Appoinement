import React, { useEffect, useState } from "react";
import "../styles/profile.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import axios from "axios";
import toast from "react-hot-toast";
import { setLoading } from "../redux/reducers/rootSlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../components/Loading";
import fetchData from "../helper/apiCall";
import jwt_decode from "jwt-decode";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

function Profile() {
  const { userId } = jwt_decode(localStorage.getItem("token"));
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);
  const [file, setFile] = useState("");
  const [formDetails, setFormDetails] = useState({
    firstname: "",
    lastname: "",
    email: "",
    age: "",
    mobile: "",
    gender: "neither",
    address: "",
    password: "",
    confpassword: "",
    longitude: "",
    latitude: ""
  });

  const getUser = async () => {
    try {
      dispatch(setLoading(true));
      const temp = await fetchData(`/user/getuser/${userId}`);
      
      let doctorData = null;
      if (temp.role === "Doctor") {
        try {
          doctorData = await fetchData(`/doctor/getdoctor/${userId}`);
        } catch (err) {
          console.log("Error fetching doctor data:", err);
        }
      }
      
      setFormDetails({
        ...temp,
        password: "",
        confpassword: "",
        mobile: temp.mobile === null ? "" : temp.mobile,
        age: temp.age === null ? "" : temp.age,
        longitude: doctorData?.longitude ?? "",
        latitude: doctorData?.latitude ?? ""
      });
      setFile(temp.pic);
      dispatch(setLoading(false));
    } catch (error) {
      console.log("Error fetching user data:", error);
      dispatch(setLoading(false));
      toast.error("Error loading profile data");
    }
  };

  useEffect(() => {
    getUser();
  }, [dispatch]);

  const inputChange = (e) => {
    const { name, value } = e.target;
    return setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const updateLocation = async (e) => {
    e.preventDefault();
    try {
      const { longitude, latitude } = formDetails;
      await toast.promise(
        axios.put(
          "/doctor/updatelocation",
          {
            longitude: parseFloat(longitude),
            latitude: parseFloat(latitude)
          },
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
        {
          pending: "Updating location...",
          success: "Location updated successfully",
          error: "Unable to update location",
        }
      );
    } catch (error) {
      toast.error("Unable to update location");
    }
  };

  const formSubmit = async (e) => {
    try {
      e.preventDefault();
      const {
        firstname,
        lastname,
        email,
        age,
        mobile,
        address,
        gender,
      } = formDetails;

      if (!email) {
        return toast.error("Email should not be empty");
      } else if (firstname.length < 3) {
        return toast.error("First name must be at least 3 characters long");
      } else if (lastname.length < 3) {
        return toast.error("Last name must be at least 3 characters long");
      }

      const updateData = {
        firstname,
        lastname,
        age,
        mobile,
        address,
        gender,
        email
      };

      await toast.promise(
        axios.put(
          "/user/updateprofile",
          updateData,
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
        {
          pending: "Updating profile...",
          success: "Profile updated successfully",
          error: "Unable to update profile",
        }
      );
    } catch (error) {
      toast.error("Unable to update profile");
    }
  };

  return (
    <>
      <Navbar />
      {loading ? (
        <Loading />
      ) : (
        <section className="register-section flex-center">
          <div className="profile-container flex-center">
            <h2 className="form-heading">Profile</h2>
            <img src={file} alt="profile" className="profile-pic" />
            
            {/* Main profile form */}
            <form onSubmit={formSubmit} className="register-form">
              <div className="form-same-row">
                <input
                  type="text"
                  name="firstname"
                  className="form-input"
                  placeholder="Enter your first name"
                  value={formDetails.firstname}
                  onChange={inputChange}
                />
                <input
                  type="text"
                  name="lastname"
                  className="form-input"
                  placeholder="Enter your last name"
                  value={formDetails.lastname}
                  onChange={inputChange}
                />
              </div>
              <div className="form-same-row">
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={formDetails.email}
                  onChange={inputChange}
                />
                <select
                  name="gender"
                  value={formDetails.gender}
                  className="form-input"
                  id="gender"
                  onChange={inputChange}
                >
                  <option value="neither">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="form-same-row">
                <input
                  type="text"
                  name="age"
                  className="form-input"
                  placeholder="Enter your age"
                  value={formDetails.age}
                  onChange={inputChange}
                />
                <input
                  type="text"
                  name="mobile"
                  className="form-input"
                  placeholder="Enter your mobile number"
                  value={formDetails?.mobile}
                  onChange={inputChange}
                />
              </div>
              <textarea
                type="text"
                name="address"
                className="form-input"
                placeholder="Enter your address"
                value={formDetails.address}
                onChange={inputChange}
                rows="2"
              ></textarea>
              <div className="form-same-row">
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={formDetails.password}
                  onChange={inputChange}
                />
                <input
                  type="password"
                  name="confpassword"
                  className="form-input"
                  placeholder="Confirm your password"
                  value={formDetails.confpassword}
                  onChange={inputChange}
                />
              </div>
              <button
                type="submit"
                className="btn form-btn"
              >
                update
              </button>
            </form>

            {/* Separate location form for doctors */}
            {formDetails.role === "Doctor" && (
              <form onSubmit={updateLocation} className="register-form location-form">
                <h3>Update Location</h3>
                <div className="form-same-row">
                  <input
                    type="number"
                    name="longitude"
                    className="form-input"
                    placeholder="Enter longitude"
                    value={formDetails.longitude}
                    onChange={inputChange}
                    step="any"
                  />
                  <input
                    type="number"
                    name="latitude"
                    className="form-input"
                    placeholder="Enter latitude"
                    value={formDetails.latitude}
                    onChange={inputChange}
                    step="any"
                  />
                </div>
                <button type="submit" className="btn form-btn">
                  Update Location
                </button>
              </form>
            )}
          </div>
        </section>
      )}
      <Footer />
    </>
  );
}

export default Profile;
