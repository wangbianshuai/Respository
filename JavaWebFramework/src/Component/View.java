package Component;

import OpenDataAccess.Data.IOracleDataBase;
import OpenDataAccess.Service.EntityRequest;
import OpenDataAccess.Service.Request;
import OpenDataAccess.Utility.Common;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

public class View extends EntityRequest {
    public View() {
    }

    public View(Request request) {
        super(request);
    }

    private ResultSet GetSqlColumn(String connectionString, String tableName) throws SQLException {
        this.GetDataBase().SetConnectionString(connectionString);
        String sqlText = "select * from " + tableName + " where 1= 0";
        return GetDataBase().ExceToResultSet(sqlText, null);
    }

    private List<Map<String, Object>> GetSqlColumnType(String connectionString, String tableName) throws SQLException, Exception {
        this.GetDataBase().SetConnectionString(connectionString);
        String sqlText = String.format("SELECT o.name as TableName, c.name AS ColumnName, TYPE_NAME(c.user_type_id) AS TypeName, max_length as TypeLength, is_Nullable as IsNullable, isnull(ep.value, '') AS ColumnComments, ISNULL(d.is_primary_key, 0) as IsPrimaryKey FROM sys.objects AS o JOIN sys.columns AS c ON o.object_id = c.object_id LEFT JOIN sys.extended_properties ep ON c.object_id = ep.major_id and c.column_id = ep.minor_id left join (select a.object_id, b.column_id, a.is_primary_key from sys.indexes a, sys.index_columns b, sys.key_constraints c where a.index_id = b.index_id and a.object_id = b.object_id and a.object_id = c.parent_object_id and a.is_primary_key = 1) d on c.object_id = d.object_id and c.column_id = d.column_id WHERE o.name = '%s' ORDER BY c.column_id", tableName);

        if (this.GetDataBase() instanceof IOracleDataBase) {
            sqlText = String.format("select a.Table_Name TableName, a.COLUMN_NAME ColumnName, a.DATA_TYPE TypeName, a.Data_Length TypeLength, a.Nullable IsNullable, nvl(b.comments, '') ColumnComments, nvl(e.is_primary_key, 0) IsPrimaryKey from user_tab_columns a left join user_col_comments b on a.TABLE_NAME = b.TABLE_NAME and a.COLUMN_NAME = b.COLUMN_NAME left join (select c.Table_Name, c.Column_Name, 1 is_primary_key from user_cons_columns c, user_constraints d where c.constraint_name = d.constraint_name and d.constraint_type = 'P' and d.Table_Name=d.Table_Name) e on a.TABLE_NAME = e.Table_Name and a.COLUMN_NAME = e.column_name where upper(a.Table_Name) = upper('%s')", tableName);
        }

        return this.GetDataBase().ExceSelect(sqlText, null);
    }

    private String GetFieldType(String name) {
        String fieldType = "";
        switch (name) {
            case "String": {
                fieldType = "String";
                break;
            }
            case "Date": {
                fieldType = "Date";
                break;
            }
            case "TimeSpan": {
                fieldType = "TimeSpan";
                break;
            }
            case "Int16": {
                fieldType = "short";
                break;
            }
            case "Int32": {
                fieldType = "int";
                break;
            }
            case "Int64": {
                fieldType = "long";
                break;
            }
            case "Boolean": {
                fieldType = "bool";
                break;
            }
            case "Single": {
                fieldType = "float";
                break;
            }
            default: {
                fieldType = name.toLowerCase();
                break;
            }
        }
        return fieldType;
    }

    public Object GetTableEntityType() {
        try {
            String connectionString = this.GetRequest().GetParameterValue("ConnectionString");
            String tableName = this.GetRequest().GetParameterValue("TableName");
            List<Map<String, Object>> dictList = new ArrayList<>();

            List<Map<String, Object>> dtType = this.GetSqlColumnType(connectionString, tableName);

            Map<String, Object> dict = null;

            for (Map<String, Object> dr : dtType) {
                String label = (String) dr.get("ColumnComments");
                dict = new HashMap<>();
                dict.put("Name", dr.get("ColumnName"));
                dict.put("Label", Common.IsNullOrEmpty(label) ? dr.get("ColumnName") : label);
                dict.put("Type", this.GetFieldType((String) dr.get("TypeName")));
                String typeName = dr.get("TypeName").toString().toLowerCase();
                int maxLength = (int) dr.get("TypeLength");
                String isNullable = dr.get("IsNullable").toString();
                boolean nullable = isNullable == "Y" || isNullable == "1" || isNullable.toLowerCase() == "true";
                dict.put("Nullable", nullable);
                dict.put("MaxLength", maxLength);
                dictList.add(dict);
            }

            Map<String, Object> propertyDict = new HashMap<>();
            propertyDict.put("Property", dictList);
            return propertyDict;
        } catch (Exception ex) {
            ExHandling(ex);
        }
        return null;
    }

    public Object SavePropertyConfig() {
        try {
            String viewId = this.GetRequest().GetParameterValue("ViewId");
            String viewName = this.GetRequest().GetParameterValue("ViewName");
            String path = this.GetRequest().RootPath + "\\Files\\" + viewName;

            File dir = new File(path);
            if (!dir.exists()) dir.mkdirs();

            String fielName = viewName + "_" + viewId + "_" + Common.DateToString(new Date(), "yyyyMMddHHmmss") + ".txt";
            path += "\\" + fielName;

            FileWriter fw = new FileWriter(path, true);
            BufferedWriter writer = new BufferedWriter(fw);

            writer.write(this.GetRequest().Content);

            writer.close();
            fw.close();
        } catch (Exception ex) {
        }
        return null;
    }
}