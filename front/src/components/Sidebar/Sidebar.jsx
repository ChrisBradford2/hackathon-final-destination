import React from 'react';
import './Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faStickyNote, faTasks, faComments, faEnvelope, faClipboardList, faChartLine } from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ setSidebarWidth }) => {
  const handleMouseEnter = () => {
    setSidebarWidth(256); // largeur de la sidebar sur hover
  };

  const handleMouseLeave = () => {
    setSidebarWidth(112); // largeur par défaut de la sidebar
  };
  return (
    <nav className="sidebar" onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}>
      <ul>
        <li>
          <FontAwesomeIcon icon={faCalendarAlt} className="icon" />
          <span className="sidebar-text">Agenda</span>
        </li>
        <li>
          <FontAwesomeIcon icon={faStickyNote} className="icon" />
          <span className="sidebar-text">Notes</span>
        </li>
        <li>
          <FontAwesomeIcon icon={faTasks} className="icon" />
          <span className="sidebar-text">Doctolib Team</span>
        </li>
        <li>
          <FontAwesomeIcon icon={faComments} className="icon" />
          <span className="sidebar-text">Tâches (2)</span>
        </li>
        <li>
          <FontAwesomeIcon icon={faEnvelope} className="icon" />
          <span className="sidebar-text">Messagerie patients</span>
        </li>
        <li>
          <FontAwesomeIcon icon={faClipboardList} className="icon" />
          <span className="sidebar-text">Gestion des patients</span>
        </li>
        <li>
          <FontAwesomeIcon icon={faChartLine} className="icon" />
          <span className="sidebar-text">Mon activité</span>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
