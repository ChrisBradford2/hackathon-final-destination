import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import './App.css';
import Sidebar from './components/Sidebar/Sidebar';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Header />
        <Sidebar />
        <Routes>
          <Route path="/" component={Home} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
