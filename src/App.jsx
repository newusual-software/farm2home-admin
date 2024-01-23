import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./pages/landing";
import UserSignIn from "./pages/auth/userSignIn";
import ProtectedRoute from "./components/protectedRoute/index";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductDescription from "./pages/productDescription";
import Customer from "./pages/customer";
function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* authentication routes */}
          <Route path="/sign-in" element={<UserSignIn />} />
          {/* protected routes */}
          <Route element={<ProtectedRoute />}>
            {/* landing route */}
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Landing />} />
            <Route path="/product/:id" element={<ProductDescription />} />
            <Route path="/customer" element={<Customer />} />
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
