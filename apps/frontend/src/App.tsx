import { BrowserRouter, Routes, Route } from "react-router-dom";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import OrderPage from "./pages/OrderPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MenuPage />} />

        <Route path="/cart" element={<CartPage />} />

        <Route path="/orders/:orderId" element={<OrderPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;