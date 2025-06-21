import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchCameraById } from "../../../../store/static/cameraSlice";
import { Box } from "@mui/material";
import ReviewForm from "../../product/ReviewForm";
import QuestionAnswer from "../../product/QuestionAnswer";

const CameraDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("specifications");

  const { currentCamera, loading, error } = useSelector((state) => state.cameras);

  const sectionsRef = {
    specifications: useRef(null),
    details: useRef(null),
    qa: useRef(null),
    review: useRef(null),
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchCameraById(id));
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

      {/* Camera Specifications */}
      <section ref={sectionsRef.specifications} className="py-5">
        <h2 className="text-sm md:text-lg font-bold bg-gray-300 w-fit p-1">
          Specifications
        </h2>
        {currentCamera ? (
          <Box className="flex justify-between mt-4">
            <table className="md:w-2xl border-collapse text-sm md:text-lg">
              <tbody>
                <tr className="even:bg-gray-50">
                  <td className="py-2 px-4 font-bold min-w-[150px] text-left border-b">Brand</td>
                  <td className="py-2 px-4 text-left border-b">{currentCamera.brand?.brandname || currentCamera.catagory?.name || "N/A"}</td>
                </tr>
                <tr className="even:bg-gray-50">
                  <td className="py-2 px-4 font-bold min-w-[100px] text-left border-b">Category</td>
                  <td className="py-2 px-4 text-left border-b">{currentCamera.catagory?.name || "Uncategorized"}</td>
                </tr>
                <tr className="even:bg-gray-50">
                  <td className="py-2 px-4 font-bold min-w-[100px] text-left border-b">Item</td>
                  <td className="py-2 px-4 text-left border-b">{currentCamera.productItem?.productitemname || "Camera"}</td>
                </tr>
                <tr className="even:bg-gray-50">
                  <td className="py-2 px-4 font-bold min-w-[100px] text-left border-b">Resolution</td>
                  <td className="py-2 px-4 text-left border-b">{currentCamera.totalpixel || "N/A"}</td>
                </tr>
                <tr className="even:bg-gray-50">
                  <td className="py-2 px-4 font-bold min-w-[100px] text-left border-b">Display Size</td>
                  <td className="py-2 px-4 text-left border-b">{currentCamera.displaysize || "N/A"}</td>
                </tr>
                <tr className="even:bg-gray-50">
                  <td className="py-2 px-4 font-bold min-w-[100px] text-left border-b">Optical Zoom</td>
                  <td className="py-2 px-4 text-left border-b">{currentCamera.opticalzoom || "N/A"}</td>
                </tr>
                <tr className="even:bg-gray-50">
                  <td className="py-2 px-4 font-bold min-w-[100px] text-left border-b">Color</td>
                  <td className="py-2 px-4 text-left border-b">{currentCamera.color || "N/A"}</td>
                </tr>
                <tr className="even:bg-gray-50">
                  <td className="py-2 px-4 font-bold min-w-[100px] text-left border-b">Warranty</td>
                  <td className="py-2 px-4 text-left border-b">{currentCamera.warranty ? `${currentCamera.warranty} Years` : "N/A"}</td>
                </tr>
                {/* <tr className="even:bg-gray-50">
                  <td className="py-2 px-4 font-bold min-w-[100px] text-left border-b">Sensor Type</td>
                  <td className="py-2 px-4 text-left border-b">{currentCamera.sensortype || "N/A"}</td>
                </tr>
                <tr className="even:bg-gray-50">
                  <td className="py-2 px-4 font-bold min-w-[100px] text-left border-b">Battery Type</td>
                  <td className="py-2 px-4 text-left border-b">{currentCamera.batterytype || "N/A"}</td>
                </tr>
                <tr className="even:bg-gray-50">
                  <td className="py-2 px-4 font-bold min-w-[100px] text-left border-b">Video Resolution</td>
                  <td className="py-2 px-4 text-left border-b">{currentCamera.videoresolution || "N/A"}</td>
                </tr>
                <tr className="even:bg-gray-50">
                  <td className="py-2 px-4 font-bold min-w-[100px] text-left border-b">Weight</td>
                  <td className="py-2 px-4 text-left border-b">{currentCamera.weight || "N/A"}</td>
                </tr> */}
              </tbody>
            </table>
          </Box>
        ) : (
          <p>No camera data found.</p>
        )}
      </section>

      {/* Camera Details */}
      <section ref={sectionsRef.details} className="py-6">
        <h2 className="text-md md:text-xl mt-10 font-bold bg-gray-300 w-fit p-1 px-3">
          Details
        </h2>
        <div className="text-sm md:text-lg mt-4">
          {currentCamera?.details || "No details available."}
        </div>
      </section>

      {/* Question and Answer */}
      <section ref={sectionsRef.qa} className="py-6">
        <h2 className="text-md md:text-xl mt-10 font-bold bg-gray-300 w-fit p-1 px-3">
          Question and Answer
        </h2>
        <p className="text-sm md:text-lg">
          Ask a question about this camera.
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

export default CameraDetails;
