import React from 'react';
import './ExploreMenu.css';
import { menu_list } from '../../assets/assets';

const ExploreMenu = ({ category, setCategory }) => {
  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Alege optiunea!</h1>
     
      <div className='explore-menu-list'>
        {menu_list.map((item, index) => {
          return (
            <a href={item.menu_link} target="_blank" rel="noopener noreferrer" key={index} className='explore-menu-item-link'>
              <div
                onClick={() => setCategory(prev => prev === item.menu_name ? "All" : item.menu_name)}
                className='explore-menu-item'
              >
                <div className='explore-menu-item-content'>
                  <img
                    src={item.menu_image}
                    alt=""
                    className={`explore-menu-image ${category === item.menu_name ? "active" : ""}`}
                  />
                  <p>{item.menu_name}</p>
                </div>
                <div className='explore-menu-item-text'>
                  <p>{item.menu_description}</p>
                </div>
              </div>
            </a>
          );
        })}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;