import { PencilIcon } from "@heroicons/react/24/solid";
import { TrashIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  IconButton,
  Tooltip,
  Input,
  Checkbox,
  Chip,
} from "@material-tailwind/react";
import { useGetCustomerQuery } from "../../../services/api";
import Pagination from "../pagination/pagination";

const TABLE_HEAD = [
  "Select User",
  "Full Name",
  "Created On",
  "Email Address",
  "Phone Number",
  "Status",
  "",
];

export function CustomerTable() {
  const {
    data: customer,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetCustomerQuery();
  const online = true;
  //   const [deleteProductMutation] = useDeleteProductMutation();
  // console.log(product, isLoading, isSuccess, isError, error)
  console.log(customer?.customers);
  if (isLoading) {
    return <div>Loading...</div>;
  } else if (isSuccess) {
    // console.log(product);
  } else if (isError) {
    console.error(error);
  }

  //   const handleDelete = async (_id) => {
  //     const postData = { id: _id };

  //     try {
  //       await deleteProductMutation(postData);

  //       // Trigger a refetch after successful deletion
  //       refetch();
  //     } catch (error) {
  //       console.error("Error deleting product:", error);
  //     }
  //   };
  return (
    <Card className="h-full w-[96%] mx-auto">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div className="w-full md:w-72">
            <Input
              label="Search"
              icon={<UserGroupIcon className="h-5 w-5" />}
            />
          </div>
          <div className="flex w-full shrink-0 gap-2 md:w-max">
            <Button
              className="px-8 shadow-sm py-3 bg-transparent text-black rounded-[10px] border border-[#7B7B7B] justify-center items-center gap-2 inline-flex"
              size="lg"
            >
              All Users
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
            {customer?.customers?.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(
              (
                { first_name, last_name, email, phone_number, createdAt },
                index
              ) => {
                const isLast = index === customer.length - 1;
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
                const handleRowClick = () => {
                    // Find the checkbox element in the same row and toggle its checked state
                    const checkbox = document.getElementById(`checkbox-${index}`);
                    if (checkbox) {
                      checkbox.checked = !checkbox.checked;
                    }
                  };
                return (
                  <tr
                    key={index}
                    className="cursor-pointer hover:bg-greenWhite hover"
                    onClick={handleRowClick}
                  >
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <Checkbox ripple={true}  id={`checkbox-${index}`} />
                      </div>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {first_name} {last_name}
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
                        {email}
                      </Typography>
                    </td>

                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {phone_number}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <div className="w-max">
                        <Chip
                          variant="ghost"
                          size="sm"
                          value={online ? "online" : "offline"}
                          color={online ? "green" : "blue-gray"}
                        />
                      </div>
                    </td>
                    <td className={classes}>
                      <Tooltip content="Edit product">
                        <IconButton variant="text">
                          <PencilIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip content="Delete product">
                        <IconButton variant="text">
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
      <div className="flex w-full mb-10 mt-5 shrink-0 gap-2 md:w-max">
            <Button
              className="px-8 shadow-sm py-3 bg-mainGreen text-white rounded-[10px] border border-[#7B7B7B] justify-center items-center gap-2 inline-flex"
              size="lg"
            >
              send sms
            </Button>
            <Button
              className="px-8 shadow-sm py-3 bg-transparent text-mainGreen rounded-[10px] border border-mainGreen justify-center items-center gap-2 inline-flex"
              size="lg"
            >
             send email
            </Button>
          </div>
    </Card>
  );
}
