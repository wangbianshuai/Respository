package OpenDataAccess.Entity;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface RequestMethodAttribute {
    public boolean IsGet = true;
    public boolean IsPost = true;
    public boolean IsPut = true;
    public boolean IsDelete = true;
}
