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
import { AddDistributorsDialog } from "../dialogs/addDistributorsDialog";
import { useDeleteDistributorMutation } from "../../../services/api";
const Loader = () => {
  return <div>loading...</div>;
};
const TABLE_HEAD = ["Name", "City", "Address", "Contact", "market", ""];

export function DistributorsTable() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [distributors, setDistributors] = useState([]);
  const [deleteDistributorMutation] = useDeleteDistributorMutation();

  let baseUrl = import.meta.env.VITE_BASE_URL
  // let baseUrl = "http://localhost:3000/";
  useEffect(() => {
    axios
      .get(`${baseUrl}marketplace/distributors`)
      .then((response) => {
        console.log(response.data.data);
        if (response.data.data) {
          setDistributors(response.data.data);
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
  const handleDelete = async (_id) => {
    const postData = { id: _id };

    try {
      const response = await deleteDistributorMutation(postData);

      // Trigger a refetch after successful deletion
      if (response.data) {
        const updatedData = await axios.get(
          `${baseUrl}marketplace/distributors`
        );
        setDistributors(updatedData.data.data);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  return (
    <Card className="h-full w-[96%] mx-auto">
      <AddDistributorsDialog open={open} handleOpen={handleOpen} />
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div className="w-full md:w-72">
            <Input
              label="Search"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            />
          </div>
          <div className="flex w-full shrink-0 gap-2 md:w-max">
            <Button
              onClick={handleOpen}
              className="flex items-center gap-3 capitalize bg-mainGreen"
              size="lg"
            >
              <PlusIcon className="h-4 w-4" /> Add distributor
            </Button>
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
              distributors.map((distributor, index) => {
                const isLast = index === distributor.length - 1;
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
                        <Tooltip content={distributor.name}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-bold"
                          >
                            {TruncateString({ str: distributor.name, num: 25 })}
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
                        {distributor.city}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Tooltip content={distributor.address}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {TruncateString({
                            str: distributor.address,
                            num: 24,
                          })}
                        </Typography>
                      </Tooltip>
                    </td>

                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {distributor.contact}
                      </Typography>
                    </td>
                    <td className={classes}>
                      {distributor.markets.map((item, index) => (
                        <Tooltip content={item.address} key={index}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {TruncateString({ str: item.name, num: 24 })}
                          </Typography>
                        </Tooltip>
                      ))}
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
                          onClick={() => handleDelete(distributor._id)}
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
