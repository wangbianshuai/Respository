package Component;

import OpenDataAccess.Data.DataParameterList;
import OpenDataAccess.Data.IDataParameterList;
import OpenDataAccess.Data.IQuery;
import OpenDataAccess.Data.Query;
import OpenDataAccess.Entity.EntityType;
import OpenDataAccess.Entity.IEntityData;
import OpenDataAccess.Service.EntityByComplexTypeOperation;
import OpenDataAccess.Service.EntityRequest;
import OpenDataAccess.Service.Request;
import OpenDataAccess.Utility.Common;

import java.sql.SQLException;
import java.util.List;

public class Event extends EntityRequest {
    EntityType _EventParameterEntity;

    public Event() {
    }

    public Event(Request request) {
        super(request);
        _EventParameterEntity = EntityType.GetEntityType(Model.EventParameter.class);
    }

    public Object InsertEvent() {
        return EntityByComplexTypeOperation.Insert(this, _EventParameterEntity, "Parameters", null);
    }

    private boolean InsertEvent(IEntityData entityData) throws SQLException {
        return EntityByComplexTypeOperation.Insert(this, entityData, _EventParameterEntity, "Parameters", null);
    }

    private boolean UpdateEvent(IEntityData entityData, Object primarKey) {
        return EntityByComplexTypeOperation.Update(this, entityData, primarKey, _EventParameterEntity, "Parameters");
    }

    public Object GetEvent() {
        return EntityByComplexTypeOperation.GetEntityData(this, _EventParameterEntity, "Parameters");
    }

    public Object UpdateEvent() {
        return EntityByComplexTypeOperation.Update(this, _EventParameterEntity, "Parameters", null);
    }

    public Object DeleteEvent() {
        return EntityByComplexTypeOperation.Delete(this, _EventParameterEntity);
    }

    public Object LoadCommonEvent() {
        try {
            boolean blSucceed = true;
            if (GetRequest().Entities.containsKey(this.GetEntityType().Name)) {
                List<IEntityData> entityDataList = this.GetRequest().Entities.get(this.GetEntityType().Name);
                IQuery query = new Query(this.GetEntityType().TableName, this.GetEntityType().Name);
                IEntityData queryEntityData = null;
                for (IEntityData entityData : entityDataList) {
                    if (entityData.GetValue("EventName") != null && entityData.GetValue("ApplicationId") != null) {
                        IDataParameterList parameterList = new DataParameterList();
                        parameterList.Set("@ApplicationId", entityData.GetValue("ApplicationId"));
                        parameterList.Set("@EventName", entityData.GetValue("EventName"));
                        query.Where(" where ApplicationId=@ApplicationId and EventName=@EventName", parameterList);
                        queryEntityData = this.SelectEntity(query);
                        if (queryEntityData != null) {
                            blSucceed = this.UpdateEvent(entityData, queryEntityData.GetValue(this.GetEntityType().PrimaryKey));
                            if (!blSucceed) {
                                break;
                            }
                        } else {
                            blSucceed = this.InsertEvent(entityData);
                            if (!blSucceed) {
                                break;
                            }
                        }
                    }
                }
                return GetBoolDict(blSucceed);
            } else {
                return GetBoolDict(false);
            }
        } catch (Exception ex) {
            return this.GetExceptionDict(Common.GetRealException(ex).getMessage());
        }
    }
}