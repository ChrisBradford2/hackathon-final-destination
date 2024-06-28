import React, { useState, useEffect } from 'react';
import './Home.css';
import DropdownTab from '../../components/Dropdown/DropdownTab';
import ModalAudio from '../../components/Modal/ModalAudio';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAudio, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Home = () => {
  const [audios, setAudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Nombre d'éléments par page
  const [selectedRows, setSelectedRows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [selectAll, setSelectAll] = useState(false);

  // Fonction pour récupérer les audios depuis l'API et les trier par numeroOperation décroissant
  const fetchAudios = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/audios');
      const data = await response.json();
      // Tri par numeroOperation en ordre décroissant
      data.sort((a, b) => b.id - a.id);
      setAudios(data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
      console.error(error);
    }
  };

  // Appel de fetchAudios au montage du composant
  useEffect(() => {
    fetchAudios();
  }, []);

  // Gestion de la sélection de toutes les lignes
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedRows(audios.map((item) => item.numeroOperation));
    } else {
      setSelectedRows([]);
    }
  };

  // Gestion de la sélection d'une ligne individuelle
  const handleSelectRow = (numeroOperation) => {
    if (selectedRows.includes(numeroOperation)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== numeroOperation));
    } else {
      setSelectedRows([...selectedRows, numeroOperation]);
    }
  };

  // Fonction pour ouvrir le modal
  const openModal = (content) => {
    setModalContent(content);
    setShowModal(true);
  };

  // Fonction pour gérer le changement de page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calcul des valeurs de pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalItems = audios.length;
  const currentItems = audios.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="home mt-20">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mr-8 mt-20">
        <div className="flex items-center justify-between flex-column md:flex-row flex-wrap space-y-4 md:space-y-0  bg-blue-950 px-4 w-full">
          {/* <DropdownTab /> */}
          <Link to="/hackathon-final-destination/upload" className="my-4 px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-800">
          <FontAwesomeIcon icon={faPlus} className="text-white" />
          <span className="ms-2">Ajouter une transcription</span>
          </Link>
          <label htmlFor="table-search" className="sr-only">Recherche</label>
          <div className="relative">
            <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input type="text" id="table-search-users" className="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Rechercher"/>
          </div>
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50  ">
            <tr>
              <th scope="col" className="p-4">
                <div className="flex items-center">
                  <input
                    id="checkbox-all-search"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                  <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                </div>
              </th>
              <th scope="col" className="p-3">Action</th>
              <th scope="col" className="p-3">Audio</th>
              <th scope="col" className="p-3">Date de référence</th>
              <th scope="col" className="p-3">Etat</th>
              <th scope="col" className="p-3">Besoin d'intervention</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={index} className="bg-white border-b hover:bg-gray-50 odd:bg-white even:bg-gray-50 text-xs">
                <td className="p-4">
                  <div className="flex items-center">
                    <input
                      id={`checkbox-${index}`}
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      checked={selectedRows.includes(item.numeroOperation)}
                      onChange={() => handleSelectRow(item.numeroOperation)}
                    />
                    <label htmlFor={`checkbox-${index}`} className="sr-only">checkbox</label>
                  </div>
                </td>
                <td className="p-3">
                  <Link to={`/hackathon-final-destination/${item.numeroOperation}`} className="text-blue-600 hover:text-blue-800 cursor-pointer">
                    <FontAwesomeIcon icon={faFileAudio} className="text-blue-600 hover:text-blue-800 cursor-pointer" />
                  </Link>
                </td>
                <td className="p-3">{item.audio}</td>
                <td className="p-3">{item.createdAt}</td>
                <td className="p-3">
                  {item.isAnalysed ? (
                    <span className="text-green-500">Analysé</span>
                  ) : (
                    <span className="text-red-500">Non analysé</span>
                  )}
                </td>
                <td className="p-3">
                  {item.isInNeed ? (
                    <span className="text-green-500">Oui</span>
                  ) : (
                    <span className="text-red-500">Non</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4 p-4" aria-label="Navigation de la table">
          <span className="text-sm font-normal text-gray-500 mb-4 md:mb-0 block w-full md:inline md:w-auto">
            Voir <span className="font-semibold text-gray-900 ">
              {indexOfFirstItem + 1}-{indexOfLastItem > totalItems ? totalItems : indexOfLastItem}
            </span> de <span className="font-semibold text-gray-900 ">{totalItems} </span> éléments
          </span>
          <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
            <li>
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-`}
              >
                Précédent
              </button>
            </li>
            <li>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={indexOfLastItem >= totalItems}
                className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-`}
              >
                Suivant
              </button>
            </li>
          </ul>
        </nav>
      </div>
      {showModal && <ModalAudio content={modalContent} onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Home;
