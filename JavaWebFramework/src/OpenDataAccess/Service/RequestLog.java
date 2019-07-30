package OpenDataAccess.Service;

import OpenDataAccess.Entity.EntityData;
import OpenDataAccess.Entity.IEntityData;
import OpenDataAccess.Utility.AppSettings;
import OpenDataAccess.Utility.Common;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadPoolExecutor;

public class RequestLog {
    public static Boolean IsLog = false;

    static {
        String isLog = AppSettings.GetIsLog();
        IsLog = !Common.IsNullOrEmpty(isLog) && Boolean.parseBoolean(isLog);
    }

    public static void AddRequestLog(Request request, Object obj, String responseContent) {
        if (IsLog) {
            new Thread(new Runnable() {
                @Override
                public void run() {
                    AsyncWriteRequestLog(request, obj, responseContent);
                }
            }).start();
        }
    }

    public static void AsyncWriteRequestLog(Request request, Object obj, String responseContent) {
        try {
            String logType = "Success";
            if (obj instanceof Map) {
                Map<String, Object> map = (Map<String, Object>) obj;
                if (map.containsKey("Exception")) logType = "Exception";
                else if (map.containsKey("Message")) logType = "Message";
            }

            if (logType.equals("Success")) {
                if (!Common.IsNullOrEmpty(request.MethodName)) {
                    if (!request.IsLog) return;
                }

                if (request.Entity.LogAttribute != null) {
                    if (request.RequestType.equals("GET")) {
                        if (!request.Entity.LogAttribute.IsGet) return;
                    } else if (request.RequestType.equals("POST")) {
                        if (request.IsPostQuery && !request.Entity.LogAttribute.IsPostQuery) return;
                        else if (!request.Entity.LogAttribute.IsPost) return;
                    } else if (request.RequestType.equals("PUT")) {
                        if (!request.Entity.LogAttribute.IsPut) return;
                    } else if (request.RequestType.equals("DELETE")) {
                        if (!request.Entity.LogAttribute.IsDelete) return;
                    }
                }
            }

            WriteLog(request, logType, responseContent);
        } catch (Exception ex) {
            System.out.print(ex.getStackTrace());
        }
    }

    private static void WriteLog(Request request, String logType, String responseContent) throws Exception {
        String logFilesName = "Log_" + Common.DateToString(new Date(), "yyyy-MM-dd");
        String path = "Logs/" + logFilesName + "/" + logType + "/" + request.EntityName + "/";

        if (!Common.IsNullOrEmpty(request.MethodName)) path += request.MethodName;
        else if (request.RequestType.equals("POST") && request.IsPostQuery) path += "PostQuery";
        else path += request.RequestType;

        String logPath = path;

        if (Common.IsNullOrEmpty(request.RootPath)) request.RootPath = "";
        path = request.RootPath + path.replace("/", "\\");

        File dir = new File(path);
        if (!dir.exists()) dir.mkdirs();

        String fileName = request.EntityName + "_" + request.GetRequestId().substring(0, 8).toUpperCase() + ".txt";
        path += "/" + fileName;
        logPath += "/" + fileName;

        File file = new File(path);
        if (!file.exists()) file.createNewFile();

        FileWriter fw = new FileWriter(path, true);
        BufferedWriter writer = new BufferedWriter(fw);

        if (request.CustomWriterLog == null) {
            writer.write("Request:");
            WriteLine(writer, "                         Url:" + request.RawUrl);
            WriteLine(writer, "                        Data:" + request.Content);
            WriteLine(writer, "                  EntityName:" + request.EntityName);
            WriteLine(writer, "                  MethodName:" + request.MethodName);
            WriteLine(writer, "                 RequestType:" + request.RequestType);
            WriteLine(writer, "                   IPAddress:" + request.IPAddress);
            WriteLine(writer, "               OperationUser:" + request.OperationUser);
            WriteLine(writer, "                   StartTime:" + Common.DateToString(request.StartTime, "yyyy-MM-dd HH:mm:ss:SSS"));
            WriteLine(writer, "                     EndTime:" + Common.DateToString(request.EndTime, "yyyy-MM-dd HH:mm:ss.SSS"));
            WriteLine(writer, "         ElapsedMilliseconds:" + request.ElapsedMilliseconds);
            WriteLine(writer, "");
            WriteLine(writer, "");
            WriteLine(writer, "");
            WriteLine(writer, "Response:");
            WriteLine(writer, responseContent);
            if (request.Excption != null) {
                WriteLine(writer, "Excption:");
                WriteLine(writer, "           Message:" + request.Excption.getMessage());
                WriteLine(writer, "           StackTrace:" + request.Excption.getStackTrace());
            }
            writer.flush();
            writer.close();
            fw.close();

        } else request.CustomWriterLog.Invoke(writer, responseContent);
        if (request.OperationLogEntity != null) InsertOperationLog(request, logType, logPath);
    }

    static void WriteLine(BufferedWriter writer, String str) throws IOException {
        writer.newLine();
        writer.write(str);
    }

    private static void InsertOperationLog(Request request, String logType, String logPath) {
        try {
            IEntityData entityData = new EntityData(request.OperationLogEntity);
            entityData.SetValue("LogType", logType);
            entityData.SetValue("LogPath", logPath);
            entityData.SetValue("EntityName", request.EntityName);
            entityData.SetValue("RequestType", request.RequestType);
            entityData.SetValue("MethodName", request.MethodName);
            entityData.SetValue("StartTime", request.StartTime);
            entityData.SetValue("EndTime", request.EndTime);
            entityData.SetValue("ElapsedMilliseconds", request.ElapsedMilliseconds);
            entityData.SetValue("OperationUser", request.OperationUser);
            entityData.SetValue("IPAddress", request.IPAddress);

            EntityRequest entityRequest = new EntityRequest();
            Object primaryKey = entityRequest.InsertEntity(request.OperationLogEntity, entityData, null);
        } catch (Exception ex) {
        }
    }
}
