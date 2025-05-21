import BlogPage from './app/blog/BlogPage';
import LandingPage from './app/landing-page/LandingPage';
import Profile from './app/profile/Profile';
import Pricing from './app/pricing-page/Pricing';
import Product from './app/product-page/Product';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./app/authentication/Login";
import SignUp from "./app/authentication/SignUp";
import ScrollToTop from './app/accessories/ScrollToLocation';
import SignOut from './app/authentication/SignOut';
import Checkout from './app/checkout/Checkout';
import CheckoutSuccess from './app/checkout/CheckoutSuccess';
import DashboardLayout from "@/app/dashboard/Layout";
import DashboardHome from "@/app/dashboard/home";
import CreatorStudio from './app/dashboard/studio';
import Subscriptions from './app/dashboard/subscriptions';
import NotFound from './app/accessories/NotFound';
import DashboardWorkflow from './app/dashboard/workflow';
import DashboardClips from "./app/dashboard/clips"
import DashboardSocial from "./app/dashboard/social"

export default function App () {
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
                  <Route path="subscriptions" element={<Subscriptions />} />
                  <Route path="workflow" element={<DashboardWorkflow />} />
                  <Route path="clips" element={<Navigate to="/dashboard" />} /> {/* Modify this later to have better error handling and redirection */}
                  <Route path="clips/*" element={<DashboardClips />} />
                  <Route path="social" element={<DashboardSocial />} />
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