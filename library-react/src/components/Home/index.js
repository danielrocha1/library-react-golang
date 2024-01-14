import React, {   } from 'react';
import { useNavigate } from 'react-router-dom';
import "./index.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';

const Home = () => {

const handleHomeClick = () => {
        // Adicione aqui o caminho para a página "Meus Livros"
        navigate('/');
};

const navigate = useNavigate();
  return (
    <div>
         <FontAwesomeIcon icon={faHouse} className="login-home-button" onClick={handleHomeClick} />
    </div>
  );
};

export default Home;
