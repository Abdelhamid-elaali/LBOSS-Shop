import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, selectAllProducts, selectProductStatus, selectProductError } from '../features/products/productsSlice';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { FaTshirt, FaMobileAlt, FaHome, FaDumbbell, FaBook, FaHeartbeat, FaLayerGroup } from 'react-icons/fa';

const categoryIcons = {
    'electronique': <FaMobileAlt />,
    'mode': <FaTshirt />,
    'maison-decoration': <FaHome />,
    'sport-fitness': <FaDumbbell />,
    'livres-media': <FaBook />,
    'beaute-sante': <FaHeartbeat />,
};

const Home = () => {
    const dispatch = useDispatch();
    const productsData = useSelector(selectAllProducts);
    const status = useSelector(selectProductStatus);
    const error = useSelector(selectProductError);
    const [selectedCategory, setSelectedCategory] = useState('all');

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

    // Handle data structure
    const allProducts = productsData.products || [];
    const categories = productsData.categories || [];

    // Filter products
    const filteredProducts = selectedCategory === 'all'
        ? allProducts
        : allProducts.filter(p => p.categoryId === selectedCategory);

    return (
        <main className="container mx-auto px-4 py-6 md:py-8 pb-20">
            <section className="mb-8 md:mb-12">
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">Categories</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x -mx-4 px-4 md:mx-0 md:px-0">
                    <div
                        className={`snap-center min-w-[100px] h-[100px] flex flex-col items-center justify-center rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer text-sm font-semibold border flex-shrink-0
                        ${selectedCategory === 'all' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-100 hover:border-primary/50'}`}
                        onClick={() => setSelectedCategory('all')}
                    >
                        <span className="text-2xl mb-2"><FaLayerGroup /></span>
                        <span>All</span>
                    </div>

                    {categories.map((cat) => (
                        <div
                            key={cat.id}
                            className={`snap-center min-w-[100px] h-[100px] flex flex-col items-center justify-center rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer text-sm font-semibold border flex-shrink-0
                            ${selectedCategory === cat.id ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-100 hover:border-primary/50'}`}
                            onClick={() => setSelectedCategory(cat.id)}
                        >
                            <span className="text-2xl mb-2">{categoryIcons[cat.slug] || <FaLayerGroup />}</span>
                            <span>{cat.name}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">
                    {selectedCategory === 'all' ? 'New Arrivals' : categories.find(c => c.id === selectedCategory)?.name || 'Products'}
                </h2>
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500">No products found in this category.</div>
                )}
            </section>
        </main>
    );
};

export default Home;
