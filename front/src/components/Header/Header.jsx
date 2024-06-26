import React from 'react';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeadset, faBullhorn, faUsers, faLock } from '@fortawesome/free-solid-svg-icons';
<<<<<<< feature/ui
import { Link } from 'react-router-dom';
=======
import iconImage from '../../assets/images/Genna.png'
>>>>>>> main

const Header = () => {
  return (
    <header className="header">
      <Link to="/hackathon-final-destination/" className="logo">
        CalMedia
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
<<<<<<< feature/ui
          <img src="/hackathon-final-destination/src/assets/images/Genna.png" alt="User" />
=======
          <img src={iconImage} alt="User" />
>>>>>>> main
        </div>
      </div>
    </header>
  );
};

export default Header;
