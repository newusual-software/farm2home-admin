import {
  Avatar,
  Badge,
  Button,
  Card,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
} from "@material-tailwind/react";
import DefaultLayout from "../layouts/defaultLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import { Analytics } from "../components/analytics/analyticChart";
import { OrderTable } from "../components/molecule/orderTable/orderTable";
// import io from 'socket.io-client';
import { useNavigate } from "react-router-dom";
import { AddCityDialog } from "../components/molecule/dialogs/addCityDialog";

// const socket = io('https://e-commerce-api-eekt.onrender.com');
// console.log(socket)
export default function Dashboard() {
  const [totalCustomer, setTotalCustomer] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalProductSold, setTotalProductSold] = useState(0);
  const [notifications, setNotification] = useState([]);
  const [openCityDialog, setOpenCityDialog] = useState(false);
  const [cityPrice, setCityPrice] = useState([])
  let navigate = useNavigate();

  // useEffect(() => {
  //   // Listen for "notification" event from Socket.IO server
  //   socket.on("notification", (data) => {
  //     console.log(data)
  //     setNotification(data);
  //   });

  //   // Clean up event listener on component unmount
  //   return () => {
  //     socket.off("notification");
  //   };
  // }, [socket]);
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}customers/`)
      .then((response) => {
        if (response.data) {
          setTotalCustomer(response.data.customers.length);
        }
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
    axios
      .get(`${import.meta.env.VITE_BASE_URL}pricelist/`)
      .then((response) => {
        if (response.data) {
         setCityPrice(response.data.prices);
        }
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
    axios
      .get(`${import.meta.env.VITE_BASE_URL}notification/`)
      .then((response) => {
        if (response.data) {
          console.log(response.data);
          setNotification(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
    axios
      .get(`${import.meta.env.VITE_BASE_URL}product/`)
      .then((response) => {
        if (response.data) {
          setTotalProducts(response.data.length);
        }
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });

    axios
      .get(`${import.meta.env.VITE_BASE_URL}order/total/order`)
      .then((response) => {
        if (response.data) {
          setTotalRevenue(response.data.totalRevenue);
        }
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
    axios
      .get(`${import.meta.env.VITE_BASE_URL}order/total/sold`)
      .then((response) => {
        if (response.data) {
          setTotalProductSold(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  }, []);
  const handleOpenCityDialog = () =>
    setOpenCityDialog((prevState) => !prevState);
  const cardDetails = [
    {
      bgColor: "lightGreen",
      iconUrl:
        "https://res.cloudinary.com/phantom1245/image/upload/v1707694723/farm2home/Frame_10122797_dygaxk.png",
      title: "total revenue",
      value: totalRevenue,
    },
    {
      bgColor: "lightOrange",
      iconUrl:
        "https://res.cloudinary.com/phantom1245/image/upload/v1707694710/farm2home/Frame_10122797_1_bvp4li.png",
      title: "Total Customers",
      value: totalCustomer,
    },
    {
      bgColor: "lightPurple",
      iconUrl:
        "https://res.cloudinary.com/phantom1245/image/upload/v1707694702/farm2home/Frame_10122797_2_hy72kn.png",
      title: "Total Products",
      value: totalProducts,
    },
    {
      bgColor: "lightRed",
      iconUrl:
        "https://res.cloudinary.com/phantom1245/image/upload/v1707694753/farm2home/Frame_10122797_3_d5ri4x.png",
      title: "Total Product Sold",
      value: totalProductSold,
    },
  ];

  return (
    <DefaultLayout>
      <AddCityDialog open={openCityDialog} handleOpen={handleOpenCityDialog} />
      <div className="px-3 pt-6 font-medium  my-2">
        <div className="grid grid-cols-4 gap-4">
          {cardDetails.map((items, index) => (
            <div
              key={index}
              className={`w-[16rem] p-3 rounded bg-opacity-70 bg-${items.bgColor}`}
            >
              <div>
                <Avatar src={items.iconUrl} />
              </div>
              <div className="capitalize pt-6 font-workSans pb-1 text-lg">
                {items.title}
              </div>
              <div className="text-2xl font-semibold pb-1">
                {items.title === "total revenue" ? "₦" : ""}
                {items.value}
              </div>
            </div>
          ))}
        </div>
        <div className="capitalize pt-8 font-workSans pb-1 text-lg">
          Analytics
        </div>
        <div className="w-full flex gap-5 justify-between">
          <div className="w-[70%]">
            <Analytics />
          </div>
          <div className="w-[30%]">
            <Badge content={notifications.length}>
              <Button className="bg-mainGreen">Notifications</Button>
            </Badge>
            <Card className="w-full  mt-9 overflow-y-auto h-[20rem] rounded-md">
              <List className="my-2 p-0">
                {notifications
                  ?.slice()
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  ?.map((item, index) => (
                    <div key={index}>
                      <ListItem
                        onClick={() => navigate(`/order/${item.orderId}`)}
                        className="group  rounded-md py-1.5 px-3 text-sm font-normal text-green-gray-700 hover:bg-green-500 hover:text-white focus:bg-green-500 focus:text-white"
                      >
                        <ListItemPrefix>
                          <div className=" uppercase w-[2.5rem] h-[2.5rem] text-white rounded-full bg-mainGreen inline-flex justify-center items-center ">
                            PF
                          </div>
                        </ListItemPrefix>

                        <div className="font-workSans text-md text-mainGreen hover:text-black">
                          {item.full_name}
                          <div className="text-sm text-gray-500">
                            {item.message}
                          </div>
                        </div>
                      </ListItem>
                    </div>
                  ))}
              </List>
            </Card>
          </div>
        </div>
        <div  className="w-full flex gap-5 mt-10 justify-between">
          <div className="w-[75%]">
            <OrderTable />
          </div>
          <div className="w-[30%]">
            <Badge content={cityPrice.length}>
              <Button className="bg-mainGreen" onClick={handleOpenCityDialog}>Add City</Button>
            </Badge>
            <Card className="w-full  mt-9 overflow-y-auto p-4 h-[20rem] rounded-md">
              <List className="my-2 p-0">
                {cityPrice
                  ?.slice()
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  ?.map((item, index) => (
                    <div key={index}>
                      <ListItem
                        className="group  rounded-md py-1.5 px-3 text-sm font-normal text-green-gray-700 hover:bg-green-500 hover:text-white focus:bg-green-500 focus:text-white"
                      >
                        <ListItemPrefix>
                        
                          <div className=" ">
                            {item.city}
                          </div>
                        </ListItemPrefix>
                        <ListItemSuffix>
                        <div className="font-workSans text-md text-mainGreen hover:text-black">
                          {item.estimatePrice}
                        </div>
                        </ListItemSuffix>
                      </ListItem>
                    </div>
                  ))}
              </List>
            </Card>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
