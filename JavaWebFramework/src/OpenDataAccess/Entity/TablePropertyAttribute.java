package OpenDataAccess.Entity;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface TablePropertyAttribute {
    public String Name() default "";

    public String WithSql() default "";

    public String PrimaryKey() default "";

    /// 不许查询字段名集合
    public String NoSelectNames() default "";
}
