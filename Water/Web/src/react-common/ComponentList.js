import { Component } from "react"

export default class Index extends Component {
    constructor(props) {
        super(props);

        this.Init();
        this.state = { List: this.List };
    }

    Init() {
        this.List = [];
        const { Name, Page } = this.props;
        Page.InitInstance(Name, this.Invoke());
    }

    Invoke() {
        return (name) => (this[name]) ? this[name].bind(this) : function () { };
    }

    static get defaultProps() {
        return {
            Name: ""
        }
    }

    AddList(list) {
        this.List = this.List.concat(list);
        this.setState({ List: this.List });
        return this.List;
    }

    Add(item) {
        this.List = this.List.map(m => m);
        this.List.push(item);
        this.setState({ List: this.List });
        return this.List;
    }

    render() {
        return this.state.List;
    }
}