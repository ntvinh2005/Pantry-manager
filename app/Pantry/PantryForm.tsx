// PantryForm.tsx
import React, { useState, ChangeEvent, FormEvent } from 'react';
import addPantryItem from './addPantry'; 
import Webcam from 'react-webcam'
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
        const item: PantryItem = { name, quantity, unit, expirationDate };

        await addPantryItem(item, image ?? undefined);

        setName('');
        setQuantity(0);
        setUnit('');
        setExpirationDate('');
        setImage(null);
        setImageSrc(null);
        setCameraMode(false);
    };

    const handleCapture = React.useCallback(() => {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (imageSrc) {
        // Convert the imageSrc to a Blob and then to a File
        fetch(imageSrc)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], "captured-image.jpg", { type: blob.type });
            setImage(file);
            setImageSrc(imageSrc);
          });
      }
    }, [webcamRef]);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        setImage(e.target.files[0]);
        setImageSrc(URL.createObjectURL(e.target.files[0]));
      } else {
        setImage(null);
        setImageSrc(null);
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
