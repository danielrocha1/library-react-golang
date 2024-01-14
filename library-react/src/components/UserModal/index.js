
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./index.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBookOpen, faUserCog } from '@fortawesome/free-solid-svg-icons';

const UserModal = ({ setData, data }) => {
  const [isOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const openModal = () => {
    setIsModalOpen(!isOpen);
  };

  const handleMyBooksClick = () => {
    // Adicione aqui o caminho para a página "Meus Livros"
    navigate('/meus-livros');
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
    
      <span className="info-label">Livros:</span>
      <span className="info-value">{data.UserInfo.atualLivros}/{data.UserInfo.totalLivros}</span>
    </div>
    <div className="info-row">
                <button
                  style={{ cursor: "pointer", marginTop: "15px", height: "25px" }}
                  className="profile-label"
                  onClick={() => {
                    // Add logic for "Meu Perfil" button
                  }}
                ><FontAwesomeIcon
                icon={faUser}
                className='profile-icon'
                onClick={openModal}
              />Meu Perfil</button>
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
                  />Meus Livros</button>
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
              </div>
            </div>
        </>
      )}
    </div>
  );
};

export default UserModal;
