import React, { useState, ChangeEvent, FormEvent } from 'react';
import addPantryItem from './addPantry';
import Webcam from 'react-webcam';
import axios from 'axios';
import { uploadImage } from '../../utils/firebaseConfig'; // Adjust the import path
import './PantryForm.css';

interface PantryItem {
  name: string;
  quantity: number;
  unit: string;
  expirationDate: string;
  imageUrl?: string;
}

const PantryForm: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(0);
  const [unit, setUnit] = useState<string>('');
  const [expirationDate, setExpirationDate] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [cameraMode, setCameraMode] = useState<boolean>(false);
  const webcamRef = React.useRef<Webcam>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    // Upload image if it exists
    let imageUrl: string | undefined;
    if (image) {
      try {
        imageUrl = await uploadImage(image);
      } catch (error) {
        console.error('Error uploading image:', error);
        return; // Abort submission if the image upload fails
      }
    }
  
    // Prepare the item with the image URL if available
    const item: PantryItem = {
      name,
      quantity,
      unit,
      expirationDate,
      imageUrl // Include the image URL if available
    };
  
    try {
      // Handle the image file conditionally
      await addPantryItem(item, image || undefined); // Pass 'undefined' if image is null
      // Clear form fields after successful submission
      setName('');
      setQuantity(0);
      setUnit('');
      setExpirationDate('');
      setImage(null);
      setImageSrc(null);
      setCameraMode(false);
    } catch (error) {
      console.error('Error adding pantry item:', error);
    }
  };
  

  const handleCapture = React.useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      const blob = await fetch(imageSrc).then(res => res.blob());
      const file = new File([blob], "captured-image.jpg", { type: blob.type });
      setImage(file);
      setImageSrc(imageSrc);
      
      // Upload the image and get the URL
      try {
        const imageUrl = await uploadImage(file);
        analyzeImage(imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  }, [webcamRef]);
  
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage(file);
      const imageUrl = URL.createObjectURL(file);
      setImageSrc(imageUrl);
      
      // Upload the image and get the URL
      try {
        const url = await uploadImage(file);
        analyzeImage(url);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    } else {
      setImage(null);
      setImageSrc(null);
    }
  };

  const analyzeImage = async (imageUrl: string) => {
    try {
      const response = await axios.post('/api/analyzeImage', { imageUrl });
      const { description } = response.data;
      console.log(response.data)
    
      setName(description || 'Unknown object');
    } catch (error) {
      console.error('Error analyzing image:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Item name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="p-2 border border-gray-300 rounded-md bg-white text-gray-800"
        required
      />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="p-2 border border-gray-300 rounded-md bg-white text-gray-800"
        required
      />
      <input
        type="text"
        placeholder="Unit"
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
        className="p-2 border border-gray-300 rounded-md bg-white text-gray-800"
        required
      />
      <input
        type="date"
        value={expirationDate}
        onChange={(e) => setExpirationDate(e.target.value)}
        className="p-2 border border-gray-300 rounded-md bg-white text-gray-800"
        required
      />
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setCameraMode(!cameraMode)}
          className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {cameraMode ? 'Use File Input' : 'Use Camera'}
        </button>
        {cameraMode ? (
          <div className="relative">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width="100%"
            />
            <button
              type="button"
              onClick={handleCapture}
              className="absolute bottom-2 left-2 p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Capture
            </button>
          </div>
        ) : (
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="border-none"
          />
        )}
      </div>
      {imageSrc && <img src={imageSrc} alt="Preview" className="w-24 h-24 object-cover mt-2" />}
      <button
        type="submit"
        className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
      >
        Add Item
      </button>
    </form>
  );
};

export default PantryForm;
