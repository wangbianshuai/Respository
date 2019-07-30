package OpenDataAccess.Entity;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface ILogAttribute {
    public boolean IsGet() default false;

    public boolean IsPostQuery() default false;

    public boolean IsPost() default true;

    public boolean IsPut() default true;

    public boolean IsDelete() default true;
}
