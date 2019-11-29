import { useMemo } from "react"
import BaseIndex from "./BaseIndex"

export default (props) => {
    const instance = useMemo(() => new AButton(), []);

    instance.Init(props);

    return instance.render();
}

class AButton extends BaseIndex {

    ClickAction() {
        this.PageAxis.InvokeEventAction(this.Property.EventActionName, this.props);
    }

    render() {
        const { Property, DataText, Href } = this.props
        let text = DataText;
        text = text || (Property.Label || Property.Text)

        return (<a onClick={this.ClickAction.bind(this)} href={Href}>{text}</a>)
    }
}