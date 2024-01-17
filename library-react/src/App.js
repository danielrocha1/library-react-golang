import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import BookList from './components/BookList';
import Cart from './components/Cart';
import LoginModal from './components/LoginModal';
import UserModal from './components/UserModal';
import Home from './components/Home';
import AdminModal from './components/AdminModal';
import MyBooks from './components/MyBooks';
import CrudBooks from './components/CrudBooks';
import CrudLoan from './components/CrudLoan';


import './App.css';


const App = () => {
  const [books, setBooks] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [filterTitle, setFilterTitle] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Novo estado para rastrear o status de login
  const [booksCartLength, setBooksCartLength ] = useState(0)

  const [data, setData] = useState({});
  
  const closeModal = () => {
    console.log("Fechar modal");
    setModalOpen(false);
  };
  
  const addToCart = (book) => {
    const isBookInCart = cartItems.some(item => item.id === book.id);

    // Verifica se o número de livros no carrinho é menor que data.UserInfo.totalLivros
    
    const canAddToCart = isLoggedIn ? (cartItems.length < data.UserInfo.totalLivros - data.UserInfo.atualLivros) : true;
   

    if (!isBookInCart && canAddToCart) {
      setCartItems([...cartItems, { ...book, addedToCart: true }]);
      setBooksCartLength(booksCartLength + 1);
    }
  }


  useEffect(() => {
    // const storedToken = localStorage.getItem('token'); 
    // setIsLoggedIn(!!storedToken);

    fetch("http://localhost:8080/select")
      .then(response => response.json())
      .then(data => setBooks(data))
      .catch(error => console.error("Erro ao obter os produtos:", error));

      
  }, []);


  const removeFromCart = (bookId) => {
    const updatedCart = cartItems.filter(item => item.id !== bookId);
    setCartItems(updatedCart);
    setBooksCartLength(booksCartLength-1)
  };

  const handleFilterChange = (event) => {
    setFilterTitle(event.target.value);
  };


  const filteredBooks = books.map(book => ({
    ...book,
    addedToCart: cartItems.some(item => item.id === book.id)
  })).filter(book =>
    book.name.toLowerCase().includes(filterTitle.toLowerCase())
  );

  

  return (
    <Router>
      <div className="App">
      <div className="header">
          <Home/>
          <h1  className="header-title">Lista de Livros</h1>
          {!isLoggedIn ? (
            <LoginModal
              setBooksCartLength={setBooksCartLength}
              setCartItems={setCartItems}
              setData={setData}
              data={data}
              isOpen={isModalOpen}
              onClose={closeModal}
              isLogged={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
            />
          ) : data.type == 'student' ? (
<<<<<<< HEAD
            <UserModal setData={setData} data={data} />
          )
          :
          (
            <AdminModal setData={setData} data={data} />
=======
            <UserModal setData={setData} data={data} setIsLoggedIn={setIsLoggedIn}/>
          )
          :
          (
            <AdminModal setData={setData} data={data} setIsLoggedIn={setIsLoggedIn}/>
>>>>>>> 4fdf649 (Mensagem do commit inicial)
           
          )
          }
        </div>

        <Routes>
          <Route path="/meus-livros" element={<MyBooks data={data} />} />
          <Route path="/gerenciar-livros" element={<CrudBooks  />} />
          <Route path="/gerenciar-loan" element={<CrudLoan data={data} />} />
          <Route path="/" element={<BookList filterTitle={filterTitle} setFilterTitle={setFilterTitle} data={data} books={filteredBooks} addToCart={addToCart} removeFromCart={removeFromCart} />} />
        </Routes>

        {isLoggedIn ? (
        <Cart
          booksCartLength={booksCartLength}
          setCartItems={setCartItems}
          cartItems={cartItems}
          removeFromCart={removeFromCart}
          isLogged={isLoggedIn}
          data={data}
        />)
      : data.type == 'student' ? (
        <Cart
        booksCartLength={booksCartLength}
        setCartItems={setCartItems}
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        isLogged={isLoggedIn}
        data={data}
      />
      )
      :
      (
       '' 
       
      )
      }

      </div>
    </Router>
  );
};

export default App;
