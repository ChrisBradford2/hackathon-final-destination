import React, {  useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import './App.css';
import Sidebar from './components/Sidebar/Sidebar';
import Transcription from './pages/Transcriptions/Transcription';
import Upload from './pages/Upload/Upload';
import Audio from './pages/Audio/Audio';

const App = () => {
  const [sidebarWidth, setSidebarWidth] = useState(112);

  useEffect(() => {
    const adjustHomeMargin = () => {
      const home = document.querySelector('.home');
      if (home) {
        home.style.marginLeft = `${sidebarWidth}px`;
      }
    };

    /* const adjustFooterMargin = () => {
      const footer = document.querySelector('footer');
      if(footer) {
        footer.style.marginLeft = `${sidebarWidth - }px`
      }
    } */

    adjustHomeMargin();
    //adjustFooterMargin();

    window.addEventListener('resize', adjustHomeMargin);
    //window.addEventListener('resize', adjustFooterMargin);
    return () => {
      window.removeEventListener('resize', adjustHomeMargin);
      //window.removeEventListener('resize', adjustFooterMargin);
    };
  }, [sidebarWidth]);


  return (
    <Router>
      <div className="App">
        <Header />
        <Sidebar setSidebarWidth={setSidebarWidth}/>
        <Routes>
          <Route path="/hackathon-final-destination/" element={<Home/>} />
          <Route path="/hackathon-final-destination/upload" element={<Upload/>} />
          <Route path="/hackathon-final-destination/transcription" element={<Transcription/>} />
          <Route path="/hackathon-final-destination/:id" element={<Audio/>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
