const InputComponent = ({type, value, placeholder, setValue, nameKey, error, ...prop}) => {
    return (
        <div className='relative'>
            {value.trim() !== "" && <label className='animate-slide-top absolute top-0 left-2 px-2 bg-[#fff] text-[10px] block text-gray-500'>{placeholder}</label>}
            <input 
                type={type || 'text'} 
                className={`px-4 py-2 rounded-sm border w-full my-2 placeholder:text-sm ${error ? 'border-2 border-red-600' : ''}`}
                value={value}
                placeholder={placeholder}
                onChange={e => setValue(pre => ({...pre, [nameKey]: e.target.value}))}
                {...prop}
            />
        </div>
    )
}

export default InputComponent