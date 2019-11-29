import { useMemo, useState } from "react"
import styles from "../styles/View.css";
import BaseIndex from "./BaseIndex";

export default (props) => {
    const instance = useMemo(() => new WhiteSpace(), []);

    instance.Init2(props);

    instance.InitState("IsVisible", useState(true));

    return instance.render();
}

class WhiteSpace extends BaseIndex {

    Init2(props) {
        this.Init(props);

        this.Name = "WhiteSpace"
        props.Property.SetVisible = this.SetVisible.bind(this);
    }

    SetVisible(v) {
        this.setState({ IsVisible: v })
    }

    render() {
        if (!this.state.IsVisible) return null;

        const { Property } = this.props;

        let className = Property.ClassName;
        if (className && styles[className]) className = styles[className];

        return (
            <div className={className} style={Property.Style}></div>
        )
    }
}