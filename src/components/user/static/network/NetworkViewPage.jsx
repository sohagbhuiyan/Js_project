import { useSelector } from 'react-redux';
import NetworkViewItem from './NetworkViewItem';
import NetworkDetails from './NetworkDetails';
import RelatedNetwork from './RelatedNetwork';

const NetworkViewPage = () => {
  const { currentNetwork } = useSelector((state) => state.networks);
  const categoryId = currentNetwork?.catagory?.id;

  return (
    <div className="flex-1">
      {/* NetworkViewItem: Full width on all screens */}
      <div className="w-full">
        <NetworkViewItem />
      </div>

      {/* NetworkDetails and RelatedNetwork: Row on desktop, column on mobile */}
      <div className="flex flex-col md:flex-row">
        {/* NetworkDetails: 75% width on desktop, full width on mobile */}
        <div className="w-full md:w-3/4">
          <NetworkDetails />
        </div>
        {/* RelatedNetwork: 25% width on desktop, full width on mobile */}
        <div className="px-1 w-full md:w-1/4">
          <RelatedNetwork categoryId={categoryId} />
        </div>
      </div>
    </div>
  );
};

export default NetworkViewPage;
