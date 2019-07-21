package OpenDataAccess.Entity;

public @interface LogAttribute {
    public boolean IsGet() default false;

    public boolean IsPostQuery() default false;

    public boolean IsPost() default true;

    public boolean IsPut() default true;

    public boolean IsDelete() default true;
}
