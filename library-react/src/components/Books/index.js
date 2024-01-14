// src/components/Book.js
import React from 'react';
import "./index.css";

const Book = ({ book, addToCart, removeFromCart }) => {


  const handleBookClick = () => {
    if (book.addedToCart) {
      console.log(book)
      // Se o livro já foi adicionado ao carrinho, então remove
      removeFromCart(book.id);
    } else {
      // Se o livro ainda não foi adicionado ao carrinho, então adiciona
      addToCart({ ...book, addedToCart: true });
    }
  };

  return (
    <div onClick={handleBookClick} className={`book ${book.addedToCart ? 'added-to-cart' : ''}`}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img style={{ width: '280px', height:'350px' }} src={book.image} />
      </div>
      <h3>{book.name}</h3>
      <p>R${book.price.toFixed(2)}</p>
      <button onClick={handleBookClick}>
        {book.addedToCart ? 'Remover do Carrinho' : 'Adicionar ao Carrinho'}
      </button>
    </div>
  );
};

export default Book;
