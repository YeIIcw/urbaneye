import React from 'react';
import styles from '/styles/Navbar.module.css';
import Image from 'next/image';
import Link from 'next/link';

function Navbar() {
    return (
        <div className={styles.navbar}>
            <div className={styles.titlecontainer}> AI Responder </div>
            <div className={styles.navigation}>
                <div className={styles.navwrapper}>
                    <Link href="/" passHref>
                        <div className={styles.item}>
                            <Image
                                src={require('/public/home.png')}
                                width={20}
                                height={20}
                                alt="Home Icon"
                            />
                            <h2> Dashboard </h2>
                        </div>
                    </Link>
                    <Link href="/map" passHref>
                        <div className={styles.item}>
                            <Image
                                src={require('/public/map.png')}
                                width={20}
                                height={20}
                                alt="Map Icon"
                            />
                            <h2> Map </h2>
                        </div>
                    </Link>
                    <Link href="/settings" passHref>
                        <div className={styles.item}>
                            <Image
                                src={require('/public/settings.png')}
                                width={20}
                                height={20}
                                alt="Settings Icon"
                            />
                            <h2>Settings</h2>
                        </div>
                    </Link>
                </div>
            </div>
            <div className={styles.bottom}></div>
        </div>
    );
}

export default Navbar;
