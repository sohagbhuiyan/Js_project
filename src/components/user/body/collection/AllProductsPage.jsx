import ProductHeaderBar from "./ProductHeaderBar";

const AllProductsPage = ({ title, productCount, sortOption, onSortChange, viewType, onViewChange }) => {
  return (
    <div>
      <ProductHeaderBar
        title={title}
        productCount={productCount}
        sortOption={sortOption}
        onSortChange={onSortChange}
        viewType={viewType}
        onViewChange={onViewChange}
      />
    </div>
  );
};

export default AllProductsPage;
