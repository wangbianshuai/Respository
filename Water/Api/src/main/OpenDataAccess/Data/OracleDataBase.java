package OpenDataAccess.Data;

public class OracleDataBase extends DataBase implements IOracleDataBase {

    public OracleDataBase(String connectionString, String user, String password) {
        this.SetClientType(ServerClient.OracleClient);
        this.SetConnectionString(connectionString);
        this.SetUser(user);
        this.SetPassword(password);
    }
}
