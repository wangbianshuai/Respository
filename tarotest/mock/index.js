// eslint-disable-next-line import/no-commonjs
module.exports = {
  "GET /getConfig": getConfig
};

function getConfig(req, res) {
  const name = req.query.name;
  const pathUrl = name.replace("_", "/");

  for (var key in require.cache) delete require.cache[key];
  const pageConfig = require(`../page-configs/pages/${pathUrl}`);
  res.send(pageConfig);
}
