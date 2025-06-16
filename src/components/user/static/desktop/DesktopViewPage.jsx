import { useSelector } from 'react-redux';
import DesktopViewItem from './DesktopViewItem';
import DesktopDetails from './DesktopDetails';
import RelatedDesktop from './RelatedDesktop';


const DesktopViewPage = () => {
  const { currentDesktop } = useSelector((state) => state.desktops);
  const categoryId = currentDesktop?.catagory?.id;

  return (
    <div className="flex-1">
      {/* DesktopView: Full width on all screens */}
      <div className="w-full">
        <DesktopViewItem />
      </div>

      {/* DesktopDetails and RelatedDesktop: Row on desktop, column on mobile */}
      <div className="flex flex-col md:flex-row">
        {/* DesktopDetails: 75% width on desktop, full width on mobile */}
        <div className="w-full md:w-4/5">
          <DesktopDetails />
        </div>
        {/* RelatedDesktop: 25% width on desktop, full width on mobile */}
        <div className="px-1 w-full md:w-1/3">
          <RelatedDesktop categoryId={categoryId} />
        </div>
      </div>
    </div>
  );
};

export default DesktopViewPage;