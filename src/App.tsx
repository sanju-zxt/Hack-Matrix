import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { ScrollToTop } from "./lib/scroll";
import HomePage from "./pages/HomePage";

const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const RulesPage = lazy(() => import("./pages/RulesPage"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Suspense
          fallback={
            <div className="flex min-h-[60vh] items-center justify-center font-mono text-xs uppercase tracking-[0.3em] text-white/55">
              Loadingâ€¦
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/rules" element={<RulesPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}