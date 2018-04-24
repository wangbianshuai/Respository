import React from "react"
import Index from "./Index"
import ColorPicker from 'rc-color-picker';
import 'rc-color-picker/assets/index.css';
import styles from "../styles/Index.css";

export default class ColorPicker2 extends Index {
    constructor(props) {
        super(props)

        this.Name = "ColorPicker2";
    }

    ChangeColor(value) {
        this.setState({ Value: value.color });
    }

    render() {
        const color = this.state.Value || "#000000";

        return <ColorPicker
            color={color}
            className={styles.ColorPicker}
            placement="bottomLeft"
            onChange={this.ChangeColor.bind(this)}
        />
    }
}