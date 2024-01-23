import {
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  Cog6ToothIcon,
  PowerIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
 
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
        <ListItem onClick={() => navigate("/")}  className=" text-white ">
          <ListItemPrefix>
            <ShoppingBagIcon className="h-5 w-5" />
          </ListItemPrefix>
          Products
        </ListItem>
        <ListItem onClick={() => navigate("/customer")}  className=" text-white ">
          <ListItemPrefix>
            <UserGroupIcon className="h-5 w-5" />
           </ListItemPrefix>
           Customers         
        </ListItem>
        <ListItem onClick={() => navigate("/")}  className=" text-white ">
          <ListItemPrefix>
            <ShoppingBagIcon className="h-5 w-5" />
          </ListItemPrefix>
          Orders
        </ListItem>
        <ListItem onClick={() => navigate("/")}  className=" text-white ">
          <ListItemPrefix>
            <Cog6ToothIcon className="h-5 w-5" />
          </ListItemPrefix>
          Settings
        </ListItem>
        <ListItem onClick={() => navigate("/")}  className=" text-white ">
          <ListItemPrefix>
            <PowerIcon className="h-5 w-5" />
          </ListItemPrefix>
          Log Out
        </ListItem>
      </List>
    </div>
  );
}