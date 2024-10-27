'use client';

import React, { useState } from 'react';
import { getBooks , deleteBook} from '../../lib/api';
import AddBookModal from './components/AddBookModal'; 
import AnalysisModal from './components/AnalysisModal';

interface BookMetadata {
  title: string;
  publisher: string;
  [key: string]: any; // For any additional metadata fields
}

interface Book {
  id: string;  // Changed to string to match FastAPI schema
  book_metadata: BookMetadata;  // This will already be an object, not a string
}

const BooksPage = () => {
    const [books, setBooks] = React.useState<Book[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
    const [selectedBookId, setSelectedBookId] = useState<string | null>(null);


  React.useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksData = await getBooks();
        setBooks(booksData);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError('Failed to fetch books. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  
  const handleAnalyzeBookClick = (bookId: string) => {
    setSelectedBookId(bookId);
    setIsAnalysisModalOpen(true);
  };
  const handleDeleteBook = async (bookId: string) => {
    try {
      await deleteBook(bookId);
      // Update the books state by filtering out the deleted book
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Failed to delete book. Please try again.');
    }
  };

  const fetchBooks = async () => {
    try {
      const booksData = await getBooks();
      setBooks(booksData);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('Failed to fetch books. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBooks();
  }, []);


  const handleAddBookClick = () => {
    setIsModalOpen(true); // Open the modal when button is clicked
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  const renderMetadataValue = (key: string, value: any) => {
    if (value === null) return <span className="text-gray-400">-</span>;

    // Check for 'author_webpage' and render a link if it exists
    if (key === 'author_webpage' && typeof value === 'string') {
      return (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
          Wikipedia
        </a>
      );
    }

    if (typeof value === 'object') {
      return (
        <pre className="bg-gray-100 p-2 rounded text-sm whitespace-pre-wrap">
          {JSON.stringify(value, null, 2)}
        </pre>
      );
    }

    if (typeof value === 'boolean') {
      return <span className="text-gray-700">{value ? 'Yes' : 'No'}</span>;
    }

    return <span className="text-gray-700">{String(value)}</span>;
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-gray-500">Loading books...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-100 border border-red-200 rounded p-4 mt-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Books Library</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <div
            key={book.id}
            className="border rounded-lg shadow-lg p-6 bg-white hover:shadow-xl transition-shadow"
          >
            <h2 className="text-xl text-black font-semibold mb-2">
              {book.book_metadata.title || 'Untitled Book'}
            </h2>
            <p className="text-sm text-gray-500 mb-4">ID: {book.id}</p>
            <div className="space-y-2">
              {Object.entries(book.book_metadata)
                .filter(([key]) => key !== 'formats')
                .map(([key, value]) => (
                  <div key={key} className="grid grid-cols-3 gap-2">
                    <span className="font-medium text-gray-600 capitalize">
                      {key.replace(/_/g, ' ')}:
                    </span>
                    <div className="col-span-2">
                      {renderMetadataValue(key, value)}
                    </div>
                  </div>
                ))}
            </div>
            <div className="flex space-x-2 mt-4">
              <button
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                onClick={() => handleAnalyzeBookClick(book.id)} // Open Analysis Modal on click
              >
                Analyze This Book
              </button>
              <button
                className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
                onClick={() => handleDeleteBook(book.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Floating button to open AddBookModal */}
      <button
        className="fixed bottom-4 right-4 bg-green-500 text-white rounded-full p-4 shadow-lg hover:bg-green-600 transition"
        onClick={() => setIsAddModalOpen(true)}
      >
        +
      </button>

      {/* AddBookModal for adding a book */}
      <AddBookModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        onBookAdded={fetchBooks} 
      />

      {/* AnalysisModal for book analysis */}
      {selectedBookId && (
        <AnalysisModal
          isOpen={isAnalysisModalOpen}
          bookId={selectedBookId}
          onClose={() => setIsAnalysisModalOpen(false)}
        />
      )}
    </div>
  );
};

export default BooksPage;