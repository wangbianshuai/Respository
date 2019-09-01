package OpenDataAccess.Service;

public class WhereField {
    public String Name = null;
    public String Label = null;
    public String OperateLogic = null;
    public boolean IsDefault = false;
    public String DataType = null;
    public String Value = null;
    public String Text = null;
    public String ParameterName = null;
    public Class<?> Type = null;
    public Object ObjValue = null;
    public boolean IsWhere = false;

    public WhereField() {
        IsWhere = true;
    }
}
