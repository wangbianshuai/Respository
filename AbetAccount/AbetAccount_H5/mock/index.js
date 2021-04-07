// eslint-disable-next-line import/no-commonjs
module.exports = {
  "GET /abet/h5/configs/getconfig": getConfig
};

function getConfig(req, res) {
  try{
  const name = req.query.name;
  const pathUrl = name.replace("_", "/");

  for (var key in require.cache) delete require.cache[key];
  const pageConfig = require(`../page-configs/pages/${pathUrl}`);
  res.send(pageConfig);
  }
  catch(ex){
    console.log(ex)
  }
}
