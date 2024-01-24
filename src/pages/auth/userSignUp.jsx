import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateAdminMutation } from "../../services/api";
import { addUser } from "../../redux/user";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import AuthLayout from "../../layouts/authLayout";

const UserSignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [ createAdmin, { isLoading } ] = useCreateAdminMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    if (name === "password" || name === "confirmPassword") {
      setFormData((prevFormData) => {
        if (name === "password" && value.length < 6) {
          setPasswordError("Password must be at least 6 characters");
        } else if (
          name === "confirmPassword" &&
          value !== prevFormData.password
        ) {
          setPasswordError("Passwords do not match");
        } else {
          setPasswordError("");
        }
        return prevFormData;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const postDataInfo = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      password: formData.confirmPassword,
      phone_number: formData.phoneNumber,
    };
    // Check if there are any validation errors before submitting the form
    if (passwordError || isLoading) {
      toast.error("Form has validation errors or is loading");
      return;
    }

    
    try {
      createAdmin(postDataInfo)
       .then(res => {
        console.log(res)
         if (res.data) {
          localStorage.setItem('userId', res.data.data._id);
            dispatch(addUser(res.data.data));
            toast.success("Account created successfully")
          } else {
            toast.error("Invalid ");
            return;
          }
       })
       .catch(error => console.log(error))
    } catch(e) {
      console.log(e);
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-xl font-semibold font-workSans mb-4">
        Create an Account
      </h2>
      <form className="bg-white rounded-lg p-8" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-4 md:gap-5">
          <div className=" w-full md:w-1/2">
            <label
              htmlFor="firstName"
              className="text-[#000] mb-2 font-workSans text-md font-semibold"
            >
              First Name:
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
              className="w-full p-2 border-2 mt-2 rounded-lg outline-none border-[#7B7B7B] border-opacity-50 mb-4"
            />
          </div>
          <div className="w-full md:w-1/2">
            <label
              htmlFor="lastName"
              className="text-[#000] mb-2 font-workSans text-md font-semibold"
            >
              Last Name:
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Enter your last name"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-2 border-2 mt-2 rounded-lg outline-none border-[#7B7B7B] border-opacity-50 mb-4"
            />
          </div>
        </div>
        <div className=" gap-4 md:gap-5 pt-2">
          <div className="w-full">
            <label
              htmlFor="email"
              className="text-[#000] font-workSans font-semibold"
            >
              Email Address:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border-2 mt-2 rounded-lg outline-none border-[#7B7B7B] border-opacity-50 mb-4"
            />
          </div>
        </div>
        <div className=" gap-4 md:gap-5 pt-2">
          <div className="w-full">
            <label
              htmlFor="phone number"
              className="text-[#000] font-workSans font-semibold"
            >
              Phone Number:
            </label>
            <input
              type="number"
              id="phone number"
              name="phoneNumber"
              required
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your Phone Number"
              className="w-full p-2 border-2 mt-2 rounded-lg outline-none border-[#7B7B7B] border-opacity-50 mb-4"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:gap-5">
          <div className=" w-full md:w-1/2">
            <label
              htmlFor="Password"
              className="text-[#000] mb-2 font-workSans text-md font-semibold"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your Password"
              className="w-full p-2 border-2 mt-2 rounded-lg outline-none border-[#7B7B7B] border-opacity-50 mb-4"
            />
          </div>
          <div className="w-full md:w-1/2">
            <label
              htmlFor="Confirm Password"
              className="text-[#000] mb-2 font-workSans text-md font-semibold"
            >
              Confirm Password:
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Enter your Confirm Password"
              required
              className="w-full p-2 border-2 mt-2 rounded-lg outline-none border-[#7B7B7B] border-opacity-50 mb-4"
            />
          </div>
          {passwordError && (
            <p className="text-red-500 text-sm">{passwordError}</p>
          )}
        </div>
        <div className="w-full flex items-center  justify-center ">
          <div className=" text-[#000] font-workSans font-normal text-[16px] py-3 w-full">
            By creating an account, you agree to Farm2Home{" "}
            <span>
              <a href="#" className="text-mainGreen">
                Terms & Conditions
              </a>
            </span>
          </div>
        </div>
        <button
          type="submit"
          className="bg-mainGreen w-full text-center text-white py-3 px-5 rounded-md hover:bg-green-600 mt-4"
          disabled={isLoading} // Disable the button while loading
        >
          {isLoading ? "Creating Account..." : "Create an Account"}
        </button>
        <div className="relative flex w-[90%] mx-auto flex-row py-6 ">
          <div className=" w-full inline-flex items-center text-xs align-middle">
            <div className="ms-2 w-full h-px flex-1 bg-gray-200 group-last:hidden dark:bg-gray-700"></div>
          </div>

          <div className="shrink px-3 basis-0 flex-1 group">
            <span className="w-7 h-7 flex justify-center items-center font-medium text-gray-800 rounded-full">
              or
            </span>
          </div>

          <div className=" w-full inline-flex items-center text-xs align-middle">
            <div className=" w-full h-px flex-1 bg-gray-200 group-last:hidden dark:bg-gray-700"></div>
          </div>
        </div>
        <div className=" flex w-full justify-center gap-3 items-center flex-row  ">
          <div>
            <a href="#">
              <img
                className=" w-[3rem]"
                src="https://res.cloudinary.com/phantom1245/image/upload/v1702037705/farm2home/Frame_268_fpbpmd.png"
                alt=""
              />
            </a>
          </div>
          <div>
            <a href="#">
              <img
                className=" w-[3rem]"
                src="https://res.cloudinary.com/phantom1245/image/upload/v1702037689/farm2home/Frame_267_queazd.png"
                alt=""
              />
            </a>
          </div>
        </div>
        <div className="w-full py-4">
          <div className="text-center text-[#000] font-workSans font-normal text-[16px] py-3 w-full">
            Already have an account?{" "}
            <span>
              <a href="/sign-in" className="text-mainGreen">
                Sign In
              </a>
            </span>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
};

export default UserSignUp;