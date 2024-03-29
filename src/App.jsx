import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./pages/landing";
import UserSignIn from "./pages/auth/userSignIn";
import ProtectedRoute from "./components/protectedRoute/index";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductDescription from "./pages/productDescription";
import Customer from "./pages/customer";
import UserSignUp from "./pages/auth/userSignUp";
import Order from "./pages/order";
import OrderDetails from "./pages/orderDetails";
import Newsletter from "./pages/newsletter";
import Marketplace from "./pages/marketplace";
import Dashboard from "./pages/dashboard";
import Distributors from "./pages/distributors";
function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* authentication routes */}
          <Route path="/sign-in" element={<UserSignIn />} />
          <Route path="/sign-up" element={<UserSignUp />} />
          {/* protected routes */}
          <Route element={<ProtectedRoute />}>
            {/* landing route */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Landing />} />
            <Route path="/product/:id" element={<ProductDescription />} />
            <Route path="/customer" element={<Customer />} />
            <Route path="/order" element={<Order />} />
            <Route path="/order/:id" element={<OrderDetails />} />
            <Route path="/newsletter" element={<Newsletter />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/distributors" element={<Distributors />} />

          </Route>
        </Routes>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
