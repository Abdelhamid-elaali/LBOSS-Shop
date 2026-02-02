import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, selectAllProducts, selectProductStatus, selectProductError } from '../features/products/productsSlice';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { FaTshirt, FaMobileAlt, FaHome, FaDumbbell, FaBook, FaHeartbeat, FaLayerGroup, FaSearch } from 'react-icons/fa';

const categoryConfig = {
    'all': { icon: <FaLayerGroup />, color: 'bg-slate-100 text-slate-600', label: 'Tous' },
    'electronique': { icon: <FaMobileAlt />, color: 'bg-blue-100 text-blue-600', label: 'High-Tech' },
    'mode': { icon: <FaTshirt />, color: 'bg-rose-100 text-rose-600', label: 'Mode' },
    'maison-decoration': { icon: <FaHome />, color: 'bg-orange-100 text-orange-600', label: 'Maison' },
    'sport-fitness': { icon: <FaDumbbell />, color: 'bg-emerald-100 text-emerald-600', label: 'Sport' },
    'livres-media': { icon: <FaBook />, color: 'bg-purple-100 text-purple-600', label: 'Média' },
    'beaute-sante': { icon: <FaHeartbeat />, color: 'bg-pink-100 text-pink-600', label: 'Beauté' },
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
        return <div className="text-center p-8 text-red-500">Erreur: {error}</div>;
    }

    const allProducts = productsData.products || [];
    const categories = productsData.categories || [];

    // Filter products
    const filteredProducts = selectedCategory === 'all'
        ? allProducts
        : allProducts.filter(p => p.categoryId === selectedCategory);

    return (
        <main className="container mx-auto px-4 pb-24">
            {/* Search Header - mimicking mobile header from design */}
            <div className="pt-6 pb-6 sticky top-0 z-40 bg-background/95 backdrop-blur-sm -mx-4 px-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Rechercher un produit"
                        className="w-full bg-white rounded-2xl py-3 pl-12 pr-4 shadow-sm border-none focus:ring-2 focus:ring-primary outline-none"
                    />
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                </div>
            </div>

            {/* Hero Banner */}
            <section className="mb-8 rounded-3xl overflow-hidden relative shadow-lg aspect-[2/1] md:aspect-[3/1]">
                <img
                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80"
                    alt="Hero"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center px-8 text-white">
                    <h2 className="text-2xl md:text-4xl font-bold mb-2">Nike Shoes Air Max</h2>
                    <p className="mb-4 opacity-90">Chaussures Homme</p>
                    <button
                        onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
                        className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-6 rounded-xl w-fit transition-colors shadow-lg cursor-pointer active:scale-95 transform"
                    >
                        Acheter
                    </button>
                </div>
            </section>

            {/* Categories */}
            <section className="mb-8">
                <div className="flex justify-between items-center mb-4 px-1">
                    <h3 className="font-bold text-lg text-slate-800">Catégories</h3>
                    <button className="text-primary text-sm font-medium">Voir plus</button>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x -mx-4 px-4">
                    <div
                        className="flex flex-col items-center gap-2 cursor-pointer snap-start"
                        onClick={() => setSelectedCategory('all')}
                    >
                        <div className={`w-16 h-16 flex items-center justify-center rounded-2xl transition-all ${selectedCategory === 'all' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-slate-100 text-slate-500'}`}>
                            <span className="text-2xl"><FaLayerGroup /></span>
                        </div>
                        <span className={`text-xs font-medium ${selectedCategory === 'all' ? 'text-primary' : 'text-slate-500'}`}>Tous</span>
                    </div>

                    {categories.map((cat) => {
                        const config = categoryConfig[cat.slug] || categoryConfig['all'];
                        const isActive = selectedCategory === cat.id;
                        const label = categoryConfig[cat.slug] ? categoryConfig[cat.slug].label : cat.name.split(' ')[0];
                        return (
                            <div
                                key={cat.id}
                                className="flex flex-col items-center gap-2 cursor-pointer snap-start"
                                onClick={() => setSelectedCategory(cat.id)}
                            >
                                <div className={`w-16 h-16 flex items-center justify-center rounded-2xl transition-all ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/30' : config.color}`}>
                                    <span className="text-2xl">{config.icon}</span>
                                </div>
                                <span className={`text-xs font-medium max-w-[4rem] truncate text-center ${isActive ? 'text-primary' : 'text-slate-500'}`}>{label}</span>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Products */}
            <section id="products-section">
                <div className="flex justify-between items-center mb-4 px-1">
                    <h3 className="font-bold text-lg text-slate-800">
                        {selectedCategory === 'all' ? 'Ventes Flash' : (categoryConfig[categories.find(c => c.id === selectedCategory)?.slug]?.label || 'Produits')}
                    </h3>
                    <button className="text-primary text-sm font-medium">Voir plus</button>
                </div>

                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500">Aucun produit trouvé dans cette catégorie.</div>
                )}
            </section>
        </main>
    );
};

export default Home;
