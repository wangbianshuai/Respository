package Model;


import OpenDataAccess.Entity.*;
import OpenDataAccess.LambdaInterface.IFunction2;

import java.util.Date;
import java.util.List;

@TablePropertyAttribute(Name = "t_d_Cache", PrimaryKey = "CacheId")
public class Cache extends EntityModel implements IEntity {
    public String CacheId = null;
    public String CacheName = null;
    public String ApplicationId = null;
    public String EntityName = null;
    public String ServiceUrl = null;
    public String ValueProperty = null;
    public String TextProperty = null;
    public String Options = null;
    public String Remark = null;
    public Date CreateDate = null;

    @Override
    public void InsertValidate(List<IFunction2<IValidate, IEntityData, String>> validateList) {
        validateList.add(this.ValidateExists(Cache.class, "ApplicationId=@ApplicationId and CacheName=@CacheName", "对不起，该缓存名已存在！", true));
    }

    @Override
    public void UpdateValidate(List<IFunction2<IValidate, IEntityData, String>> validateList) {
        validateList.add(this.ValidateExists(Cache.class, "CacheId=@CacheId and CacheName=@CacheName", "true", true));
        validateList.add(this.ValidateExists(Cache.class, "ApplicationId=@ApplicationId and CacheName=@CacheName", "对不起，该缓存名已存在！", true));
    }
}