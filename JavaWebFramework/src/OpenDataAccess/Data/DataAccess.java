package OpenDataAccess.Data;

import OpenDataAccess.Utility.AppSettings;

public class DataAccess {
    private static String _ConnectionString = null;
    private static String _ServerClient = null;
    private static String _User = null;
    private static String _Password = null;

    public static <T extends IDataBase> T GetDataBase(Class<T> cls) {
        IDataBase dataBase = null;
        if (cls.getClass().equals(ISqlDataBase.class)) {
            dataBase = new SqlDataBase(GetConnectionString(), GetUser(),GetPassword());
        } else if (cls.getClass().equals(IOracleDataBase.class)) {
            dataBase = new SqlDataBase(GetConnectionString(), GetUser(),GetPassword());
        } else if (cls.getClass().equals(IMySqlDataBase.class)) {
            dataBase = new MySqlDataBase(GetConnectionString());
        } else {
            throw new IllegalArgumentException();
        }
        return (T) dataBase;
    }

    public static IDataBase GetDataBase() {
        IDataBase dataBase = null;
        String client = GetServerClient();
        if (client.equals("Sql")) {
            dataBase = new SqlDataBase(GetConnectionString(), GetUser(),GetPassword());
        } else if (client.equals("Oracle")) {
            dataBase = new OracleDataBase(GetConnectionString(), GetUser(),GetPassword());
        } else if (client.equals("MySql")) {
            dataBase = new MySqlDataBase(GetConnectionString());
        } else {
            throw new IllegalArgumentException();
        }

        return dataBase;
    }

    private static String GetServerClient() {
        if (OpenDataAccess.Utility.Common.IsNullOrEmpty(_ServerClient)) {
            _ServerClient = AppSettings.ServerClient;
            _ServerClient = OpenDataAccess.Utility.Common.IsNullOrEmpty(_ServerClient) ? "Sql" : _ServerClient;
        }
        return _ServerClient;
    }

    private static String GetConnectionString() {
        if (OpenDataAccess.Utility.Common.IsNullOrEmpty(_ConnectionString))
            _ConnectionString = AppSettings.ConnectionString;
        return _ConnectionString;
    }

    private static String GetUser() {
        if (OpenDataAccess.Utility.Common.IsNullOrEmpty(_User)) _User = AppSettings.DbUser;
        return _User;
    }

    private static String GetPassword() {
        if (OpenDataAccess.Utility.Common.IsNullOrEmpty(_Password)) _Password = AppSettings.DbPassword;
        return _Password;
    }
}
