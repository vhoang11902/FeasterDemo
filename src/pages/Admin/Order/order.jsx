import React, { useState, useEffect } from "react";
import requestPrivate from "../../../utils/requestPrivate";
import { Table, Popconfirm, message } from "antd";
import { Link } from "react-router-dom";
import { FcFullTrash, FcAbout} from "react-icons/fc";

function Order() {
  const [orderInfo, setOrderInfo] = useState([]);
  useEffect(() => {
    requestPrivate
      .get('/allOrder')
      .then((response) => {
        setOrderInfo(response.data)
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const handleDelete = (order_id) => {
    requestPrivate
      .delete(`/delete-category/${order_id}`)
      .then(() => {
        const updatedCategories = orderInfo.filter(
          (order_id) => orderInfo.order_code !== order_id
        );
        setOrderInfo(updatedCategories);
        message.success("Category deleted successfully!");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const confirmDelete = (id) => {
    handleDelete(id);
  };

  const cancelDelete = (e) => {
    console.log("Cancel delete");
  };

  const mapCategoriesToData = () => {
    return orderInfo.map((order, index) => {
      return {
        ...order,
        key: order.order_code,
        stt: index + 1,
      };
    });
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
    },
    {
        title: "Name",
        dataIndex: "fullName",
        key: "fullName",
        render: (text, record) => record.customer_firstName + " " + record.customer_lastName,
      },
    {
      title: "Order Code",
      dataIndex: "order_code",
      key: "order_code",
    },
    {
      title: "Total Price",
      dataIndex: "order_total",
      key: "order_total",
    },
    {
      title: "Payment",
      dataIndex: "order_status",
      key: "order_status",
    },
    {
        title: "Time",
        dataIndex: "created_at",
        key: "created_at",
      },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex">
          <Popconfirm
            title="Are you sure to delete this category?"
            onConfirm={() => confirmDelete(record.order_code)}
            onCancel={cancelDelete}
            okText="Yes"
            cancelText="Cancel"
          >
            <button className=" text-3xl p-2">
              <FcFullTrash />
            </button>
          </Popconfirm>

          <Link to={`/orderDetail/${record.order_code}`} className=" text-3xl p-2">
            <FcAbout />
          </Link>
        </div>
      ),
    },
  ];
    return ( 
        <div className="block p-[2.5rem]">
        <div className="bg-white p-[1.75rem] rounded-2xl">
          <div className="card-body">
            <h4 className="text-lg font-semibold mb-[1.25rem]">All Order</h4>
            <Table dataSource={mapCategoriesToData()} columns={columns} />
          </div>
        </div>
      </div>
    );
}

export default Order;