import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchProductDetailsById } from "../../../store/productSlice";
import QuestionAnswer from "./QuestionAnswer";
import ReviewForm from "./ReviewForm";

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

  // // Function to format specification string
  // const formatSpecification = (spec) => {
  //   if (!spec) return "No specifications available.";
  //   const pairs = spec.split(',').map(item => item.trim());
  //   return pairs.map((pair, index) => {
  //     const [key, value] = pair.split(':').map(part => part.trim());
  //     return (
  //       <span key={index}>
  //         <strong>{key}</strong>: {value}
  //         {index < pairs.length - 1 ? ', ' : ''}
  //       </span>
  //     );
  //   });
  // };

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

  return (
    <div className="px-2 md:p-4 md:px-6">
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
          <div className="text-sm md:text-lg space-y-1">
            <p><strong>Title:</strong> {currentProduct.title}</p>
            <p><strong>Model:</strong> {currentProduct.name}</p>
            <p><strong>Category:</strong> {currentProduct.catagory?.name}</p>
            <p><strong>Item:</strong> {currentProduct.productItem?.productitemname || "items"}</p>
            <p><strong>Brand:</strong> {currentProduct.brand?.brandname || currentProduct.catagory?.name}</p>
            <p><strong>Specification:</strong> {currentProduct.specification}</p>
          </div>
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
    </div>
  );
};

export default ProductDetails;