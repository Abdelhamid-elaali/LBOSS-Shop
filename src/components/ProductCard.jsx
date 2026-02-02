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
            className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={handleClick}
            onKeyDown={(e) => e.key === 'Enter' && handleClick()}
            tabIndex={0}
            role="button"
        >
            <div className="relative aspect-[1/1.1] bg-slate-100 overflow-hidden m-2 rounded-2xl">
                <img
                    src={product.images ? product.images[0] : product.image}
                    alt={product.title}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                    loading="lazy"
                />
                <button className="absolute top-3 right-3 p-2 bg-white rounded-full text-slate-400 hover:text-accent transition-colors shadow-sm">
                    <FaRegHeart />
                </button>
            </div>
            <div className="px-4 pb-4 pt-1 space-y-1">
                <h3 className="font-semibold text-slate-900 truncate text-sm">{product.title}</h3>
                <div className="flex items-center justify-between">
                    <p className="text-base font-bold text-primary">${product.price}</p>
                    <div className="flex items-center text-xs text-slate-400 gap-1">
                        <FaStar className="text-yellow-400" />
                        <span>{product.rating}</span>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default ProductCard;
