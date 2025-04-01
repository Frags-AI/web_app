import BlogPage from './app/blog/BlogPage';
import LandingPage from './app/landing-page/LandingPage';
import Profile from './app/profile/Profile';
import Pricing from './app/pricing-page/Pricing';
import Product from './app/product-page/Product';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./app/authentication/Login";
import SignUp from "./app/authentication/SignUp";
import ScrollToTop from './app/accessories/ScrollToLocation';
import SignOut from './app/authentication/SignOut';
import Checkout from './app/checkout/Checkout';
import CheckoutSuccess from './app/checkout/CheckoutSuccess';
import DashboardLayout from "@/app/dashboard/Layout";
import DashboardHome from "@/app/dashboard/home";
import CreatorStudio from './app/dashboard/studio';
import NotFound from './app/accessories/NotFound';

const App = () => {

    return (
      <Router>
          <ScrollToTop>
            <Routes>
                <Route path="blog" element={<BlogPage/>}/>
                <Route path="profile" element={<Profile/>}/>
                <Route path="checkout" element={<Checkout />} />
                <Route path="order-details" element={<CheckoutSuccess />} />
                <Route path="dashboard" element={<DashboardLayout />}>
                  <Route index element={<DashboardHome />}/>
                  <Route path="studio" element={<CreatorStudio />} />
                </Route>
                <Route path="/login/*" element={<Login />} />
                <Route path="/signup/*" element={<SignUp />} />
                <Route path="/signout/*" element={<SignOut />} />
                <Route index element={<LandingPage />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/product" element={<Product />} />

                {/* Catchall (Place All routes above this one) */}
                <Route path="*" element={<NotFound />} />
            </Routes>
          </ScrollToTop>
      </Router>
    )
}

export default App;
