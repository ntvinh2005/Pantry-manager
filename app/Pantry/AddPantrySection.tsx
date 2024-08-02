import React, { useState } from 'react';
import Modal from '../Components/Modal';
import PantryForm from './PantryForm'; 

const AddPantrySection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <button onClick={openModal}>Add Pantry Item</button>
      
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <PantryForm />
      </Modal>
    </div>
  );
};

export default AddPantrySection;
