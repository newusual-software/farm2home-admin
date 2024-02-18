import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DefaultLayout from "../layouts/defaultLayout";
import { ImagePlacehoderSkeleton } from "../components/skeleton/imagePlacehoderSkeleton";
import {
  useSingleProductQuery,
  useRelatedProductsQuery,
} from "../services/api";
import DisplayContent from "../components/molecule/displayContent";

export default function ProductDescription() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [formattedDateWithSuffix, setFormattedDateWithSuffix] = useState("");
  const [active, setActive] = useState("");

  const { data: products, isLoading, refetch } = useSingleProductQuery(id);
  let product;
  if (products) {
    product = products.product;
  }

  const { data: relatedProduct, isLoading: relatedLoading } =
    useRelatedProductsQuery(product?.product_cat);

  useEffect(() => {
    if (product && !isLoading && !relatedLoading) {
      const date = new Date(product?.createdAt);

      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
      };

      const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
        date
      );
      setFormattedDateWithSuffix(formattedDate);

      if (relatedProduct?.length !== 0) {
        // Filter out related products based on product_cat
        setRelatedProducts(
          relatedProduct.filter(
            (prod) => prod.product_cat === product.product_cat
          )
        );
      }
    }
  }, [
    product?.product_cat,
    product,
    isLoading,
    relatedProduct,
    relatedLoading,
  ]);

  const handleClick = (index) => {
    navigate(`/product/${index}`);
    refetch();
  };

  return (
    <DefaultLayout>
      {product &&
      !isLoading &&
      Object.keys(product).length !== 0 &&
      relatedProducts.length !== 0 &&
      !relatedLoading ? (
        <div className="py-12">
          <div className="w-[95%] bg-white mx-auto p-6 rounded-lg shadow flex flex-row gap-5">
            <div className="w-[65%] grid gap-4">
              <div className="">
                <img
                  className="h-auto w-full max-w-full rounded-lg object-cover object-center md:h-[480px]"
                  src={active !== "" ? active : product?.product_image}
                  alt={product?.product_name}
                />
              </div>
              <div className="w-full grid grid-cols-3 gap-4">
                {product?.alt_image.slice(0, 3).map((alt_img, index) => (
                  <div key={index}>
                    <img
                      onClick={() => setActive(alt_img)}
                      src={alt_img}
                      className="w-full h-auto rounded-[10px]"
                      alt="gallery-image"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full ">
              <div className="text-mainGreen text-[28px] font-semibold capitalize font-workSans">
                {product?.product_name}
              </div>
              <div className="text-black">
                <span className="text-[32px] font-semibold">
                  &#8358;
                  <span className="font-workSans">
                    {product?.product_price}
                  </span>
                </span>
              </div>
              <div className="w-[584px] text-gray-800 text-base font-normal font-workSans leading-snug tracking-wide">
                brand:{" "}
                <a href="" className="text-mainGreen">
                  {product?.product_brand || "big bull"}
                </a>
              </div>

              <div className=" mt-4 text-[#636363] text-[22px] font-semibold font-workSans">
                Posted by:{" "}
                <span className="text-[#636363] text-base font-normal font-workSans leading-snug tracking-wide">
                  Farm2Home
                </span>
              </div>
              <div className="text-[#636363] text-[22px] font-semibold font-workSans">
                Location:{" "}
                <span className="text-[#636363] text-base font-normal font-workSans leading-snug tracking-wide">
                  Lagos State
                </span>
              </div>
              <div className="text-[#636363] text-[22px] font-semibold font-workSans">
                Available Quantity:{" "}
                <span className="text-[#636363] text-base font-normal font-workSans leading-snug tracking-wide">
                  {product?.product_total}
                </span>
              </div>
              <div className="text-[#636363] text-[22px] font-semibold font-workSans">
                Remaining Quantity:{" "}
                <span className="text-[#636363] text-base font-normal font-workSans leading-snug tracking-wide">
                  {product?.product_total}
                </span>
              </div>
              <div className="text-[#636363] text-[22px] font-semibold font-workSans">
                Posted Date:{" "}
                <span className="text-[#636363] text-base font-normal font-workSans leading-snug tracking-wide">
                  {formattedDateWithSuffix}
                </span>
              </div>
              <div className="text-[#636363] text-[22px] font-semibold font-workSans">
                Category:{" "}
                <span className="text-[#636363] text-base font-normal font-workSans leading-snug tracking-wide">
                  {product?.product_cat} &gt; {product?.product_sub_cat || null}{" "}
                  &gt; {product?.product_sub_sub_cat || null}
                </span>
              </div>

              <div className="mt-2 text-mainGreen text-[22px] font-semibold font-workSans">
                Description:
                <span className="w-[584px] text-gray-800 text-base font-normal font-workSans leading-snug tracking-wide">
                  <DisplayContent htmlContent={product?.product_des} />
                </span>
              </div>
            </div>
          </div>
          <div className="text-black text-[28px] my-5 font-medium font-workSans">
            Related Products
          </div>
          <div className="overflow-x-auto w-full mx-auto">
            <div className="gap-3 flex w-full flex-row">
              {relatedProducts.map((data, index) => (
                <div
                  key={index}
                  className="cursor-pointer"
                  onClick={() => handleClick(data._id)}
                >
                  <img
                    src={data.product_image}
                    className="h-40 w-full max-w-full rounded-lg object-cover object-center"
                    alt="gallery-image"
                  />
                  <div className="px-28"></div>
                  <div className=" text-mainGreen text-[22px] font-medium font-workSans">
                    {data.product_name}
                  </div>
                  <div className="text-black font-semibold leading-snug tracking-wide">
                    &#8358;{" "}
                    <span className="text-[18px] font-workSans">
                      {data.product_price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <ImagePlacehoderSkeleton />
        </div>
      )}
    </DefaultLayout>
  );
}
