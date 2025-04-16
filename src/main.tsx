import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { ThemeProvider } from "./theme/ThemeProvider";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from 'react-hot-toast';
import AppErrorBoundary from "./components/AppErrorBoundary";
import './index.css';

// Configure error handling
if (import.meta.env.PROD) {
  // Disable console in production, except for warnings and errors
  const originalConsole = { ...console };
  console.log = () => {};
  console.info = () => {};
  console.debug = () => {};
  // Keep error and warn
  console.error = originalConsole.error;
  console.warn = originalConsole.warn;
}

// Add global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: '#ECF0F1',
                color: '#2C3E50',
              },
              success: {
                style: {
                  background: '#2ECC71',
                  color: '#fff',
                },
              },
              error: {
                style: {
                  background: '#E74C3C',
                  color: '#fff',
                },
              },
            }}
          />
          <RouterProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
    </AppErrorBoundary>
  </React.StrictMode>
);
