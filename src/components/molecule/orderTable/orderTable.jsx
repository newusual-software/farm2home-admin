import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  Tooltip,
  Input,
  Chip,
  IconButton,
} from "@material-tailwind/react";

import Pagination from "../pagination/pagination";
import { useNavigate } from "react-router-dom";
import { TruncateString } from "../../../lib/util/truncateString";
import { useEffect, useState } from "react";
import axios from "axios";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { useUpdateStatusMutation } from "../../../services/api";
const TABLE_HEAD = [
  "Name",
  "Order Id",
  "Date",
  "Amount Paid",
  //phone number for delivery
  "phone number",
  "Status",
  "",
];

export function OrderTable() {
  const navigate = useNavigate();
  const [order, setOrder] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [updateOrder] = useUpdateStatusMutation();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}order/`)
      .then((response) => {
        if (response.data) {
          console.log(response.data);
          setOrder(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  }, []);

  const handleActionClick = (orderId) => {
    setSelectedOrderId(orderId);
    setDropdownVisible((cur) => !cur);
  };

  const handleStatusSelect = async (status, orderID) => {
    if (status || orderID) {
      let putData = {
        status: status,
        orderID: orderID,
      };
      if (status == "Delivered") {
        const isConfirmed = window.confirm(
          "Are you sure this goods have been delivered"
        );
        if (isConfirmed) {
          try {
            const orderResponse = await updateOrder(putData).unwrap();

            if (orderResponse.order) {
              // Update the specific order in the state
              setOrder((prevOrders) =>
                prevOrders.map((order) =>
                  order._id === orderResponse.order._id
                    ? { ...order, status: orderResponse.order.status }
                    : order
                )
              );
            }
          } catch (error) {
            console.error("Error updating order:", error);
          }
        } else {
          setDropdownVisible(false);
        }
      } else {
        try {
          const orderResponse = await updateOrder(putData).unwrap();

          if (orderResponse.order) {
            // Update the specific order in the state
            setOrder((prevOrders) =>
              prevOrders.map((order) =>
                order._id === orderResponse.order._id
                  ? { ...order, status: orderResponse.order.status }
                  : order
              )
            );
          }
        } catch (error) {
          console.error("Error updating order:", error);
        }
      }
    }
    setDropdownVisible(false);
  };
  //   console.log(selectedStatus)
  return (
    <Card className="h-full w-[96%] mx-auto">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>Order History</div>
          <div className="w-full md:w-72">
            <Input
              label="Search"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            />
          </div>
        </div>
      </CardHeader>
      <CardBody className=" px-0">
        <table className="w-full min-w-max table-auto text-left">
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
            {order
              ?.slice()
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map(
                (
                  {
                    address,
                    customer_id,
                    orderID,
                    amount_paid,
                    status,
                    createdAt,
                  },
                  index
                ) => {
                  const isLast = index === order.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";
                  const dateObject = new Date(createdAt);

                  // Format the date as YYYY-MM-DD
                  const formattedDate = dateObject.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  });

                  return (
                    <tr
                      key={index}
                      className="cursor-pointer hover:bg-greenWhite hover"
                    >
                      <td
                        className={classes}
                        onClick={() => navigate(`/order/${orderID}`)}
                      >
                        <div className="flex items-center gap-3">
                          <Tooltip
                            content={
                              customer_id.first_name +
                              " " +
                              customer_id.last_name
                            }
                          >
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-bold"
                            >
                              {TruncateString({
                                str:
                                  customer_id.first_name +
                                  " " +
                                  customer_id.last_name,
                                num: 10,
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
                          #{orderID}
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
                          &#8358;{amount_paid}
                        </Typography>
                      </td>

                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {address.phone_number}
                        </Typography>
                      </td>

                      <td className={classes}>
                        <div className="w-[6.5rem]">
                          <Chip
                            size="lg"
                            value={status}
                            className="text-center"
                          />
                        </div>
                      </td>
                      <td>
                        {" "}
                        <Tooltip content="changed status">
                          <IconButton
                            variant="text"
                            onClick={() => handleActionClick(orderID)}
                            disabled={status === "Delivered"}
                          >
                            <EllipsisVerticalIcon className="h-6 w-6 text-black" />
                          </IconButton>
                        </Tooltip>
                        {isDropdownVisible && selectedOrderId === orderID && (
                          <div className="relative bg-white border rounded shadow-md p-2 top-0 right-0 z-10">
                            <div
                              className="cursor-pointer hover:bg-gray-100 px-2 py-1"
                              onClick={() =>
                                handleStatusSelect("Processing", orderID)
                              }
                            >
                              Processing
                            </div>
                            <div
                              className="cursor-pointer hover:bg-gray-100 px-2 py-1"
                              onClick={() =>
                                handleStatusSelect("Shipped", orderID)
                              }
                            >
                              Shipped
                            </div>
                            <div
                              className="cursor-pointer hover:bg-gray-100 px-2 py-1"
                              onClick={() =>
                                handleStatusSelect("Delivered", orderID)
                              }
                            >
                              Delivered
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                }
              )}
          </tbody>
        </table>
      </CardBody>
      <Pagination />
    </Card>
  );
}
