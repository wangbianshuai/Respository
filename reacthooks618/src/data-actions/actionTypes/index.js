const actionTypes = {};

export default (name) => {
    if (actionTypes[name]) return actionTypes[name];
    const path = name.replace("_", "/");
    actionTypes[name] = require(`./${path}`).default;
    return actionTypes[name];
};