import { useSelector } from 'react-redux';
import CameraViewItem from './CameraViewItem';
import CameraDetails from './CameraDetails';
import RelatedCamera from './RelatedCamera';

const CameraViewPage = () => {
  const { currentCamera } = useSelector((state) => state.cameras);
  const categoryId = currentCamera?.catagory?.id;

  return (
    <div className="flex-1">
      {/* CameraViewItem: Full width on all screens */}
      <div className="w-full">
        <CameraViewItem />
      </div>

      {/* CameraDetails and RelatedCamera: Row on desktop, column on mobile */}
      <div className="flex flex-col md:flex-row">
        {/* CameraDetails: 75% width on desktop, full width on mobile */}
        <div className="w-full md:w-3/4">
          <CameraDetails />
        </div>
        {/* RelatedCamera: 25% width on desktop, full width on mobile */}
        <div className="px-1 w-full md:w-1/4">
          <RelatedCamera categoryId={categoryId} />
        </div>
      </div>
    </div>
  );
};

export default CameraViewPage;
