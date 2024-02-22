import { PencilIcon, PlusIcon } from "@heroicons/react/24/solid";
import { MagnifyingGlassIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  IconButton,
  Tooltip,
  Input,
} from "@material-tailwind/react";
import { useState } from "react";
import Pagination from "../pagination/pagination";
import { TruncateString } from "../../../lib/util/truncateString";
import { useEffect } from "react";
import axios from "axios";
import { AddMarketDialog } from "../dialogs/addMarketDialog";
import { useDeleteMarketMutation } from "../../../services/api";
import { AddCityDialog } from "../dialogs/addCityDialog";
const Loader = () => {
  return <div>loading...</div>;
};
const TABLE_HEAD = [
  "Name",
  "City",
  "Address",
  "Opening Hours",
  "no of distributors",
  "",
];

export function MarketTable() {
  const [open, setOpen] = useState(false);
  const [openCityDialog, setOpenCityDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [markets, setMarkets] = useState([]);
  const [deleteMarket] = useDeleteMarketMutation();
  let baseUrl = import.meta.env.VITE_BASE_URL;
  // let baseUrl = "http://localhost:3000/";
  useEffect(() => {
    axios
      .get(`${baseUrl}marketplace/market`)
      .then((response) => {
        if (response.data.success === true) {
          setMarkets(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching product", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [baseUrl]);
  const handleOpen = () => setOpen((cur) => !cur);
  const handleOpenCityDialog = () =>
    setOpenCityDialog((prevState) => !prevState);

  const handleDelete = async (_id) => {
    const postData = { id: _id };

    try {
      const response = await deleteMarket(postData);

      // Trigger a refetch after successful deletion
      if (response.data) {
        const updatedData = await axios.get(`${baseUrl}marketplace/market`);
        setMarkets(updatedData.data.data);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  return (
    <Card className="h-full w-[96%] mx-auto">
      <AddMarketDialog open={open} handleOpen={handleOpen} />
      <AddCityDialog open={openCityDialog} handleOpen={handleOpenCityDialog} />
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div className="w-full md:w-72">
            <Input
              label="Search"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            />
          </div>
          <div className="flex w-full shrink-0 gap-2 md:w-max">
            <div>
              <Button
                onClick={handleOpen}
                className="flex items-center gap-3 capitalize bg-mainGreen"
                size="lg"
              >
                <PlusIcon className="h-4 w-4" /> Add market
              </Button>
            </div>
            <div>
              <Button
                onClick={handleOpenCityDialog}
                className="flex items-center gap-3 capitalize bg-mainGreen"
                size="lg"
              >
                <PlusIcon className="h-4 w-4" /> Add City
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardBody className=" px-1">
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
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  <Loader />
                </td>
              </tr>
            ) : (
              markets.map((market, index) => {
                const isLast = index === market.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr
                    key={index}
                    className="cursor-pointer hover:bg-greenWhite hover"
                  >
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <Tooltip content={market.name}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-bold"
                          >
                            {TruncateString({ str: market.name, num: 25 })}
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
                        {market.city}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Tooltip content={market.address}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {TruncateString({ str: market.address, num: 24 })}
                        </Typography>
                      </Tooltip>
                    </td>
                    <td className={classes}>
                      <ul className="list-disc list-inside">
                        {market.openingHours.map((hour, index) => (
                          <Tooltip
                            key={index}
                            content={`${hour.open} - ${hour.close}`}
                          >
                            <li>{hour.day}</li>
                          </Tooltip>
                        ))}
                      </ul>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {market.distributors.length}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Tooltip content="Edit product">
                        <IconButton variant="text">
                          <PencilIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip content="Delete product">
                        <IconButton
                          variant="text"
                          onClick={() => handleDelete(market._id)}
                        >
                          <TrashIcon className="h-4 w-4 text-red-900" />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </CardBody>
      <Pagination />
    </Card>
  );
}
