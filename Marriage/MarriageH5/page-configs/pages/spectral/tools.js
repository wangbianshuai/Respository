//spectral/tools 3100-3199

module.exports = {
    name: "tools",
    type: "View",
    eventActions: [],
    properties: [getTabs(), getEditView()]
}

function getEditView() {
    return {
        name: "editView",
        type: "View",
        isDiv: true,
        className: 'divDetail',
        properties: [getEditView2()]
    }
}

function getEditView2() {
    return {
        name: "toolsEdit",
        type: "RowsColsView",
        isDiv: true,
        className: 'divDetail3',
        properties: getProperties()
    }
}

function getTabs() {
    return {
        name: 'tabs1',
        type: 'Tabs',
        isDiv: true,
        className: 'tabDetail',
        tabs: [{ title: '活动', url: "/spectral/list?tabPage=0" },
        { title: '科研经验', url: "/spectral/list?tabPage=1" },
        { title: '云课堂', url: "/spectral/list?tabPage=2" },
        { title: '工具', url: "/spectral/list?tabPage=3" }]
    }
}

function getProperties() {
    return [
        { name: 'tools1', type: 'tools1'},
        { name: 'tools2', type: 'tools2'},
        { name: 'tools3', type: 'tools3'},
        { name: 'tools4', type: 'tools4'},
    ]
}


