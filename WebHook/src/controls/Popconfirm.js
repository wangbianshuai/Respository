import { useMemo } from "react"
import BaseIndex from "./BaseIndex"
import { Popconfirm } from "antd"

export default (props) => {
    const instance = useMemo(() => new Popconfirm2(), []);

    instance.Init(props);

    return instance.render();
}

class Popconfirm2 extends BaseIndex {

    ConfirmAction() {
        this.PageAxis.InvokeEventAction(this.Property.EventActionName, this.props);
    }

    render() {
        const { Property } = this.props
        const text = Property.Label || Property.Text

        return (
            <Popconfirm title={Property.Title} onConfirm={this.ConfirmAction.bind(this)} okText="确定" cancelText="取消">
                <a href={Property.Href}>{text}</a>
            </Popconfirm>
        )
    }
}