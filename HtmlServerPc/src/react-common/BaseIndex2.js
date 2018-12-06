import { Component } from "react"
import { Common } from "UtilsCommon";

export default class Index extends Component {
    constructor(props) {
        super(props)
        this.Id = Common.CreateGuid();
    }


    SetResponseMessage(d, stateName) {
        if (d && d.IsSuccess === false && d.Message) return true;
        return false
    }

    componentWillReceiveProps2(nextProps){
    }

    ReceiveNextProps(nextProps) {
        if (this.IsNextProps(nextProps)) this.componentWillReceiveProps2(nextProps);
    }

    IsNextProps(nextProps) {
        for (let key in nextProps) if (this.props[key] !== nextProps[key]) return true;
        return false;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.ReceiveNextProps) prevState.ReceiveNextProps(nextProps);
        return null;
    }

    shouldComponentUpdate(nextProps, nextState) {
        let blChangedProps = false;

        for (let key in nextProps) {
            if (nextProps[key] !== undefined && this.props[key] !== nextProps[key]) {
                blChangedProps = true;

                if (this.SetResponseMessage(nextProps[key], key)) blChangedProps = false;

                if (blChangedProps) break;
            }
        }

        if (!blChangedProps) {
            for (let key in nextState) {
                if (this.state[key] !== nextState[key]) { blChangedProps = true; break; }
            }
        }

        return blChangedProps;
    }

    JudgeChanged(props, nextProps, name) {
        return nextProps[name] !== undefined && !Common.IsEquals(nextProps[name], props[name])
    }

    InputChange(key) {
        return (e) => this.setState({ [key]: e.target.value });
    }
}