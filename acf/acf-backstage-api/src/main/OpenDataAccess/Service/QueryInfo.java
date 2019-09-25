package OpenDataAccess.Service;

import OpenDataAccess.Data.IDataParameterList;
import OpenDataAccess.Data.IQuery;
import OpenDataAccess.Data.Query;
import OpenDataAccess.Entity.EntityModel;
import OpenDataAccess.Entity.EntityType;
import OpenDataAccess.Entity.IEntity;

import java.util.List;

public class QueryInfo extends EntityModel implements IEntity {
    public String FieldSql = null;
    public String OrderBySql = null;
    public String GroupBySql = null;
    public String GroupByFieldSql = null;
    public String WhereSql = null;
    public IDataParameterList ParameterList = null;
    public boolean HasLabel = false;
    public List<WhereField> WhereFields = null;
    public List<HeaderInfo> HeaderInfos = null;
    public String ProcName = null;

    public IQuery ToQuery(EntityType entity) {
        IQuery query = new Query(entity.TableName, entity.Name);
        query.Where(this.WhereSql, this.ParameterList);
        query.Select(this.FieldSql);
        query.OrderBy(this.OrderBySql);
        query.GroupBy(this.GroupBySql);
        return query;
    }
}




