// import { useEffect, useState } from "react";
// import axios from "axios";
// import { getCookie } from "src/utils/cookie";
// import styles from "./CategoryList.module.css";
// import toast from "react-hot-toast";

// function CategoryList() {
//   const [categories, setCategories] = useState([]);
//   const accessToken = getCookie("accessToken");

//   // Fetch categories
//   const getCategoryList = async () => {
//     try {
//       const response = await axios.get("http://localhost:8000/api/admin/category", {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       });
//       setCategories(response?.data?.data || []);
//     } catch (error) {
//       console.error("Error fetching categories", error);
//     }
//   };

//   // Handle category deletion
//   const handleDelete = async (category) => {
//     try {
//       const response = await axios.post(
//         `http://127.0.0.1:8000/api/admin/category/${category.id}?_method=delete`,
//         {
//           name: category.name, // Send name in the request body
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );

//       if (response.status === 200) {
//         // Filter out the deleted category from the list
//         setCategories(categories.filter((item) => item.id !== category.id));
//         toast.success("دسته بندی با موفقیت ثبت شد!");
//       }
//     } catch (error) {
//       if (error.response?.status === 401) {
//         toast.error("تنها ادمین اجازه حذف کردن دسته بندی دارد.");
//       } else {
//         console.error("حذف دسته بندی با مشکل مواجه شده است", error);
//         toast.error("حذف دسنه بندی ناموفق بوده است.");
//       }
//     }
//   };

//   // Fetch categories on component mount
//   useEffect(() => {
//     getCategoryList();
//   }, []);

//   return (
//     <div className={styles.list}>
//       {categories.map((category) => (
//         <div key={category.id}>
//           <h5>{category.name}</h5>
//           <button onClick={() => handleDelete(category)}>حذف</button>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default CategoryList;

import { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "src/utils/cookie";
import styles from "./CategoryList.module.css";
import toast from "react-hot-toast";
import Loader from "../modules/Loader";

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const accessToken = getCookie("accessToken");

  // Fetch categories
  const getCategoryList = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/category",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setCategories(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching categories", error);
    } finally {
      setLoading(false); // Stop loading after fetching
    }
  };

  // Handle category deletion
  const handleDelete = async (category) => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/admin/category/${category.id}?_method=delete`,
        {
          name: category.name, // Send name in the request body
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        // Filter out the deleted category from the list
        setCategories(categories.filter((item) => item.id !== category.id));
        toast.success("دسته بندی با موفقیت حذف شد!");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("تنها ادمین اجازه حذف کردن دسته بندی دارد.");
      } else {
        console.error("حذف دسته بندی با مشکل مواجه شده است", error);
        toast.error("حذف دسنه بندی ناموفق بوده است.");
      }
    }
  };

  // Fetch categories on component mount
  useEffect(() => {
    getCategoryList();
  }, []);

  return (
    <div className={styles.list}>
      {loading ? (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <Loader />
        </div>
      ) : categories.length > 0 ? (
        categories.map((category) => (
          <div key={category.id} className={styles.categoryItem}>
          <h5>{category.name}</h5>
          <button className={styles.deleteButton} onClick={() => handleDelete(category)}>
            حذف
          </button>
        </div>
        ))
      ) : (
        <p> هیچ کاتاگوری ثبت نشده است.</p>
      )}
    </div>
  );
}

export default CategoryList;
