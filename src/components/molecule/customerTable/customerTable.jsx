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
import { useDeleteCustomerMutation, useGetCustomerQuery } from "../../../services/api";
import Pagination from "../pagination/pagination";
import { useState } from "react";
// import twilio from "twilio";

const TABLE_HEAD = [
  "Select User",
  "Full Name",
  "Created On",
  "Email Address",
  "Phone Number",
  "Role",
  "",
];

export function CustomerTable() {
  const {
    data: customer,
    isLoading,
    isSuccess,
    isError,
    error,
    refetch
  } = useGetCustomerQuery();
  const [deleteCustomerMutation] = useDeleteCustomerMutation();

  const [selectedEmails, setSelectedEmails] = useState([]);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState([]);

  const handleCheckboxChange = (email, phone_number) => {
    setSelectedEmails((prevSelectedEmails) => {
      if (prevSelectedEmails.includes(email)) {
        // Remove the email if it's already selected
        return prevSelectedEmails.filter(
          (selectedEmail) => selectedEmail !== email
        );
      } else {
        // Add the email if it's not selected
        return [...prevSelectedEmails, email];
      }
    });

    setSelectedPhoneNumber((prevSelectedPhoneNUmber) => {
      if (prevSelectedPhoneNUmber.includes(phone_number)) {
        // Remove the email if it's already selected
        return prevSelectedPhoneNUmber.filter(
          (selectedPhoneNumber) => selectedPhoneNumber !== phone_number
        );
      } else {
        // Add the phone_number if it's not selected
        return [...prevSelectedPhoneNUmber, phone_number];
      }
    });
  };

  const handleSendEmail = () => {
    if (selectedEmails.length > 0) {
      console.log("Selected Emails:", selectedEmails);
  
      // Create a mailto link with pre-filled recipients
      const mailtoLink = `mailto:${selectedEmails.join(',')}`;
  
      // Open the link in a new window or tab
      window.open(mailtoLink, '_blank');
    } else {
      console.log("No emails selected");
    }
  };
  const handleSendMessage = () => {
    if (selectedEmails.length > 0) {
      console.log("Selected Emails:", selectedEmails);
  
      // Create a mailto link with pre-filled recipients
      const mailtoLink = `mailto:${selectedEmails.join(',')}`;
  
      // Open the link in a new window or tab
      window.open(mailtoLink, '_blank');
    } else {
      console.log("No emails selected");
    }
  };

  const handleDelete = async (customerId) => {
    console.log(customerId)
    try {
      const result = await deleteCustomerMutation(customerId);
      if(result.data.message === "Customer deleted successfully"){
        refetch()
      }else{
        console.log(result);
      }
    } catch (error) {
      // Handle errors
      console.error(error);
    }
  };
  if (isLoading) {
    return <div>Loading...</div>;
  } else if (isSuccess) {
    // console.log(product);
  } else if (isError) {
    console.error(error);
  }


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
              onClick={() => refetch()}
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
          {customer?.customers !== undefined ? (
            <tbody>
              {customer?.customers
                ?.slice()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map(
                  (
                    {
                      _id,
                      first_name,
                      last_name,
                      email,
                      phone_number,
                      createdAt,
                      role,
                    },
                    index
                  ) => {
                    const isLast = index === customer.length - 1;
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
                            <Checkbox
                              ripple={true}
                              checked={(selectedEmails.includes(email),
                                        selectedPhoneNumber.includes(phone_number))}
                              onChange={() => handleCheckboxChange(email, phone_number)}
                            />
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
                              value={role === 5000 ? "admin" : "user"}
                              color={role === 5000 ? "green" : "blue-gray"}
                            />
                          </div>
                        </td>
                        <td className={classes}>
                          <Tooltip content="Delete User">
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
          ) : (
            <div className="py-14 flex justify-center w-full text-center items-center text-3xl">
              No customer to display
            </div>
          )}
        </table>
      </CardBody>
      <Pagination />
      <div className="flex w-full mb-10 mt-5 shrink-0 gap-2 md:w-max">
        <Button
          className="px-8 shadow-sm py-3 bg-mainGreen text-white rounded-[10px] border border-[#7B7B7B] justify-center items-center gap-2 inline-flex"
          size="lg"
          onClick={handleSendMessage}
          disabled
        >
          send sms
        </Button>
        <Button
          className="px-8 shadow-sm py-3 bg-transparent text-mainGreen rounded-[10px] border border-mainGreen justify-center items-center gap-2 inline-flex"
          size="lg"
          onClick={handleSendEmail}
        >
          send email
        </Button>
      </div>
    </Card>
  );
}
