
import React from 'react'
import Navbar from '/components/Navbar.js'
import Sidebar from '/components/Sidebar.js'
import styles from '/styles/layout.module.css'



export default function RootLayout({ children }) {
  return (
    <div className={styles.layout}>
        <Navbar className={styles.navbar}/>
        <div className={styles.main}>
            {children}       
        </div>
        <Sidebar className={styles.sidebar}/>

    </div>
  )
}
