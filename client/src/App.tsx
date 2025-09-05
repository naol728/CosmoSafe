import LandingPage from "@/page/landing/LandingPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "@/page/auth/SendOtp";
import VarifyOtp from "./page/auth/VarifyOtp";
import { Toaster } from "sonner";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useEffect } from "react";
import { fetchUser } from "./store/slices/authSlice";
import { useAppDispatch } from "./store/hook";

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
          <Route path="/dashboard" element={<>dashboard</>} />
        </Route>
      </Routes>
      <Toaster position="top-center" />
    </BrowserRouter>
  );
}

export default App;
