import { BrowserRouter, Routes, Route } from "react-router-dom";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import OrderTrackPage from "./pages/OrderTrackPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MenuPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders/:orderId" element={<OrderTrackPage />} />
        <Route path="/orders" element={<OrdersPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;