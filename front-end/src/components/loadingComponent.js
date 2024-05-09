import React from 'react';
import ReactLoading from 'react-loading';
 
const LoadingComponent = ({ type, color }) => (
    <div className='w-screen h-screen flex justify-center items-center'>
        <ReactLoading type={type} color={color} height={50} width={50} />
    </div>
);
 
export default LoadingComponent;