import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import styles from "./ProductDetail.module.css";
import { GoAlert } from "react-icons/go";
import Loader from "src/components/modules/Loader";
import { IoHomeOutline } from "react-icons/io5";
import { getCookie } from "src/utils/cookie";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const accessToken = getCookie("accessToken");
    setIsRegistered(!!accessToken);
  }, []);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/products/${productId}`
        );
        setProduct(response.data.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handlePhoneClick = () => {
    if (isRegistered) {
      setShowPhone(!showPhone);
    } else {
      setShowPopup(true);
    }
  };

  const handleClosePopup = () => setShowPopup(false);

  // Track the main image index
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  // Track the index for the thumbnails being displayed
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle image navigation for the main image
  const handleNext = () => {
    if (product && product.contents.length > 0) {
      setCurrentIndex((prev) =>
        prev === product.contents.length - 4 ? 0 : prev + 1
      );
    }
  };

  const handlePrev = () => {
    if (product && product.contents.length > 0) {
      setCurrentIndex((prev) =>
        prev === 0 ? product.contents.length - 4 : prev - 1
      );
    }
  };

  if (!product) {
    return (
      <div className={styles.loading}>
        <Loader />
      </div>
    );
  }

  return (
    <>
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
        <Link to="/">
          <div className={styles.topSection}>
            <IoHomeOutline />
            <p>بازگشت</p>
          </div>
        </Link>
      </div>

      <div className={styles.productDetailContainer}>
        {/* Main Image Section */}
        <div className={styles.pictureContainer}>

        <div className={styles.sliderContainer}>
          {product.contents.length > 0 ? (
            <img
              src={
                product.contents[selectedImageIndex].link.startsWith("http")
                  ? product.contents[selectedImageIndex].link
                  : `http://localhost:8000${product.contents[selectedImageIndex].link}`
              }
              alt="Main Product"
              className={styles.mainImage}
            />
          ) : (
            <img
              src="https://via.placeholder.com/150?text=No+Image"
              alt="No images available"
              className={styles.noImage}
            />
          )}
        </div>

        {/* Thumbnail Section */}
        <div className={styles.thumbnailContainer}>
        <div className={styles.arrow} onClick={handleNext}>
            <IoChevronForward />
          </div>

          <div className={styles.thumbnailWrapper}>
            {product.contents
              .slice(currentIndex, currentIndex + 4)
              .map((image, index) => (
                <img
                  key={index}
                  src={
                    image.link.startsWith("http")
                      ? image.link
                      : `http://localhost:8000${image.link}`
                  }
                  alt={`Thumbnail ${index}`}
                  className={`${styles.thumbnailImage} ${
                    currentIndex + index === selectedImageIndex
                      ? styles.activeThumbnail
                      : ""
                  }`}
                  onClick={() => setSelectedImageIndex(currentIndex + index)} // Change main image on click
                />
              ))}
          </div>
          <div className={styles.arrow} onClick={handlePrev}>
            <IoChevronBack />
          </div>
         
        </div>
        </div>

      <div className={styles.productInfo}>
        <h1 className={styles.productName}>{product.name}</h1>
        <div className={styles.category}>
          <div>
            <strong>دسته بندی: </strong>
            <span className={styles.categoryName}>{product.category.name}</span>
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
            <strong>آدرس:</strong>
            <p>{product.address.name}</p>
          </div>
        </div>
        <hr className={styles.separator} />
        <div className={styles.userInfo}>
          <strong>شماره تلفن ثبت کننده آگهی: </strong>
          <span
            className={styles.userPhone}
            onClick={handlePhoneClick}
            style={{ cursor: "pointer", color: "blue" }}
          >
            {showPhone ? product.user.phone_number : "09XXXXXXX"}
          </span>
        </div>
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
