import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchAllPrinters } from "../../../../store/static/printersSlice";
import { Box } from "@mui/material";
import ReviewForm from "../../product/ReviewForm";
import QuestionAnswer from "../../product/QuestionAnswer";

const PrinterDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("specifications");

  const { printers, loading, error } = useSelector((state) => state.printers);
  const currentPrinter = printers.find(printer => printer.id === parseInt(id));

  const sectionsRef = {
    specifications: [],
    details: "",
    qa: null,
    review: [],
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchAllPrinters());
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

      {/* Printer Specifications */}
      <section ref={sectionsRef.specifications} className="py-5">
        <h2 className="text-sm md:text-lg font-bold bg-gray-300 w-fit p-1">
          Specifications
        </h2>
        {currentPrinter ? (
          <Box className="flex justify-between mt-4">
            <table className="md:w-2xl border-collapse text-sm md:text-lg">
              <tbody>
                <tr className="even:bg-gray-50">
                  <td className="py-2 px-4 font-bold min-w-[150px] text-left border-b">Brand</td>
                  <td className="py-2 px-4 text-left border-b">{currentPrinter.brand?.brandname || currentPrinter.catagory?.name}</td>
                </tr>
                <tr className="even:bg-gray-50">
                  <td className="py-2 px-4 font-bold min-w-[100px] text-left border-b">Category</td>
                  <td className="py-2 px-4 text-left border-b">{currentPrinter.catagory?.name}</td>
                </tr>
                <tr className="even:bg-gray-50">
                  <td className="py-2 px-4 font-bold min-w-[100px] text-left border-b">Item</td>
                  <td className="py-2 px-4 text-left border-b">{currentPrinter.productItem?.productitemname || "items"}</td>
                </tr>
                <tr className="even:bg-gray-50">
                  <td className="py-2 px-4 font-bold min-w-[100px] text-left border-b">Printer Type</td>
                  <td className="py-2 px-4 text-left border-b">{currentPrinter.type}</td>
                </tr>
                <tr className="even:bg-gray-50">
                  <td className="py-2 px-4 font-bold min-w-[100px] text-left border-b">Print Speed</td>
                  <td className="py-2 px-4 text-left border-b">{currentPrinter.printspeed}</td>
                </tr>
                <tr className="even:bg-gray-50">
                  <td className="py-2 px-4 font-bold min-w-[100px] text-left border-b">Print Width</td>
                  <td className="py-2 px-4 text-left border-b">{currentPrinter.printwidth}</td>
                </tr>
                <tr className="even:bg-gray-50">
                  <td className="py-2 px-4 font-bold min-w-[100px] text-left border-b">Print Resolution</td>
                  <td className="py-2 px-4 text-left border-b">{currentPrinter.printresolution}</td>
                </tr>
                <tr className="even:bg-gray-50">
                  <td className="py-2 px-4 font-bold min-w-[100px] text-left border-b">Interfaces</td>
                  <td className="py-2 px-4 text-left border-b">{currentPrinter.interfaces}</td>
                </tr>
                <tr className="even:bg-gray-50">
                  <td className="py-2 px-4 font-bold min-w-[100px] text-left border-b">Body Color</td>
                  <td className="py-2 px-4 text-left border-b">{currentPrinter.bodycolor}</td>
                </tr>
                <tr className="even:bg-gray-50">
                  <td className="py-2 px-4 font-bold text-left border-b">Warranty</td>
                  <td className="py-2 px-4 text-left border-b">{currentPrinter.warranty} Years</td>
                </tr>
              </tbody>
            </table>
          </Box>
        ) : (
          <p>No printer data found.</p>
        )}
      </section>

      {/* Printer Details */}
      <section ref={sectionsRef.details} className="py-6">
        <h2 className="text-md md:text-xl mt-10 font-bold bg-gray-300 w-fit p-1 px-3">
          Details
        </h2>
        <div className="text-sm md:text-lg mt-4">
          {currentPrinter?.details || "No details available."}
        </div>
      </section>

      {/* Question and Answer */}
      <section ref={sectionsRef.qa} className="py-6">
        <h2 className="text-md md:text-xl mt-10 font-bold bg-gray-300 w-fit p-1 px-3">
          Question and Answer
        </h2>
        <p className="text-sm md:text-lg">
          Ask a question about this printer.
        </p>
        <QuestionAnswer />
      </section>

      {/* Review Section */}
      <section ref={sectionsRef.review} className="py-6">
        <h2 className="text-md md:text-xl font-bold mt-10 bg-gray-300 w-fit p-1 px-3">
          Review
        </h2>
        <p className="text-sm md:text-lg">Customer reviews will be shown here.</p>
        <ReviewForm />
      </section>
    </Box>
  );
};

export default PrinterDetails;
