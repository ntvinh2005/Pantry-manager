import { db } from '../../utils/firebaseConfig';
import { doc, deleteDoc } from 'firebase/firestore';

const deletePantry = async (itemId: string) => {
  try {
    const docRef = doc(db, 'pantryItems', itemId);
    await deleteDoc(docRef);
    console.log('Document successfully deleted!');
  } catch (error) {
    console.error('Error deleting document: ', error);
  }
};

export default deletePantry;