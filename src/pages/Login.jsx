
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { setCookie } from "src/utils/cookie";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  // const { refetch } = useQuery(["profile"], getProfile);
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    let isValid = true;
    const newErrors = {};

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = "آدرس ایمیل را به درستی وارد کنید";
      isValid = false;
    }

    if (formData.password.length < 8) {
      newErrors.password = "رمز عبور شما باید بیشتر از 8 کارکتر باشد";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/auth/login",
          {
            email: formData.email,
            password: formData.password,
          }
        );
  
        if (response) {
          toast.success("عملیات با موفقیت انجام شد");
          const accessToken = response.data.data.token;
          const userName = response.data.data.user;
          console.log({ accessToken });
          console.log({ userName });
          setCookie("accessToken", accessToken, 1); // Set the access token cookie for 1 day
          setCookie("userName", encodeURIComponent(userName), 1); // Set the username cookie for 1 day
          toast.success(" شما با موفقیت وارد شدید. ");

          window.location.href = "/"; // This will navigate to the homepage and reload the page
        }
      } catch (error) {
        // Check if error response exists and handle specific status codes
        if (error.response) {
          if (error.response.status === 403) {
            toast.error("شما ثبت نام نکرده اید");
          } else {
            toast.error("مشکلی پیش آمده است");
          }
        } else {
          toast.error("مشکلی در اتصال به سرور رخ داده است");
        }
      }
    }
  };
  

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.title}> ورود </h2>

      <div style={styles.inputContainer}>
        <label style={styles.label}>ایمیل:</label>
        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.email && <p style={styles.error}>{errors.email}</p>}
      </div>

      <div style={styles.inputContainer}>
        <label style={styles.label}>رمز عبور:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.password && <p style={styles.error}>{errors.password}</p>}
      </div>

      <button type="submit" style={styles.button}>
        ثبت
      </button>
      {submitStatus && <p style={styles.submitStatus}>{submitStatus}</p>}
    </form>
  );
}

const styles = {
  form: {
    maxWidth: "400px",
    margin: "0 auto",
    padding: "2rem",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
    backgroundColor: "#f9f9f9",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center",
    color: "#333",
    marginBottom: "1.5rem",
    fontSize: "24px",
  },
  inputContainer: {
    marginBottom: "1rem",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "bold",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "0.8rem",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontSize: "16px",
  },
  button: {
    width: "100%",
    padding: "0.8rem",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#4CAF50",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  buttonHover: {
    backgroundColor: "#45a049",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginTop: "0.5rem",
  },
  submitStatus: {
    textAlign: "center",
    color: "green",
    fontSize: "16px",
    marginTop: "1rem",
  },
};

export default Login;
