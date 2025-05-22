import ProductDetails from "./ProductDetails";
import ProductView from "./ProductView";
import RelatedProduct from "./RelatedProduct";

const ProductviewPage = () => {
  return (
    <div className="flex-1">
      {/* ProductView: Full width on all screens */}
      <div className="w-full">
        <ProductView />
      </div>

      {/* ProductDetails and RelatedProduct: Row on desktop, column on mobile */}
      <div className="flex flex-col md:flex-row">
        {/* ProductDetails: 75% width on desktop, full width on mobile */}
        <div className="w-full md:w-3/4">
          <ProductDetails />
        </div>
        {/* RelatedProduct: 25% width on desktop, full width on mobile */}
        <div className="w-full md:w-1/3">
          <RelatedProduct />
        </div>
      </div>
    </div>
  );
};

export default ProductviewPage;