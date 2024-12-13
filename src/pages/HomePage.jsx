import { useEffect, useState } from "react";
import axios from "axios";
import Main from "components/templates/Main";
import Sidebar from "components/templates/Sidebar";
import Loader from "src/components/modules/Loader";
import styles from "./homePage.module.css";

const style = { display: "flex" };

function HomePage() {
  const [allCategories, setAllCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);  // Contains products for the current page
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // Fetch categories
  const getCategories = async () => {
    const response = await axios.get("http://localhost:8000/api/settings/category");
    setAllCategories(response?.data?.data || []);
  };

  // Fetch products
  const getAllProducts = async (page = 1, category = null) => {
    setLoading(true);
  
    const categoryFilter = category ? `&category_id=${category}` : "";
  
    try {
      const response = await axios.get(
        `http://localhost:8000/api/products?page=${page}${categoryFilter}`
      );
  
      const products = response?.data?.data?.data || [];
      const meta = response?.data?.data || {};
  
      // Reset products when navigating to the first page or changing category
      if (page === 1) {
        setAllProducts(products); // Clear out products when switching to page 1 or changing category
      } else {
        // Ensure we're not duplicating the products when on subsequent pages
        setAllProducts((prevProducts) => {
          // Check if new products are not already in the list before adding them
          const allNewProducts = [
            // ...prevProducts,
            ...products.filter((newProduct) => 
              !prevProducts.some((existingProduct) => existingProduct.id === newProduct.id)
            ),
          ];
          return allNewProducts;
        });
      }
  
      // Update the pagination info from the response
      const currentPage = meta.current_page || 1;
      const lastPage = meta.last_page || 1;
  
      setCurrentPage(currentPage);
      setLastPage(lastPage);
  
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };
  
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([getCategories(), getAllProducts()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);  // Reset to first page when changing category
    getAllProducts(1, categoryId);  // Fetch products for the selected category
  };

  const nextPage = async () => {
    if (currentPage < lastPage) {
      const newPage = currentPage + 1;
      await getAllProducts(newPage, selectedCategory); // Fetch products for the next page
    }
  };
  
  const prevPage = async () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      await getAllProducts(newPage, selectedCategory); // Fetch products for the previous page
    }
  };
  
  
  

  return (
    <div style={style}>
      {loading ? (
        <div style={{ textAlign: "center", width: "100%", marginTop: "50px" }}>
          <Loader />
        </div>
      ) : (
        <>
          <Sidebar
            allCategories={allCategories}
            onSelectCategory={handleCategorySelect}
            selectedCategory={selectedCategory}
          />
          <div>
            <Main
              currentProducts={allProducts}  // Display products for the current page
              allProducts={allProducts}
              selectedCategory={selectedCategory}
            />
            {/* Pagination Controls */}
            <div className={styles.pagination}>
  <button
    onClick={prevPage}
    disabled={currentPage === 1} // Disable "Previous" button if on the first page
  >
    قبلی
  </button>
  <span>{`صفحه ${currentPage} از ${lastPage}`}</span>
  <button
    onClick={nextPage}
    disabled={currentPage >= lastPage} // Disable "Next" button if on the last page
  >
    بعدی
  </button>
</div>


          </div>
        </>
      )}
    </div>
  );
}

export default HomePage;
