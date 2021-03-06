import dva from "dva";
import React from "react";
import { createBrowserHistory, createMemoryHistory } from "history";
import ModelsConfig from "../configs/ModelsConfig";
import ModelsIndex from "./models/Index";
import { Common } from "UtilsCommon";

export default class Index {
    constructor(component, initialState, props) {
        this.Component = component;
        this.InitialState = initialState;
        this.props = props || {};
    }

    Init(rootId, path) {
        const history = rootId ? createBrowserHistory() : createMemoryHistory();
        path && history.push(path);

        this.app = new dva({ history, initialState: this.InitialState });

        this.LoadModels();

        this.app.router(() => React.createElement(this.Component, { ...this.props, App: this.app }));

        if (rootId) this.app.start("#" + rootId);
        else return this.app.start();
    }

    LoadModels() {
        ModelsConfig.forEach(m => this.app.model(Common.ToModels(new ModelsIndex(m))));
    }

    GetState() {
        return this.app._store.getState();
    }
}