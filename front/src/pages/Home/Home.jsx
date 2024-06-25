import React, { useState } from 'react';
import './Home.css';
import DropdownTab from '../../components/Dropdown/DropdownTab';
import ModalAudio from '../../components/Modal/ModalAudio';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAudio } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  // Example data for table rows
  const [tableData] = useState([
    {
      etape: "J+1",
      protocole: "Test Classique",
      tel: "01 23 45 67 89",
      sms: "Oui",
      dateReference: "01/06/2000",
      etat: "Actif",
      numeroOperation: "123456",
      nom: "Doe",
      prenom: "John",
      ipp: "987654321",
      dateNaissance: "1990-01-01",
      medecin: "Dr. Smith",
      intervention: "Chirurgie",
      dureeIntervention: 120,
    },
    {
      etape: "",
      protocole: "Test Classique",
      tel: "06 23 45 67 89",
      sms: "Oui",
      dateReference: "01/06/1980",
      etat: "Actif",
      numeroOperation: "123456",
      nom: "Thom",
      prenom: "Thom",
      ipp: "987654321",
      dateNaissance: "1990-01-01",
      medecin: "Dr. Smith",
      intervention: "Chirurgie",
      dureeIntervention: 120,
    },
    {
      etape: "",
      protocole: "Test Classique",
      tel: "07 23 45 67 89",
      sms: "Oui",
      dateReference: "01/06/1980",
      etat: "Actif",
      numeroOperation: "123456",
      nom: "Jean",
      prenom: "Dupont",
      ipp: "987654321",
      dateNaissance: "1990-01-01",
      medecin: "Dr. Smith",
      intervention: "Chirurgie",
      dureeIntervention: 120,
    },

    {
      etape: "J+1",
      protocole: "Test Classique",
      tel: "01 23 45 67 89",
      sms: "Oui",
      dateReference: "01/06/2000",
      etat: "Actif",
      numeroOperation: "123456",
      nom: "Doe",
      prenom: "John",
      ipp: "987654321",
      dateNaissance: "1990-01-01",
      medecin: "Dr. Smith",
      intervention: "Chirurgie",
      dureeIntervention: 120,
    },
    {
      etape: "",
      protocole: "Test Classique",
      tel: "06 23 45 67 89",
      sms: "Oui",
      dateReference: "01/06/1980",
      etat: "Actif",
      numeroOperation: "123456",
      nom: "Thom",
      prenom: "Thom",
      ipp: "987654321",
      dateNaissance: "1990-01-01",
      medecin: "Dr. Smith",
      intervention: "Chirurgie",
      dureeIntervention: 120,
    },
    {
      etape: "",
      protocole: "Test Classique",
      tel: "07 23 45 67 89",
      sms: "Oui",
      dateReference: "01/06/1980",
      etat: "Actif",
      numeroOperation: "123456",
      nom: "Jean",
      prenom: "Dupont",
      ipp: "987654321",
      dateNaissance: "1990-01-01",
      medecin: "Dr. Smith",
      intervention: "Chirurgie",
      dureeIntervention: 120,
    },
  ]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items per page

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tableData.slice(indexOfFirstItem, indexOfLastItem);
  const totalItems = tableData.length;
  const [selectedRows, setSelectedRows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedRows(currentItems.map((item) => item.numeroOperation));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (numeroOperation) => {
    if (selectedRows.includes(numeroOperation)) {
      setSelectedRows(selectedRows.filter((id) => id !== numeroOperation));
    } else {
      setSelectedRows([...selectedRows, numeroOperation]);
    }
  };

  const openModal = (content) => {
    setModalContent(content);
    setShowModal(true);
  };

  // Function to handle page change
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="home mt-20">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mr-8 mt-20">
        <div className="flex items-center justify-between flex-column md:flex-row flex-wrap space-y-4 md:space-y-0 py-4 bg-blue-950 px-4 w-full">
          <DropdownTab />
          <label htmlFor="table-search" className="sr-only">Search</label>
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
              <th scope="col" className="p-3">Etape</th>
              <th scope="col" className="p-3">Protocole</th>
              <th scope="col" className="p-3">Tél. portable</th>
              <th scope="col" className="p-3">Suivi SMS</th>
              <th scope="col" className="p-3">Date de référence</th>
              <th scope="col" className="p-3">Etat</th>
              <th scope="col" className="p-3">Numéro d'opération</th>
              <th scope="col" className="p-3">Nom</th>
              <th scope="col" className="p-3">Prénom</th>
              <th scope="col" className="p-3">IPP</th>
              <th scope="col" className="p-3">Date de naissance</th>
              <th scope="col" className="p-3">Médecin</th>
              <th scope="col" className="p-3">Intervention/Examen</th>
              <th scope="col" className="p-3">Durée intervention (en mins)</th>
              <th scope="col" className="p-3">...</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={index} className="bg-white border-bhover:bg-gray-50 odd:bg-white even:bg-gray-50 text-xs">
                <td className="p-4">
                  <div className="flex items-center">
                    <input
                      id={`checkbox-${index}`}
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500    focus:ring-2  "
                      checked={selectedRows.includes(item.numeroOperation)}
                      onChange={() => handleSelectRow(item.numeroOperation)}
                    />
                    <label htmlFor={`checkbox-${index}`} className="sr-only">checkbox</label>
                  </div>
                </td>
                <td className="p-3">
                  <button onClick={() => openModal(<div>Modal Content for {item.nom}</div>)}>
                    <FontAwesomeIcon icon={faFileAudio} className="text-blue-600 hover:text-blue-800 cursor-pointer" />
                  </button>
                </td>
                <td className="p-3">{item.etape}</td>
                <td className="p-3">{item.protocole}</td>
                <td className="p-3">{item.tel}</td>
                <td className="p-3">{item.sms}</td>
                <td className="p-3">{item.dateReference}</td>
                <td className="p-3">{item.etat}</td>
                <td className="p-3">{item.numeroOperation}</td>
                <td className="p-3">{item.nom}</td>
                <td className="p-3">{item.prenom}</td>
                <td className="p-3">{item.ipp}</td>
                <td className="p-3">{item.dateNaissance}</td>
                <td className="p-3">{item.medecin}</td>
                <td className="p-3">{item.intervention}</td>
                <td className="p-3">{item.dureeIntervention}</td>
                <td className="p-3">...</td>
              </tr>
            ))}
          </tbody>
        </table>
        <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4 p-4" aria-label="Table navigation">
          <span className="text-sm font-normal text-gray-500  mb-4 md:mb-0 block w-full md:inline md:w-auto">
            Voir <span className="font-semibold text-gray-900 ">
              {indexOfFirstItem + 1}-{indexOfLastItem > totalItems ? totalItems : indexOfLastItem}
            </span> de <span className="font-semibold text-gray-900 ">{totalItems} </span> éléments
          </span>
          <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
            <li>
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                Précédent
              </button>
            </li>
            {Array.from({ length: Math.ceil(totalItems / itemsPerPage) }, (_, i) => (
              <li key={i}>
                <button
                  onClick={() => paginate(i + 1)}
                  className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 ${currentPage === i + 1 ? 'bg-gray-100 ' : ''}`}
                >
                  {i + 1}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === Math.ceil(totalItems / itemsPerPage)}
                className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 ${currentPage === Math.ceil(totalItems / itemsPerPage) ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                Suivant
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <ModalAudio showModal={showModal} setShowModal={setShowModal} content={modalContent} />
    </div>
  );
};

export default Home;
