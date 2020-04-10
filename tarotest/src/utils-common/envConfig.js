import Taro from "@tarojs/taro";

const serviceConfig = {
  ApiService: getApiSericeUrl
};

const envConfig = {
  getServiceUrl,
  getPageConfigUrl,
  env: null,
  isProd: isProd()
}

function isProd() {
  return process.env.NODE_ENV === 'production'
}

function getApiSericeUrl() {
  return "/api/";
}

function getServiceUrl(serverName) {
  return () => {
    let hostName = ""
    if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) hostName = 'https://sabg.beyondsoft.com/workreport'
    return hostName + serviceConfig[serverName]();
  }
}

function getPageConfigUrl(name) {
  let url = 'http://localhost:3721/getConfig?name=' + name;
  if (envConfig.isProd) url = 'https://sabg.beyondsoft.com/workreport/miniprogramconfigs/' + name.replace('_', '/') + '.json';
  return url;
}

export default envConfig;
