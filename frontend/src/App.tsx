import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import SearchPage from "./pages/SearchPage";
import ProductPage from "./pages/ProductPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/categories/:category" element={<CategoryPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/products/:id" element={<ProductPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      <footer className="border-t border-[#e8e8e2] bg-white">
        <div className="mx-auto flex min-h-[75px] w-[calc(100%-32px)] max-w-[1160px] items-center justify-between gap-3 text-xs text-[#898a83]">
          <span className="font-extrabold tracking-[.12em] text-[#24251f]">ANSR</span>
          <span>Product catalogue · Built for the challenge</span>
        </div>
      </footer>
    </div>
  );
}
