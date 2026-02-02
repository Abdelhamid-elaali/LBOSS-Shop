import axiosInstance from '../../api/axiosInstance';

const getProducts = async () => {
    const response = await axiosInstance.get('/');
    return response.data;
};

const productsService = {
    getProducts,
};

export default productsService;
