import React, { useEffect, useState } from 'react';
import { db } from '../../utils/firebaseConfig'; 
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import deletePantry from './deletePantry'

interface PantryItem {
  id: string;  
  name: string;
  quantity: number;
  unit: string;
  expirationDate: string;
  imageUrl?: string; 
}

const ShowPantryList: React.FC = () => {
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [newQuantity, setNewQuantity] = useState<number>(0);

  useEffect(() => {
    const fetchPantryItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'pantryItems'));
        const items: PantryItem[] = querySnapshot.docs.map(doc => ({
          id: doc.id, 
          ...doc.data() as Omit<PantryItem, 'id'> 
        }));
        setPantryItems(items);
      } catch (error) {
        console.error("Error fetching pantry items:", error);
      }
    };

    fetchPantryItems();
  }, []);

  const handleQuantityChange = (itemId: string) => {
    setEditingItemId(itemId);
    const item = pantryItems.find(item => item.id === itemId);
    if (item) {
      setNewQuantity(item.quantity);
    }
  };

  const handleUpdateQuantity = async () => {
    if (editingItemId) {
      try {
        const docRef = doc(db, 'pantryItems', editingItemId);
        await updateDoc(docRef, { quantity: newQuantity });
        alert('Quantity updated successfully!');
        setEditingItemId(null);
        
        const updatedItems = pantryItems.map(item => 
          item.id === editingItemId ? { ...item, quantity: newQuantity } : item
        );
        setPantryItems(updatedItems);
      } catch (error) {
        console.error('Error updating quantity:', error);
      }
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      await deletePantry(itemId);
      setPantryItems(pantryItems.filter(item => item.id !== itemId));
      alert('Item deleted successfully!');
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Pantry Items</h1>
      <ul className="space-y-4">
        {pantryItems.map((item) => (
          <li key={item.id} className="border-b pb-4 mb-4 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">{item.name}</h2>
            <div className="flex items-center space-x-4 mb-2">
              {editingItemId === item.id ? (
                <>
                  <input
                    type="number"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(Number(e.target.value))}
                    className="p-2 border border-gray-300 rounded-md w-24 text-gray-900"
                  />
                  <button
                    onClick={handleUpdateQuantity}
                    className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Update
                  </button>
                </>
              ) : (
                <>
                  <span className="text-lg text-gray-800">
                    {item.quantity} {item.unit}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(item.id)}
                    className="p-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                  >
                    Edit Quantity
                  </button>
                </>
              )}
            </div>
            <p className="text-gray-600">Expires on: {item.expirationDate}</p>
            {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover mt-2 rounded" />}
            <button
              onClick={() => handleDelete(item.id)}
              className="mt-4 p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShowPantryList;