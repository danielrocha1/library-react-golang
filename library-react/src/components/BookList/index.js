// src/components/BookList.js
import React, {useState} from 'react';
import Book from '../Books';
import './index.css';


const BookList = ({filterTitle, setFilterTitle, books, addToCart, removeFromCart, data}) => {
 
 
  const handleFilterChange = (event) => {
    setFilterTitle(event.target.value);
  };

  return (
    <>
    
  <input
  className="filter-input"
  type="text"
  placeholder="Filtrar por título"
  value={filterTitle}
  onChange={handleFilterChange}
/>

    <div className="book-list">
      {books.map((book) => (
        <Book key={book.id} book={book} addToCart={addToCart} removeFromCart={removeFromCart}/>
      ))}
    </div>
    </>
  );
};

export default BookList;