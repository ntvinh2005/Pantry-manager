import React, { useState } from 'react';
import Modal from '../Components/Modal';
import PantryForm from './PantryForm'; 

const AddPantrySection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <button
        onClick={openModal}
        className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 transition duration-150 ease-in-out"
      >
        Add Pantry Item
      </button>
      
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <PantryForm />
      </Modal>
    </div>
  );
};

export default AddPantrySection;
