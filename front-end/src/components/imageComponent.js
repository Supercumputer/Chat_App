import { useState } from "react"
import { noImg } from "assets/images";

const ImageComponent = ({src, alt='', ...props}) => {
    const [image, setImage] = useState('');

    const handlerError = () => {
        setImage(noImg)
    }

    return (
        <img src={image || src} alt={alt} onError={handlerError} {...props}/>
    )
}

export default ImageComponent