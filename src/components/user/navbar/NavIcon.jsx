// components/navigation/NavIcon.jsx
const NavIcon = ({ icon: Icon, label, onClick, count = 0, isMobile = false, isUserIcon = false }) => (
    <div className={`relative ${isMobile ? "flex flex-col items-center" : ""}`}>
      <div
        className={`flex items-center cursor-pointer ${isMobile ? "flex-col" : ""}`}
        onClick={onClick}
      >
        <div className="flex flex-col justify-around items-center">
          <Icon className={isMobile ? "text-lg" : "text-lg hover:text-gray-300"} />
          {count > 0 && !isUserIcon && (
            <span className={`absolute ${isMobile ? "-top-2 -right-2" : "-top-4 -right-3"} bg-red-500 text-white text-xs p-1 rounded-full`}>
              {count}
            </span>
          )}
        </div>
        {isMobile && <span className="text-xs mt-1">{label}</span>}
      </div>
    </div>
  );
  export default NavIcon;   
  