import { Navigate, Route, Routes } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import HomePage from "pages/HomePage";
import AdminPage from "pages/AdminPage";
import AuthPage from "pages/AuthPage";
import DashboardPage from "pages/DashboardPage";
import PageNotFound from "pages/404";
import Loader from "components/modules/Loader";
import { getProfile } from "services/user";
import Login from "src/pages/Login";
import { useEffect, useState } from "react";
import { getCookie } from "src/utils/cookie";
import ProductDetail from "src/pages/ProductDetail";
import axios from "axios";
import UserPanel from "src/pages/UserPanel";

function Router() {
  // const { data, isLoading, error } = useQuery(["profile"], getProfile);
  // console.log({ data, isLoading, error });

  // if (isLoading) return <Loader />;
  const [isRegistered, setIsRegistered] = useState(false);
  const [userName, setUserName] = useState(null);
  const accessToken = getCookie("accessToken");

  useEffect(() => {
    const storedUserName = getCookie("userName");

    if (accessToken) {
      setIsRegistered(true);
      setUserName(decodeURIComponent(storedUserName));
    }
  }, []);
  const [userDetail, setUserDetail] = useState([]);

  const getUserData = async () => {
    var response = await axios.get("http://localhost:8000/api/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Send token in Authorization header
      },
    });
    console.log({ response });
    var user = response?.data;
    setUserDetail(user);
  };
  console.log({ userDetail });
  useEffect(() => {
    getUserData();
  }, []);
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route
        path="/dashboard"
        element={isRegistered ? <DashboardPage /> : <Navigate to="/auth" />}
      />
      <Route path="/login" element={<Login />} />
      <Route
        path="/auth"
        element={isRegistered ? <Navigate to="/dashboard" /> : <AuthPage />}
      />
      {/* <Route
        path="/admin"
        element={
          userDetail && userDetail.email === "melika8204.it.v@gmail.com" ? (
            <AdminPage />
          ) : (
            <Navigate to="/" />
          )
        }
      /> */}
      <Route
        path="/admin"
        element={
          userDetail.email && userDetail.email === "melika8204.it.v@gmail.com" ? (
            <AdminPage />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/userpanel"
        element={isRegistered ? <UserPanel /> : <Navigate to="/auth" />}
      />

      <Route path="/product/:productId" element={<ProductDetail />} />

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default Router;
// import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";

// import HomePage from "pages/HomePage";
// import AdminPage from "pages/AdminPage";
// import AuthPage from "pages/AuthPage";
// import DashboardPage from "pages/DashboardPage";
// import PageNotFound from "pages/404";
// import Loader from "components/modules/Loader";
// import { getProfile } from "services/user";
// import Login from "src/pages/Login";
// import { useEffect, useState } from "react";
// import { getCookie } from "src/utils/cookie";

// function Router() {
//   const { data, isLoading, error } = useQuery(["profile"], getProfile);
//   // console.log({ data, isLoading, error });

//   if (isLoading) return <Loader />;
//   const [isRegistered, setIsRegistered] = useState(false);
//   const [userName, setUserName] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const accessToken = getCookie("accessToken");
//     const storedUserName = getCookie("userName");
//     if (accessToken) {
//       setIsRegistered(true);
//       setUserName(decodeURIComponent(storedUserName));
//     }
//   }, []);
//   return (
//     <Routes>
//       <Route index element={<HomePage />} />
//       <Route
//         path="/dashboard"
//         element={isRegistered ? <DashboardPage /> : <Navigate to="/auth" />}
//       />
//         <Route
//         path="/login"
//         element={isRegistered ? <Login /> : <Navigate to="/login" />}
//       />
//       <Route
//         path="/auth"
//         element={isRegistered ? <Navigate to="/auth" /> : <AuthPage />}
//       />
//       <Route
//         path="/admin"
//         element={
//           data && data.data.role === "ADMIN" ? (
//             <AdminPage />
//           ) : (
//             <Navigate to="/" />
//           )
//         }
//       />
//       <Route path="*" element={<PageNotFound />} />
//     </Routes>
//   );
// }

// export default Router;
