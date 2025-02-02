import { BrowserRouter, Route, Routes } from "react-router";
import AuthenticationLayout from "./components/layout/AuthenticationLayout";
import MainLayout from "./components/layout/MainLayout";
import ProductsPage from "./pages/products";
import ListsPage from "./pages/lists";
import InvitePage from "./pages/invite";
import { ToastContainer } from "react-toastify";
import { useContext } from "react";
import ThemeContext from "./store/theme-context";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/layout/ErrorFallback";

function App() {
  const { currentColorSchemeName } = useContext(ThemeContext);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route element={<AuthenticationLayout />}>
              <Route path="/" element={<ListsPage />} />
              <Route path="lists">
                <Route path=":listId" element={<ProductsPage />} />
              </Route>
              <Route path="invite/:token" element={<InvitePage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="bottom-right"
        theme={currentColorSchemeName}
        hideProgressBar
        rtl
      />
    </ErrorBoundary>
  );
}

export default App;
