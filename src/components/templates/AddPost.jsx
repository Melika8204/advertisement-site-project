import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { getCategory } from "services/admin";
import { getCookie } from "utils/cookie";

import styles from "./AddPost.module.css";

function AddPost() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    category_id: "",
    address_id: "",
    price: null,
    exchange: "",
    condition: "",
    address: "",
    Contents: [],
  });

  const [allCategories, setAllCategories] = useState([]);
  const [allStates, setAllStates] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      const response = await axios.get("http://localhost:8000/api/settings/category");
      setAllCategories(response?.data?.data);
    };

    const getStates = async () => {
      const response = await axios.get("http://localhost:8000/api/settings/address");
      setAllStates(response?.data?.data);
    };

    getCategories();
    getStates();
  }, []);

  const changeHandler = (event) => {
    const { name, value, files } = event.target;
    if (name === "Contents") {
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

  const addHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      if (key === "Contents") {
        form.Contents.forEach((file) => {
          formData.append("Contents[]", file);
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
          "Authorization": `Bearer ${accessToken}`,
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

      <div className={styles.inputGroup}>
        <label htmlFor="name">عنوان</label>
        <input
          type="text"
          name="name"
          id="name"
          value={form.name}
          onChange={changeHandler}
          placeholder="عنوان محصول"
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="description">توضیحات</label>
        <textarea
          name="description"
          id="description"
          value={form.description}
          onChange={changeHandler}
          placeholder="توضیحات محصول"
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="price">قیمت</label>
        <input
          type="number"
          name="price"
          id="price"
          value={form.price}
          onChange={changeHandler}
          placeholder="قیمت محصول"
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="address_id">استان</label>
        <select
          id="address_id"
          name="address_id"
          value={form.address_id}
          onChange={changeHandler}
        >
          <option value="">انتخاب استان</option>
          {allStates.map((place) => (
            <option key={place.id} value={place.id}>
              {place.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="address">آدرس</label>
        <input
          type="text"
          name="address"
          id="address"
          value={form.address}
          onChange={changeHandler}
          placeholder="آدرس دقیق"
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="category_id">دسته بندی</label>
        <select
          name="category_id"
          id="category_id"
          value={form.category_id}
          onChange={changeHandler}
        >
          <option value="">انتخاب دسته بندی</option>
          {allCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="exchange">تمایل برای معاوضه</label>
        <select
          name="exchange"
          id="exchange"
          value={form.exchange}
          onChange={changeHandler}
        >
          <option value="true">بله</option>
          <option value="false">خیر</option>
        </select>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="condition">وضعیت</label>
        <select
          name="condition"
          id="condition"
          value={form.condition}
          onChange={changeHandler}
        >
          <option value="new">نو</option>
          <option value="like_new">در حد نو</option>
          <option value="old">کهنه</option>
        </select>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="Contents">عکس‌ها</label>
        <input
          type="file"
          name="Contents"
          id="Contents"
          multiple
          onChange={changeHandler}
        />
      </div>

      <button type="submit" className={styles.submitBtn}>
        ارسال آگهی
      </button>
    </form>
  );
}

export default AddPost;
