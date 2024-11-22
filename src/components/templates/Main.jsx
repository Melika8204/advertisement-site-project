import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { sp } from "utils/numbers";
import styles from "./Main.module.css";
import Loader from "../modules/Loader";

function Main({ allProducts, selectedCategory }) {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10; // Set how many products per page you want

  // Calculate the products for the current page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  // Filter products based on selected category
  const filteredProducts = selectedCategory
    ? allProducts.filter((post) => post.category_id === selectedCategory)
    : allProducts;

  // Paginate filtered products
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Handle loading state
  useEffect(() => {
    if (allProducts) {
      setLoading(false);
    }
  }, [allProducts]);

  // Handle page change
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredProducts.length / productsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className={styles.contain}>
    <div className={styles.container}>
      {loading ? (
        <div className={styles.loader}>
          <Loader />
        </div>
      ) : currentProducts.length > 0 ? (
        currentProducts.map((post) => {
          const imageUrl = post.first_pic
            ? post.first_pic.url || post.first_pic.link
            : null;

          return (
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
                src={imageUrl ? `http://localhost:8000${imageUrl}` : "https://via.placeholder.com/300?text=No+Image+Submitted"}
                alt={`Product ${post.name}`}
                className={styles.productImage}
              />
            </div>
          );
        })
      ) : (
        <div className={styles.noData}>
          <h2>متاسفانه داده‌ای یافت نشد.</h2>
          <p>در حال حاضر اطلاعاتی برای نمایش وجود ندارد. لطفاً دوباره تلاش کنید.</p>
          <img
            src="https://media.giphy.com/media/xT0xezC9XzI48Dmb1u/giphy.gif"
            alt="No Data"
            className={styles.image}
          />
          <p>ممنون از صبر شما.</p>
        </div>
      )}

    </div>
      {/* Pagination Buttons */}
      <div className={styles.pagination}>
        <button onClick={prevPage} disabled={currentPage === 1}>قبلی</button>
        <span>{`صفحه ${currentPage}`}</span>
        <button onClick={nextPage} disabled={currentPage * productsPerPage >= filteredProducts.length}>بعدی</button>
      </div>
     </div>
  );
}

export default Main;
