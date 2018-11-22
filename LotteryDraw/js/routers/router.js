import React, { Navigator } from 'react-native'
import * as sceneConfig from '../configs/sceneConfig'
import Common from "../utils/Common"

export default class Router {
    constructor(navigator, route, getRoute) {
        this.navigator = navigator
        this.Route = route
        this.GetRoute = getRoute

        this.Route.Index = this.Route.Index || 0
    }

    push(name, props = null) {
        let route = this.GetRoute(name)
        if (!route) { return }

        const routesList = this.navigator.getCurrentRoutes()
        route.index = routesList[routesList.length - 1].Index + 1
        route.sceneConfig = sceneConfig.customFloatFromRight

        this.navigator.push({
            ...route,
            props
        })
    }

    replace(name, props = null) {
        let route = this.GetRoute(name)
        if (!route) { return }

        const routesList = this.navigator.getCurrentRoutes()
        route.index = routesList[routesList.length - 1].Index + 1
        route.sceneConfig = sceneConfig.customFloatFromRight

        this.navigator.replace({
            ...route,
            props
        })
    }

    pop() {
        if (this.navigator && this.navigator.getCurrentRoutes().length > 1) {
            this.navigator.pop()
            return true
        }
        else {
            return false
        }
    }

    replaceWithHome() {
        this.navigator.popToTop()
    }
}

