package OpenDataAccess.Data;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

/**
 * Created by BianzhaiWang on 2017/1/11.
 */
public interface IDataBase {

    //获取链接
    public Connection GetConnection();

    //设置链接字符串
    void SetConnectionString(String connectionString);

    //获取链接字符串
    public String GetConnectionString();

    void SetUser(String value);

    String GetUser();

    String GetPassword();

    void SetPassword(String value);

    ServerClient GetClientType();

    void SetClientType(ServerClient value);

    public Connection CreateConnection() throws SQLException;

    //执行无查询语句
    public int ExceNoQuery(String sql, IDataParameterList parameterList, IDataTransaction trans) throws SQLException;

    //执行查询语句
    public List<Map<String, Object>> ExceSelect(String sql, IDataParameterList parameterList) throws SQLException, Exception;

    public ResultSet ExceToResultSet(String sql, IDataParameterList parameterList) throws SQLException;

    //执行查询语句
    public <T> List<T> ExceSelectTo(Class<T> cls, String sql, IDataParameterList parameterList) throws SQLException, Exception, IllegalAccessException, InstantiationException;
}
