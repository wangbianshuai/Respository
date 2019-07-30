package Model;

import OpenDataAccess.Entity.EntityModel;
import OpenDataAccess.Entity.IEntity;
import OpenDataAccess.Entity.ITablePropertyAttribute;

import java.util.Date;

@ITablePropertyAttribute(Name = "t_d_OperationLog", PrimaryKey = "LogId")
public class OperationLog extends EntityModel implements IEntity {
    public String LogId = null;
    public String LogType = null;
    public String LogPath = null;
    public String EntityName = null;
    public String RequestType = null;
    public String MethodName = null;
    public String IPAddress = null;
    public Date StartTime = null;
    public Date EndTime = null;
    public long ElapsedMilliseconds = 0;
    public String OperationUser = null;
    public Date CreateDate = null;
    public String RowVersion = null;
}