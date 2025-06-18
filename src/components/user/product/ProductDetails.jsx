import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchProductDetailsById } from "../../../store/productSlice";
import QuestionAnswer from "./QuestionAnswer";
import ReviewForm from "./ReviewForm";
import { Box } from "@mui/material";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("specifications");

  const { currentProduct, loading, error } = useSelector(
    (state) => state.products
  );

  const sectionsRef = {
    specifications: useRef(null),
    details: useRef(null),
    qa: useRef(null),
    review: useRef(null),
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetailsById(id));
    }
  }, [dispatch, id]);

  const handleScroll = (section) => {
    setActiveTab(section);
    if (sectionsRef[section]?.current) {
      sectionsRef[section].current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

  return (
    <Box className="px-2 md:p-4 md:px-6">
      {/* Header Tabs */}
      <div className="flex max-w-full space-x-1 md:space-x-14 rounded-t-md bg-gray-800/80 font-medium text-xs md:text-lg">
        {["specifications", "details", "qa", "review"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 cursor-pointer ${
              activeTab === tab
                ? "border-b-2 border-red-400 text-red-200"
                : "text-gray-100"
            }`}
            onClick={() => handleScroll(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Product Specifications */}
      <section ref={sectionsRef.specifications} className="py-6">
        <h2 className="text-md md:text-xl font-bold bg-gray-300 w-fit p-1">
          Specifications
        </h2>
        {currentProduct ? (
          <Box className="flex justify-between mt-4">
            <table className="md:w-2xl border-collapse text-sm md:text-lg">
              <tbody>
                {/* <tr className="even:bg-gray-50">
                  <td className="py-2 px-4 font-bold min-w-[100px] text-left border-b">Title</td>
                  <td className="py-2 px-4 text-left border-b">{currentProduct.name}</td>
                </tr> */}
                <tr className="even:bg-gray-50">
                  <td className="py-2 px-4 font-bold min-w-[100px] text-left border-b">Model</td>
                  <td className="py-2 px-4 text-left border-b">{currentProduct.name}</td>
                </tr>
                <tr className="even:bg-gray-50">
                  <td className="py-2 px-4 font-bold min-w-[100px] text-left border-b">Category</td>
                  <td className="py-2 px-4 text-left border-b">{currentProduct.catagory?.name}</td>
                </tr>
                <tr className="even:bg-gray-50">
                  <td className="py-2 px-4 font-bold min-w-[100px] text-left border-b">Item</td>
                  <td className="py-2 px-4 text-left border-b">{currentProduct.productItem?.productitemname || "items"}</td>
                </tr>
                <tr className="even:bg-gray-50">
                  <td className="py-2 px-4 font-bold min-w-[100px] text-left border-b">Brand</td>
                  <td className="py-2 px-4 text-left border-b">{currentProduct.brand?.brandname || currentProduct.catagory?.name}</td>
                </tr>
                <tr className="even:bg-gray-50">
                  <td className="py-2 px-4 font-bold min-w-[100px] text-left border-b">Specification</td>
                  <td className="py-2 px-4 text-left border-b">{currentProduct.specification}</td>
                </tr>
              </tbody>
            </table>
          </Box>
        ) : (
          <p>No product data found.</p>
        )}
      </section>

      {/* Product Details */}
      <section ref={sectionsRef.details} className="py-6">
        <h2 className="text-md md:text-xl font-bold bg-gray-300 w-fit p-1 px-3">
          Details
        </h2>
        <div className="text-sm md:text-lg mt-2">
          {currentProduct?.details || "No details available."}
        </div>
      </section>

      {/* Question and Answer */}
      <section ref={sectionsRef.qa} className="py-6">
        <h2 className="text-md md:text-xl font-bold bg-gray-300 w-fit p-1 px-3">
          Question and Answer
        </h2>
        <p className="text-sm md:text-lg">
          Ask a question about this product.
        </p>
        <QuestionAnswer />
      </section>

      {/* Review Section */}
      <section ref={sectionsRef.review} className="py-6">
        <h2 className="text-md md:text-xl font-bold bg-gray-300 w-fit p-1 px-3">
          Review
        </h2>
        <p className="text-sm md:text-lg">Customer reviews will be shown here.</p>
        <ReviewForm />
      </section>
    </Box>
  );
};

export default ProductDetails;
