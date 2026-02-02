import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaRegHeart } from 'react-icons/fa';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/product/${product.id}`);
    };

    return (
        <article
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-100"
            onClick={handleClick}
            onKeyDown={(e) => e.key === 'Enter' && handleClick()}
            tabIndex={0}
            role="button"
        >
            <div className="relative aspect-square bg-gray-100 overflow-hidden">
                <img
                    src={product.images ? product.images[0] : product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
                <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 transition-colors shadow-sm">
                    <FaRegHeart />
                </button>
            </div>
            <div className="p-4 space-y-2">
                <h3 className="font-medium text-gray-900 truncate">{product.title}</h3>
                <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-gray-900">${product.price}</p>
                    <div className="flex items-center text-sm text-gray-500 gap-1">
                        <FaStar className="text-yellow-400" />
                        <span>{product.rating}</span>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default ProductCard;
