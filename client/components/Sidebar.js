import React from 'react';
import Link from 'next/link'
import Image from 'next/image'
import styles from '/styles/Sidebar.module.css'

function Sidebar(props) {

    

    return (
        <div className={styles.sidebar}>
            <div className={styles.profile} >
                <div className={styles.imagewrapper}>
                    <Image 
                    src={require('/public/stockprofilepic.jpg')}
                    fill={true}
                    style={{objectFit: "cover"}}
                    alt='Profile Picture'
                    />
                </div>
                <h1> Name </h1>
                <h2> Description </h2>
            </div>
            
        </div>
    );
}

export default Sidebar;