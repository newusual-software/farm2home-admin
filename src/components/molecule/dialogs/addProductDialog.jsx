import {
  Button,
  Dialog,
  Card,
  CardBody,
  Typography,
  Input,
  Select,
  Option,
  Textarea,
} from "@material-tailwind/react";
import { useState } from "react";
import {
  useAddProductMutation,
  useGetCategoryQuery,
} from "../../../services/api";

export function DialogWithForm({ handleOpen, open }) {
  const [selectedCategory, setSelectedCategory] = useState("");

  const [formData, setFormData] = useState({
    productName: "",
    productAmount: 0,
    productImage: null,
    productImageBase64: "", // New state to store base64 image
    productQuantity: 0,
    productDescription: "",
  });
  const [addProduct] = useAddProductMutation();

  // Event handlers for input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const reader = new FileReader();

      reader.onload = (event) => {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: files[0],
          productImageBase64: event.target.result, // Set base64 representation
        }));
      };

      reader.readAsDataURL(files[0]);
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const {
    data: category,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetCategoryQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  } else if (isSuccess) {
    console.log(category.data);
  } else if (isError) {
    console.error(error);
  }

  const handleSelectCategory = (newOption) => {
    setSelectedCategory(newOption);
  };
  const handleSubmit = () => {
    const postDataInfo = {
      product_name: formData.productName,
      product_image: formData.productImageBase64,
      product_total: parseInt(formData.productQuantity, 10),
      product_cat: selectedCategory, // Add the address field
      product_description: formData.productDescription, // Add the state field
      product_price: parseFloat(formData.productAmount), // Add the state field
      product_rate: 5, // Add the state field
    };
                console.log(postDataInfo);

    try {
      addProduct(postDataInfo)
        .then((res) => {
          if (res) {
            console.log(res);
          } else {
            console.error("mor ");

          }
        })
        .catch((error) => console.log(error));
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Dialog
        size="md"
        open={open}
        handler={handleOpen}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-full">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
              Add Product
            </Typography>
            <div className="-mb-2 flex gap-3 w-full">
              <div className="w-1/2">
                <Typography variant="h6">Product Name</Typography>
                <Input
                  label="Name"
                  size="lg"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                />
              </div>
              <div className="w-1/2">
                <Typography variant="h6">Product Amount</Typography>
                <div className="relative">
                  <Input
                    type="number"
                    size="lg"
                    className="py-[.65rem] px-4 ps-9 pe-16 block w-ful border-gray-400 border shadow-sm rounded-lg text-sm "
                    placeholder="0.00"
                    name="productAmount"
                    value={formData.productAmount}
                    onChange={handleChange}
                  />
                  <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4">
                    <span className="text-gray-500">&#8358;</span>
                  </div>
                  <div className="absolute inset-y-0 end-0 flex items-center pointer-events-none z-20 pe-4">
                    <span className="text-gray-500">NGN</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="-mb-2">
              <Typography variant="h6">Product Image</Typography>
              <label htmlFor="file-input-medium" className="sr-only">
                Choose file
              </label>
              <input
                type="file"
                id="file-input-medium"
                className="block w-full border border-gray-400 shadow-sm rounded-lg text-sm file:border-0
                      file:bg-gray-100 file:me-4
                      file:py-3 file:px-4
                  "
                name="productImage"
                onChange={handleChange}
              />
            </div>
            <div className="my-2 flex gap-3 w-full">
              <div className="w-full md:w-1/2">
                <Typography variant="h6">Total Quantity</Typography>
                <Input
                  type="number"
                  label="Quantity"
                  size="lg"
                  name="productQuantity"
                  value={formData.productQuantity}
                  onChange={handleChange}
                />
              </div>
              <div className="w-full md:w-1/2">
                <Typography variant="h6">Add category </Typography>
                <Select
                  size="lg"
                  label="Select category"
                  value={selectedCategory}
                  onChange={handleSelectCategory}
                >
                  {category?.data?.map((category, index) => (
                    <Option
                      key={index}
                      value={category.name}
                      label={category.name}
                    >
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
            <div>
              <Typography variant="h6">Add description </Typography>
              <Textarea
                label="description"
                name="productDescription"
                value={formData.productDescription}
                onChange={handleChange}
              />
            </div>
            <Button variant="gradient" onClick={handleSubmit} fullWidth>
              Add Product
            </Button>
          </CardBody>
        </Card>
      </Dialog>
    </>
  );
}
