import { db, storage } from '../../utils/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';

interface PantryItem {
    id?: string; 
    name: string;
    quantity: number;
    unit: string;
    expirationDate: string;
    imageUrl?: string; 
    userId: string;
}

const addPantryItem = async (item: Omit<PantryItem, 'id'>, imageFile?: File) => {
    try {
        let imageUrl = '';

        if (imageFile) {
            const imageRef = ref(storage, `images/${imageFile.name}`);
            await uploadBytes(imageRef, imageFile);
            imageUrl = await getDownloadURL(imageRef);
        }

        const docRef = await addDoc(collection(db, 'pantryItems'), {
            ...item,
            imageUrl
        });

        console.log('Document written with ID: ', docRef.id); 

    } catch (e) {
        console.error('Error adding document: ', e);
    }
};

export default addPantryItem;
