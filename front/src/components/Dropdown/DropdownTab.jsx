import React, { useState } from 'react';
import DropdownRadioTab from './DropdownRadioTab';

const DropdownTab = () => {
  const [showActionDropdown, setShowActionDropdown] = useState(false);

  const toggleActionDropdown = () => {
    setShowActionDropdown(!showActionDropdown);
  };

  return (
    <div>
      {/* Dropdown Action */}
      <button
        id="dropdownActionButton"
        onClick={toggleActionDropdown}
        className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5"
        type="button"
      >
        <span className="sr-only">Action button</span>
        Action
        <svg
          className="w-2.5 h-2.5 ms-2.5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {showActionDropdown && (
        <div
          id="dropdownAction"
          className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44"
        >
          <ul className="py-1 text-sm text-gray-700 " aria-labelledby="dropdownActionButton">
            <li>
              <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                Voir
              </a>
            </li>
            <li>
              <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                Modifier
              </a>
            </li>
            <li>
              <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                
              </a>
            </li>
          </ul>
          <div className="py-1">
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Supprimer
            </a>
          </div>
        </div>
      )}

      {/* Dropdown Radio */}
      
      <DropdownRadioTab/>
    </div>
  );
};

export default DropdownTab;
