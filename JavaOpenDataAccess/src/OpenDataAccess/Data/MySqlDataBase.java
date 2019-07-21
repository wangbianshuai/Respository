package OpenDataAccess.Data;

import java.sql.DriverManager;
import java.sql.SQLException;

public class MySqlDataBase extends DataBase implements IMySqlDataBase {

    MySqlDataBase() {
        this.SetClientType(ServerClient.MySqlClient);
    }
}
