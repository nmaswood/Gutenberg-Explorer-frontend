import axios from 'axios';

const API_URL = 'https://gutenberg-explorer-back-1b3df3bcf947.herokuapp.com';  // Replace this with your FastAPI base URL



interface AddBookResponse {
  id: string;
  book_metadata: {
    title: string;
    publisher: string;
    [key: string]: string;
  };
}

export const addBook = async (bookId: string): Promise<AddBookResponse> => {
  try {
    const response = await axios.post(`${API_URL}/books`, { book_id: bookId });
    return response.data;
  } catch (error) {
    console.error('Error adding book:', error);
    throw error;
  }
};

// Fetch all books from FastAPI
export const getBooks = async () => {
  try {
    const response = await axios.get(`${API_URL}/books`);
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};


export const getBookAnalysis =async (bookId: string) => {
  try{
    const response = await axios.get(`${API_URL}/analyze-book/${bookId}`);
    return response.data
  }catch (error){
    console.error("Error getting book analysis");
    throw error;
  }
};


// Delete a book from the FastAPI backend
export const deleteBook = async (bookId: string) => {
  try {
    await axios.delete(`${API_URL}/books`, {
      data: { book_id: bookId }  // This sends book_id in the request body
    });
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
};
