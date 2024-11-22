import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { getCookie } from "src/utils/cookie";
import Loader from "../modules/Loader";
import styles from "./PostList.module.css";
import { sp } from "utils/numbers";

function PostList() {
  const accessToken = getCookie("accessToken");
  console.log("Access Token:", accessToken); // Check if this logs the token correctly

  const [allMyProducts, setAllMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllMyPrpducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/add-product",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Attach token here
          },
        }
      );
      console.log({ response });
      const myProducts = response?.data?.data?.data;
      setAllMyProducts(myProducts);
    } catch (error) {
      console.error("Error fetching products", error);
      toast.error("Failed to load your products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllMyPrpducts();
  }, []);

  // Handle user product deletion
  const handleDelete = async (post) => {
    console.log({ post });
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
        // Remove the deleted post from the list
        setAllMyProducts(allMyProducts.filter((item) => item.id !== post.id));
        toast.success("محصول با موفقیت حذف شد!");
        window.location.reload();

      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Unauthenticated! Please check your token.");
      } else {
        console.error("حذف محصول با مشکل مواجه شده است.", error);
        toast.error("حذف محصول با مشکل مواجه شده است.");
      }
    }
  };

  return (
    <div className={styles.list}>
      <h3>آگهی های شما</h3>

      {loading ? (
        <div>
          <Loader />
        </div>
      ) : allMyProducts.length === 0 ? (
        <p>تا کنون آگهی ثبت نکرده اید</p>
      ) : (
        allMyProducts.map((post) => (
          <div key={post.id} className={styles.post}>
            <img src={post.first_pic} alt={post.name} />
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
        ))
      )}
    </div>
  );
}

export default PostList;
