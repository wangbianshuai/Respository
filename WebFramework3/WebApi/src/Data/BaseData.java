package Data;

import LambdaInterface.IExceptionHandle;
import Oracle.DataBase;
import Oracle.DataParameterList;
import Oracle.IDataBase;
import Oracle.IDataParameterList;
import Utility.AppSettings;
import Utility.Common;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Created by Bianshuai on 2017/1/11.
 */
public class BaseData {
    public IDataBase DBAccess = null;

    public String TableName = null;

    public String PrimaryKey = null;

    public IExceptionHandle ExceptionHandle = null;

    public BaseData() {
        this.Init();
    }

    private void Init() {
        if (DataBase.ConnectionString == null) {
            DataBase.ConnectionString = AppSettings.ConnectionString;
            DataBase.User = AppSettings.DbUser;
            DataBase.Password = AppSettings.DbPassword;
        }
        this.DBAccess = new DataBase();
    }

    public BaseData(IExceptionHandle exHandle) {
        this.Init();
        this.ExceptionHandle = exHandle;
    }

    public <T> List<T> SelectEntities(Class<T> cls, String sql, IDataParameterList parameterList) {
        try {
            return this.DBAccess.ExceSelectTo(cls, sql, parameterList);
        } catch (Exception ex) {
            this.ExHandling(ex);
            return null;
        }
    }

    private void ExHandling(Exception ex) {
        if (this.ExceptionHandle != null) {
            this.ExceptionHandle.Handling(ex);
        }
    }

    public <T> List<T> SelectEntities(Class<T> cls, List<String> selectFieldList, Map<String, Object> whereNameValues) {
        IDataParameterList parameterList = new DataParameterList();

        List<String> fieldList = whereNameValues.keySet().stream().map(m -> String.format("%s=@%s ", m, m)).collect(Collectors.toList());
        parameterList.Set(whereNameValues);

        String selectFieldSql = selectFieldList == null ? "*" : String.join(",", selectFieldList);

        String sql = String.format("select %s from %s where %s", selectFieldSql, this.TableName, String.join(" and ", fieldList));

        return this.SelectEntities(cls, sql, parameterList);
    }

    public <T> List<T> SelectEntities(Class<T> cls) {
        String sql = String.format("select * from %s", this.TableName);
        return this.SelectEntities(cls, sql, null);
    }

    public <T> T SelectEntity(Class<T> cls, String sql, IDataParameterList parameterList) {
        return Common.GetFirstOrDefault(cls, this.SelectEntities(cls, sql, parameterList));
    }

    public <T> T SelectEntity(Class<T> cls, List<String> selectFieldList, Map<String, Object> whereNameValues) {
        return Common.GetFirstOrDefault(cls, this.SelectEntities(cls, selectFieldList, whereNameValues));
    }

    public boolean Insert(Map<String, Object> nameValues) {
        Set<String> nameList = nameValues.keySet();

        String sql = String.format("insert %s (%s) values (%s)", this.TableName, String.join(",", nameList),
                String.join(",", nameList.stream().map(s -> String.format("@%s", s)).collect(Collectors.toList())));

        IDataParameterList parameterList = new DataParameterList();
        parameterList.Set(nameValues);

        return this.ExceNoQuery(sql, parameterList) == 1;
    }

    public int ExceNoQuery(String sql, IDataParameterList parameterList) {
        try {
            return this.DBAccess.ExceNoQuery(sql, parameterList);
        } catch (Exception ex) {
            this.ExHandling(ex);
            return -1;
        }
    }

    public boolean Update(Map<String, Object> nameValues, String whereSql, IDataParameterList parameterList) {
        if (parameterList == null) {
            parameterList = new DataParameterList();
        }

        List<String> fieldList = nameValues.keySet().stream().map(m -> String.format("%s=@%s", m, m)).collect(Collectors.toList());
        parameterList.AddMap(nameValues);

        String sql = String.format("update %s set %s %s", this.TableName, String.join(",", fieldList), whereSql);

        return this.ExceNoQuery(sql, parameterList) == 1;
    }

    public boolean Update(Map<String, Object> nameValues, Map<String, Object> whereNameValues) {
        IDataParameterList parameterList = new DataParameterList();
        parameterList.Set(whereNameValues);

        List<String> fieldList = whereNameValues.keySet().stream().map(m -> String.format("%s=@%s", m, m)).collect(Collectors.toList());

        String whereSql = String.format("where %s", String.join(" and ", fieldList));

        return this.Update(nameValues, whereSql, parameterList);
    }

    public boolean Update(Map<String, Object> nameValues, Object primaryKeyValue) {
        Map<String, Object> whereNameValues = new HashMap<>();
        whereNameValues.put(this.PrimaryKey, primaryKeyValue);
        return this.Update(nameValues, whereNameValues);
    }

    public boolean Delete(Map<String, Object> whereNameValues) {
        IDataParameterList parameterList = new DataParameterList();
        parameterList.Set(whereNameValues);

        List<String> fieldList = whereNameValues.keySet().stream().map(m -> String.format("%s=@%s", m, m)).collect(Collectors.toList());

        String sql = String.format("delete from %s where %s", this.TableName, String.join(" and ", fieldList));

        return this.ExceNoQuery(sql, parameterList) > 0;
    }

    public boolean Delete(Object primaryKeyValue) {
        Map<String, Object> whereNameValues = new HashMap<>();
        whereNameValues.put(this.PrimaryKey, primaryKeyValue);
        return this.Delete(whereNameValues);
    }
}
