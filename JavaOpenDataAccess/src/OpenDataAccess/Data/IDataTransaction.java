package OpenDataAccess.Data;

import java.sql.Connection;

public interface IDataTransaction {
    Connection CreateConnection(String connectionString, String userId, String Password);

    Connection GetConnection();

    void Commit();
}
