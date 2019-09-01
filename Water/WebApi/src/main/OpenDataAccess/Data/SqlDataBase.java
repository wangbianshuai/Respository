package OpenDataAccess.Data;

public class SqlDataBase extends DataBase implements ISqlDataBase {

    public SqlDataBase(String connectionString, String user, String password) {
        this.SetClientType(ServerClient.SqlClient);
        this.SetConnectionString(connectionString);
        this.SetUser(user);
        this.SetPassword(password);
    }
}
