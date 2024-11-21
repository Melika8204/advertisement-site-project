import { useQuery } from "@tanstack/react-query";
import { getPosts } from "services/user";
import { sp } from "utils/numbers";
import Loader from "../modules/Loader";
import styles from "./PostList.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "src/utils/cookie";
import toast from "react-hot-toast";

function PostList() {
  // const baseURL = import.meta.env.VITE_BASE_URL;
  // const { data, isLoading } = useQuery(["my-post-list"], getPosts);
  const accessToken = getCookie("accessToken");
  console.log("Access Token:", accessToken); // Check if this logs the token correctly

  const [allMyProducts, setAllMyProducts] = useState([]);
  console.log({ allMyProducts });

  const getAllMyPrpducts = async () => {
    var response = await axios.get("http://localhost:8000/api/add-product", {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Attach token here
      },
    });
    console.log({ response });
    var myProducts = response?.data?.data?.data;
    setAllMyProducts(myProducts);
  };
  useEffect(() => {
    getAllMyPrpducts();
  }, []);
  // Handle user product deletion
  const handleDelete = async (post) => {
    console.log({post})
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/add-product/${post.id}?_method=delete`,
        {
          name: post.name, // Send name in the request body
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        // Filter out the deleted category from the list
        setAllMyProducts(
          post.filter((item) => item.id !== post.id)
        );
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
  return (
    <div className={styles.list}>
      <h3>آگهی های شما</h3>

      {allMyProducts.length === 0 ? (
        <div>
          <Loader />
          <div>
            <p>تا کنون آگهی ثبت نکرده اید</p>
          </div>
        </div>
      ) : (
        <>
          {allMyProducts.map((post) => (
            <div key={post.id} className={styles.post}>
              <img src={post.first_pic} />
              <div>
                <p>{post.name}</p>
                <span>{post.description}</span>
              </div>
              <div className={styles.price}>
                <p>{new Date(post.created_at).toLocaleDateString("fa-IR")}</p>
                <span>{sp(post.price)} تومان</span>
              </div>
              <button onClick={() => handleDelete(post)}>حذف</button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default PostList;
