import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, RequireAuth, RedirectIfAuth } from "@/context/AuthContext"
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import VerifyOtp from "@/pages/VerifyOtp"
import DashboardLayout from "@/components/DashboardLayout"
import ReqFunds from "@/pages/ReqFunds"
import Transactions from "@/pages/Transactions"

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<RedirectIfAuth><Login /></RedirectIfAuth>} />
          <Route path="/register" element={<RedirectIfAuth><Register /></RedirectIfAuth>} />
          <Route path="/verify-otp" element={<RedirectIfAuth><VerifyOtp /></RedirectIfAuth>} />
          <Route path="/dashboard" element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }>
            <Route index element={<Navigate to="req-funds" replace />} />
            <Route path="req-funds" element={<ReqFunds />} />
            <Route path="transactions" element={<Transactions />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
