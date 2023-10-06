
import Header from "./Header/header";
import CartContext from "../../pages/Frontend/CartContext";
import { useState } from "react";
function CheckOut({ children }) {
  const [cartItems, setCartItems] = useState([]);
  return (
    <div className="font-body">
      <CartContext.Provider value={[cartItems, setCartItems]}>
        <Header />
        <div className=" mx-[100px] mt-12 mb-5">{children}</div>
      </CartContext.Provider>
    </div>
  );
}
export default CheckOut;
