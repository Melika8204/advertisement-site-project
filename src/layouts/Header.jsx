import { Link, useNavigate } from "react-router-dom";

import styles from "./Header.module.css";
import { useEffect, useState } from "react";
import { getCookie, removeCookie } from "src/utils/cookie";
import axios from "axios";
import toast from "react-hot-toast";
import { BsDoorOpen } from "react-icons/bs";

function Header() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [userName, setUserName] = useState(null);
  const navigate = useNavigate();
  const accessToken = getCookie("accessToken");

  console.log("Access Token:", accessToken); // Check if this logs the token correctly
  const storedUserName = getCookie("userName");
  console.log("storedUserName:", storedUserName); // Check if this logs the token correctly

  useEffect(() => {
    const accessToken = getCookie("accessToken");
    const storedUserName = getCookie("userName");

    if (accessToken) {
      setIsRegistered(true);
      setUserName(decodeURIComponent(storedUserName));
    }
  }, []);
  const handleLogout = async () => {
    const accessToken = getCookie("accessToken"); // Make sure the token exists
    console.log({ accessToken });
    try {
      // Make API call to log out user
      await axios.post(
        "http://localhost:8000/api/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the token for authorization
            // "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"), // Include CSRF token if using Sanctum
          },
        }
      );

      // Remove cookies on the frontend
      removeCookie("accessToken");
      removeCookie("userName");

      // Redirect to home or login page
      window.location.href = "/"; // This will navigate to the homepage and reload the page

      // Optionally, show a success message
      toast.success("You have successfully logged out!");
    } catch (error) {
      toast.error("An error occurred while logging out.");
    }
  };
  const [userDetail, setUserDetail] = useState([]);

  const getUserData = async () => {
    var response = await axios.get("http://localhost:8000/api/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Send token in Authorization header
      },
    });
    console.log({ response });
    var user = response?.data;
    setUserDetail(user);
  };
  console.log({ userDetail });
  useEffect(() => {
    getUserData();
  }, []);
  return (
    <header className={styles.header}>
      <div>
        <Link to="/">
          <img src="logo.jpg" className={styles.logo} />
        </Link>
        <span>
          {/* {isRegistered ? (
            <>
              <img src="location.svg" />
              <p>
                {userDetail.address.name && userDetail.address.name
                  ? userDetail.address.name
                  : "تهران"}
              </p>
            </>
          ) : (
            <>
              <img src="location.svg" />
              <p>تهران</p>
            </>
          )} */}
            <img src="location.svg" />
            <p>تهران</p>
        </span>
      </div>
      <div>
        {
        userDetail.email &&
        userDetail.email === "melika8204.it.v@gmail.com" ? (
          <Link to="/admin" className={styles.button}>
            پنل ادمین
          </Link>
        ) : (
          <>
            {isRegistered ? (
              <Link to="/userpanel">
                <span>
                  <img src="profile.svg" />
                  <p>پنل {userDetail.name}</p>
                </span>
              </Link>
            ) : (
              <Link to="/login" className={styles.button}>
                ورود
              </Link>
            )}
            {isRegistered ? (
              <Link to="/dashboard" className={styles.button}>
                ثبت آگهی
              </Link>
            ) : (
              <Link to="/auth" className={styles.button}>
                ثبت آگهی
              </Link>
            )}
          </>
        )}
        {isRegistered ? (
          <div
            style={{
              backgroundColor: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 15px",
              // gap: "5px",
            }}
          >
            <BsDoorOpen style={{ color: "black" }} />

            <button
              style={{
                backgroundColor: "white",
                color: "black",
                border: "none",
              }}
              onClick={handleLogout}
            >
              خروج
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}

export default Header;
