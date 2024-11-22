import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { setCookie } from "src/utils/cookie";

function AuthPage() {
  const [formData, setFormData] = useState({
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    address_id: "",
    name: "",
  });
  const [allStates, setallStates] = useState([]);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // New loading state
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };
  console.log({ formData });
  const getStates = async () => {
    var response = await axios.get(
      "http://localhost:8000/api/settings/address"
    );
    console.log({ response });
    var places = response?.data?.data;
    setallStates(places);
  };
  useEffect(() => {
    getStates();
  }, []);
  const validate = () => {
    const newErrors = {};
    let isValid = true;

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = "ایمیل خود را به درستی وارد نمایید.";
      isValid = false;
    }

    if (!/^\d{11}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "شماره تلفن باید 11 عدد باشد.";
      isValid = false;
    }

    if (formData.password.length < 8) {
      newErrors.password = "رمزعبور باید حداقل 8 کارکتر باشد.";
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "رمز عبور یکسان نمیباشد.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate() || loading) return; // Prevent multiple submissions

    setLoading(true); // Set loading state to true to prevent multiple submissions

    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/register",
        {
          email: formData.email,
          phone_number: formData.phoneNumber,
          password: formData.password,
          password_confirmation: formData.confirmPassword,
          address_id: formData.address_id,
          name: formData.name,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Response data token:", response.data?.token); // Optional chaining

      if (response.status === 201) {
        const accessToken = response.data.data.token;
        const userName = response.data.data.user;
        console.log({ accessToken });
        console.log({ userName });

        setCookie("accessToken", accessToken, 1); // Set the access token cookie for 1 day
        setCookie("userName", encodeURIComponent(userName), 1); // Set the username cookie for 1 day
        toast.success(" شما با موفقیت ثبت نام شدید. ");

        window.location.href = "/"; // This will navigate to the homepage and reload the page
      } else {
        toast.error("ثبت نام موفقیت آمیز نبود.");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 422) {
          toast.error(
            "کاربر قبلا ثبت نام کرده است. لطفا از صفحه ورود وارد شوید."
          );
        } else if (error.response.status === 400) {
          toast.error("ثبت نام موفقیت آمیز نبود. اطلاعات ثبت شده را چک کنید.");
        } else {
          toast.error("مشکلی پیش آمده است . دوباره امتحان کنید.");
        }
      } else {
        toast.error("اتصال اینترنت خود را بررسی نمایید.");
      }
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.title}> ثبت نام</h2>
      <div style={styles.inputContainer}>
        <label style={styles.label}>اسم:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.email && <p style={styles.error}>{errors.email}</p>}
      </div>
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
      {/* <div style={styles.inputContainer}>
        <label style={styles.label}>استان:</label>
        <input
          type="text"
          name="address_id"
          value={formData.address_id}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.email && <p style={styles.error}>{errors.email}</p>}
      </div> */}
      <div style={styles.inputContainer}>
        <label style={styles.label}>استان </label>
        <select
          style={styles.input}
          id="address_id"
          name="address_id"
          onChange={handleChange} // document.getElementById(
          //   "addressState"
          // ).style.borderBlockColor = "white";
        >
          <option className="iranSans"> استان</option>
          {allStates &&
            allStates.map(function (place) {
              return (
                <option className="iranSans" value={place.id}>
                  {place.name}
                </option>
              );
            })}
        </select>
      </div>{" "}
      <div style={styles.inputContainer}>
        <label style={styles.label}> شماره تلفن:</label>
        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.phoneNumber && <p style={styles.error}>{errors.phoneNumber}</p>}
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
      <div style={styles.inputContainer}>
        <label style={styles.label}> تکرار رمز عبور:</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.confirmPassword && (
          <p style={styles.error}>{errors.confirmPassword}</p>
        )}
      </div>
      <button type="submit" style={styles.button} disabled={loading}>
        {loading ? "در حال ثبت نام..." : "ثبت نام"}
      </button>
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

export default AuthPage;
