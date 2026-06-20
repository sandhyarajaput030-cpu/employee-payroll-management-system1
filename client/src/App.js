import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Home from "./components/guestLayout/Home";
import Login from "./components/guestLayout/Login";
import Register from "./components/guestLayout/Register";
import GuestLayout from "./components/guestLayout/GuestLayout";
import About from "./components/guestLayout/About";
import Services from "./components/guestLayout/Services";


import AdminLayout from "./components/adminLayout/AdminLayout"; 
import AdminDashboard from "./components/adminLayout/AdminDashboard";
import Employees from "./components/adminLayout/Employees";
import HRManagers from "./components/adminLayout/HRManagers";
import AdminNoticeBoard from "./components/adminLayout/NoticeBoard";

import ProfilePage from "./pages/ProfilePage.jsx";



import AdminViewPayslips from "./pages/admin/payroll/ViewPayslips";
import AdminSalaryPrediction from "./pages/admin/payroll/SalaryPrediction";
import GeneratePayslips from "./pages/hr/payroll/GeneratePayslips";
import ApprovePayslips from "./pages/admin/payroll/ApprovePayslips";
import PayslipView from "./pages/admin/payroll/PayslipView";


import HrLayout from "./components/hrLayout/HrLayout";
import HrDashboard from "./components/hrLayout/HrDashboard";
import Attendance from "./components/adminLayout/Attendance";
import AdminLeaves from "./components/adminLayout/EmployeeLeaves";
import LeaveDashboard from "./components/hrLayout/LeaveDashboard";



import EmployeeLayout from "./components/employeeLayout/EmployeeLayout";
import EmployeeDashboard from "./components/employeeLayout/EmployeeDashboard";
import EmployeeAttendance from "./components/employeeLayout/EmployeeAttendance";
import EmployeePayslips from "./components/employeeLayout/EmployeePayslips";
import LeaveRequest from "./components/employeeLayout/LeaveRequest";
import EmployeeNotices from "./components/employeeLayout/EmployeeNotices";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Guest Layout Wrapper */}
        <Route path="/" element={<GuestLayout />}>

          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
        </Route>


        {/* --- ADMIN  DASHBOARD ROUTE --- */}
        <Route path="/admin-dashboard" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
         <Route path="employees" element={<Employees />} />
          <Route path="hr-managers" element={<HRManagers />} />
          <Route path="notice-board" element={<AdminNoticeBoard />} />
          <Route path="profile" element={<ProfilePage />} />

           {/* View/Edit Employee */}
          <Route path="employees/:id" element={<div>View Employee Page</div>} />
          <Route path="employees/edit/:id" element={<div>Edit Employee Page</div>} />

          {/*  ✅ PAYROLL ROUTES (Admin) */}
          <Route path="payroll/view-slips" element={<AdminViewPayslips />} />
         <Route path="payroll/salary-prediction" element={<AdminSalaryPrediction  />} />
         <Route path="payroll/approve-slips" element={<ApprovePayslips />} />
         <Route path="leaves" element={<AdminLeaves />} />

        
          
          <Route path="attendance" element={<Attendance />} />
          
         <Route path="hr-managers" element={<HRManagers />} />
        </Route>



        {/* --- HR DASHBOARD ROUTE --- */}
  <Route path="/hr-dashboard" element={<HrLayout />}>
  <Route index element={<HrDashboard />} />

  <Route path="employees" element={<Employees />} />
  <Route path="attendance" element={<Attendance />} />
    {/* ✅ Payroll routes for HR */}
  <Route path="payroll/generate-slips" element={<GeneratePayslips />} />
  <Route path="payroll/view-slips" element={<AdminViewPayslips />} />
  <Route path="payroll/salary-prediction" element={<AdminSalaryPrediction />} />
  <Route path="leaves" element={<LeaveDashboard />} />
  <Route path="notice-board" element={<AdminNoticeBoard />} />
  <Route path="profile" element={<ProfilePage />} />
  
 
</Route>


{/* --- EMPLOYEE DASHBOARD ROUTE --- */}
<Route path="/employee-dashboard" element={<EmployeeLayout />}>
  <Route index element={<EmployeeDashboard />} />

  <Route path="attendance" element={<EmployeeAttendance />} />
  <Route path="payslips" element={<EmployeePayslips />} />
  <Route path="profile" element={<ProfilePage />} />
  <Route path="leave" element={<LeaveRequest />} />
  <Route path="notice-board" element={<EmployeeNotices />} />
</Route>

 {/* 🔥 COMMON PAGE FOR BOTH */}
  <Route path="/payslip-view" element={<PayslipView />} />

      </Routes>
    </BrowserRouter>
  );
}


export default App;