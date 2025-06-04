import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllContactUs, clearError } from '../../../store/contactUsSlice';
import { MdCall, MdEmail, MdLocationPin } from "react-icons/md";
import { TbClockHour4 } from "react-icons/tb";

const ContactUs = () => {
  const dispatch = useDispatch();
  const { contacts = [], loading, error } = useSelector((state) => state.contactUs || {});

  useEffect(() => {
    dispatch(getAllContactUs());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  return (
    <div className="md:px-6 mb-1 -mt-3 text-sm sm:text-base text-center md:text-left">
      <h1 className="text-lg font-medium ">Contact Us</h1>
      {error && (
        <div className="text-red-700 bg-red-100 p-2 mb-4 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : contacts.length === 0 ? (
        <div>No contact information available.</div>
      ) : (
        <div className="space-y-1 text-sm px-4 sm:px-0 ">
          {contacts.map((contact) => (
            <div key={contact.id}>
             <span className='flex'><MdLocationPin className='mt-0.5 mr-2'/><p>{contact.address}</p></span>
              <span className='flex'><MdCall className='mt-0.5 mr-2'/><p>{contact.phonenumbers}</p></span>
              <span className='flex'><MdEmail className='mt-0.5 mr-2'/><p>{contact.email}</p></span>
              <span className='flex'><TbClockHour4 className='mt-0.5 mr-2'/><p>{contact.saturday}</p></span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactUs;
