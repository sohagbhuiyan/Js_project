import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllContactUs, clearError } from '../../../store/contactUsSlice';

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
    <div className="md:px-6 mb-6 md:mb-2 text-sm sm:text-base text-center md:text-left">
      <h1 className="text-lg font-medium mb-4">Contact Us</h1>

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
        <div className="space-y-1 mb-6">
          {contacts.map((contact) => (
            <div key={contact.id}>
              <p>{contact.address}</p>
              <p>{contact.phonenumbers}</p>
              <p>{contact.email}</p>
              <p>{contact.saturday}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactUs;
