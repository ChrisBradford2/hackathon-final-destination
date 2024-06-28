import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import './App.css';
import Sidebar from './components/Sidebar/Sidebar';
import Upload from './pages/Upload/Upload';
import Audio from './pages/Audio/Audio';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [sidebarWidth, setSidebarWidth] = useState(112);

  useEffect(() => {
    const adjustHomeMargin = () => {
      const home = document.querySelector('.home');
      if (home) {
        home.style.marginLeft = `${sidebarWidth}px`;
      }
    };

    adjustHomeMargin();

    window.addEventListener('resize', adjustHomeMargin);
    return () => {
      window.removeEventListener('resize', adjustHomeMargin);
    };
  }, [sidebarWidth]);

  return (
    <Router>
      <div className="app flex">
        <Header />
        <Sidebar setSidebarWidth={setSidebarWidth} />
        <div className="main-content ml-28 pt-16 p-5 flex-1 bg-white h-screen transition-all duration-300">
          <Routes>
            <Route path="/hackathon-final-destination/" element={<Home />} />
            <Route path="/hackathon-final-destination/upload" element={<Upload />} />
            <Route path="/hackathon-final-destination/:id" element={<Audio />} />
          </Routes>
        </div>
        <Footer />
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
};

export default App;
