import React from 'react';
import Navbar from '../components/Navbar'; // Adjust path as needed
import HarvardMap from '../components/HarvardMap'; // Adjust path as needed
import styles from '../styles/MapPage.module.css'; // Import the styles

export default function MapPage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.navbarContainer}>
      </div>
      <HarvardMap />
    </div>
  );
}
