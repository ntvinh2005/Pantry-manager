import React, { useEffect, useState } from 'react';
import { db } from '../../utils/firebaseConfig'; 
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';

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
        const docRef = doc(db, 'pantryItems', editingItemId); // Use Firestore document ID
        await updateDoc(docRef, {
          quantity: newQuantity
        });
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

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Pantry Items</h1>
      <ul>
        {pantryItems.map((item) => (
          <li key={item.id} className="border-b py-2">
            <h2 className="text-lg font-semibold">{item.name}</h2>
            <p>
              Quantity: {editingItemId === item.id ? (
                <>
                  <input
                    type="number"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(Number(e.target.value))}
                    className="p-1 border border-gray-300 rounded-md"
                  />
                  <button
                    onClick={handleUpdateQuantity}
                    className="ml-2 p-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Update
                  </button>
                </>
              ) : (
                <>
                  {item.quantity} {item.unit}
                  <button
                    onClick={() => handleQuantityChange(item.id)}
                    className="ml-2 p-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                  >
                    Edit Quantity
                  </button>
                </>
              )}
            </p>
            <p>Expires on: {item.expirationDate}</p>
            {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover mt-2" />}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShowPantryList;
