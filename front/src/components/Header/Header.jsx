import React from 'react';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeadset, faBullhorn, faUsers, faLock } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">CalMedica</div>
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
          <img src="/hackathon-final-destination/src/assets/images/Genna.png" alt="User" />
        </div>
      </div>
    </header>
  );
};

export default Header;
