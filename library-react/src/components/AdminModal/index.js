
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./index.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
<<<<<<< HEAD
import { faUser, faBookOpen, faUserCog } from '@fortawesome/free-solid-svg-icons';

const AdminModal = ({ setData, data }) => {
=======
import { faUser, faBookOpen, faUserCog, faSignOut } from '@fortawesome/free-solid-svg-icons';

const AdminModal = ({ setData, data, setIsLoggedIn }) => {
>>>>>>> 4fdf649 (Mensagem do commit inicial)
  const [isOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const openModal = () => {
    setIsModalOpen(!isOpen);
  };

  const handleMyBooksClick = () => {
    // Adicione aqui o caminho para a página "Meus Livros"
    navigate('/gerenciar-livros');
    setIsModalOpen(!isOpen);
  };
<<<<<<< HEAD
=======
  const handleLogOutClick = () => {
    // Adicione aqui o caminho para a página "Meus Livros"
    setIsLoggedIn(false)
    setData('')
  };
>>>>>>> 4fdf649 (Mensagem do commit inicial)

  const handleMyLoanClick = () => {
    // Adicione aqui o caminho para a página "Meus Livros"
    navigate('/gerenciar-loan');
    setIsModalOpen(!isOpen);
  };


  return (
    <div>
      <FontAwesomeIcon
        icon={faUser}
        className={`login-icon ${isOpen ? 'open' : ''}`}
        onClick={openModal}
      />

      {isOpen && (
        <>
          <div className="modal-overlay">
            <div className="modal-user">
          <div className="info-row">
      <span className="info-label">Nome:</span>
      <span className="info-value">{data.UserInfo.Nome}</span>
    </div>
    <div className="info-row">
      <span className="info-label">Idade:</span>
      <span className="info-value">{data.UserInfo.Idade}</span>
    </div>
    <div className="info-row">
      <span className="info-label">Email:</span>
      <span className="info-value">{data.UserInfo.Email}</span>
    </div>
  
    <div className="info-row">
                <button
                  style={{ cursor: "pointer", marginTop: "15px", height: "25px" }}
                  className="profile-label"
                  onClick={handleMyLoanClick}
    
                ><FontAwesomeIcon
                icon={faUser}
                className='profile-icon'
                
              />Devoluções</button>
              </div>
              <div className="info-row">
                <button
                  style={{ cursor: "pointer", marginTop: "10px", height: "25px" }}
                  className="book-label"
                  onClick={handleMyBooksClick}
                ><FontAwesomeIcon
                    icon={faBookOpen}
                    className='book-icon'
                    onClick={openModal}
                  />Gerenciar Livros</button>
              </div>
              <div className="info-row">
              <button
                  style={{ cursor: "pointer", marginTop: "10px", height: "25px" }}
                  className="config-label"
                  onClick={handleMyBooksClick}
                ><FontAwesomeIcon
                    icon={faUserCog}
                    className='config-icon'
                    onClick={openModal}
                  />
                  Configurações
                </button>
              </div>
<<<<<<< HEAD
=======
              <div className="info-row">
              <button
                  style={{ cursor: "pointer", marginTop: "10px", height: "25px" }}
                  className="logout-label"
                  onClick={handleLogOutClick}
                ><FontAwesomeIcon
                    icon={faSignOut}
                    className='logout-icon'
                    onClick={openModal}
                  />
                  Logout
                </button>
              </div>
>>>>>>> 4fdf649 (Mensagem do commit inicial)
              </div>
            </div>
        </>
      )}
    </div>
  );
};

export default AdminModal;
