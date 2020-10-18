import React, { useCallback, useState } from 'react';
import styles from '../styles/view.scss';
import { Common } from 'UtilsCommon';

const computeTools0 = (calculateorX, calculateorY) => {
    if (Common.getFloatValue(calculateorX) === 0) return 0;
    return Common.addComma(Common.getNumber(1.22 * calculateorY / calculateorX, 2));
};

const Tools0 = () => {
    const [calculateorY, setCalculateorY] = useState('');
    const [calculateorX, setCalculateorX] = useState('');

    const onChangeX = useCallback((e) => {
        setCalculateorX(e.target.value);
    }, [setCalculateorX]);

    const onChangeY = useCallback((e) => {
        setCalculateorY(e.target.value);
    }, [setCalculateorY]);

    return (
        <div className={styles.divToolsItem}>
            <div className={styles.divInput}>
                <input type="text" value={calculateorY} onChange={onChangeY} placeholder="Laser wavelength λ" />
                <input type="text" value={calculateorX} onChange={onChangeX} placeholder="NA of objective" />
            </div>
            <div className={styles.divResult}>
                <label>Diameter of laser spot:</label>
                <div>
                    <span>{computeTools0(calculateorX, calculateorY)}</span><span>nm</span>
                </div>
            </div>
        </div>
    )
};

const computeTools1 = (calculateorX, calculateorY) => {
    if (Common.getFloatValue(calculateorY) === 0) return 0;
    return Common.addComma(Common.getNumber((1 / ((1 / calculateorY) - (calculateorX / 10000000))), 20));
};

const Tools1 = () => {
    const [calculateorY, setCalculateorY] = useState('');
    const [calculateorX, setCalculateorX] = useState('');

    const onChangeX = useCallback((e) => {
        setCalculateorX(e.target.value);
    }, [setCalculateorX]);

    const onChangeY = useCallback((e) => {
        setCalculateorY(e.target.value);
    }, [setCalculateorY]);

    return (
        <div className={styles.divToolsItem}>
            <div className={styles.divInput}>
                <input type="text" value={calculateorY} onChange={onChangeY} placeholder="Laser wavelength λ(nm)" />
                <input type="text" value={calculateorX} onChange={onChangeX} placeholder="Raman Shift (cm-1)" />
            </div>
            <div className={styles.divResult}>
                <label>Unit conversion (from cm<sup>-1</sup> to nm)</label>
                <label>Raman wavelength:</label>
                <div>
                    <span>{computeTools1(calculateorX, calculateorY)}</span><span>nm</span>
                </div>
            </div>
        </div>
    )
};

const computeTools2 = (calculateorX, calculateorY) => {
    if (Common.getFloatValue(calculateorY) === 0) return 0;
    if (Common.getFloatValue(calculateorX) === 0) return 0;
    return Common.addComma(Common.getNumber((1 / calculateorY - 1 / calculateorX) * 10000000, 2));
};

const Tools2 = () => {
    const [calculateorY, setCalculateorY] = useState('');
    const [calculateorX, setCalculateorX] = useState('');

    const onChangeX = useCallback((e) => {
        setCalculateorX(e.target.value);
    }, [setCalculateorX]);

    const onChangeY = useCallback((e) => {
        setCalculateorY(e.target.value);
    }, [setCalculateorY]);

    return (
        <div className={styles.divToolsItem}>
            <div className={styles.divInput}>
                <input type="text" value={calculateorY} onChange={onChangeY} placeholder="Laser wavelength λ(nm)" />
                <input type="text" value={calculateorX} onChange={onChangeX} placeholder="Raman wavelength(nm)" />
            </div>
            <div className={styles.divResult}>
                <label>Unit conversion (from nm to cm<sup>-1</sup>)</label>
                <label>Raman Shift:</label>
                <div>
                    <span>{computeTools2(calculateorX, calculateorY)}</span><span>cm<sup>-1</sup></span>
                </div>
            </div>
        </div>
    )
};

const computeTools3 = (calculateorX, calculateorY) => {
    if (Common.getFloatValue(calculateorY) === 0) return 0;
    if (Common.getFloatValue(calculateorX) === 0) return 0;
    return Common.addComma(Common.getNumber(calculateorY / (4 * 3.1415926535898 * calculateorX), 2));
};

const Tools3 = () => {
    const [calculateorY, setCalculateorY] = useState('');
    const [calculateorX, setCalculateorX] = useState('');

    const onChangeX = useCallback((e) => {
        setCalculateorX(e.target.value);
    }, [setCalculateorX]);

    const onChangeY = useCallback((e) => {
        setCalculateorY(e.target.value);
    }, [setCalculateorY]);

    return (
        <div className={styles.divToolsItem}>
            <div className={styles.divInput}>
                <input type="text" value={calculateorY} onChange={onChangeY} placeholder="Laser wavelength λ(nm)" />
                <input type="text" value={calculateorX} onChange={onChangeX} placeholder="Extinction coefficient k" />
            </div>
            <div className={styles.divResult}>
                <label>Penetration depth of laser into the sample</label>
                <label>Penetration depth D<sub>p</sub>:</label>
                <div>
                    <span>{computeTools3(calculateorX, calculateorY)}</span><span>nm</span>
                </div>
            </div>
        </div>
    )
};

const computeTools4 = (calculateorY) => {
    if (Common.getFloatValue(calculateorY) === 0) return 0;
    return 1240 / calculateorY;
};

const Tools4 = () => {
    const [calculateorY, setCalculateorY] = useState('');

    const onChangeY = useCallback((e) => {
        setCalculateorY(e.target.value);
    }, [setCalculateorY]);

    return (
        <div className={styles.divToolsItem}>
            <div className={styles.divInput}>
                <input type="text" value={calculateorY} onChange={onChangeY} placeholder="eV" />
            </div>
            <div className={styles.divResult}>
                <label>Unit conversion (from eV to nm) </label>
                <label>nm:</label>
                <div>
                    <span>{computeTools4(calculateorY)}</span><span>J</span>
                </div>
            </div>
        </div>
    )
};

const computeTools5 = (calculateorY) => {
    if (Common.getFloatValue(calculateorY) === 0) return 0;
    return 0.000000000000001989 / calculateorY;
};

const Tools5 = () => {
    const [calculateorY, setCalculateorY] = useState('');

    const onChangeY = useCallback((e) => {
        setCalculateorY(e.target.value);
    }, [setCalculateorY]);

    return (
        <div className={styles.divToolsItem}>
            <div className={styles.divInput}>
                <input type="text" value={calculateorY} onChange={onChangeY} placeholder="Wavelength(nm)V" />
            </div>
            <div className={styles.divResult}>
                <label>Photon energy (E) of different wavelengths</label>
                <label>Energy E:</label>
                <div>
                    <span>{computeTools5(calculateorY)}</span>
                </div>
            </div>
        </div>
    )
};

const computeTools6 = (calculateorX, calculateorY) => {
    if (Common.getFloatValue(calculateorY) === 0) return 0;
    if (Common.getFloatValue(calculateorX) === 0) return 0;
    return Common.addComma(Common.getNumber((calculateorY / calculateorX) * 1000000000000, 2));
};

const Tools6 = () => {
    const [calculateorY, setCalculateorY] = useState('');
    const [calculateorX, setCalculateorX] = useState('');

    const onChangeX = useCallback((e) => {
        setCalculateorX(e.target.value);
    }, [setCalculateorX]);

    const onChangeY = useCallback((e) => {
        setCalculateorY(e.target.value);
    }, [setCalculateorY]);

    return (
        <div className={styles.divToolsItem}>
            <div className={styles.divInput}>
                <input type="text" value={calculateorY} onChange={onChangeY} placeholder="Average power(W)" />
                <input type="text" value={calculateorX} onChange={onChangeX} placeholder="Maximum frequency (Hz)" />
            </div>
            <div className={styles.divResult}>
                <label>Pulse laser energy calculation</label>
                <label>Pulse energy:</label>
                <div>
                    <span>{computeTools6(calculateorX, calculateorY)}</span><span>pJ/pulse</span>
                </div>
            </div>
        </div>
    )
};

export default (props) => {
    const [value, setValue] = useState('-1');
    const onChange = useCallback((e) => {
        setValue(e.target.value);
    }, [setValue]);

    return (<div className={styles.divTools}>
        <span className={styles.spanTitle}>Optical Formula</span>
        <span className={styles.spanContent}>
            Are you still looking for optical formulas? Here we provide a series of formulas to make your research easy. Just put in the desired data, we will generate the solution for you. Below is the list of formulas that we provide:
            </span>
        <br />
        <span className={styles.spanContent}>1.The diameter of the laser spot on the sample for you to understand the micro-Raman spatial resolution</span>
        <span className={styles.spanContent}>2.The depth of the laser penetrate into the sample so that you know how deep your sample can be measured by Raman</span>
        <span className={styles.spanContent}>3.Unit conversion between wavelength (nm) and wavenumber (cm-1)</span>
        <span className={styles.spanContent}>4.Unit conversion between eV to nm</span>
        <span className={styles.spanContent}>5.Photon energy of different wavelengths</span>
        <span className={styles.spanContent}>6.Pulse laser energy</span>
        <div className={styles.divSelect}>
            <select onChange={onChange} value={value}>
                <option value="-1">Formula selection</option>
                <option value="0">Diameter of laser spot</option>
                <option value="1">Unit conversion (from cm -1 to nm)</option>
                <option value="2">Unit conversion (from nm to cm -1)</option>
                <option value="3">Penetration depth of laser into the sample</option>
                <option value="4">Unit conversion (from eV to nm) </option>
                <option value="5">Photon energy (E) of different wavelengths</option>
                <option value="6">Pulse laser energy calculation</option>
            </select>
        </div>
        {value === '0' && <Tools0 />}
        {value === '1' && <Tools1 />}
        {value === '2' && <Tools2 />}
        {value === '3' && <Tools3 />}
        {value === '4' && <Tools4 />}
        {value === '5' && <Tools5 />}
        {value === '6' && <Tools6 />}
    </div>)
};