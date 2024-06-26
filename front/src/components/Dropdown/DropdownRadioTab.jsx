import React, { useState, useRef, useEffect } from 'react';

const DropdownRadioTab = () => {
  const [showRadioDropdown, setShowRadioDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    /*const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowRadioDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };*/
  }, []);

  const toggleRadioDropdown = () => {
    setShowRadioDropdown(!showRadioDropdown);
  };

  return (
    <div className="relative inline-block">
      <button
        id="dropdownRadioButton"
        onClick={toggleRadioDropdown}
        className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4  font-medium rounded-lg text-sm px-3 py-1.5"
        type="button"
      >
        Tous
        <svg
          className="w-3 h-3 text-gray-500 dark:text-gray-400 ms-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 18a1 1 0 0 1-.707-.293l-7-7a1 1 0 0 1 1.414-1.414L10 15.586l5.293-5.293a1 1 0 1 1 1.414 1.414l-6.999 6.999A1 1 0 0 1 10 18z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {showRadioDropdown && (
        <div
          ref={dropdownRef}
          className="absolute z-10 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <ul className="py-1">
            <li>
              <div className="flex items-center p-2 rounded hover:bg-gray-100">
                <input
                  id="filter-radio-j-5"
                  type="radio"
                  value="J-5"
                  name="filter-radio"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor="filter-radio-j-5"
                  className="ml-2 text-sm font-medium text-gray-900"
                >
                  J-5
                </label>
              </div>
            </li>
            <li>
              <div className="flex items-center p-2 rounded hover:bg-gray-100">
                <input
                  id="filter-radio-j-2"
                  type="radio"
                  value="J-2"
                  name="filter-radio"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor="filter-radio-j-2"
                  className="ml-2 text-sm font-medium text-gray-900"
                >
                  J-2
                </label>
              </div>
            </li>
            <li>
              <div className="flex items-center p-2 rounded hover:bg-gray-100">
                <input
                  id="filter-radio-j-1"
                  type="radio"
                  value="J-1"
                  name="filter-radio"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor="filter-radio-j-1"
                  className="ml-2 text-sm font-medium text-gray-900"
                >
                  J-1
                </label>
              </div>
            </li>
            <li>
              <div className="flex items-center p-2 rounded hover:bg-gray-100">
                <input
                  id="filter-radio-j0"
                  type="radio"
                  value="J0"
                  name="filter-radio"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor="filter-radio-j0"
                  className="ml-2 text-sm font-medium text-gray-900"
                >
                  J0
                </label>
              </div>
            </li>
            <li>
              <div className="flex items-center p-2 rounded hover:bg-gray-100">
                <input
                  id="filter-radio-j+1"
                  type="radio"
                  value="J+1"
                  name="filter-radio"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor="filter-radio-j+1"
                  className="ml-2 text-sm font-medium text-gray-900"
                >
                  J+1
                </label>
              </div>
            </li>
            <li>
              <div className="flex items-center p-2 rounded hover:bg-gray-100">
                <input
                  id="filter-radio-j+4"
                  type="radio"
                  value="J+4"
                  name="filter-radio"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor="filter-radio-j+4"
                  className="ml-2 text-sm font-medium text-gray-900"
                >
                  J+4
                </label>
              </div>
            </li>
            <li>
              <div className="flex items-center p-2 rounded hover:bg-gray-100">
                <input
                  id="filter-radio-j+7"
                  type="radio"
                  value="J+7"
                  name="filter-radio"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor="filter-radio-j+7"
                  className="ml-2 text-sm font-medium text-gray-900"
                >
                  J+7
                </label>
              </div>
            </li>
            <li>
              <div className="flex items-center p-2 rounded hover:bg-gray-100">
                <input
                  id="filter-radio-j+2000"
                  type="radio"
                  value="J+2000"
                  name="filter-radio"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor="filter-radio-j+2000"
                  className="ml-2 text-sm font-medium text-gray-900"
                >
                  J+2000
                </label>
              </div>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownRadioTab;
