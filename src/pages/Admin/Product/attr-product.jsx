import { useParams } from "react-router-dom";
import React, { useState, useEffect, useCallback } from "react";
import requestPrivate from "../../../utils/requestPrivate";
import { Table, Popconfirm } from "antd";
import { Link } from "react-router-dom";
import { FcFullTrash, FcSettings } from "react-icons/fc";

function AttrProduct() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [attrValue, setAttrValue] = useState([]);
  const [formState, setFormState] = useState({
    attr_id: "",
    value: "",
  });
  const [formVariant, setVariantValue] = useState({
    price: "",
    stock: "",
  });
  const [dataVariant, setDataVariant] = useState([]);
  const [selectedValues, setSelectedValues] = useState({});

  const selectedAttrValues = Object.entries(selectedValues).map(
    ([key, value]) => {
      return {
        attr_id: key,
        attr_value_id: value,
      };
    }
  );
  const handleDelete = (product_id) => {
    
  };

  const confirmDelete = (product_id) => {
    handleDelete(product_id);
  };

  const cancelDelete = (e) => {
    console.log("Cancel delete");
  };

  const fetchAttributeData = useCallback(async () => {
    const attributeData = await requestPrivate.get('/attribute');
    setData(attributeData.data);
    const attributeDataWithProducts = await Promise.all(
      attributeData.data.map(async (attribute) => {
        const attrProducts = await requestPrivate.get(
          `/attribute-pro?product_id=${id}&attr_id=${attribute.id}`);
        return { ...attribute, attr_products: attrProducts.data };
      })
    );
    setAttrValue(attributeDataWithProducts);
    const variantDataWithProducts = await requestPrivate.get(
      `/variant-pro?product_id=${id}`);
    setDataVariant(variantDataWithProducts.data);
  }, [id]);

  useEffect(() => {
    fetchAttributeData();
  }, [fetchAttributeData]);

  const handleAttributeSubmit = (event) => {
    event.preventDefault();
    const productId = id;
    const body = {
      product_id: productId,
      attributes: data.map((attribute) => ({
        attr_id: attribute.id,
        value: formState[`attr-${attribute.id}`],
      })),
    };
    requestPrivate
      .post(`/save-attrValue/${id}`, body)
      .then((response) => {
        console.log(response.data);
        setFormState({ attr_id: "", value: "" });
        fetchAttributeData();
      })
      .catch((error) => {
        const { errors } = error.response.data;
        console.log(errors);
      });
  };

  const handleAttrValueSubmit = (event) => {
    event.preventDefault();
    const productId = id; 
    const body = {
      product_id: productId,
      price: formVariant.price,
      stock: formVariant.stock,
      attributes: selectedAttrValues,
    };
    requestPrivate
      .post(`/save-variant/${id}`, body)
      .then((response) => {
        fetchAttributeData();
      })
      .catch((error) => {
        const { errors } = error.response.data;
        console.log(errors);
      });
  };

  const mapVariantToData = () => {
    return dataVariant.map((variant, index) => {
      const newVariant = {
        ...variant,
        key: variant.sku_id,
        stt: index + 1,
      };
      variant.variants.forEach((attrVariant) => {
        attrValue.forEach((attr) => {
          if (attr.id === attrVariant.attr_id) {
            attr.attr_products.forEach((attr_value) => {
              if (attr_value.attr_value_id === attrVariant.attr_value_id) {
                newVariant[`attr_${attrVariant.attr_id}`] = attr_value.value;
              }
            });
          }
        });
      });
      return newVariant;
    });
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: 60,
      align: "center",
    },
  ];

  dataVariant.slice(0, 1).forEach((variant) => {
    variant.variants.forEach((attrVariant) => {
      attrValue.forEach((attr) => {
        if (attr.id === attrVariant.attr_id) {
          attr.attr_products.forEach((attr_value) => {
            if (attr_value.attr_value_id === attrVariant.attr_value_id) {
              columns.push({
                title: `${attr.attr_name}`,
                dataIndex: `attr_${attrVariant.attr_id}`,
                key: `${attr_value.value}`,
                width: 150,
                align: "center",
              });
            }
          });
        }
      });
    });
  });

  columns.push(
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 100,
      align: "center",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      width: 100,
      align: "center",
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      align: "center",
      render: (_, record) => (
        <div className="flex justify-center">
          <Popconfirm
            title="Are you sure to delete this category?"
            onConfirm={() => confirmDelete(record.product_id)}
            onCancel={cancelDelete}
            okText="Yes"
            cancelText="Cancel"
            color="white"
          >
            <button className=" text-3xl p-2">
              <FcFullTrash />
            </button>
          </Popconfirm>
        </div>
      ),
    },
  );
  return (
    <div className="p-[2.125rem] ">
      <div className="grid grid-cols-2">
        <div className=" col-span-1 bg-white p-[1.75rem] m-3 rounded-2xl">
          <div className="">
            <h4 className="text-lg font-semibold mb-[1.25rem]">
              Add Attribute
            </h4>
            <form onSubmit={handleAttributeSubmit}>
              <div>
                {data.map((attribute) => (
                  <div key={attribute.id} className="mb-6 flex items-center">
                    <div className="w-40 text-sm mb-2">
                      {attribute.attr_name}:
                    </div>
                    <input
                      className="w-[70%] h-[2.875rem] rounded-md border-[1px] border-[#CED4DA] py-3 px-5 focus:outline-none"
                      placeholder={attribute.attr_name}
                      name={`attr-${attribute.id}`}
                      value={formState[`attr-${attribute.id}`] || ""}
                      onChange={(event) =>
                        setFormState({
                          ...formState,
                          [`attr-${attribute.id}`]: event.target.value,
                        })
                      }
                    />
                  </div>
                ))}
              </div>
              <div className="mb-6">
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 px-5 rounded-xl hover:bg-blue-700 transition"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="col-span-1 bg-white p-[1.75rem] m-3 rounded-2xl">
          <div className="">
            <h4 className="text-lg font-semibold mb-[1.25rem]">Add Variant</h4>
            <form onSubmit={handleAttrValueSubmit}>
              <div>
                {attrValue.map((attr) => (
                  <div key={attr.id} className="mb-6 flex items-center">
                    <div className="w-40 text-sm mb-2">{attr.attr_name}:</div>
                    {attr.attr_products.map((attrValue) => (
                      <div key={attrValue.attr_value_id}>
                        <input
                          type="radio"
                          name={attrValue.attr_id}
                          checked={
                            selectedValues[attr.id] === attrValue.attr_value_id
                          }
                          onChange={() =>
                            setSelectedValues({
                              ...selectedValues,
                              [attr.id]: attrValue.attr_value_id,
                            })
                          }
                          value={attrValue.attr_value_id}
                        ></input>
                        <label
                          htmlFor={attrValue.attr_value_id}
                          className="p-2"
                        >
                          {attrValue.value}
                        </label>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="mb-6 flex items-center">
                <div className="w-40 text-sm mb-2">Price:</div>
                <input
                  className="w-full h-[2.875rem] mx-14 rounded-md border-[1px] border-[#CED4DA] py-3 px-5 focus:outline-none"
                  placeholder="Price"
                  value={formVariant.price}
                  onChange={(event) =>
                    setVariantValue({
                      ...formVariant,
                      price: event.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-6 flex items-center">
                <div className="w-40 text-sm mb-2">Stock:</div>
                <input
                  className="w-full h-[2.875rem] mx-14 rounded-md border-[1px] border-[#CED4DA] py-3 px-5 focus:outline-none"
                  placeholder="Stock"
                  value={formVariant.stock}
                  onChange={(event) =>
                    setVariantValue({
                      ...formVariant,
                      stock: event.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-6">
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 px-5 rounded-xl hover:bg-blue-700 transition"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="bg-white p-[1.75rem] m-3 rounded-2xl col-span-2">
        <div className="card-body">
          <h4 className="text-lg font-semibold mb-[1.25rem]">All Product</h4>
          <Table
            dataSource={mapVariantToData()}
            columns={columns}
            scroll={{ x: "100%", y: "calc(100% - 250px)" }} // thiết lập chiều dài để cho phép cuộn
          />
        </div>
      </div>
    </div>
  );
}

export default AttrProduct;
