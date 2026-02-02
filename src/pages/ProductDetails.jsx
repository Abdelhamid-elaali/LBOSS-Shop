import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaStar } from 'react-icons/fa';
import { selectAllProducts, fetchProducts, selectProductStatus } from '../features/products/productsSlice';
import { addToCart } from '../features/cart/cartSlice';
import Loader from '../components/Loader';

const ProductDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const products = useSelector(selectAllProducts);
    const status = useSelector(selectProductStatus);
    const [selectedColor, setSelectedColor] = useState(0);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchProducts());
        }
    }, [status, dispatch]);

    if (status === 'loading') {
        return <Loader />;
    }

    const productList = products.products || products || [];
    // Loose comparison as id from params is string
    const product = productList.find((p) => p.id == id);

    if (!product) {
        return <div className="container mx-auto p-8 text-center">Product not found</div>;
    }

    const handleAddToCart = () => {
        dispatch(addToCart(product));
    };

    const images = product.images || [product.image];

    return (
        <main className="container mx-auto px-4 py-8 lg:flex lg:gap-12 max-w-6xl pb-24 lg:pb-8">
            <div className="lg:w-1/2 mb-8 lg:mb-0 bg-white rounded-3xl overflow-hidden aspect-square shadow-sm flex items-center justify-center p-8">
                <img src={images[0]} alt={product.title} className="max-w-full max-h-full object-contain mix-blend-multiply" />
            </div>

            <div className="lg:w-1/2 flex flex-col gap-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <div className="flex text-yellow-400">
                            <FaStar />
                            <span className="text-gray-900 ml-1 font-bold">{product.rating}</span>
                        </div>
                        <span>({product.reviews?.length || 100} reviews)</span>
                    </div>
                </div>

                <p className="text-3xl font-bold text-gray-900">${product.price}</p>

                <div className="space-y-3">
                    <span className="font-semibold text-gray-900">Select Color</span>
                    <div className="flex gap-3">
                        {['#FF5733', '#33FF57', '#3357FF', '#333'].map((color, index) => (
                            <div
                                key={color}
                                className={`w-8 h-8 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-sm ${selectedColor === index ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                                style={{ backgroundColor: color }}
                                onClick={() => setSelectedColor(index)}
                            />
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <span className="font-semibold text-gray-900">Description</span>
                    <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>

                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t md:border-none md:bg-transparent md:static md:p-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:shadow-none">
                    <button
                        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-full text-lg shadow-lg active:scale-95 transition-all"
                        onClick={handleAddToCart}
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </main>
    );
};

export default ProductDetails;
