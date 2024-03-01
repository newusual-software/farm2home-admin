import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DefaultLayout from "../layouts/defaultLayout";
import {
  Avatar,
  Card,
  CardBody,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import { TruncateString } from "../lib/util/truncateString";
import AddCommasToNumber from "../lib/util/addComma";

const Loader = () => {
  return <div>loading</div>;
};

const TABLE_HEAD = ["Name", "Price", "Date", "Total Quantity", "category", ""];
export default function OrderDetails() {
  let { id } = useParams();
  const [orderDetails, setOrderDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}order/${id}`)
      .then((response) => {
        if (response.data) {
          console.log(response?.data[0]);
          setOrderDetails(response?.data[0]);
        }
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);
  const dateObject = new Date(orderDetails?.createdAt);

  // Format the date as YYYY-MM-DD
  const formattedDate = dateObject.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // Calculate subtotal
  const subtotal = orderDetails?.products?.reduce(
    (total, item) =>
      total + item.product_id.product_price * item.product_quatity,
    0
  );

  // Calculate delivery charges
  const deliveryCharges = orderDetails?.amount_paid - subtotal;

  return (
    <DefaultLayout>
      <div className="text-[#212323] pl-10 pt-6 text-xl font-medium font-workSans my-2">
        Invoice
      </div>
      <div className="px-14 my-4">
        {loading ? (
          <Loader />
        ) : (
          <Card className="mx-auto">
            <CardBody>
              <Typography className="text-center text-2xl font-workSans font-medium text-[#212323]">
                Order Details ({orderDetails?.status})
              </Typography>
              <div className="pl-8 text-mainGreen font-semibold text-xl mt-4 mb-2">
                Customer&apos;s Details:{" "}
              </div>
              <div className="grid grid-cols-2 gap-2  pl-8 capitalize justify-between w-full">
                <div className="text-black font-medium text-lg ">
                  Full name:{" "}
                  <span className="inline-flex flex-wrap text-gray-600">
                    {TruncateString({
                      str:
                        orderDetails?.customer_id.first_name +
                        " " +
                        orderDetails?.customer_id.last_name,
                      num: 30,
                    })}
                  </span>
                </div>
                <div className="text-black font-medium text-lg ">
                  Order No:{" "}
                  <span className="inline-flex flex-wrap text-gray-600">
                    {orderDetails?.orderID}
                  </span>
                </div>
                <div className="text-black font-medium text-lg ">
                  phone No:{" "}
                  <span className="inline-flex flex-wrap text-gray-600">
                    {orderDetails?.customer_id.phone_number}
                  </span>
                </div>
                <div className="text-black font-medium text-lg ">
                  email:{" "}
                  <span className="inline-flex flex-wrap lowercase text-gray-600">
                    {TruncateString({
                      str: orderDetails?.customer_id.email,
                      num: 25,
                    })}
                  </span>
                </div>
                <div className="text-black font-medium text-lg ">
                  Date:{" "}
                  <span className="inline-flex flex-wrap text-gray-600">
                    {formattedDate}
                  </span>
                </div>
                <div className="text-black font-medium text-lg ">
                  Total Amount Paid:{" "}
                  <span className="inline-flex flex-wrap text-gray-600">
                    &#8358;{orderDetails?.amount_paid}
                  </span>
                </div>
              </div>
              <div className="pl-8 text-mainGreen font-semibold text-xl mt-4 mb-2">
                Delivery Details:{" "}
              </div>
              <div className="grid grid-cols-2 gap-2  pl-8 capitalize justify-between w-full">
                <div className="text-black font-medium text-lg ">
                  Full name:{" "}
                  <span className="inline-flex flex-wrap text-gray-600">
                    {TruncateString({
                      str:
                        orderDetails?.address.first_name +
                        " " +
                        orderDetails?.address.last_name,
                      num: 30,
                    })}
                  </span>
                </div>

                <div className="text-black font-medium text-lg ">
                  phone No:{" "}
                  <span className="inline-flex flex-wrap text-gray-600">
                    {orderDetails?.address?.phone_number}
                  </span>
                </div>
                <div className="text-black font-medium text-lg ">
                  email:{" "}
                  <span className="inline-flex flex-wrap lowercase text-gray-600">
                    {TruncateString({
                      str: orderDetails?.address?.email,
                      num: 25,
                    })}
                  </span>
                </div>
                <div className="text-black font-medium text-lg ">
                  Additional phone No:{" "}
                  <span className="inline-flex flex-wrap text-gray-600">
                    {orderDetails?.address?.additional_phone_number}
                  </span>
                </div>
                <div className="text-black font-medium text-lg ">
                  Address:{" "}
                  <span className="inline-flex flex-wrap text-gray-600">
                    {orderDetails?.address?.address}
                  </span>
                </div>
                <div className="text-black font-medium text-lg ">
                  state/city:{" "}
                  <span className="inline-flex flex-wrap text-gray-600">
                    {orderDetails?.address.state} state,{" "}
                    {orderDetails?.address?.city}
                  </span>
                </div>
                <div className="text-black font-medium text-lg ">
                  Direction:{" "}
                  <span className="inline-flex flex-wrap text-gray-600">
                    {orderDetails?.address?.directions}
                  </span>
                </div>
                <div className="text-black font-medium text-lg ">
                  Nearest Markets:{" "}
                  <span className="inline-flex flex-col text-gray-600">
                    {orderDetails?.markets?.map((market) => (
                      <div key={market.id}>{market.name}</div>
                    ))}
                  </span>
                </div>
              </div>

              <table className="w-full min-w-max table-auto my-5 text-left">
                <thead>
                  <tr>
                    {TABLE_HEAD.map((head) => (
                      <th
                        key={head}
                        className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                      >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal leading-none opacity-70"
                        >
                          {head}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orderDetails?.products?.map(
                    ({ product_id, createdAt }, index) => {
                      const isLast = index === orderDetails.products.length - 1;
                      const classes = isLast
                        ? "p-4"
                        : "p-4 border-b border-blue-gray-50";
                      const dateObject = new Date(createdAt);

                      // Format the date as YYYY-MM-DD
                      const formattedDate = dateObject.toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        }
                      );

                      return (
                        <tr
                          key={index}
                          className="cursor-pointer hover:bg-greenWhite hover"
                        >
                          <td className={classes}>
                            <div className="flex items-center gap-3">
                              <Avatar
                                src={product_id?.product_image}
                                alt={product_id?.product_name}
                                size="md"
                                className="border border-blue-gray-50 bg-blue-gray-50/50"
                              />
                              <Tooltip content={product_id?.product_name}>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-bold"
                                >
                                  {TruncateString({
                                    str: product_id?.product_name,
                                    num: 24,
                                  })}
                                </Typography>
                              </Tooltip>
                            </div>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              &#8358;{AddCommasToNumber(product_id?.product_price)}
                            </Typography>
                          </td>

                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {formattedDate}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {product_id?.product_total}
                            </Typography>
                          </td>

                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {product_id?.product_cat}
                            </Typography>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
              <div className="flex flex-col justify-end items-end pr-10 mt-5">
                <div className="flex gap-9">
                  <div className="flex justify-start items-start text-[#7E7E7E] text-[20px] font-medium font-workSans">
                    Sub-Total:
                  </div>
                  <div className="text-black text-xl font-medium font-workSans">
                    &#8358;
                    {AddCommasToNumber(orderDetails?.products?.reduce(
                      (total, item) =>
                        total +
                        item.product_id.product_price * item.product_quatity,
                      0
                    ))}
                  </div>
                </div>
                <div className="flex gap-9 border-b border-[#7E7E7E] pb-2">
                  <div className="text-[#7E7E7E] text-[20px] font-medium font-workSans">
                    Delivery Charges:
                  </div>
                  <div className="text-black text-xl font-medium font-workSans">
                    &#8358;{AddCommasToNumber(deliveryCharges)}
                  </div>
                </div>
                <div className="flex gap-9">
                  <div className="text-[#7E7E7E] text-[20px] font-medium font-workSans">
                    Total:
                  </div>
                  <div className="text-black text-xl font-medium font-workSans">
                    &#8358;
                    {AddCommasToNumber(orderDetails?.amount_paid)}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </DefaultLayout>
  );
}
