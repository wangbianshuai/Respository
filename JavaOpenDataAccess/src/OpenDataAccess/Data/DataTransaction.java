package OpenDataAccess.Data;

import java.sql.Connection;
import java.sql.SQLException;

public class DataTransaction implements IDataTransaction {

    Connection _Connection = null;
    public DataTransaction(Connection connection) throws SQLException {
        _Connection = connection;
        _Connection.setAutoCommit(false);
    }

    public Connection GetConnection() {
        return _Connection;
    }

    public boolean CommitTransaction(boolean blSucceed) throws  SQLException {
        try {
            if (blSucceed) {
                _Connection.commit();
                return true;
            } else {
                _Connection.rollback();
                return false;
            }
        } catch (Exception ex) {
            _Connection.rollback();
            return false;
        } finally {
            _Connection.close();
        }
    }
}
