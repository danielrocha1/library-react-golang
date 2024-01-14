import React, { useState,  } from 'react';
import "./index.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';

const LoginModal = ({setBooksCartLength, setCartItems, setIsLoggedIn, setData ,data}) => {
  const [isOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('daniel@example.com');
  const [password, setPassword] = useState(123);
  

  const openModal = () => {
    setIsModalOpen(!isOpen);
  }; 
  

  const closeModal = () => {
    setIsModalOpen(!isOpen);
  };

  const handleSubmit =  async () => {

    // Enviar dados para o servidor
    const response = await fetch(`http://localhost:8080/login/?email=${email}&password=${password}`)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setData(data)
      })
      .catch(error => console.error("Erro ao obter os produtos:", error));

    // Lida com a resposta do servidor, por exemplo, verifica se o login foi bem-sucedido



    setIsLoggedIn(true)
    setCartItems([])
    setBooksCartLength(0)
    setIsModalOpen(false);
  };

  return (
    <div>
      {!isOpen && (
        <FontAwesomeIcon icon={faSignInAlt} className="login-icon" onClick={openModal} />
      )}

      {isOpen && (
        <>
        <FontAwesomeIcon icon={faSignInAlt} className="login-icon" onClick={openModal} />
        
        <div onClick={()=> closeModal} className="login-overlay">
          <div className="modal-content" >
            <h2>Login</h2>
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <label>Senha:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button style={{marginLeft:"10px"}} onClick={handleSubmit}>Login</button>
            <p style={{marginLeft:"10px"}}><a href="#">Esqueceu sua senha?</a></p>
          </div>
        </div>
        </>
      )}
    </div>
  );
};

export default LoginModal;
