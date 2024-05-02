// App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home';

import AddWord from './components/Addword'; // Corrected component name

import ViewWord from './components/ViewWord';
import WordBank from './components/WordBank';
import SomaliToEnglish from './components/category/SomaliToEnglish';
import Authorization from './components/Authorization'
import AdminComponent from './components/AdminComponent';
import WordAdmin from './components/WordAdmin';



function App() {
  return (
    <Router>
      <div>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          
          <Route path="/wordbank" element={<WordBank />} /> 
          <Route path="/word/:id" element={<ViewWord />} /> 
          <Route path="/wordUpdate/:id" element={<WordAdmin />} /> 
          <Route path="/add" element={<AddWord />} />
          <Route path="/auth" element={<Authorization />} />
          <Route path="/admin" element={<AdminComponent />} />
          
          <Route path="/category/SomaliToEnglish" element={<SomaliToEnglish category="SomaliToEnglish" />} />
          <Route path="/category/EnglishToSomali" element={<SomaliToEnglish category="EnglishToSomali" />} />
          <Route path="/category/SomaliToSomali" element={<SomaliToEnglish category="SomaliToSomali" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;



