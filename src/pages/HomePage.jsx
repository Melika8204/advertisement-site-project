import { useEffect, useState } from "react";
import axios from "axios";
import Main from "components/templates/Main";
import Sidebar from "components/templates/Sidebar";
import Loader from "src/components/modules/Loader";

const style = { display: "flex" };

function HomePage() {
  const [allCategories, setAllCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state

  // Fetch categories and products from the backend
  const getCategories = async () => {
    const response = await axios.get("http://localhost:8000/api/settings/category");
    setAllCategories(response?.data?.data || []);
  };

  const getAllPostsProducts = async () => {
    const response = await axios.get("http://localhost:8000/api/products");
    setAllProducts(response?.data?.data?.data || []);
  };

  // Load data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading
      await Promise.all([getCategories(), getAllPostsProducts()]);
      setLoading(false); // Stop loading after data fetch
    };

    fetchData();
  }, []);

  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    console.log({ categoryId });
  };

  console.log({ allProducts });

  return (
    <div style={style}>
      {loading ? (
        // Loader Component or Placeholder
        <div style={{ textAlign: "center", width: "100%", marginTop: "50px" }}>
          <Loader/>
        </div>
      ) : (
        <>
          <Sidebar
            allCategories={allCategories}
            onSelectCategory={handleCategorySelect}
            selectedCategory={selectedCategory}
          />
          <Main allProducts={allProducts} selectedCategory={selectedCategory} />
        </>
      )}
    </div>
  );
}

export default HomePage;
