package OpenDataAccess.Data;

import java.sql.Connection;
import java.sql.SQLException;

public interface IDataTransaction {
    Connection GetConnection();

    boolean CommitTransaction(boolean blSucceed) throws SQLException;
}
