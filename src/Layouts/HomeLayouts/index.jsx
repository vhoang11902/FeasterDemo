import Footer from "./Footer/footer";
import Header from "./Header/header";
import NavigationBar from "../../components/NavigationBars/navigationBar";
import CartContext from "../../pages/Frontend/CartContext";
import { useState } from "react";
function HomeLayouts({ children }) {
  const [cartItems, setCartItems] = useState([]);
  return (
    <div className="font-body">
      <CartContext.Provider value={[cartItems, setCartItems]}>
        <Header />
        <NavigationBar />
        <div className="mx-[100px] mt-12 mb-5 max-lg:mx-[20px]">{children}</div>
        <Footer />
      </CartContext.Provider>
    </div>
  );
}
export default HomeLayouts;
