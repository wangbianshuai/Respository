export default {
    "GET /risk/configs/getconfig": GetConfig
};

function GetConfig(req, res) {
    const name = req.query.name;
    const pathUrl = name.replace("_", "/");

    for (var key in require.cache) delete require.cache[key];
    const pageConfig = require(`../../configs/pages/${pathUrl}`);
    res.send(pageConfig);
}