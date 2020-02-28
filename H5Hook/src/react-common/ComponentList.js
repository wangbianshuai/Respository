import { useState, useMemo } from "react"

export default (props) => {
    const [list, setList] = useState([]);
    const obj = useMemo(() => new Index(), []);

    obj.Init(props, list, setList);

    obj.List = list;

    return list;
}

class Index {
    Init(props, list, setList) {
        if (!this.IsInit) this.IsInit = true; else return;

        this.List = list;
        this.setList = setList
        const { Name, Page } = props;
        Page.InitInstance(Name, this.Invoke());
    }

    Invoke() {
        return (name) => (this[name]) ? this[name].bind(this) : function () { };
    }

    AddList(list) {
        this.List = this.List.concat(list);
        this.setList(this.List);
        return this.List;
    }

    Add(item) {
        this.List = this.List.map(m => m);
        this.List.push(item);
        this.setList(this.List);
        return this.List;
    }
}