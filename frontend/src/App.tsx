import BlogPage from './app/blog/BlogPage';
import LandingPage from './app/landing-page/LandingPage';
import Subscription from './app/subscription/Subscription';
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
import DashboardLayout from "@/app/dashboard/Dashboard";
import DashboardHome from "@/app/dashboard/home";
import CreatorStudio from "@/app/dashboard/creator-studio/creator-studio";

const App = () => {

    return (
      <Router>
          <ScrollToTop>
            <Routes>
                <Route path="/blog" element={<BlogPage/>}/>
                <Route path="/profile" element={<Profile/>}/>
                <Route path="/subscription" element={<Subscription />}/>
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/checkout/success" element={<CheckoutSuccess />} />
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<DashboardHome />}/>
                  <Route path="studio" element={<CreatorStudio />} />
                </Route>
                <Route path="/login/*" element={<Login />} />
                <Route path="/signup/*" element={<SignUp />} />
                <Route path="/signout/*" element={<SignOut />} />
                <Route index element={<LandingPage />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/product" element={<Product />} />
            </Routes>
          </ScrollToTop>
      </Router>
    )
}

export default App;
