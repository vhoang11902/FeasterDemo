import { useParams } from "react-router-dom";

function OrderPlace() {
    const { orderId } = useParams();

  return (
    <div className=" text-center pt-20">
      <h1 className="text-2xl font-semibold">Thank you for your order !!!</h1>
      <h2 className="text-2xl my-5"> Your order code is: {orderId}</h2>
      <h2 className="text-2xl">We also sent a same code to your email to confirm your order !!!</h2>
      <h2 className="text-2xl">
        We will prepare and ship your order immediately to you. This process
        will take about 5 days.
      </h2>
      <h2 className="text-2xl mt-5">Thanks for choosing us. Have a nice day. </h2>
    </div>
  );
}

export default OrderPlace;
