package OpenDataAccess.Data;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Map;

/**
 * Created by BianzhaiWang on 2017/1/11.
 */
public interface IDataParameterList {

    //设置参数
    public void Set(String name, Object value);

    //设置参数
    public void Set(Map<String,Object> map);

    //添加参数
    public void AddMap(Map<String,Object> map);

    //获取参数值
    public Object Get(String name);

    //移除参数
    public void Remove(String name);

    //移除参数
    public void RemoveAll();

    //参数化Sql
    public String ToSql(String sql);

    //设置PreparedStatement参数
    public void SetPreparedStatementParameters(PreparedStatement preparedStatement) throws SQLException;
}
