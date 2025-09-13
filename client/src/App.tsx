import LandingPage from "@/page/landing/LandingPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "@/page/auth/SendOtp";
import VarifyOtp from "./page/auth/VarifyOtp";
import { Toaster } from "sonner";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useEffect } from "react";
import { fetchUser } from "./store/slices/authSlice";
import { useAppDispatch } from "./store/hook";
import Layout from "./page/dashboard/Layout";
import Dashboard from "./page/dashboard/Dashboard";
import Earth from "./page/dashboard/earth/Earth";
import Space from "./page/dashboard/space/Space";
import Search from "./page/dashboard/search/Search";
import Setting from "./page/dashboard/setting/Setting";
import ArticleDetail from "./components/ArticleDetail";
import Discovery from "./page/dashboard/discoveries/Discovery";
import ArticleLayout from "./page/dashboard/ArticleLayout";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<LoginPage />} />
        <Route path="/varify-otp/:email" element={<VarifyOtp />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Layout />}>
            <Route element={<ArticleLayout />} >
              <Route index element={<Dashboard />} />
              <Route path="articles/:id" element={<ArticleDetail />} />
            </Route>

            <Route path="earth" element={<Earth />} />
            <Route path="space" element={<Space />} />
            <Route path="discovery" element={<Discovery />} />
            <Route path="insights" element={<>ai insight</>} />
            <Route path="images" element={<>images</>} />
            <Route path="search" element={<Search />} />
            <Route path="Settings" element={<Setting />} />
          </Route>
        </Route>
      </Routes>
      <Toaster position="top-center" />
    </BrowserRouter>
  );
}

export default App;
