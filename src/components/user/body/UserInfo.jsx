import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInfo } from '../../../store/infoSlice';

const UserInfo = () => {
  const dispatch = useDispatch();
  const { info, loading, error } = useSelector((state) => state.info);

  useEffect(() => {
    if (!info) {
      dispatch(fetchInfo());
    }
  }, [dispatch, info]);

  if (loading) {
    return (
      <div className="flex justify-center my-4">
        <div className="animate-spin h-8 w-8 border-4 border-t-transparent border-gray-600 rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
        {error}
      </div>
    );
  }

  if (!info) {
    return (
      <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded mb-4 text-sm">
        No service feature info available.
      </div>
    );
  }

  return (
    <div className="flex flex-row justify-around items-center gap-4 p-1 sm:gap-6 px-4 bg-[#c8a071] text-white text-center">
      <div className="text-xs  md:text-sm font-medium">
        {info.emi}
      </div>
      <div className="text-xs  md:text-sm font-medium">
        {info.support}
      </div>
      <div className="text-xs  md:text-sm font-medium">
        {info.payment}
      </div>
      <div className="text-xs  md:text-sm font-medium">
        {info.delivery}
      </div>
    </div>
  );
};

export default UserInfo;
