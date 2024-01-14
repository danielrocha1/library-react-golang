import React, { useState, useEffect } from 'react';
import './index.css'; // Importa o arquivo de estilo

const MyBooks = ({ data }) => {
  const [bookData, setBookData] = useState([]);
  const [loading, setLoading] = useState(true);

  const Book = ({ book }) => {
    const isPendingAndExpired = book.Emprestimo.StatusDeDevolucao === 'Pendente' && book.Emprestimo.Expirado;
    const isConcluded = book.Emprestimo.StatusDeDevolucao === 'Devolvido';

    const getStatus = () => {
      if (isPendingAndExpired) {
        return { className: 'book-container-false', status: 'Expirado' };
      } else if (isConcluded) {
        return { className: 'book-container-conclued', status: 'Dentro do prazo' };
      } else {
        return { className: 'book-container', status: 'Dentro do prazo' };
      }
    };

    const { className, status } = getStatus();

    return (
      <div className={className}>
        <div className="book-image-container">
          <img className="book-image" src={book.Product.image} alt={book.Product.name} />
        </div>
        <h3 className="book-title">{book.Product.name}</h3>
        <p>Data do Empréstimo: {book.Emprestimo.DataEmprestimo}</p>
        <p>Data de Devolução: {book.Emprestimo.DataDevolucao}</p>
        <p>Devolução: {book.Emprestimo.StatusDeDevolucao}</p>
        {isConcluded || isPendingAndExpired ? (
          <p>Status: {book.Emprestimo.Expirado ? 'Expirado' : 'Dentro do prazo'}</p>
        ) : null}
        {/* Adicione mais informações conforme necessário */}
      </div>
    );
  };

  const BookList = ({ books }) => {
    return (
      <div className="mybook-list">
        {books.map((book) => (
          <Book key={book.Emprestimo.EmprestimoID} book={book} />
        ))}
      </div>
    );
  };

  useEffect(() => {
    fetch(`http://localhost:8080/selectMybooks/?UserID=${data.UserInfo.ID}`)
      .then(response => response.json())
      .then(data => setBookData(data))
      .catch(error => console.error("Erro ao obter os produtos:", error))
      .finally(() => setLoading(false));
  }, []);

  // Separando livros concluídos, pendentes e expirados
  const pendingBooks = bookData.filter(
    book => book.Emprestimo.StatusDeDevolucao === 'Pendente' && !book.Emprestimo.Expirado
  );
  const expiredPendingBooks = bookData.filter(
    book => book.Emprestimo.StatusDeDevolucao === 'Pendente' && book.Emprestimo.Expirado
  );
  const concludedBooks = bookData.filter(book => book.Emprestimo.StatusDeDevolucao === 'Devolvido');

  return (
    <div className="my-books-container">
      <h1>Meus Livros</h1>
      <span>Estes livros estão em sua posse ou devolvidos</span>

      <h3>Livros Pendentes</h3>
      {loading ? <p>Carregando...</p> : <BookList books={pendingBooks.concat(expiredPendingBooks)} />}

      <h3>Livros Concluídos</h3>
      {loading ? <p>Carregando...</p> : <BookList books={concludedBooks} />}
    </div>
  );
};

export default MyBooks;
