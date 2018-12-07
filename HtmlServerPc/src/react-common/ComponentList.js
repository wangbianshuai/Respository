import { Component } from "react"

export default class Index extends Component {
    constructor(props) {
        super(props);

        this.Init();
        this.state = { List: this.List };
    }

    Init() {
        const { Name, List, InitComponentList } = this.props;
        this.List = List;
        InitComponentList(Name, this.Add(), this.AddList())
    }

    static get defaultProps() {
        return {
            Name: "",
            List: [],
            InitComponentList: Function()
        }
    }

    AddList() {
        return (list) => {
            this.List = this.List.concat(list);
            this.setState({ List: this.List });
            return this.List;
        }
    }

    Add() {
        return (item) => {
            this.List = this.List.map(m => m);
            this.List.push(item);
            this.setState({ List: this.List });
            return this.List;
        }
    }

    render() {
        return this.state.List;
    }
}