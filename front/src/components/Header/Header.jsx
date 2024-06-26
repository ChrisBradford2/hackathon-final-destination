import React from 'react';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeadset, faBullhorn, faUsers, faLock } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import iconImage from '../../assets/images/Genna.png'

const Header = () => {
  return (
    <header className="header">
      <Link to="/hackathon-final-destination/" className="logo">
        CalMedica
      </Link>
      <div className="search-bar">
        <input type="text" placeholder="Rechercher un patient" />
      </div>
      <div className="actions">
        <button>
          <FontAwesomeIcon icon={faHeadset} /> Contacter le support
        </button>
        <FontAwesomeIcon icon={faBullhorn} className="icon" />
        <FontAwesomeIcon icon={faUsers} className="icon" />
        <FontAwesomeIcon icon={faLock} className="icon" />
        <div className="user-icon">
          <img src={iconImage} alt="User" />
        </div>
      </div>
    </header>
  );
};

export default Header;
