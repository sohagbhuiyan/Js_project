import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";
import ContactUs from "./ContactUs";

const Footer = () => {
  return (
    <>
      <footer className="bg-black text-white py-6 px-4 md:px-16 pb-1">
        <div className="mx-auto">
          <div className="flex flex-col md:flex-row justify-between md:space-x-10">
            <div className="flex flex-col mb-3 items-center md:items-start">
              <h2 className="text-lg font-semibold">JS COMPUTER</h2>
              <p className="text-xs max-w-56 text-justify">
                <strong>JS Computers</strong> is your trusted online destination for high 
                quality tech products, offering the 
                latest gadgets and computer essentials at unbeatable value. Connect with Us-
              </p>
              <div className="flex gap-3 md:gap-6 mt-2">
                <a href="https://www.facebook.com/jscomputermym" target="_blank" rel="noopener noreferrer">
                  <FaFacebook className="text-xl cursor-pointer hover:text-gray-400" />
                </a>
                <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                  <FaTwitter className="text-xl cursor-pointer hover:text-gray-400" />
                </a>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                  <FaInstagram className="text-xl cursor-pointer hover:text-gray-400" />
                </a>
              </div>
              <Link to="/complaint" className="mt-2">
                <button className="text-xs bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded transition duration-200 cursor-pointer">
                  Submit a Complaint
                </button>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:gap-10 text-xs sm:text-sm text-center sm:text-left pb-5">
              <div className="flex flex-col gap-1 border-l-2 border-gray-400 h-[13rem] px-2">
                <Link to="/about-us">
                  <p className="cursor-pointer hover:text-gray-400">About Us</p>
                </Link>
                <Link to="/news-media">
                  <p className="cursor-pointer hover:text-gray-400">Media</p>
                </Link>
                <Link to="/contact">
                  <p className="cursor-pointer hover:text-gray-400">Contact</p>
                </Link>
                <Link to="/branches">
                  <p className="cursor-pointer hover:text-gray-400"> Branches</p>
                </Link>
                <Link to="/warranty">
                  <p className="cursor-pointer hover:text-gray-400"> Warranty</p>
                </Link>
                 <Link to="/Repair and Services">
                  <p className="cursor-pointer hover:text-gray-400"> Repair and Services</p>
                </Link>
                <Link to="/EMI">
                  <p className="cursor-pointer hover:text-gray-400"> EMI</p>
                </Link>
                <Link to="/Glossary">
                  <p className="cursor-pointer hover:text-gray-400"> Glossary</p>
                </Link>
                <Link to="/Blog">
                  <p className="cursor-pointer hover:text-gray-400"> Blog</p>
                </Link>
                

              </div>
              <div className="flex flex-col gap-1 border-l-2 border-gray-400 h-[15rem] px-2">
                <Link to="/about-ceo">
                  <p className="cursor-pointer hover:text-gray-400">About Our CEO</p>
                </Link>
                <Link to="/specialty">
                  <p className="cursor-pointer hover:text-gray-400">Our Specialty</p>
                </Link>
                <Link to="/service-center">
                  <p className="cursor-pointer hover:text-gray-400">Service Center</p>
                </Link>

                <Link to="/ Order Procedure">
                  <p className="cursor-pointer hover:text-gray-400"> Order Procedure</p>
                </Link>
                <Link to="/Return, Refund & Cancelation">
                  <p className="cursor-pointer hover:text-gray-400">Return, Refund & Cancelation</p>
                </Link>
                <Link to="/Payment Method">
                  <p className="cursor-pointer hover:text-gray-400">Payment Method</p>
                </Link>
                       <Link to="/Cookie Policy">
                  <p className="cursor-pointer hover:text-gray-400"> Cookie Policy</p>
                </Link>
                <Link to="/Terms & Conditions">
                  <p className="cursor-pointer hover:text-gray-400">Terms & Conditions</p>
                </Link>
                <Link to="/Privacy policy">
                  <p className="cursor-pointer hover:text-gray-400">Privacy policy</p>
                </Link>
               <Link to="/ডিজিটাল কমার্স নির্দেশিকা">
                  <p className="cursor-pointer hover:text-gray-400">ডিজিটাল কমার্স নির্দেশিকা</p>
                </Link>



              </div>
            </div>
            <ContactUs />
          </div>
        </div>
      </footer>
      <hr />
      <div className="p-3 mb-13 md:mb-0 bg-gray-900">
        <p className="text-xs md:text-md text-gray-100 text-center">Copyright © 2025 JS Computers. All Rights Reserved</p>
      </div>
    </>
  );
};

export default Footer;