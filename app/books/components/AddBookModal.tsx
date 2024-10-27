import React, { useState } from 'react';
import { addBook } from '../../../lib/api';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookAdded: () => void;  // Changed to just trigger a refresh
}

const AddBookModal: React.FC<AddBookModalProps> = ({ isOpen, onClose, onBookAdded }) => {
  const [bookId, setBookId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsSubmitting(true);
    
    try {
      await addBook(bookId);
      setMessage('Book added successfully');
      setBookId('');
      onBookAdded(); // Trigger parent refresh
      onClose(); // Close modal immediately after success
    } catch (error) {
      setError('Failed to add book: ' + (error as Error).message); // Display error message
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setBookId('');
    setMessage('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h1 className="text-xl text-black font-bold mb-4">Add a New Book</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            placeholder="Enter Book ID"
            required
            disabled={isSubmitting}
            className="text-black border border-gray-300 rounded p-2 w-full mb-4"
          />
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full ${
              isSubmitting ? 'bg-gray-400' : 'bg-green-500 hover:bg-blue-600'
            } text-white py-2 rounded transition`}
          >
            {isSubmitting ? 'Adding...' : 'Add Book'}
          </button>
        </form>
        {message && <p className="text-green-600 mt-2">{message}</p>}
        {error && <p className="text-red-600 mt-2">{error}</p>}
        <button 
          onClick={handleClose} 
          disabled={isSubmitting}
          className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AddBookModal;
