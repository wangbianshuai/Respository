import Index from "./Index"

export default class PropertyItem extends Index {
    constructor(props) {
        super(props)

        this.Name = "PropertyItem";
    }

    render() {
        const { Property } = this.props;

        return this.GetReactComponent(Property);
    }
}