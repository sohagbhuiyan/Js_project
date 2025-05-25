import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllMedia } from '../../../store/mediaSlice'; // Adjust path if needed
import { API_BASE_URL } from '../../../store/api'; // Adjust path if needed

const NewsMedia = () => {
  const dispatch = useDispatch();
  const { mediaEntries, loading, error } = useSelector((state) => state.media);

  useEffect(() => {
    dispatch(getAllMedia());
  }, [dispatch]);

  return (
    <div className="p-4">
      <h2 className="text-xl md:text-2xl text-red-700 text-center font-bold mb-6">Latest News Media</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {mediaEntries.length === 0 && !loading && <p>No media available.</p>}

      <div className=" px-4 py-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mediaEntries.map((media) => (
          <div key={media.id} className="border border-blue-300 p-2 rounded shadow">
            <img
              src={`${API_BASE_URL}/images/${media.imagea}`}
              alt="News Media"
              className="w-full h-auto object-cover rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsMedia;
