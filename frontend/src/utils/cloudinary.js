import {Cloudinary} from '@cloudinary/url-gen';

export default new Cloudinary({
    cloud: {
        cloudName: import.meta.env.VITE_REACT_CLOUDINARY_NAME
    }
});