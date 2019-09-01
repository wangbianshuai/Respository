package OpenDataAccess.Utility;

import OpenDataAccess.LambdaInterface.IFunction1;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Supplier;

/**
 * Created by Bianshuai on 2017/1/11.
 */
public class AppSettings {
    public static String GetConnectionString(){
        return GetConfig("OpenDataAccess.Data.ConnectionString");
    }
    public static String GetDbUser(){
        return GetConfig("OpenDataAccess.Data.DbUser");
    }
    public static String GetDbPassword(){
        return GetConfig("OpenDataAccess.Data.DbPassword");
    }
    public static String GetServerClient(){
        return GetConfig("OpenDataAccess.Data.ServerClient");
    }
    public static String GetIsLog(){
        return GetConfig("OpenDataAccess.IsLog");
    }

    public static final String DateFormat = "yyyy-MM-dd HH:mm:ss.SSS";

    public static IFunction1<String,String> InvokeConfig=null;

    private static Map<String, String> _data = new HashMap<>();
    public static String GetConfig(String name) {
        if(InvokeConfig==null) return null;
        if (_data.containsKey(name)) return _data.get(name);

        String value = InvokeConfig.Invoke(name);
        _data.put(name, value);
        return value;
    }
}