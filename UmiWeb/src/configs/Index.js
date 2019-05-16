export default (name) => {
    const path = name.replace("_", "/");
    return require(`./pages/${path}`).default;
};