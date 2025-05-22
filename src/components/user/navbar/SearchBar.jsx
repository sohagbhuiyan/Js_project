import { AiOutlineSearch } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/collections?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate("/collections"); // Clear search if query is empty
    }
  };

  return (
    <div className="relative bg-white w-full max-w-xs sm:max-w-xs md:max-w-lg lg:max-w-xl rounded-md flex">
      <input
        type="text"
        placeholder="Enter Your Keyword..."
        className="w-full px-2 md:px-6 text-xs md:text-sm sm:px-4 text-black rounded-md outline-none"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />
      <button
        className="p-0.5 md:p-1.5 bg-green-500 hover:bg-green-600 rounded-r-md cursor-pointer"
        onClick={handleSearch}
      >
        <AiOutlineSearch className="text-white text-xl" />
      </button>
    </div>
  );
};

export default SearchBar;
