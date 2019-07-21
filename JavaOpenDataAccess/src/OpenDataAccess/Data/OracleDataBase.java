package OpenDataAccess.Data;

public class OracleDataBase extends DataBase implements IOracleDataBase {

    public OracleDataBase() {
        this.SetClientType(ServerClient.OracleClient);
    }
}
