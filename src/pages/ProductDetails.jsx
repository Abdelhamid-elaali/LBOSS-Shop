import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaStar, FaArrowLeft, FaHeart } from 'react-icons/fa';
import { selectAllProducts, fetchProducts, selectProductStatus } from '../features/products/productsSlice';
import { addToCart } from '../features/cart/cartSlice';
import Loader from '../components/Loader';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
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
        return <div className="p-8 text-center text-gray-500">Produit introuvable</div>;
    }

    const handleAddToCart = () => {
        dispatch(addToCart(product));
    };

    const images = product.images || [product.image];

    return (
        <main className="bg-slate-50 min-h-screen pb-24 relative">
            {/* Header Icons */}
            <div className="fixed top-0 left-0 right-0 p-6 flex justify-between z-20">
                <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/50 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-800 shadow-sm hover:bg-white transition-colors">
                    <FaArrowLeft />
                </button>
                <button className="w-10 h-10 bg-white/50 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 shadow-sm hover:bg-white transition-colors">
                    <FaHeart />
                </button>
            </div>

            {/* Product Image Area - Full height on mobile to create separation */}
            <div className="h-[45vh] w-full flex items-center justify-center p-8">
                <img
                    src={images[0]}
                    alt={product.title}
                    className="max-h-full max-w-full object-contain filter drop-shadow-xl"
                />
            </div>

            {/* Content Sheet */}
            <div className="bg-white rounded-t-[2.5rem] shadow-2xl -mt-8 relative z-10 p-8 min-h-[50vh] flex flex-col gap-6 animate-slide-up">

                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-1 max-w-[250px] leading-tight">{product.title}</h1>
                        <span className="text-slate-500 text-sm">Chaussures Homme</span>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-primary">${product.price}</p>
                        <div className="flex items-center justify-end gap-1 text-sm text-yellow-400 mt-1">
                            <FaStar />
                            <span className="text-slate-900 font-bold">{product.rating}</span>
                            <span className="text-slate-400 font-normal">({product.reviews?.length || 100} avis)</span>
                        </div>
                    </div>
                </div>

                {/* Color Selection */}
                <div>
                    <span className="font-bold text-slate-900 block mb-3">Couleur</span>
                    <div className="flex gap-4">
                        {['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#6366f1'].map((color, index) => (
                            <div
                                key={color}
                                className={`w-8 h-8 rounded-full cursor-pointer transition-all ${selectedColor === index ? 'ring-2 ring-offset-2 ring-slate-900 scale-110' : 'opacity-70 hover:opacity-100 hover:scale-105'}`}
                                style={{ backgroundColor: color }}
                                onClick={() => setSelectedColor(index)}
                            >
                                {selectedColor === index && (
                                    <div className="w-full h-full flex items-center justify-center text-white text-xs">✓</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Description */}
                <div>
                    <span className="font-bold text-slate-900 block mb-2">Description</span>
                    <p className="text-slate-500 leading-relaxed text-sm">{product.description}</p>
                </div>

                {/* Bottom Action */}
                <div className="mt-auto pt-4">
                    <button
                        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl text-lg shadow-lg shadow-primary/30 active:scale-95 transition-all flex justify-center items-center gap-2"
                        onClick={handleAddToCart}
                    >
                        Ajouter au panier
                    </button>
                </div>
            </div>
        </main>
    );
};

export default ProductDetails;
