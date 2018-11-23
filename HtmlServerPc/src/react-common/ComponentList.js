import { Component } from "react"

export default class Index extends Component {
    constructor(props) {
        super(props);

        this.List = this.InitList();
        this.state = { List: this.List }

    }

    InitList() {
        const { Page, Name } = this.props;
        if (Page[Name] && Page[Name].List) return Page[Name].List;
        return [];
    }

    componentDidMount() {
        debugger
        this.props.Page.InitComponentList(this.props.Name, this.Add(), this.AddList());
    }

    AddList() {
        return (list) => {
            this.List = this.List.concat(list);
            this.setState({ List: this.List });
        }
    }

    Add() {
        return (item) => {
            this.List = this.List.map(m => m);
            this.List.push(item);
            this.setState({ List: this.List });
        }
    }

    render() {
        return this.state.List;
    }
}