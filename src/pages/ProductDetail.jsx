import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./ProductDetail.module.css";
import { GoAlert } from "react-icons/go";

const ProductDetail = ({ isUserLoggedIn }) => {
  const { productId } = useParams(); // Get the productId from the URL
  const [product, setProduct] = useState(null);

  // Fetch product details
  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/products/${productId}`
      );
      setProduct(response.data.data); // Set the product data
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  if (!product) return <div className={styles.loading}>Loading...</div>; // Show loading state until data is fetched

  return (
    <div className={styles.productDetailContainer}>
      <div className={styles.productImages}>
        {product.contents.length > 0 ? (
          product.contents.map((image, index) => {
            const imageUrl = image.link.startsWith('http') 
              ? image.link 
              : `http://localhost:8000${image.link}`; // Correct image URL

            return (
              <img
              key={index}
              src={image.link} // Use the real image link
              alt={`product-image-${index}`}
              className={styles.productImage}
            />
            );
          })
        ) : (
          <img
            src="https://via.placeholder.com/150?text=No+Image" // Placeholder when no image is available
            alt="No images available"
            className={styles.noImage}
          />
        )}
      </div>

      <div className={styles.productInfo}>
        <h1 className={styles.productName}>{product.name}</h1>

        <div className={styles.category}>
          <div>
            <strong>دسته بندی: </strong>
            <span className={styles.categoryName}>{product.category.name}</span>
          </div>
          <div>{new Date(product.created_at).toLocaleDateString("fa-IR")}</div>
        </div>
        <hr className={styles.separator} />
        <div>
          <GoAlert />
          زنگ خطر قبل از معامله
        </div>
        <hr className={styles.separator} />

        <div className={styles.productDetails}>
          <div>
            <strong>قیمت:</strong> <p>{product.price}تومان</p>
          </div>
          <div>
            <strong>وضعیت:</strong>{" "}
            <p>
              {product.condition === "new"
                ? "نو"
                : product.condition === "like_new"
                ? "در حد نو"
                : product.condition === "old"
                ? "کهنه"
                : "ثبت نشده است"}
            </p>
          </div>
          <div>
            <strong>مایل به معاوضه:</strong>{" "}
            <p>{product.exchange === 1 ? "بله" : "خیر"}</p>
          </div>
          <div>
            <strong>آدرس : </strong>
            <p>{product.address.name}</p>
          </div>
        </div>

        <hr className={styles.separator} />

        <div className={styles.productAddress}>
          <strong>توضیحات: </strong>
          <span className={styles.addressName}>{product.description}</span>
        </div>

        {isUserLoggedIn && (
          <div className={styles.userInfo}>
            <strong>User Phone: </strong>
            <span className={styles.userPhone}>
              {product.user.phone_number}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
