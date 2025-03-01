import React from 'react'
import './ExploreMenu.css'
import { menu_list } from '../../assets/assets'

const ExploreMenu = ({category, setCategory}) => {
  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Choose your option</h1>
      <p className='explore-menu-text'>From the list below</p>
      <div className='explore-menu-list'>
        {menu_list.map((item, index) => {
          return (
            <div onClick={() => setCategory(prev => prev === item.menu_name ? "All" : item.menu_name)}
            key={index} className='explore-menu-item'>
              <div className='explore-menu-item-content'>
                <img  src={item.menu_image} alt=""className={`explore-menu-image ${category === item.menu_name ? "active" : ""}`}    />
                <p>{item.menu_name}</p>
              </div>
              <div className='explore-menu-item-text'>
                <p>{item.menu_description}</p>
              </div>
            </div>
          )
        })}
      </div>
      <hr />
    </div>
  )
}

export default ExploreMenu
