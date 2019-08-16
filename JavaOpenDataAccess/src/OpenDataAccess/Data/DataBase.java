package OpenDataAccess.Data;

import OpenDataAccess.Utility.Common;

import java.lang.reflect.Field;
import java.sql.*;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by BianzhaiWang on 2017/1/11.
 */
public class DataBase implements IDataBase {

    private Connection _Connection = null;
    private Statement _Statement = null;
    private String _ConnectionString = null;
    private String _User = null;
    private String _Password = null;
    private PreparedStatement _PrearedStatement = null;
    private ResultSet _ResultSet = null;
    private ServerClient _ClientType;

    //获取链接
    @Override
    public Connection GetConnection() {
        return this._Connection;
    }

    //设置链接字符串
    @Override
    public void SetConnectionString(String connectionString) {
        this._ConnectionString = connectionString;
    }

    //获取链接字符串
    @Override
    public String GetConnectionString() {
        return this._ConnectionString;
    }

    public void SetUser(String value) {
        _User = value;
    }

    public String GetUser() {
        return _User;
    }

    public String GetPassword() {
        return _Password;
    }

    public void SetPassword(String value) {
        _Password = value;
    }

    public ServerClient GetClientType() {
        return _ClientType;
    }

    public void SetClientType(ServerClient value) {
        _ClientType = value;
    }

    public Connection CreateConnection() throws SQLException {
        try {
            if (_ClientType == ServerClient.OracleClient) {
                Class.forName("oracle.jdbc.driver.OracleDriver");
                _Connection = DriverManager.getConnection(this._ConnectionString, _User, _Password);
            } else if (_ClientType == ServerClient.MySqlClient) {
                Class.forName("com.mysql.cj.jdbc.Driver");
                _Connection = DriverManager.getConnection(this._ConnectionString, _User, _Password);
            } else {
                Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
                _Connection = DriverManager.getConnection(this._ConnectionString, _User, _Password);
            }
            return _Connection;
        } catch (ClassNotFoundException ex) {
            throw new SQLException(ex);
        }
    }

    //执行无查询语句
    @Override
    public int ExceNoQuery(String sql, IDataParameterList parameterList, IDataTransaction trans) throws SQLException {
        try {
            if(trans!=null) _Connection= trans.GetConnection();
            else this.CreateConnection();

            if (parameterList == null) {
                this._Statement = this._Connection.createStatement();
                return this._Statement.executeUpdate(sql);
            } else {
                sql = parameterList.ToSql(sql);
                this._PrearedStatement = this._Connection.prepareStatement(sql);
                parameterList.SetPreparedStatementParameters(this._PrearedStatement);
                return this._PrearedStatement.executeUpdate();
            }
        } catch (SQLException ex) {
            throw ex;
        } finally {
            this.CloseConnction(trans!=null);
        }
    }

    private void CloseConnction(boolean blTrans) throws SQLException {
        if (this._Statement != null) {
            this._Statement.close();
            this._Statement = null;
        }

        if (this._PrearedStatement != null) {
            this._PrearedStatement.close();
            this._PrearedStatement = null;
        }

        if (this._ResultSet != null) {
            this._ResultSet.close();
            this._ResultSet = null;
        }

        if (this._Connection != null && !blTrans) {
            this._Connection.close();
            this._Connection = null;
        }
    }

    //执行查询语句
    @Override
    public List<Map<String, Object>> ExceSelect(String sql, IDataParameterList parameterList) throws SQLException,Exception {
        try {
            this.ExcelQueryToResultSet(sql, parameterList);
            return this.ResultSetToList();
        } catch (SQLException ex) {
            throw ex;
        } finally {
            this.CloseConnction(false);
        }
    }

    private void ExcelQueryToResultSet(String sql, IDataParameterList parameterList) throws SQLException {
        this.CreateConnection();

        if (parameterList == null) {
            this._Statement = this._Connection.createStatement();
            this._ResultSet = this._Statement.executeQuery(sql);
        } else {
            sql = parameterList.ToSql(sql);
            this._PrearedStatement = this._Connection.prepareStatement(sql);
            parameterList.SetPreparedStatementParameters(this._PrearedStatement);
            this._ResultSet = this._PrearedStatement.executeQuery();
        }
    }

    public ResultSet ExceToResultSet(String sql, IDataParameterList parameterList) throws SQLException {
        try {
            this.ExcelQueryToResultSet(sql, parameterList);
            return _ResultSet;
        } catch (SQLException ex) {
            throw ex;
        } finally {
            this.CloseConnction(false);
        }
    }

    //执行查询语句
    @Override
    public <T> List<T> ExceSelectTo(Class<T> cls, String sql, IDataParameterList parameterList) throws SQLException, Exception, IllegalAccessException, InstantiationException {
        try {
            this.ExcelQueryToResultSet(sql, parameterList);
            return this.ResultSetToList2(cls);
        } catch (SQLException ex) {
            throw ex;
        } catch (IllegalAccessException ex) {
            throw ex;
        } catch (InstantiationException ex) {
            throw ex;
        } catch (Exception ex) {
            throw ex;
        } finally {
            this.CloseConnction(false);
        }
    }

    private List<Map<String, Object>> ResultSetToList() throws SQLException, Exception {
        if (this._ResultSet != null) {
            List<Map<String, Object>> list = new ArrayList<>();

            Map<String, Object> map = null;

            ResultSetMetaData metaData = this._ResultSet.getMetaData();
            int iColNum = metaData.getColumnCount();
            String columnName = "";
            Object value=null;
            while (this._ResultSet.next()) {
                map = new HashMap<>();

                for (int i = 1; i <= iColNum; i++) {
                    columnName = metaData.getColumnLabel(i);
                    value = _ResultSet.getObject(i);
                    if(value instanceof  NClob) value= Common.Clob2String((NClob)value);
                    map.put(columnName, value);
                }

                list.add(map);
            }
            return list;
        }

        return null;
    }

    private <T> List<T> ResultSetToList2(Class<T> cls) throws SQLException, Exception, IllegalAccessException, InstantiationException {
        if (this._ResultSet != null) {
            List<T> list = new ArrayList<>();

            T obj = null;

            Map<Integer, Field> fieldMap = new HashMap<>();

            ResultSetMetaData metaData = this._ResultSet.getMetaData();
            int iColNum = metaData.getColumnCount();
            String columnName = "";
            Field[] fields = null;
            Field field = null;
            Object value = null;

            while (this._ResultSet.next()) {
                obj = cls.newInstance();
                if (fields == null) fields = cls.getFields();

                for (int i = 1; i <= iColNum; i++) {
                    columnName = metaData.getColumnLabel(i);
                    value = _ResultSet.getObject(i);
                    if (value instanceof NClob) value = Common.Clob2String((NClob) value);

                    field = this.GetField(i, fieldMap, fields, columnName);
                    if (field != null) field.set(obj, Common.ChangeType(field.getType(), value));
                }

                list.add(obj);
            }
            return list;
        }

        return null;
    }

    private Field GetField(int index, Map<Integer, Field> fieldMap, Field[] fields, String columnName) {
        Field field = fieldMap.get(index);

        if (field == null && columnName != null) {
            for (int i = 0; i < fields.length; i++) {
                if (fields[i].getName().toLowerCase().equals(columnName.toLowerCase())) {
                    field = fields[i];
                    fieldMap.put(index, field);
                    break;
                }
            }
        }

        return field;
    }
}
