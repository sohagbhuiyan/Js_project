import { useSelector } from 'react-redux';
import PrinterViewItem from './PrinterViewItem';
import PrinterDetails from './PrinterDetails';
import RelatedPrinter from './RelatedPrinter';

const PrinterViewPage = () => {
  const { currentPrinter } = useSelector((state) => state.printers);
  const categoryId = currentPrinter?.catagory?.id;

  return (
    <div className="flex-1">
      {/* PrinterViewItem: Full width on all screens */}
      <div className="w-full">
        <PrinterViewItem />
      </div>

      {/* PrinterDetails and RelatedPrinter: Row on desktop, column on mobile */}
      <div className="flex flex-col md:flex-row">
        {/* PrinterDetails: 75% width on desktop, full width on mobile */}
        <div className="w-full md:w-3/4">
          <PrinterDetails />
        </div>
        {/* RelatedPrinter: 25% width on desktop, full width on mobile */}
        <div className="px-1 w-full md:w-1/4">
          <RelatedPrinter categoryId={categoryId} />
        </div>
      </div>
    </div>
  );
};

export default PrinterViewPage;
