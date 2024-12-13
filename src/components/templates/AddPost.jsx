import { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "utils/cookie";
import toast from "react-hot-toast";

import styles from "./AddPost.module.css";

function AddPost() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    category_id: "",
    address_id: "",
    address: "",
    price: null,
    exchange: "",
    condition: "",
    contents: [],
  });

  const [errors, setErrors] = useState({});
  const [allCategories, setAllCategories] = useState([]);
  const [allStates, setAllStates] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/settings/category"
        );
        setAllCategories(response?.data?.data);
      } catch (error) {
        toast.error("Failed to fetch categories.");
      }
    };

    const getStates = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/settings/address"
        );
        setAllStates(response?.data?.data);
      } catch (error) {
        toast.error("Failed to fetch states.");
      }
    };

    getCategories();
    getStates();
  }, []);

  const changeHandler = (event) => {
    const { name, value, files } = event.target;
    if (name === "contents") {
      setForm({
        ...form,
        [name]: Array.from(files),
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const removeImage = (index) => {
    const updatedcontents = [...form.contents];
    updatedcontents.splice(index, 1);
    setForm({ ...form, contents: updatedcontents });
  };

  const validateForm = () => {
    const validationErrors = {};

    // Validate text fields
    if (!form.name) {
      validationErrors.name = "نام آگهی الزامی است";
    }
    if (!form.description) {
      validationErrors.description = "توضیحات الزامی است";
    }
    if (!form.category_id) {
      validationErrors.category_id = "دسته‌بندی الزامی است";
    }
    if (!form.address_id) {
      validationErrors.address_id = "استان الزامی است";
    }
    if (!form.price || form.price <= 0) {
      validationErrors.price = "قیمت باید بزرگتر از صفر باشد";
    }
    if (!form.address) {
      validationErrors.address = "آدرس الزامی است";
    }
    if (!form.condition) {
      validationErrors.condition = "وضعیت الزامی است";
    }
    if (!form.exchange) {
      validationErrors.exchange = "تمایل برای معاوضه الزامی است";
    }

    // Validate file selection
    if (form.contents.length === 0) {
      validationErrors.contents = "انتخاب حداقل یک عکس الزامی است";
    }

    return validationErrors;
  };

  const addHandler = async (event) => {
    event.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      if (key === "contents") {
        form.contents.forEach((file) => {
          formData.append("contents[]", file);
        });
      } else {
        formData.append(key, form[key]);
      }
    });

    const accessToken = getCookie("accessToken");

    try {
      await axios.post("http://localhost:8000/api/add-product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("آگهی شما با موفقیت ثبت شد");
    } catch (error) {
      toast.error("مشکلی پیش آمده است");
    }
  };

  return (
    <form onSubmit={addHandler} className={styles.form}>
      <h3>افزودن آگهی</h3>

      {/* Name Field */}
      <div className={styles.inputGroup}>
        <label htmlFor="name">نام آگهی</label>
        <input
          type="text"
          name="name"
          id="name"
          value={form.name}
          onChange={changeHandler}
        />
        {errors.name && <span className={styles.error}>{errors.name}</span>}
      </div>

      {/* Description Field */}
      <div className={styles.inputGroup}>
        <label htmlFor="description">توضیحات</label>
        <textarea
          name="description"
          id="description"
          value={form.description}
          onChange={changeHandler}
        />
        {errors.description && (
          <span className={styles.error}>{errors.description}</span>
        )}
      </div>

      {/* Category Field */}
      <div className={styles.inputGroup}>
        <label htmlFor="category_id">دسته‌بندی</label>
        <select
          name="category_id"
          id="category_id"
          value={form.category_id}
          onChange={changeHandler}
        >
          <option value="">انتخاب کنید</option>
          {allCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.category_id && (
          <span className={styles.error}>{errors.category_id}</span>
        )}
      </div>

      {/* State Field */}
      <div className={styles.inputGroup}>
        <label htmlFor="address_id">استان</label>
        <select
          name="address_id"
          id="address_id"
          value={form.address_id}
          onChange={changeHandler}
        >
          <option value="">انتخاب کنید</option>
          {allStates.map((state) => (
            <option key={state.id} value={state.id}>
              {state.name}
            </option>
          ))}
        </select>
        {errors.address_id && (
          <span className={styles.error}>{errors.address_id}</span>
        )}
      </div>

      {/* Address Field */}
      <div className={styles.inputGroup}>
        <label htmlFor="address">آدرس</label>
        <input
          type="text"
          name="address"
          id="address"
          value={form.address}
          onChange={changeHandler}
        />
        {errors.address && (
          <span className={styles.error}>{errors.address}</span>
        )}
      </div>

      {/* Price Field */}
      <div className={styles.inputGroup}>
        <label htmlFor="price">قیمت</label>
        <input
          type="number"
          name="price"
          id="price"
          value={form.price}
          onChange={changeHandler}
        />
        {errors.price && <span className={styles.error}>{errors.price}</span>}
      </div>

      {/* Exchange Field */}
      <div className={styles.inputGroup}>
        <label htmlFor="exchange">تمایل برای معاوضه</label>
        <select
          name="exchange"
          id="exchange"
          value={form.exchange}
          onChange={changeHandler}
        >
          <option>انتخاب کنید</option>
          <option value="true">بله</option>
          <option value="false">خیر</option>
        </select>
        {errors.exchange && (
          <span className={styles.error}>{errors.exchange}</span>
        )}
      </div>

      {/* Condition Field */}
      <div className={styles.inputGroup}>
        <label htmlFor="condition">وضعیت</label>
        <select
          name="condition"
          id="condition"
          value={form.condition}
          onChange={changeHandler}
        >
          <option>انتخاب کنید</option>

          <option value="new">نو</option>
          <option value="like_new">در حد نو</option>
          <option value="old">کهنه</option>
        </select>
        {errors.condition && (
          <span className={styles.error}>{errors.condition}</span>
        )}
      </div>

      {/* Image Upload */}
      {/* Image Upload */}
      <div className={styles.inputGroup}>
        <label htmlFor="contents">عکس‌ها</label>
        <input
          type="file"
          name="contents"
          id="contents"
          multiple
          onChange={changeHandler}
        />
        {errors.contents && (
          <span className={styles.error}>{errors.contents}</span>
        )}
      </div>

      {/* Preview images with delete buttons */}
      <div className={styles.previewContainer}>
        {form.contents.map((file, index) => (
          <div key={index} className={styles.previewImage}>
            <img
              src={URL.createObjectURL(file)}
              alt={`Preview ${index}`}
              className={styles.previewImg}
            />
            <button
              type="button"
              className={styles.deleteBtn}
              onClick={() => removeImage(index)}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <button type="submit" className={styles.submitButton}>
        ثبت آگهی
      </button>
    </form>
  );
}

export default AddPost;
