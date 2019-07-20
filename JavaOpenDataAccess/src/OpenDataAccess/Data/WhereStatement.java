package OpenDataAccess.Data;

public class WhereStatement {
    public String ColumnName;
    public String LogicalOperator;
    public String ColumnValue;

    public WhereStatement(String columnName, String logicalOperator, String columnValue) {
        ColumnName = columnName;
        LogicalOperator = logicalOperator;
        ColumnValue = columnValue;
    }
}