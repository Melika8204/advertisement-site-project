import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import styles from "./ProductDetail.module.css";
import { GoAlert } from "react-icons/go";
import Loader from "src/components/modules/Loader";
import { IoHomeOutline } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { getCookie } from "src/utils/cookie";

const ProductDetail = ({}) => {
  const { productId } = useParams(); // Get the productId from the URL
  const [product, setProduct] = useState(null);
  const accessToken = getCookie("accessToken");
  const [isRegistered, setIsRegistered] = useState(false);
  useEffect(() => {
    const accessToken = getCookie("accessToken");

    if (accessToken) {
      setIsRegistered(true);
    }
  }, []);
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
  const [showPhone, setShowPhone] = useState(false); // Track if phone number is visible
  const [showPopup, setShowPopup] = useState(false); // Track if popup is visible

  // Toggle phone number visibility
  const handlePhoneClick = () => {
    if (isRegistered) {
      setShowPhone(!showPhone);
    } else {
      setShowPopup(true); // Show popup if user is not logged in
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false); // Close the popup
  };
  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  if (!product)
    return (
      <div className={styles.loading}>
        <Loader />
      </div>
    ); // Show loading state until data is fetched

  return (
    <>
      {/* Popup for non-logged-in users */}
      {showPopup && !isRegistered && (
            <div className={styles.popup}>
              <div className={styles.popupContent}>
                <p>برای مشاهده شماره باید ابتدا وارد حساب کاربری شوید.</p>
                <Link to="/auth">
                  <button className={styles.registerButton}>
                    برای ثبت‌نام اینجا کلیک کنید
                  </button>
                </Link>
                <button
                  onClick={handleClosePopup}
                  className={styles.closePopupButton}
                >
                  بستن
                </button>
              </div>
            </div>
          )}
      <div>
        <Link to={`/`}>
          <div className={styles.topSection}>
            <IoHomeOutline />
            <p>بازگشت</p>
          </div>
        </Link>

        {/* <div className={styles.productInfoTop}>
          <h2>
            {product.category.name}

            <IoIosArrowBack />
            {product.name}
          </h2>
        </div> */}
      </div>
      <div className={styles.productDetailContainer}>
        {/* Top section with Product Name, Category, and Buttons */}
        <div className={styles.productImages}>
          {product.contents.length > 0 ? (
            product.contents.map((image, index) => {
              const imageUrl = image.link.startsWith("http")
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
              <span className={styles.categoryName}>
                {product.category.name}
              </span>
            </div>
            <div>
              {new Date(product.created_at).toLocaleDateString("fa-IR")}
            </div>
          </div>
          <hr className={styles.separator} />
          <div className={styles.alertSection}>
            <GoAlert style={{ color: "red" }} />
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
          {/* {isRegistered && ( */}
            <div className={styles.userInfo}>
              <strong>شماره تلفن ثبت کننده آگهی: </strong>
              <span
                className={styles.userPhone}
                onClick={handlePhoneClick}
                style={{ cursor: "pointer", color: "blue" }}
              >
                {showPhone ? product.user.phone_number : "09XXXXXXX"}{" "}
                {/* Show phone number when clicked */}
              </span>
            </div>
          {/* )} */}
          
          <div className={styles.productAddress}>
            <strong>توضیحات: </strong>
            <span className={styles.addressName}>{product.description}</span>
          </div>

        

        
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
