import { useState } from "react";
import styles from "./categoryForm.module.css";
import axios from "axios";
import toast from "react-hot-toast";
import { getCookie } from "src/utils/cookie";

function CategoryForm() {
  const [form, setForm] = useState({ name: "" });

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const accessToken = getCookie("accessToken");
  console.log({ form });
  const submitHandler = async (event) => {
    event.preventDefault();

    if (!form.name) {
      toast.error("اسم دسته بندی نمی‌تواند خالی باشد.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/admin/category",
        { name: form.name }, // Request body
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Attach token here
          },
        }
      );

      if (response.status === 200) {
        toast.success("کاتاگوری جدید با موفقیت ثبت شد");
        setForm({ name: "" }); // Reset the form after successful submission
        window.location.reload();

      }
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("مشکلی پیش آمده است");
    }
  };

  return (
    <form
      onChange={changeHandler}
      onSubmit={submitHandler}
      className={styles.form}
    >
      <h3>دسته بندی جدید</h3>
      <label htmlFor="name">اسم دسته بندی</label>
      <input type="text" name="name" id="name" value={form.name} />
      <button type="submit">ایجاد</button>
    </form>
  );
}

export default CategoryForm;
// import React, { useState } from "react";
// import axios from "axios";
// import { getCookie } from "src/utils/cookie";

// const CategoryForm = () => {
//   const [name, setName] = useState("");
//   const [message, setMessage] = useState("");
//   const accessToken = getCookie("accessToken");

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const token = "your-admin-token-here"; // Replace with your actual token
//       const response = await axios.post(
//         "http://127.0.0.1:8000/api/admin/category",
//         { name },
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       setMessage("Category added successfully!");
//     } catch (error) {
//       // Check for specific error and handle it
//       if (
//         error.response &&
//         error.response.data.message.includes("Add [name] to fillable property")
//       ) {
//         setMessage("The category couldn't be added due to a server issue.");
//       } else {
//         setMessage(error.response?.data?.message || "An error occurred.");
//       }
//     }
//   };

//   return (
//     <div>
//       <h1>Add Category</h1>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Category Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//         />
//         <button type="submit">Add Category</button>
//       </form>
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default CategoryForm;
