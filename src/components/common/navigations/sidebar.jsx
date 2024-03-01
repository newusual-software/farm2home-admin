import {
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { MapIcon, NewspaperIcon } from "@heroicons/react/24/outline";
 
export function Sidebar() {
  const navigate = useNavigate()

  return (
    <div className=" sticky top-0 left-0 h-screen w-50 min-w-[2.5rem] pt-20 pl-3 shadow-xl flex justify-center items-start shadow-blue-gray-900/5 bg-mainGreen">
      <List>
        <ListItem onClick={() => navigate("/")}  className=" text-white ">
          <ListItemPrefix>
            <PresentationChartBarIcon className="h-5 w-5" />
          </ListItemPrefix>
          Dashboard
        </ListItem>
        <ListItem onClick={() => navigate("/products")}  className=" text-white ">
          <ListItemPrefix>
            <ShoppingBagIcon className="h-5 w-5" />
          </ListItemPrefix>
          Products
        </ListItem>
        <ListItem onClick={() => navigate("/customer")}  className=" text-white ">
          <ListItemPrefix>
            <UsersIcon className="h-5 w-5" />
           </ListItemPrefix>
           Customers         
        </ListItem>
        <ListItem onClick={() => navigate("/order")}  className=" text-white ">
          <ListItemPrefix>
            <ShoppingBagIcon className="h-5 w-5" />
          </ListItemPrefix>
          Orders
        </ListItem>
        <ListItem onClick={() => navigate("/newsletter")}  className=" text-white ">
          <ListItemPrefix>
            <NewspaperIcon className="h-5 w-5" />
          </ListItemPrefix>
          Newsletter
        </ListItem>
        <ListItem onClick={() => navigate("/marketplace")}  className=" text-white ">
          <ListItemPrefix>
            <MapIcon className="h-5 w-5" />
          </ListItemPrefix>
          Markets
        </ListItem>
        <ListItem onClick={() => navigate("/distributors")}  className=" text-white ">
          <ListItemPrefix>
            <UserGroupIcon className="h-5 w-5" />
          </ListItemPrefix>
          Distributors
        </ListItem>
      </List>
    </div>
  );
}