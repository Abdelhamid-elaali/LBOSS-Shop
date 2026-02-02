import React from 'react';

const Loader = () => {
    return (
        <div className="flex justify-center items-center h-40 w-full">
            <div className="w-10 h-10 border-4 border-gray-200 border-l-primary rounded-full animate-spin" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
};

export default Loader;
