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
import { useAddImageMutation } from "../../../services/cloudinary";

export function DialogWithForm({ handleOpen, open, refetch }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [formData, setFormData] = useState({
    productName: "",
    productAmount: 0,
    productImage: null,
    productQuantity: 0,
    productDescription: "",
    altImages: [],
  });
  const [addImage] = useAddImageMutation();

  const [addProduct, { isLoading }] = useAddProductMutation();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "productImage") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: files[0],
      }));
    } else if (name.startsWith("altImage")) {
      const altImageIndex = parseInt(name.replace("altImage", ""), 10) - 1;
      const altImagesCopy = [...formData.altImages];
      altImagesCopy[altImageIndex] = files[0];

      setFormData((prevFormData) => ({
        ...prevFormData,
        altImages: altImagesCopy,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const {
    data: category,
    isLoading: loading,
    isError,
    error,
  } = useGetCategoryQuery();

  if(loading){
    return <div>loading...</div>
  } else if (isError) {
    console.error(error);
  }

  const handleSelectCategory = (newOption) => {
    setSelectedCategory(newOption);
  };

  const handleSubmit = async () => {
    try {
      // Check if an image is selected
      if (formData.productImage) {
        // Upload the main image to Cloudinary
        const mainImageResponse = await addImage(formData.productImage);

        // The response will contain the URL of the uploaded main image
        const mainImageUrl = mainImageResponse.data.secure_url;

        if (mainImageUrl) {
          // Upload alt images to Cloudinary
          const altImageUrls = await Promise.all(
            formData.altImages.map(async (altImage) => {
              const altImageResponse = await addImage(altImage);
              return altImageResponse.data.secure_url;
            })
          );

          // Continue with product submission using Cloudinary URLs
          const postDataInfo = {
            product_name: formData.productName,
            product_image: mainImageUrl,
            product_total: parseInt(formData.productQuantity, 10),
            product_cat: selectedCategory,
            alt_image: altImageUrls, // Use alt_images instead of alt_image
            product_des: formData.productDescription,
            product_price: parseFloat(formData.productAmount),
            product_rate: 5,
          };

          // Add the product
          const productResponse = await addProduct(postDataInfo).unwrap();

          console.log(productResponse);
          refetch() 
          handleOpen(false);
        }
      } else {
        // Handle the case where no main image is selected
        console.error("Please select a main image");
      }
    } catch (error) {
      console.error("Error submitting product:", error);
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
            <div className="-mb-2 flex gap-3 w-full">
              {[1, 2, 3].map((index) => (
                <div key={index} className="w-full md:w-2/3">
                  <Typography variant="h6">{`Alt Image${index}`}</Typography>
                  <label
                    htmlFor={`alt-file-input-${index}`}
                    className="sr-only"
                  >
                    Choose file
                  </label>
                  <input
                    type="file"
                    id={`alt-file-input-${index}`}
                    className="block w-full border border-gray-400 shadow-sm rounded-lg text-sm file:border-0
                  file:bg-gray-100 file:me-4
                  file:py-3 file:px-4
                "
                    name={`altImage${index}`}
                    onChange={handleChange}
                  />
                </div>
              ))}
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
            <Button variant="gradient" onClick={handleSubmit} fullWidth disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Product"}
            </Button>
          </CardBody>
        </Card>
      </Dialog>
    </>
  );
}
