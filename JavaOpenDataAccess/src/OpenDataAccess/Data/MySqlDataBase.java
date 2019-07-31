package OpenDataAccess.Data;

import java.sql.DriverManager;
import java.sql.SQLException;

public class MySqlDataBase extends DataBase implements IMySqlDataBase {

    MySqlDataBase(String connectionString) {
        this.SetClientType(ServerClient.MySqlClient);
        this.SetConnectionString(connectionString);
    }
}
