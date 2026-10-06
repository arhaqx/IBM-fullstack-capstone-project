import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Profile.css'
import {urlConfig} from '../../config';
import { useAppContext } from '../../context/AuthContext';

const Profile = () => {
  const [userDetails, setUserDetails] = useState({});
 const [updatedDetails, setUpdatedDetails] = useState({});
 const {setUserName} = useAppContext();
 const [changed, setChanged] = useState("");
 const [error, setError] = useState("");

 const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const authtoken = sessionStorage.getItem("auth-token");
        const email = sessionStorage.getItem("email");
        const name=sessionStorage.getItem('name');
        if (name || authtoken) {
                  const storedUserDetails = {
                    name: name,
                    email:email
                  };

                  setUserDetails(storedUserDetails);
                  setUpdatedDetails(storedUserDetails);
                }
  } catch (error) {
    console.error(error);
    // Handle error case
  }
  };

    const authtoken = sessionStorage.getItem("auth-token");
    if (!authtoken) {
      navigate("/app/login");
    } else {
      fetchUserProfile();
    }
  }, [navigate]);

const handleEdit = () => {
setEditMode(true);
};

const handleCancel = () => {
setUpdatedDetails(userDetails);
setEditMode(false);
setError("");
};

const handleInputChange = (e) => {
setUpdatedDetails({
  ...updatedDetails,
  [e.target.name]: e.target.value,
});
};
const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const authtoken = sessionStorage.getItem("auth-token");
    const email = sessionStorage.getItem("email");

    if (!authtoken || !email) {
      navigate("/app/login");
      return;
    }

    const payload = { ...updatedDetails };
    const response = await fetch(`${urlConfig.backendUrl}/api/auth/update`, {
      //Step 1: Task 1
      method: "PUT",
      //Step 1: Task 2
      headers: {
        "Authorization": `Bearer ${authtoken}`,
        "Content-Type": "application/json",
        "Email": email,
      },
      //Step 1: Task 3
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      // Update the user details in session storage
      //Step 1: Task 4
      setUserName(updatedDetails.name);
      //Step 1: Task 5
      sessionStorage.setItem("name", updatedDetails.name);
      setUserDetails(updatedDetails);
      setEditMode(false);
      // Display success message to the user
      setChanged("Name Changed Successfully!");
      setTimeout(() => {
        setChanged("");
        navigate("/");
      }, 1000);

    } else {
      // Handle error case
      throw new Error("Failed to update profile");
    }
  } catch (error) {
    console.error(error);
    // Handle error case
    setError("Could not update your profile. Please try again.");
  }
};

return (
<div className="profile-container">
  {editMode ? (
<form onSubmit={handleSubmit}>
<h1>Edit profile</h1>
<label>
  Email
  <input
    type="email"
    name="email"
    id="profile-email"
    className="form-control"
    value={userDetails.email || ""}
    disabled // Disable the email field
  />
</label>
<label>
   Name
   <input
     type="text"
     name="name"
     id="profile-name"
     className="form-control"
     value={updatedDetails.name || ""}
     onChange={handleInputChange}
   />
</label>

<div className="form-error" role="alert">{error}</div>
<button type="submit" className="btn btn-primary btn-block" id="profile-save">Save</button>
<button type="button" className="btn btn-ghost btn-block mt-2" id="profile-cancel" onClick={handleCancel}>Cancel</button>
</form>
) : (
<div className="profile-details">
<div className="profile-avatar">{(userDetails.name || "?").charAt(0).toUpperCase()}</div>
<h1>Hi, {userDetails.name}</h1>
<p> <b>Email:</b> {userDetails.email}</p>
<button className="btn btn-primary" id="profile-edit" onClick={handleEdit}>Edit</button>
<span style={{color:'#4fd1c5',height:'.5cm',display:'block',fontStyle:'italic',fontSize:'12px',marginTop:'0.75rem'}}>{changed}</span>
</div>
)}
</div>
);
};

export default Profile;
