import React from 'react'
import { useState } from 'react';
import './Home.css'
import Header from '../../Components/Header/Header';
import ExploreMenu from '../../Components/ExploreMenu/ExploreMenu'
import Middle from '../../Components/Middle/Middle';
import AppDownload from '../../Components/AppDownload/AppDownload';

const Home = () => {
  const [category, setCategory] = useState("All");
  return (
    <div>
        <Header/>
        <ExploreMenu category={category} setCategory={setCategory}/>
        <Middle />
        <AppDownload />
      
    </div>
  )
}

export default Home
