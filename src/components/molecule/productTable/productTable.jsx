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
  Avatar,
} from "@material-tailwind/react";
import { useGetProductQuery, useDeleteProductMutation } from "../../../services/api";
import { DialogWithForm } from "../dialogs/addProductDialog";
import { useState } from "react";
import Pagination from "../pagination/pagination";
const TABLE_HEAD = [
  "Name",
  "Price",
  "Date",
  "Total Quantity",
  "Rem.Quantity",
  "category",
  "",
];

export function ProductTable() {
  const [open, setOpen] = useState(false);

  const {
    data: product,
    isLoading,
    isSuccess,
    isError,
    error,
    refetch,
  } = useGetProductQuery();
  const [deleteProductMutation] = useDeleteProductMutation();
  // console.log(product, isLoading, isSuccess, isError, error)

  if (isLoading) {
    return <div>Loading...</div>;
  } else if (isSuccess) {
    // console.log(product);
  } else if (isError) {
    console.error(error);
  }

  const handleOpen = () => setOpen((cur) => !cur);

  const handleDelete = async (_id) => {
    const postData = { id: _id };
  
    try {
      await deleteProductMutation(postData);
  
      // Trigger a refetch after successful deletion
      refetch();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  return (
    <Card className="h-full w-[96%] mx-auto">
      <DialogWithForm open={open} handleOpen={handleOpen} refetch={refetch} />
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
              <PlusIcon className="h-4 w-4" /> Add product
            </Button>
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
            {product.map(
              (
                {
                  _id,
                  product_cat,
                  product_image,
                  product_price,
                  product_name,
                  product_total,
                  createdAt,
                },
                index
              ) => {
                const isLast = index === product.length - 1;
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
                  <tr key={index}>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={product_image}
                          alt={product_name}
                          size="md"
                          className="border border-blue-gray-50 bg-blue-gray-50/50"
                        />
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold"
                        >
                          {product_name}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        &#8358;{product_price}
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
                        {product_total}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {product_total}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {product_cat}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Tooltip content="Edit product">
                        <IconButton variant="text">
                          <PencilIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip content="Delete product">
                        <IconButton variant="text" onClick={() => handleDelete(_id)}>
                          <TrashIcon className="h-4 w-4 text-red-900" />
                        </IconButton>
                      </Tooltip>
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
