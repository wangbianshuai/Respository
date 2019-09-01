package OpenDataAccess.Data;

public class OrderByStatement {
    public String ColumnName;
    public boolean IsASC;

    public OrderByStatement(String columnName, boolean isAsc) {
        ColumnName = columnName;
        IsASC = isAsc;
    }
}
