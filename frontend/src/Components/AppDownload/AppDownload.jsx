import React from 'react'
import './AppDownload.css'

const AppDownload = () => {
  return (
    <div className='app-download' id='app-download'>
        <p>Download the app<br />Jira</p>
        <div className='app-download-platforms'>
            <button>
                <img src="https://img.icons8.com/ios-filled/50/000000/apple-app-store--v1.png" alt="apple"/>
            </button>
            <button>
                <img src="https://img.icons8.com/ios-filled/50/000000/google-play.png" alt="google"/>
            </button>
        </div>
    </div>
  )
}

export default AppDownload
