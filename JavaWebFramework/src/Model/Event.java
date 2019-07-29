package Model;

import OpenDataAccess.Entity.*;
import OpenDataAccess.LambdaInterface.IFunction2;

import java.util.Date;
import java.util.List;

@TablePropertyAttribute(Name = "t_d_Event", PrimaryKey = "EventId")
public class Event extends EntityModel implements IEntity {
    public String EventId = null;
    public String EventName = null;
    public String ApplicationId = null;
    public String MethodName = null;
    public byte IsCommon = 0;
    public byte IsSelectView = 0;
    public String Code = null;
    public String Remark = null;
    public Date CreateDate = null;

    @Override
    public void InsertValidate(List<IFunction2<IValidate, IEntityData, String>> validateList) {
        validateList.add(this.ValidateExists(Event.class, "ApplicationId=@ApplicationId and EventName=@EventName", "对不起，该事件名已存在！", true));
    }

    @Override
    public void UpdateValidate(List<IFunction2<IValidate, IEntityData, String>> validateList) {
        validateList.add(this.ValidateExists(Event.class, "EventId=@EventId and EventName=@EventName", "true", true));
        validateList.add(this.ValidateExists(Event.class, "ApplicationId=@ApplicationId and EventName=@EventName", "对不起，该事件名已存在！", true));
    }
}