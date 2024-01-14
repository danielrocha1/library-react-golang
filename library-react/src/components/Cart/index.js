import React, { useState } from 'react';
import "./index.css"
import CartIcon from '@mui/icons-material/ShoppingCart';

const Cart = ({booksCartLength, cartItems, removeFromCart, isLogged, data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const openModal = (book) => {
    setSelectedBook(book);
    setIsModalOpen(!isModalOpen);
  };

  const closeModal = () => {
    setSelectedBook(null);
    setIsModalOpen(!isModalOpen);
  };




  const handleFinish = () => {
    
    if (isLogged){
      const finishOrder = {
        UserID: data.UserInfo.ID, 
        ProdutoID: cartItems.map(item => item.id),
        requestBooks: (booksCartLength + data.UserInfo.atualLivros)
      };

      fetch(`http://localhost:8080/insertLoan/?UserID=${finishOrder.UserID}&ProdutoID=${finishOrder.ProdutoID}&RequestBooks=${finishOrder.requestBooks}`,{
        method:"POST",
      })
      .then(response => console.log(response))
      .catch(error => console.error("Erro ao obter os produtos:", error));
      setIsModalOpen(!isModalOpen)
    }else{
      console.log("nao logado")
    }
    
  };


  return (
    <div className="cart">
      {!isModalOpen && (
        <CartIcon style={{ color: "white",     width: "30px",
        height: "30px", }} onClick={()=>openModal()} />
      )}

      {isModalOpen && (
        <>
            <button className="modal-close" onClick={closeModal}>X</button>
          <div className="booklist">
          <ul className="cart-list">
          
           
          
          <li className="table-container">
    <table >
      <thead>
        <tr>
          <th>Nome do Item</th>
          <th>Preço</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody style={{backgroundColor: "#0c51f3f2",}}> 
        {cartItems ? (
          cartItems.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>R${item.price.toFixed(2)}</td>
              <td>
                <button style={{  fontSize: "15px",}} onClick={() => removeFromCart(item.id)}>Remover</button>
              </td>
            </tr>
           
            
          ))
        ) : (
          <tr>
            <td colSpan="3">Carrinho vazio</td>
          </tr>
        )}
      </tbody>
    </table>
  </li>
</ul>

            {cartItems.length > 0 ?  <div style={{cursor:"pointer",}} onClick={() => handleFinish()}>Fechar Pedido | {booksCartLength} Livros</div>  : setIsModalOpen(false) }
            
          </div>
          
        </>
      )}
    </div>
  );
};

export default Cart;
