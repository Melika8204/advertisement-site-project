import styles from "./Sidebar.module.css";

function Sidebar({ allCategories, onSelectCategory, selectedCategory }) {
  return (
    <div className={styles.sidebar}>
      <h4>دسته ها</h4>
      <ul>
        {allCategories.map((category) => (
          <li
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            // className={selectedCategory === category.id ? styles.selected : ""}
          >
            <p
              className={
                selectedCategory === category.id ? styles.selected : styles.name
              }
            >
              {category.name}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
