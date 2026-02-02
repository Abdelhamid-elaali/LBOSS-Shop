import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, selectAllProducts, selectProductStatus, selectProductError } from '../features/products/productsSlice';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { FaTshirt, FaMale, FaFemale, FaChild, FaMobileAlt } from 'react-icons/fa';

// Static categories for UI demo
const CATEGORIES = [
    { id: 1, name: 'Fashion', icon: <FaTshirt /> },
    { id: 2, name: 'Mens', icon: <FaMale /> },
    { id: 3, name: 'Womens', icon: <FaFemale /> },
    { id: 4, name: 'Kids', icon: <FaChild /> },
    { id: 5, name: 'Electronics', icon: <FaMobileAlt /> },
];

const Home = () => {
    const dispatch = useDispatch();
    const products = useSelector(selectAllProducts);
    const status = useSelector(selectProductStatus);
    const error = useSelector(selectProductError);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchProducts());
        }
    }, [status, dispatch]);

    if (status === 'loading') {
        return <Loader />;
    }

    if (status === 'failed') {
        return <div className="text-center p-8 text-red-500">Error: {error}</div>;
    }

    // Handle case where API response structure might vary
    const productList = products.products || products || [];

    return (
        <main className="container mx-auto px-4 py-6 md:py-8 pb-20">
            <section className="mb-8 md:mb-12">
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">Categories</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x -mx-4 px-4 md:mx-0 md:px-0">
                    {CATEGORIES.map((cat) => (
                        <div key={cat.id} className="snap-center min-w-[100px] h-[100px] flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer text-sm font-semibold text-gray-600 border border-gray-100 flex-shrink-0">
                            <span className="text-2xl mb-2">{cat.icon}</span>
                            <span>{cat.name}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">New Arrivals</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {Array.isArray(productList) && productList.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>
        </main>
    );
};

export default Home;
