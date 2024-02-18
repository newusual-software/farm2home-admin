import {
  Button,
  Dialog,
  Card,
  CardBody,
  Typography,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import {
  // useSingleProductQuery,
  useUpdateProductMutation,
} from "../../../services/api";
import { useAddImageMutation } from "../../../services/cloudinary";
import { agriculturalData } from "../../../data/category";
import axios from "axios";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";

export function UpdateProductForm({ handleOpen, open, productId }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedSubSubcategory, setSelectedSubSubcategory] = useState("");
  const [formData, setFormData] = useState({
    productName: "",
    productBrandName: "",
    productAmount: 0,
    productImage: null,
    productQuantity: 0,
    altImages: [],
  });
  const [addImage] = useAddImageMutation();
  const [updateProduct, { isLoading }] = useUpdateProductMutation();
  const [content, setContent] = useState("");

  const handleEditorChange = (value) => {
    setContent(value);
  };
  useEffect(() => {
    if(productId){
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/product/get/${productId}`)
      .then((response) => {
        if (response) {
          console.log(response.data.product);
          let product = response.data.product
          
      setSelectedCategory(product.product_cat);
      setSelectedSubcategory(product.product_sub_cat);
      setSelectedSubSubcategory(product.product_sub_sub_cat);
      setContent(product.product_des)
      setFormData({
        productName: product.product_name,
        productBrandName: product.product_brand_name,
        productAmount: product.product_price,
        productQuantity: product.product_total,
        altImages: [],
        productImage: null,

      });
        }
      })
      .catch((error) => {
        console.error("Error fetching address book:", error);
      })
    }
  }, [productId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "productImage") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: files[0] || null, // Use null if no file is selected
      }));
    } else if (name.startsWith("altImage")) {
      const altImageIndex = parseInt(name.replace("altImage", ""), 10) - 1;
      const altImagesCopy = [...formData.altImages];
      altImagesCopy[altImageIndex] = files[0] || null; // Use null if no file is selected

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

  const handleSelectCategory = (newOption) => {
    setSelectedCategory(newOption);
    setSelectedSubcategory(""); // Reset subcategory when changing category
    setSelectedSubSubcategory(""); // Reset subsubcategory when changing category
  };

  const handleSelectSubcategory = (newOption) => {
    setSelectedSubcategory(newOption);
    setSelectedSubSubcategory(""); // Reset subsubcategory when changing subcategory
  };

  const handleSelectSubSubcategory = (newOption) => {
    setSelectedSubSubcategory(newOption);
  };

  const handleSubmit = async () => {
    try {
      let mainImageUrl = null;
      let altImageUrls = [];

      // Check if an image is selected
      if (formData.productImage) {
        // Upload the main image to Cloudinary
        const mainImageResponse = await addImage(formData.productImage);

        // The response will contain the URL of the uploaded main image
        mainImageUrl = mainImageResponse.data.secure_url;
      }

      // Upload alt images to Cloudinary if they are selected
      if (formData.altImages.length > 0) {
        altImageUrls = await Promise.all(
          formData.altImages.map(async (altImage) => {
            if (altImage) {
              const altImageResponse = await addImage(altImage);
              return altImageResponse.data.secure_url;
            }
            return null;
          })
        );
      }

      const updateDataInfo = {
        id: productId, // Provide the product ID for the update
      };

      // Add fields to updateDataInfo only if they are changed
      if (formData.productName) {
        updateDataInfo.product_name = formData.productName;
      }

      if (formData.productBrandName) {
        updateDataInfo.product_brand_name = formData.productBrandName;
      }

      if (mainImageUrl) {
        updateDataInfo.product_image = mainImageUrl;
      }

      if (formData.productQuantity) {
        updateDataInfo.product_total = parseInt(formData.productQuantity, 10);
      }

      if (selectedCategory) {
        updateDataInfo.product_cat = selectedCategory;
      }

      if (selectedSubcategory) {
        updateDataInfo.product_sub_cat = selectedSubcategory;
      }

      if (selectedSubSubcategory) {
        updateDataInfo.product_sub_sub_cat = selectedSubSubcategory;
      }

      if (altImageUrls.length > 0) {
        updateDataInfo.alt_image = altImageUrls.filter((url) => url !== null); // Remove null values
      }

      if (content) {
        updateDataInfo.product_des = content;
      }

      if (formData.productAmount) {
        updateDataInfo.product_price = parseFloat(formData.productAmount);
      }

      updateDataInfo.product_rate = 5;
      console.log(updateDataInfo);
      // Update the product
      await updateProduct(updateDataInfo).unwrap();

      window.location.reload();
   
      handleOpen(false);
    } catch (error) {
      console.error("Error submitting product:", error);
    }
  };

  return (
    <>
      <Dialog
        size="lg"
        open={open}
        handler={handleOpen}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-full">
          <CardBody className="flex overflow-y-auto h-[30rem] flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
              Update Product
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
                <Typography variant="h6">Brand Name</Typography>
                <Input
                  label="Brand Name"
                  size="lg"
                  name="productBrandName"
                  value={formData.productBrandName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="-mb-2 flex gap-3 w-full">
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
              <div className="w-full md:w-1/3">
                <Typography variant="h6">Add category</Typography>
                <Select
                  size="lg"
                  label="Select category"
                  value={selectedCategory}
                  onChange={handleSelectCategory}
                >
                  {agriculturalData.map((category, index) => (
                    <Option
                      key={index}
                      value={category.category}
                      label={category.category}
                    >
                      {category.category}
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="w-full md:w-1/3">
                <Typography variant="h6">Choose sub category</Typography>
                <Select
                  size="lg"
                  label="Select sub category"
                  value={selectedSubcategory}
                  onChange={handleSelectSubcategory}
                  disabled={
                    !selectedCategory ||
                    !agriculturalData.find(
                      (category) => category.category === selectedCategory
                    )?.subcategories.length
                  }
                >
                  {selectedCategory &&
                    agriculturalData
                      .find(
                        (category) => category.category === selectedCategory
                      )
                      ?.subcategories.map((subcategory, index) => (
                        <Option
                          key={index}
                          value={subcategory.name}
                          label={subcategory.name}
                        >
                          {subcategory.name}
                        </Option>
                      ))}
                </Select>
              </div>
              <div className="w-full md:w-1/3">
                <Typography variant="h6">Add sub sub category</Typography>
                <Select
                  size="lg"
                  label="Select sub sub category"
                  value={selectedSubSubcategory}
                  onChange={handleSelectSubSubcategory}
                  disabled={
                    !selectedCategory ||
                    !selectedSubcategory ||
                    !agriculturalData
                      .find(
                        (category) => category.category === selectedCategory
                      )
                      ?.subcategories.find(
                        (subcategory) =>
                          subcategory.name === selectedSubcategory
                      )?.subsubcategories.length
                  }
                >
                  {selectedCategory &&
                    selectedSubcategory &&
                    agriculturalData
                      .find(
                        (category) => category.category === selectedCategory
                      )
                      ?.subcategories.find(
                        (subcategory) =>
                          subcategory.name === selectedSubcategory
                      )
                      ?.subsubcategories.map((subsubcategory, index) => (
                        <Option
                          key={index}
                          value={subsubcategory}
                          label={subsubcategory}
                        >
                          {subsubcategory}
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
              <div className="w-full max-w-3xl mx-auto mt-6 mb-20">
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={handleEditorChange}
                  className="h-[15rem]"
                  modules={{
                    toolbar: [
                      [{ header: "1" }, { header: "2" }, { font: [] }],
                      [{ size: [] }],
                      ["bold", "italic", "underline", "strike", "blockquote"],
                      [
                        { list: "ordered" },
                        { list: "bullet" },
                        { indent: "-1" },
                        { indent: "+1" },
                      ],
                      ["link", "image", "video"],
                      ["clean"],
                    ],
                  }}
                />
              </div>          
            </div>
          </CardBody>
          <Button
            variant="gradient"
            onClick={handleSubmit}
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Product"}
          </Button>
        </Card>
      </Dialog>
    </>
  );
}
