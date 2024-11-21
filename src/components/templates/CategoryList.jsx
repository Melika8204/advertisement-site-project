import { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "src/utils/cookie";
import styles from "./CategoryList.module.css";
import toast from "react-hot-toast";

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const accessToken = getCookie("accessToken");

  // Fetch categories
  const getCategoryList = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/admin/category", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setCategories(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching categories", error);
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
        toast.success("Category deleted successfully!");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Unauthenticated! Please check your token.");
      } else {
        console.error("Error deleting category", error);
        toast.error("Failed to delete category.");
      }
    }
  };

  // Fetch categories on component mount
  useEffect(() => {
    getCategoryList();
  }, []);

  return (
    <div className={styles.list}>
      {categories.map((category) => (
        <div key={category.id}>
          <h5>{category.name}</h5>
          <button onClick={() => handleDelete(category)}>حذف</button>
        </div>
      ))}
    </div>
  );
}

export default CategoryList;
