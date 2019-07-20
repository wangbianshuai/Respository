package OpenDataAccess.Entity;

public @interface TablePropertyAttribute {
    public String Name = "";

    public String WithSql = "";

    public String PrimaryKey = "";

    /// 不许查询字段名集合
    public String NoSelectNames = "";
}
