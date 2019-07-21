package OpenDataAccess.Service;

import OpenDataAccess.Data.IQuery;
import OpenDataAccess.Entity.EntityType;
import OpenDataAccess.Entity.IEntityAccess;
import OpenDataAccess.Entity.IEntityData;
import OpenDataAccess.Entity.IValidate;
import OpenDataAccess.LambdaInterface.IFunction1;

import java.util.Map;

public interface IEntityRequest extends IEntityAccess,IValidate {
    QueryRequest GetQueryRequest();

    void SetQueryRequest(QueryRequest value);

    Request GetRequest();

    void SetRequest(Request value);

    IFunction1<IQuery, IQuery> GetExpandSelectQuery();

    void SetExpandSelectQuery(IFunction1<IQuery, IQuery> value);

    Map<String, Object> GetExceptionDict(String message);

    Map<String, Object> GetMessageDict(String message);

    Map<String, Object> GetBoolDict(boolean blSucceed);

    String CompareVersion(IEntityData newEntityData, IEntityData oldEntityData);

    boolean JudgeIsEdit(EntityType entityType, IEntityData newEntityData, IEntityData oldEntityData) throws  Exception;

    Object Select();

    Object Insert();

    Object Update();

    Object Delete();
}
