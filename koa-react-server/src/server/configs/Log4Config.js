export default {
    appenders: {
        errorLogger: { type: 'dateFile', alwaysIncludePattern: true, pattern: "-yyyy-MM-dd-hh.log", filename: "logs/error/error" },
        resLogger: { type: 'dateFile', category: "resLogger", alwaysIncludePattern: true, pattern: "-yyyy-MM-dd-hh.log", filename: "logs/trace/trace" },
        infoLogger: { type: 'dateFile', category: "infoLogger", alwaysIncludePattern: true, pattern: "-yyyy-MM-dd-hh.log", filename: "logs/info/info" },
    },
    categories: {
        default: { appenders: ['errorLogger'], level: "ERROR" },
        resLogger: { appenders: ["resLogger"], level: "TRACE" },
        infoLogger: { appenders: ["infoLogger"], level: "INFO" },
    }
}
