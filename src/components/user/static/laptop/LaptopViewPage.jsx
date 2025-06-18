import { useSelector } from 'react-redux';
import LaptopViewItem from './laptopViewItem';
import LaptopDetails from './LaptopDetails';
import RelatedLaptop from './RealatedLaptop';


const LaptopViewPage = () => {
  const { currentLaptop } = useSelector((state) => state.laptops);
  const categoryId = currentLaptop?.catagory?.id;

  return (
    <div className="flex-1">
      {/* LaptopView: Full width on all screens */}
      <div className="w-full">
        <LaptopViewItem />
      </div>

      {/* LaptopDetails and RelatedLaptop: Row on desktop, column on mobile */}
      <div className="flex flex-col md:flex-row">
        {/* LaptopDetails: 75% width on desktop, full width on mobile */}
        <div className="w-full md:w-3/4">
          <LaptopDetails />
        </div>
        {/* RelatedLaptop: 25% width on desktop, full width on mobile */}
        <div className="px-1 w-full md:w-1/4">
          <RelatedLaptop categoryId={categoryId} />
        </div>
      </div>
    </div>
  );
};

export default LaptopViewPage;