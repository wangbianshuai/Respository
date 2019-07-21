package OpenDataAccess.Data;

public class SqlDataBase extends DataBase implements ISqlDataBase {

    public SqlDataBase() {
        this.SetClientType(ServerClient.SqlClient);
    }
}
