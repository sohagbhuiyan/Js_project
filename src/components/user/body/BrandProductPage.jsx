import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchProductsByBrand, clearProductsByBrand } from '../../../store/brandSlice';
import { API_BASE_URL } from '../../../store/api';
import CollectionCard from './collection/CollectionCard';


const BrandProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { productsByBrand, loading, error } = useSelector((state) => state.brands);

  useEffect(() => {
    dispatch(fetchProductsByBrand({ id }));
    return () => {
      dispatch(clearProductsByBrand());
    };
  }, [dispatch, id]);

  useEffect(() => {
    console.log('Products by Brand:', productsByBrand); // Debug data
  }, [productsByBrand]);

  if (loading) return <div className="text-center py-4"><span>Loading products...</span></div>;
  if (error) return <div className="text-center text-red-500 py-4">Error: {error}</div>;

  return (
    <div className="py-5 px-3 md:px-10">
      <h2 className="text-md md:text-2xl text-white bg-gray-700 font-semibold mb-4 p-1">
        Top Brand Products
      </h2>
      {productsByBrand.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5 md:gap-6 lg:gap-8 mb-4">
          {productsByBrand.map((product) => {
            const imageUrl = `${API_BASE_URL}/images/${product.imagea}`
            return (
              <CollectionCard  
                key={product.id}
                id={product.id}
                imagea={imageUrl}
                category={product.catagory?.name || 'Uncategorized'}
                product={product.product?.name}
                name={product.name}
                regularprice={product.regularprice}
                specialprice={product.specialprice}
                brandname={product.brand?.brandname}
                title={product.title}
                details={product.details}
                specification={product.specification}
              />
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-500 col-span-full">No products found for this brand</p>
      )}
      <Link to="/brand" className="mt-4 inline-block text-blue-600 hover:underline">
        Back to Brands
      </Link>
    </div>
  );
};

export default BrandProductPage;