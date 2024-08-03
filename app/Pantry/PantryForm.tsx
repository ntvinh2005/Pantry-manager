// PantryForm.tsx
import React, { useState, ChangeEvent, FormEvent } from 'react';
import addPantryItem from './addPantry'; 
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

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const item: PantryItem = { name, quantity, unit, expirationDate };

        await addPantryItem(item, image ?? undefined);

        setName('');
        setQuantity(0);
        setUnit('');
        setExpirationDate('');
        setImage(null);
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImage(e.target.files[0]);
        } else {
            setImage(null);
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
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="border-none"
            />
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
