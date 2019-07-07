package Oracle;

import Utility.Common;

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

    private Connection _Connection=null;
    private  Statement _Statement=null;
    private  String _ConnectionString=null;
    private  String _User=null;
    private  String _Password=null;
    private  PreparedStatement _PrearedStatement=null;
    private  ResultSet _ResultSet=null;

    public static String ConnectionString=null;
    public static String User=null;
    public static String Password=null;

    public DataBase() {
        this._ConnectionString = ConnectionString;
        _User = User;
        _Password = Password;
    }

    //获取链接
    @Override
    public Connection GetConnection() {
        return this._Connection;
    }

    //设置链接字符串
    @Override
    public String SetConnectionString(String connectionString) {
        this._ConnectionString = connectionString;
        return  this._ConnectionString;
    }

    //获取链接字符串
    @Override
    public String GetConnectionString() {
        return this._ConnectionString;
    }

    private void CreateConnection() throws SQLException {
        try {
            Class.forName("oracle.jdbc.driver.OracleDriver");
            _Connection = DriverManager.getConnection(this._ConnectionString,_User,_Password);
        } catch (ClassNotFoundException ex) {
            throw new SQLException(ex);
        }
    }

    //执行无查询语句
    @Override
    public int ExceNoQuery(String sql, IDataParameterList parameterList) throws SQLException {
        try {
            this.CreateConnection();

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
           this.CloseConnction();
        }
    }

    private void  CloseConnction() throws SQLException {
        if (this._Statement != null) {
            this._Statement.close();
            this._Statement = null;
        }

        if (this._PrearedStatement != null) {
            this._PrearedStatement.close();
            this._PrearedStatement = null;
        }

        if(this._ResultSet!=null) {
            this._ResultSet.close();
            this._ResultSet = null;
        }

        if (this._Connection != null) {
            this._Connection.close();
            this._Connection = null;
        }
    }

    //执行查询语句
    @Override
    public List<Map<String, Object>> ExceSelect(String sql, IDataParameterList parameterList) throws SQLException {
        try {
            this.ExcelQueryToResultSet(sql, parameterList);
            return this.ResultSetToList();
        } catch (SQLException ex) {
            throw ex;
        } finally {
            this.CloseConnction();
        }
    }

    private  void ExcelQueryToResultSet(String sql, IDataParameterList parameterList) throws SQLException {
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

    //执行查询语句
    @Override
    public <T> List<T> ExceSelectTo(Class<T> cls, String sql, IDataParameterList parameterList) throws SQLException,Exception, IllegalAccessException,InstantiationException {
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
            this.CloseConnction();
        }
    }

    private List<Map<String,Object>> ResultSetToList() throws SQLException {
        if (this._ResultSet != null) {
            List<Map<String, Object>> list = new ArrayList<>();

            Map<String, Object> map = null;

            ResultSetMetaData metaData = this._ResultSet.getMetaData();
            int iColNum = metaData.getColumnCount();
            String columnName = "";
            while (this._ResultSet.next()) {
                map = new HashMap<>();

                for (int i = 1; i <= iColNum; i++) {
                    columnName = metaData.getColumnName(i);
                    map.put(columnName, this._ResultSet.getObject(i));
                }

                list.add(map);
            }
            return list;
        }

        return null;
    }

    private <T> List<T> ResultSetToList2(Class<T> cls) throws SQLException,Exception,IllegalAccessException,InstantiationException {
        if (this._ResultSet != null) {
            List<T> list = new ArrayList<>();

            T obj = null;

            Map<Integer, Field> fieldMap = new HashMap<>();

            ResultSetMetaData metaData = this._ResultSet.getMetaData();
            int iColNum = metaData.getColumnCount();
            String columnName = "";
            Field[] fields = null;
            Field field = null;
            boolean blFirst = true;

            while (this._ResultSet.next()) {
                obj = cls.newInstance();
                if (fields == null) {
                    fields = cls.getFields();
                }

                for (int i = 1; i <= iColNum; i++) {
                    if (blFirst) {
                        columnName = metaData.getColumnName(i);
                    }

                    field = this.GetField(i, fieldMap, fields, columnName);
                    if (field != null) {
                        field.set(obj, Common.ChangeType(field.getType(), this._ResultSet.getObject(i)));
                    }
                }

                blFirst = false;
                columnName = null;
                list.add(obj);
            }
            return list;
        }

        return null;
    }

    private  Field GetField(int index,Map<Integer,Field> fieldMap,Field[] fields,String columnName) {
        Field field = fieldMap.get(index);

        if (field == null && columnName != null) {
            for (int i = 0; i < fields.length; i++) {
                if (fields[i].getName().toLowerCase().equals(columnName.toLowerCase())) {
                    field= fields[i];
                    fieldMap.put(index, field);
                    break;
                }
            }
        }

        return field;
    }
}
