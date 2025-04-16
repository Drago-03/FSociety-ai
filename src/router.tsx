import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import ErrorPage from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import DevLogin from "./components/DevLogin";
import Team from "./pages/Team";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import ContentQueue from "./pages/ContentQueue";
import Analytics from "./pages/Analytics";
import Community from "./pages/Community";
import Integrations from "./pages/Integrations";
import Profile from "./pages/Profile";
import WebVerification from "./pages/WebVerification";
import DocumentVerification from "./pages/DocumentVerification";

// Create a component for pages not yet implemented
const NotImplemented = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Coming Soon</h1>
    <p>This feature is under development and will be available soon.</p>
  </div>
);

const router = createBrowserRouter([
  // Public Routes
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/dev-login",
    element: <DevLogin />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/team",
    element: <Team />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/contact",
    element: <Contact />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/privacy",
    element: <Layout requireAuth={false}><PrivacyPolicy /></Layout>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/terms",
    element: <Layout requireAuth={false}><TermsOfService /></Layout>,
    errorElement: <ErrorPage />,
  },
  
  // Protected Routes
  {
    path: "/",
    element: <ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/queue",
    element: <ProtectedRoute><Layout><ContentQueue /></Layout></ProtectedRoute>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/analytics",
    element: <ProtectedRoute><Layout><Analytics /></Layout></ProtectedRoute>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/community",
    element: <ProtectedRoute><Layout><Community /></Layout></ProtectedRoute>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/integrations",
    element: <ProtectedRoute><Layout><Integrations /></Layout></ProtectedRoute>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/settings",
    element: <ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/profile",
    element: <ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/web-verification",
    element: <ProtectedRoute><Layout><WebVerification /></Layout></ProtectedRoute>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/document-verification",
    element: <ProtectedRoute><Layout><DocumentVerification /></Layout></ProtectedRoute>,
    errorElement: <ErrorPage />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  }
]);

export default router;
