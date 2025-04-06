import { useEffect, useState } from "react";
const Test = () => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      const response = await fetch(
        "http://127.0.0.1:3000/preview_image?url=http://localhost:5173/?date=2025-04-04"
      );
      const imageUrl = await response.json(); // Get the blob data
      setImage(imageUrl.image); // Set the blob URL as the image source
      console.log(imageUrl);
    };
    fetchImage();
  }, []);

  return <img src={image} alt="Preview" />;
};
export default Test;
