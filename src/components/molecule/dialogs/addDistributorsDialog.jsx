import { useEffect, useState } from "react";
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
import axios from "axios";
import { useAddDistributorsMutation } from "../../../services/api";

export function AddDistributorsDialog({ handleOpen, open }) {
  const [formData, setFormData] = useState({
    distributorsName: "",
    city: "",
    address: "",
    contact: 0,
  });
  const [loading, setLoading] = useState(false);
  const [deliveryLoading, setDeliveryLoading] = useState(false);
  const [selectedLga, setSelectedLga] = useState("");
  const [selectedMarket, setSelectedMarket] = useState("");
  const [deliveryPrices, setDeliveryPrices] = useState([]);
  const [addDistributors, { isLoading }] = useAddDistributorsMutation();
  const [markets, setMarkets] = useState([]);

  useEffect(() => {
    let baseUrl = import.meta.env.VITE_BASE_URL;
    // let baseUrl = "http://localhost:3000/";

    axios
      .get(`${baseUrl}pricelist`)
      .then((response) => {
        if (response.data) {
          setDeliveryPrices(response.data.prices);
        }
      })
      .catch((error) => {
        console.error("Error fetching delivery pricelist:", error);
      })
      .finally(() => {
        setDeliveryLoading(false);
      });

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
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    
    // Prevent negative values
    if (name === 'contact') {
      newValue = Math.max(0, parseInt(value));
    }
  
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: newValue,
    }));
  };
  
  
  const handleSelectLga = (newOption) => {
    setSelectedLga(newOption);
  };
  const handleMarket = (newOption) => {
    setSelectedMarket(newOption);
  };


  const handleSubmit = async () => {
    setLoading(true);
    const postDataInfo = {
      name: formData.distributorsName,
      city: selectedLga,
      address: formData.address,
      contact: formData.contact,
      marketId: selectedMarket
    };
    try {
      // Continue with distributors submission
     await addDistributors(postDataInfo).unwrap()
     .then((res) => {
      console.log(res)
      if(!res.error){
        window.location.reload();
          handleOpen(false);
      }else {
        alert(res.error.data.message)
      }
     })
     .catch((err) => console.log(err))
      
    } catch (error) {
      console.error("Error submitting market:", error);
    }
    setLoading(false);
  };
  if (deliveryLoading) {
    return <div>Loading...</div>;
  }
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
              Add Market
            </Typography>
            <div className="flex gap-3 w-full">
              <div className="w-full">
                <Typography variant="h6">Market Name</Typography>
                <Input
                  label="Distributors Name"
                  size="lg"
                  name="distributorsName"
                  value={formData.distributorsName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="w-full flex gap-3 flex-col">
              <div className="text-[#7B7B7B] font-workSans font-semibold">
                <label htmlFor="lga">City*:</label>
              </div>
              <Select
                size="lg"
                label="Select City"
                value={selectedLga}
                onChange={handleSelectLga}
              >
                {deliveryPrices.map((city, index) => (
                  <Option key={index} value={city.city} label={city.city}>
                    {city.city}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="w-full flex gap-3 flex-col">
              <div className="text-[#7B7B7B] font-workSans font-semibold">
                <label htmlFor="lga">Market*:</label>
              </div>
              <Select
                size="lg"
                label="Select Market"
                value={selectedMarket}
                onChange={handleMarket}
              >
                {markets.map((market, index) => (
                  <Option key={index} value={market._id} label={market.name}>
                    {market.name}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="flex gap-3 w-full">
              <div className="w-full">
                <Typography variant="h6">Address</Typography>
                <Input
                  label="Address"
                  size="lg"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex gap-3 w-full">
              <div className="w-full">
                <Typography variant="h6">Contact</Typography>
                <Input
                  label="Contact"
                  size="lg"
                  name="contact"
                  type="number"
                  value={formData.contact}
                  onChange={handleChange}
                />
              </div>
            </div>
            
          </CardBody>
          <Button
            variant="gradient"
            onClick={handleSubmit}
            fullWidth
            disabled={isLoading || loading}
          >
            {isLoading || loading ? "Adding..." : "Add Market"}
          </Button>
        </Card>
      </Dialog>
    </>
  );
}
