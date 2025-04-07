import React, { useState, useEffect } from 'react'; // Adaugă useEffect
import './Home.css';
import Header from '../../Components/Header/Header';
import ExploreMenu from '../../Components/ExploreMenu/ExploreMenu';
import Middle from '../../Components/Middle/Middle';
import AppDownload from '../../Components/AppDownload/AppDownload';

const Home = ({ setShowLogin }) => {
  const [category, setCategory] = useState("All");

  
  useEffect(() => {
    localStorage.setItem('token', null); 
   
  }, []);

  return (
    <div>
      <Header setShowLogin={setShowLogin} />
      <ExploreMenu category={category} setCategory={setCategory} />
      <Middle />
      <AppDownload />
    </div>
  );
};

export default Home;