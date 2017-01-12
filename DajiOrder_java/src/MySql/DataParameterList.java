package MySql;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Types;
import java.util.*;

/**
 * Created by BianzhaiWang on 2017/1/11.
 */
public class DataParameterList implements  IDataParameterList {

    private Map<String, Object> _Parameters = null;
    private List<Object> _PreparedParameters = null;

    public DataParameterList() {
        _Parameters = new HashMap<>();
    }

    //设置参数
    @Override
    public void Set(String name, Object value) {
        if (this._Parameters.containsKey(name)) {
            this._Parameters.replace(name, value);
        } else {
            this._Parameters.put(name, value);
        }
    }

    //设置参数
    @Override
    public void Set(Map<String, Object> map) {
        this._Parameters = map;
    }

    //添加参数
    @Override
    public void AddMap(Map<String, Object> map) {
        if (this._Parameters == null) {
            this._Parameters = map;
        } else {
            this._Parameters.putAll(map);
        }
    }

    //获取参数值
    @Override
    public Object Get(String name) {
        return this._Parameters.get(name);
    }

    private String AddFrefix(String name) {
        if (!name.startsWith("@")) {
            name = "@" + name;
        }
        return name;
    }

    //移除参数
    @Override
    public void Remove(String name) {
        this._Parameters.remove(name);
    }

    //移除参数
    @Override
    public void RemoveAll() {
        this._Parameters = null;
    }

    //参数化Sql
    @Override
    public String ToSql(String sql) {
        this._PreparedParameters = new ArrayList<Object>();

        for (Map.Entry<String, Object> entry : this._Parameters.entrySet()) {
            sql = this.GetPreparedParameters(entry.getKey(), entry.getValue(), sql);
        }

        return sql;
    }

    //设置PreparedStatement参数
    @Override
    public void SetPreparedStatementParameters(PreparedStatement preparedStatement) throws SQLException {
        if (this._PreparedParameters != null && !this._PreparedParameters.isEmpty()) {

            Object value = null;
            for (int i = 0; i < this._PreparedParameters.size(); i++) {
                value = this._PreparedParameters.get(i);
                this.SetPreparedParameter(preparedStatement, i + 1, value);
            }
        }
    }

    private void SetPreparedParameter(PreparedStatement preparedStatement, int index, Object value) throws SQLException {
        if (value == null) {
            preparedStatement.setNull(index, Types.NULL);
        } else if (value instanceof String) {
            preparedStatement.setString(index, value.toString());
        } else if (value instanceof Integer) {
            preparedStatement.setInt(index, (int) value);
        } else if (value instanceof Long) {
            preparedStatement.setLong(index, (long) value);
        } else if (value instanceof Double) {
            preparedStatement.setDouble(index, (double) value);
        } else if (value instanceof Float) {
            preparedStatement.setFloat(index, (float) value);
        } else if (value instanceof Boolean) {
            preparedStatement.setBoolean(index, (boolean) value);
        } else if (value instanceof Byte) {
            preparedStatement.setByte(index, (byte) value);
        } else if (value instanceof Byte) {
            preparedStatement.setByte(index, (byte) value);
        } else if (value instanceof Date) {
            preparedStatement.setDate(index, new java.sql.Date(((Date) value).getTime()));
        } else {
            preparedStatement.setString(index, value.toString());
        }
    }

    private String GetPreparedParameters(String name, Object value, String sql) {
        name = this.AddFrefix(name);
        int index = 0;
        while (index >= 0) {
            index = sql.indexOf(name, index);
            if (index >= 0) {
                if (index == 0) {
                    sql = "?" + sql.substring(name.length());
                } else if (index == sql.length() - name.length()) {
                    sql = sql.substring(0, index) + "?";
                } else {
                    sql = sql.substring(0, index) + "?" + sql.substring(index + name.length());
                }
                this._PreparedParameters.add(value);
            }
        }

        return sql;
    }
}
