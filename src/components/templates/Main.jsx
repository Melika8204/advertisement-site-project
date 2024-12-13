import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { sp } from "utils/numbers";
import styles from "./Main.module.css";
import Loader from "../modules/Loader";

function Main({ allProducts, selectedCategory, currentProducts }) {
  const [loading, setLoading] = useState(true);
  // const [currentPage, setCurrentPage] = useState(1);
  // const productsPerPage = 10; // Set how many products per page you want

  // Calculate the products for the current page
  // const indexOfLastProduct = currentPage * productsPerPage;
  // const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  // Filter products based on selected category
  // const filteredProducts = selectedCategory
  //   ? allProducts.filter((post) => post.category_id === selectedCategory)
  //   : allProducts;

  // Paginate filtered products
  // const currentProducts = filteredProducts.slice(
  //   indexOfFirstProduct,
  //   indexOfLastProduct
  // );

  // Handle loading state
  useEffect(() => {
    if (allProducts) {
      setLoading(false);
    }
  }, [allProducts]);

  // Handle page change
  // const nextPage = () => {
  //   if (currentPage < Math.ceil(filteredProducts.length / productsPerPage)) {
  //     setCurrentPage(currentPage + 1);
  //   }
  // };

  // const prevPage = () => {
  //   if (currentPage > 1) {
  //     setCurrentPage(currentPage - 1);
  //   }
  // };

  return (
    <div className={styles.contain}>
      <div className={styles.container}>
        {loading ? (
          <div className={styles.loader}>
            <Loader />
          </div>
        ) : currentProducts.length > 0 ? (
          currentProducts.map((post) => (
            <div key={post.id} className={styles.card}>
              <div className={styles.info}>
                <Link to={`/product/${post.id}`}>
                  <p>{post.name}</p>
                </Link>
                <div>
                  <p>{sp(post.price)} تومان</p>
                  <span>{post.address}</span>
                </div>
              </div>
              <img
                src={
                  post?.first_pic?.link
                    ? post.first_pic.link
                    : "https://via.placeholder.com/300?text=No+Image+Submitted"
                }
                alt={`Product ${post.name}`}
                className={styles.productImage}
              />
            </div>
          ))
        ) : (
          <div className={styles.noData}>
            <h2>متاسفانه داده‌ای یافت نشد.</h2>
            <p>
              در حال حاضر اطلاعاتی برای نمایش وجود ندارد. لطفاً دوباره تلاش
              کنید.
            </p>
          </div>
        )}
      </div>
      <div>
        {/* Pagination feedback */}
        {loading && <p>در حال بارگذاری داده‌ها...</p>}
      </div>
    </div>
  );
}

export default Main;
