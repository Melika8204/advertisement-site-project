import { useEffect, useState } from "react";
import axios from "axios";
import Main from "components/templates/Main";
import Sidebar from "components/templates/Sidebar";

const style = { display: "flex" };

function HomePage() {
  const [allCategories, setAllCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch categories from the backend
  const getCategories = async () => {
    const response = await axios.get("http://localhost:8000/api/settings/category");
    setAllCategories(response?.data?.data);
  };

  // Fetch all products from the backend
  const getAllPostsProducts = async () => {
    const response = await axios.get("http://localhost:8000/api/products");
    setAllProducts(response?.data?.data?.data);
  };

  useEffect(() => {
    getCategories();
    getAllPostsProducts();
  }, []);

  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId); // Update selectedCategory
    console.log({categoryId})
  };
  console.log({allProducts})

  return (
    <div style={style}>
      <Sidebar 
        allCategories={allCategories} 
        onSelectCategory={handleCategorySelect} 
        selectedCategory={selectedCategory} 
      />
      <Main 
        allProducts={allProducts} 
        selectedCategory={selectedCategory} 
      />
    </div>
  );
}

export default HomePage;
