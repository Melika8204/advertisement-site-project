import { Link } from "react-router-dom";
import { sp } from "utils/numbers";
import styles from "./Main.module.css";

function Main({ allProducts, selectedCategory }) {
  // Filter posts based on the selected category
  const filteredPosts = selectedCategory
    ? allProducts.filter((post) => post.category_id === selectedCategory)
    : allProducts; // Show all products if no category is selected

  return (
    <div className={styles.container}>
      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => {
          // Log the post data to verify what we have
          console.log("Post Data:", post);

          // Directly access the image URL from the backend
          const imageUrl = post.first_pic ? post.first_pic.url || post.first_pic.link : null;
          console.log("Image URL:", imageUrl); // Check the image URL

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
              {/* Use the image URL directly */}
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
  );
}

export default Main;
