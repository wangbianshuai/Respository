import React from 'react';
import styles from '../styles/view.scss';

export default (props) => {
    return (<div className={styles.divTools}>
        <span className={styles.spanTitle}>Periodical Charts for XRF</span>
        <span className={styles.spanContent}>
            XRF spectroscopy is widely used for qualitative and quantitative elemental analysis of environmental, archaeological, geological, biological, industrial and other samples. This periodic table is an excellent reference tool for student and professionals for anyone with an interest in materials analysis. Compared to ordinary periodic table, this one not only shows elements name, atomic number, periodic symbol and atomic weight, and also useful information in XRF analysis including secondary X-ray energies (keV) of each element.
        </span>
        <br />
        <span className={styles.spanContent}>The periodic table also can help you to choose proper condition for analysis. For example, the energy of Cu Kα1 is 8.040 keV, which means you have to choose accelerating voltage no less than 8 kV to excite CuKα1 peak.</span>
        <br />
        <span>
            <img src='http://www.wikispectra.com/assets/images/Tool04.png' alt='' />
        </span>
        <div className={styles.whiteSpace30}></div>
    </div>)
};