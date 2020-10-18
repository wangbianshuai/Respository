import React from 'react';
import styles from '../styles/view.scss';
export default (props) => {
    return (<div className={styles.divTools}>
        <span className={styles.spanTitle}>Grating Tools</span>
        <span className={styles.spanContent}>
        This spectrometer calculator is very convenient for the users to get spectroscopy parameters after selecting different spectrometers, detectors and gratings. To use this tool, you need to select the model of spectrometer and detector which will be used, and its corresponding parameters will also display accordingly. After that you can select and change the gratings, the linear dispersion, CCD resolution and coverage will be displayed. You can also get the corresponding nanometer from the laser line if you put the laser line and the Raman shift value in the calculator.
        </span>
        <br />     
        <div className={styles.divButton}>
            <a href='https://www.horiba.com/en_en/diffraction-gratings-ruled-holographic/'>Grating Tools</a>
        </div>
    </div>)
};