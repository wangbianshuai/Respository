package OpenDataAccess.Entity;

public @interface TablePropertyAttribute {
    public String Name() default "";

    public String WithSql() default "";

    public String PrimaryKey() default "";

    /// 不许查询字段名集合
    public String NoSelectNames() default "";
}
