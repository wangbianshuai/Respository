package OpenDataAccess.Data;

import OpenDataAccess.LambdaInterface.IExceptionHandle;

import java.sql.Connection;
import java.sql.SQLException;

public interface IDataTransaction {
    Connection GetConnection();

    boolean CommitTransaction(boolean blSucceed) throws SQLException;

    boolean CommitTransaction(boolean blSucceed, IExceptionHandle exHandle);
}
