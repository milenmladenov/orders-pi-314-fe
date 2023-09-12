import React from 'react';
import { Link } from 'react-router-dom'


const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-md shadow-md p-6">
        <p className="mb-4">Потвърждавате ли създаването на поръчката?</p>
        <div className="flex justify-end">
          <button
            className="px-4 py-2 mr-2 text-white bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            
          >
                      Да
            
          </button>
          <button
            className="px-4 py-2 text-gray-500 bg-gray-200 rounded-md shadow-md hover:bg-gray-300"
            onClick={onClose}
          >
            Не
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
