import { useSelector } from 'react-redux';
import ProductView from './ProductView';
import ProductDetails from './ProductDetails';
import RelatedProduct from './RelatedProduct';

const ProductviewPage = () => {
  const { currentProduct } = useSelector((state) => state.products);
  const categoryId = currentProduct?.catagory?.id || currentProduct?.categoryId;

  return (
    <div className="flex-1">
      {/* ProductView: Full width on all screens */}
      <div className="w-full">
        <ProductView />
      </div>

      {/* ProductDetails and RelatedProduct: Row on desktop, column on mobile */}
      <div className="flex flex-col md:flex-row">
        {/* ProductDetails: 75% width on desktop, full width on mobile */}
        <div className="w-full md:w-4/5">
          <ProductDetails />
        </div>
        {/* RelatedProduct: 25% width on desktop, full width on mobile */}
        <div className=" px-1 w-full md:w-1/3">
          <RelatedProduct categoryId={categoryId} />
        </div>
      </div>
    </div>
  );
};

export default ProductviewPage;