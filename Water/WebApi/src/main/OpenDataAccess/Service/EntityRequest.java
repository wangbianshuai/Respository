package OpenDataAccess.Service;

import OpenDataAccess.Data.*;
import OpenDataAccess.Entity.*;
import OpenDataAccess.LambdaInterface.*;
import OpenDataAccess.Utility.Common;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class EntityRequest extends EntityAccess implements IEntityRequest, IEntityAccess {
    private QueryRequest _QueryRequest = null;
    private Request _Request = null;
    private IFunction1<IQuery, IQuery> _ExpandSelectQuery = null;

    public QueryRequest GetQueryRequest() {
        return _QueryRequest;
    }

    public void SetQueryRequest(QueryRequest value) {
        _QueryRequest = value;
    }

    public Request GetRequest() {
        return _Request;
    }

    public void SetRequest(Request value) {
        _Request = value;
    }

    public IFunction1<IQuery, IQuery> GetExpandSelectQuery() {
        return _ExpandSelectQuery;
    }

    public void SetExpandSelectQuery(IFunction1<IQuery, IQuery> value) {
        _ExpandSelectQuery = value;
    }

    public EntityRequest() {
        Init();
    }

    private void Init(){
        this.ExceptionHandle = (ex) -> {
            throw new RuntimeException(ex);
        };
    }

    public EntityRequest(Request request) {
        _Request = request;
        Init();
        _QueryRequest = new QueryRequest(_Request, this, ExceptionHandle);
        this.SetEntityType(_Request.Entity);
    }

    public void ExHandling(Exception ex) {
        if (this.ExceptionHandle != null) {
            this.ExceptionHandle.Handling(ex);
        }
    }

    public Map<String, Object> GetExceptionDict(String message) {
        Map<String, Object> dict = new HashMap<>();
        dict.put("Exception", message);
        return dict;
    }

    public Map<String, Object> GetMessageDict(String message) {
        Map<String, Object> dict = new HashMap<>();
        dict.put("Message", message);
        return dict;
    }

    public Map<String, Object> GetBoolDict(boolean blSucceed) {
        Map<String, Object> dict = new HashMap<>();
        if (blSucceed) {
            dict.put("Succeed", "操作成功！");
        } else {
            dict.put("Message", "操作失败！");
        }
        return dict;
    }

    public boolean IsNullOrEmpty(String str) {
        return Common.IsNullOrEmpty(str);
    }

    /// 比较版本
    public String CompareVersion(IEntityData newEntityData, IEntityData oldEntityData) {
        String newRowVersion = newEntityData.GetStringValue("RowVersion");
        String oldRowVersion = oldEntityData.GetStringValue("RowVersion");

        if (!IsNullOrEmpty(newRowVersion) && !IsNullOrEmpty(oldRowVersion) && !newRowVersion.toLowerCase().equals(oldRowVersion.toLowerCase())) {
            return "对不起，更新数据不是最新版本，请刷新后再操作！";
        }

        return "";
    }

    public boolean JudgeIsEdit(EntityType entityType, IEntityData newEntityData, IEntityData oldEntityData) throws Exception {
        List<String> editNameList = new ArrayList<>();

        entityType.Properties.forEach(p -> {
            if (oldEntityData.ContainsKey(p.Name) && newEntityData.ContainsKey(p.Name)) editNameList.add(p.Name);
        });

        boolean blEdit = false;
        for (int i = 0; i < editNameList.size(); i++) {
            String name = editNameList.get(i);
            Object newValue = newEntityData.GetValue(name);
            Object oldValue = oldEntityData.GetValue(name);
            if ((newValue == null && oldValue != null) || (newValue != null && oldValue == null)) {
                blEdit = true;
            } else if (newValue != null && !oldValue.equals(Common.ChangeType(oldValue.getClass(), newValue))) {
                blEdit = true;
            }
            if (blEdit) {
                break;
            }
        }
        return blEdit;
    }

    public IAction3<IEntityData, String, IDataParameterList> QueryGroupByInfo = null;

    public Object Select() {
        try {
            IQuery query = null;
            if (this._QueryRequest.IsQuery) {
                if (this._QueryRequest.QueryInfo != null) {
                    if (IsNullOrEmpty(this._QueryRequest.QueryInfo.ProcName)) {
                        query = this._QueryRequest.QueryInfo.ToQuery(this._Request.Entity);
                    }
                } else {
                    Map<String, Object> dict = new HashMap<>();
                    dict.put("NoQueryInfo", true);
                    return dict;
                }
            } else {
                query = _QueryRequest.ToQuery();
            }
            String action = this._Request.GetParameterValue("Action");
            String title = this._Request.GetParameterValue("Title");
            String entityName = this._Request.GetParameterValue("EntityName");
            if (_QueryRequest.IsPage) {
                IEntityData pageInfo = new EntityData("PageInfo");

                QueryPage(query, pageInfo);

                return pageInfo;
            } else if (_QueryRequest.IsData && action != "Excel") {
                String pageSizeString = _Request.GetParameterValue("PageSize");
                String pageIndexString = _Request.GetParameterValue("PageIndex");
                int pageSize = IsNullOrEmpty(pageSizeString) ? 20 : Integer.parseInt(pageSizeString);
                int pageIndex = IsNullOrEmpty(pageIndexString) ? 1 : Integer.parseInt(pageIndexString);
                StringBuilder sb = new StringBuilder();
                sb.append("select * from (");
                if (this.GetDataBase().GetClientType() == ServerClient.MySqlClient) {
                    sb.append("select ");
                    sb.append(IsNullOrEmpty(query.ToSelectSql().trim()) ? "t.*" : query.ToSelectSql());
                    sb.append(String.format(" from %s %s %s %s) a",
                            _Request.Entity.TableName + " t",
                            query.ToWhereSql(),
                            query.ToGroupSql(),
                            IsNullOrEmpty(query.ToOrderBySql()) ? "order by " + _Request.Entity.PrimaryKey : query.ToOrderBySql()));
                    sb.append(String.format(" limit %s,%s", (pageIndex - 1) * pageSize, pageSize));
                } else {
                    sb.append(String.format("select row_number() over(%s) as rn,", IsNullOrEmpty(query.ToOrderBySql().trim()) ? "order by " + _Request.Entity.PrimaryKey : query.ToOrderBySql()));
                    sb.append(IsNullOrEmpty(query.ToSelectSql().trim()) ? "t.*" : query.ToSelectSql());
                    sb.append(String.format(" from %s %s %s) a", _Request.Entity.TableName + " t", query.ToWhereSql(), query.ToGroupSql()));
                    sb.append(String.format(" where a.rn > %s and a.rn <= %s", (pageIndex - 1) * pageSize, pageIndex * pageSize));
                }

                query.SetWithSql(this.GetEntityType().WithSql);
                query.SetSql(sb.toString(), null);

                return this.SelectEntities(query);
            } else if (_QueryRequest.PrimaryKeyProperty != null) {
                return this.SelectEntity(query);
            }
            return this.SelectEntities(query);
        } catch (Exception ex) {
            this.ExHandling(ex);
            return null;
        }
    }

    void QueryPage(IQuery query, IEntityData pageInfo) throws Exception {
        IEntityData selectData = null;

        if (IsNullOrEmpty(query.ToGroupSql().trim())) {
            query.Select("count(*) PageRecord");
            query.GroupBy("").Join("").OrderBy("");
        } else {
            query.Select("count(*) PageRecord");
            query.SetTableName(String.format("(select %s from %s %s %s) a", query.ToSelectSql(), _Request.Entity.TableName + " t", query.ToWhereSql(), query.ToGroupSql()));
            query.GroupBy("").Join("").OrderBy("").Where("", query.GetParameterList());
        }

        query.SetWithSql(this.GetEntityType().WithSql);
        selectData = this.SelectEntity(query);

        SetPageInfo(selectData, pageInfo);
    }

    public void SetPageInfo(IEntityData selectData, IEntityData pageInfo) throws Exception {
        if (selectData != null) {
            int pageRecord = selectData.GetValueByType(int.class, "PageRecord");
            int pageCount = 0;
            String pageSizeString = _Request.GetParameterValue("PageSize");
            String pageIndexString = _Request.GetParameterValue("PageIndex");
            int pageSize = IsNullOrEmpty(pageSizeString) ? 20 : Integer.parseInt(pageSizeString);
            int pageIndex = IsNullOrEmpty(pageIndexString) ? 1 : Integer.parseInt(pageIndexString);
            if (pageRecord % pageSize == 0) {
                pageCount = pageRecord / pageSize;
            } else {
                pageCount = pageRecord / pageSize + 1;
            }
            pageIndex = pageIndex > pageCount ? pageCount : pageIndex;

            pageInfo.SetValue("PageRecord", pageRecord);
            pageInfo.SetValue("PageIndex", pageIndex);
            pageInfo.SetValue("PageSize", pageSize);
            pageInfo.SetValue("PageCount", pageCount);
        }
    }

    public Object Insert() {
        IDataTransaction trans =null;
        try {
            boolean blSucceed = true;
            Object primaryKey = null;
            if (_Request.Entities.containsKey(_Request.Entity.Name) && _Request.Entities.get(_Request.Entity.Name) != null) {
                List<IEntityData> entityDataList = _Request.Entities.get(_Request.Entity.Name);
                String message = "";
                for (int i = 0; i < entityDataList.size(); i++) {
                    IEntityData entityData = entityDataList.get(i);
                    message = this.Validate(entityData, this.GetEntityType().InsertValidateList);
                    if (!IsNullOrEmpty(message)) {
                        break;
                    }
                }
                if (!IsNullOrEmpty(message)) {
                    return GetMessageDict(message);
                }

                trans = new DataTransaction(GetDataBase().CreateConnection());
                for (int i = 0; i < entityDataList.size(); i++) {
                    IEntityData entityData = entityDataList.get(i);
                    primaryKey = this.InsertEntity(entityData, trans);
                    blSucceed = primaryKey != null;
                    if (!blSucceed) {
                        break;
                    }
                }
                blSucceed = trans.CommitTransaction(blSucceed);
                if (primaryKey != null) {
                    Map<String, Object> dict = GetBoolDict(blSucceed);
                    dict.put("PrimaryKey", primaryKey);
                    return dict;
                } else {
                    return GetBoolDict(blSucceed);
                }
            } else {
                return GetBoolDict(false);
            }
        } catch (Exception ex) {
            if (trans != null) trans.CommitTransaction(false, ExceptionHandle);
            ExHandling(ex);
            return null;
        }
    }

    public Object Update() {
        try {
            if (_Request.Entities.containsKey(_Request.Entity.Name) && _Request.Entities.get(_Request.Entity.Name) != null) {
                IEntityData entityData = _Request.Entities.get(_Request.Entity.Name).get(0);
                String message = this.Validate(entityData, this.GetEntityType().UpdateValidateList);
                if (!IsNullOrEmpty(message)) {
                    return GetMessageDict(message);
                }
                if (entityData.GetValue("RowVersion") != null) {
                    IEntityData oldEntityData = this.SelectEntity(_QueryRequest.ToQuery());
                    if (oldEntityData == null) {
                        return GetBoolDict(false);
                    }
                    message = this.CompareVersion(entityData, oldEntityData);
                    if (!IsNullOrEmpty(message)) {
                        return GetMessageDict(message);
                    }
                }
                return GetBoolDict(this.UpdateEntity(_QueryRequest.ToQuery(), entityData, null));
            } else {
                return GetBoolDict(false);
            }
        } catch (Exception ex) {
            ExHandling(ex);
            return null;
        }
    }

    public Object Delete() {
        try {
            String message = "";
            if (_Request.Entities != null && _Request.Entities.containsKey("Validate") && _Request.Entities.get("Validate") != null) {
                List<IEntityData> validateEntityDataList = _Request.Entities.get("Validate");
                String entityName = "";
                String filter = "";
                EntityType entityType = null;
                for (int i = 0; i < validateEntityDataList.size(); i++) {
                    IEntityData validateEntityData = validateEntityDataList.get(i);
                    entityName = validateEntityData.GetStringValue("EntityName");
                    filter = this.ReplaceOperator(validateEntityData.GetStringValue("Filter"));
                    message = validateEntityData.GetStringValue("Message");
                    entityType = EntityType.GetEntityType(entityName, false);
                    if (entityType != null) {
                        IQuery query = new Query(entityType.TableName, entityType.Name);
                        query.Select("top 1 1");
                        query.Where(String.format(" where %s", filter), null);
                        if (this.SelectEntity(query) != null) {
                            break;
                        } else {
                            message = "";
                        }
                    } else {
                        message = String.format("对不起,实体%s不存在！", entityName);
                        break;
                    }
                }
            }
            if (!IsNullOrEmpty(message)) {
                return GetMessageDict(message);
            } else {
                String rowVersion = this._Request.GetParameterValue("RowVersion");
                if (!IsNullOrEmpty(rowVersion)) {
                    IEntityData entityData = new EntityData(this.GetEntityType());
                    entityData.SetValue("RowVersion", rowVersion);
                    IEntityData oldEntityData = this.SelectEntity(_QueryRequest.ToQuery());
                    if (oldEntityData == null) {
                        return GetBoolDict(false);
                    }
                    message = this.CompareVersion(entityData, oldEntityData);
                    if (!IsNullOrEmpty(message)) {
                        return GetMessageDict(message);
                    }
                }
                return GetBoolDict(this.DeleteEntity(_QueryRequest.ToQuery(), null));
            }
        } catch (Exception ex) {
            ExHandling(ex);
            return null;
        }
    }

    private String ReplaceOperator(String filter) {
        filter = filter.replace(" eq ", "=");
        filter = filter.replace(" ne ", "<>");
        filter = filter.replace(" gt ", ">");
        filter = filter.replace(" ge ", ">=");
        filter = filter.replace(" lt ", "<");
        filter = filter.replace(" le ", "<=");
        return filter;
    }

    public String Validate(IEntityData entityData, List<IFunction2<IValidate, IEntityData, String>> validateList) {
        String message = "";
        if (validateList != null && validateList.size() > 0) {
            for (int i = 0; i < validateList.size(); i++) {
                IFunction2<IValidate, IEntityData, String> validate = validateList.get(i);
                message = validate.Invoke(this, entityData);
                if (!IsNullOrEmpty(message)) {
                    break;
                }
            }
        }
        message = message.equals("true") ? "" : message;
        return message;
    }

    public String Validate() {
        String message = "";
        if (_Request.Entities.containsKey("Validate") && _Request.Entities.get("Validate") != null) {
            IEntityData validateEntityData = Common.GetFirstOrDefault(IEntityData.class, _Request.Entities.get("Validate"));
            String operationType = validateEntityData.GetStringValue("OperationType");
            String configName = validateEntityData.GetStringValue("ConfigName");
            List<Map<String, Object>> uniquePropertyList = (List<Map<String, Object>>) validateEntityData.GetValue("UniqueProperty");
            List<IEntityData> entityDataList = _Request.Entities.get(_Request.Entity.Name);
            for (int i = 0; i < entityDataList.size(); i++) {
                IEntityData entityData = entityDataList.get(i);

                if (operationType == "Update") {
                    Object primaryKey = _QueryRequest.PrimaryKeyProperty.Value;
                    IEntityData updateEntityData = this.SelectEntityByPrimaryKey(primaryKey);
                    if (updateEntityData != null) {
                        if (uniquePropertyList != null) {
                            uniquePropertyList.forEach(uniqueProperty ->
                            {
                                uniqueProperty.put("EditPropertyValue", updateEntityData.GetValue(uniqueProperty.get("Name").toString()));
                            });
                        }
                    } else {
                        message = String.format("对不起，该%s不存在！", configName);
                    }
                }
                if (IsNullOrEmpty(message) && uniquePropertyList != null) {
                    for (int j = 0; j < uniquePropertyList.size(); j++) {
                        Map<String, Object> uniqueProperty = uniquePropertyList.get(i);
                        String propertyName = uniqueProperty.get("Name").toString();
                        String propertyLabel = uniqueProperty.get("Label").toString();
                        Object propertyValue = entityData.GetValue(propertyName);
                        Property property = this._Request.Entity.GetProperty(propertyName);
                        if (propertyValue != null && property != null) {
                            property.Value = propertyValue;
                            Object editPropertyValue = null;
                            if (uniqueProperty.containsKey("EditPropertyValue")) {
                                editPropertyValue = uniqueProperty.get("EditPropertyValue");
                            }
                            if (editPropertyValue == null || !editPropertyValue.toString().trim().equals(propertyValue.toString().trim())) {
                                List<WhereStatement> whereList = new ArrayList<>();

                                whereList.add(new WhereStatement(propertyName, "=", "@" + propertyName));

                                IDataParameterList parameterList = new DataParameterList();
                                parameterList.Set(property.Name, property.Value);
                                IQuery query = new Query(this._Request.Entity.TableName);
                                query.Where(whereList, parameterList);
                                IEntityData editEntityData = this.SelectEntity(query);
                                if (editEntityData != null) {
                                    message = String.format("对不起，该%s已存在！", propertyLabel);
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
        return message;
    }

    public <T extends IEntity> String ValidateExists(Class<T> cls, IEntityData entityData, String filter, String message, boolean blExists) {
        try {
            EntityType entityType = EntityType.GetEntityType(cls);
            if (entityType != null) {
                IQuery query = new Query(entityType.TableName, entityType.Name);
                query.Select(entityType.PrimaryKey);
                query.Where(String.format(" where %s", filter), this.GetFileterParameterList(entityData, entityType, filter));
                if (this.SelectEntity(query) != null) {
                    if (!blExists) {
                        message = "";
                    }
                } else {
                    if (blExists) {
                        message = "";
                    }
                }
            }
            return message;
        } catch (Exception ex) {
            ExHandling(ex);
            return null;
        }
    }

    private IDataParameterList GetFileterParameterList(IEntityData entityData, EntityType entityType, String filter) throws Exception {
        List<Property> propertyList = new ArrayList<>();
        entityType.Properties.forEach(p -> {
            if (filter.contains("@" + p.Name)) {
                Property property = new Property();
                property.Name = p.Name;
                property.IsSelect = p.IsSelect;
                property.ParameterName = p.ParameterName;
                property.Type = p.Type;
                propertyList.add(property);
            }
        });

        if (propertyList.size() > 0) {
            IDataParameterList parameterList = new DataParameterList();
            for (int i = 0; i < propertyList.size(); i++) {
                Property property = propertyList.get(i);
                property.Value = Common.ChangeType(property.Type, entityData.GetValue(property.Name));
                parameterList.Set(property.Name, property.Value);
            }
            ;
            return parameterList;
        }
        return null;
    }

    public <T extends IEntity> String InsertValidateUnique(Class<T> cls, IEntityData entityData, String propertyName, String message) {
        try {
            EntityType entityType = EntityType.GetEntityType(cls);
            if (entityType != null) {
                Property property = entityType.GetProperty(propertyName);
                if (property != null) {
                    Object propertyValue = Common.ChangeType(property.Type, entityData.GetValue(property.Name));
                    IQuery query = new Query(entityType.TableName, entityType.Name);
                    property.Value = propertyValue;
                    IDataParameterList parameterList = new DataParameterList();
                    parameterList.Set(property.Name, property.Value);
                    query.Where(String.format(" where %s=@%s", propertyName, propertyName), parameterList);
                    if (this.SelectEntity(query) == null) {
                        message = "";
                    }
                }
                return message;
            }
            return "";
        } catch (Exception ex) {
            ExHandling(ex);
            return null;
        }
    }

    public <T extends IEntity> String UpdateValidateUnique(Class<T> cls, IEntityData entityData, String propertyName, String message) {
        try {
            EntityType entityType = EntityType.GetEntityType(cls);
            if (entityType != null) {
                Property property = entityType.GetProperty(propertyName);
                Property primaryKeyProperty = entityType.GetProperty(entityType.PrimaryKey);
                if (property != null) {
                    Object propertyValue = Common.ChangeType(property.Type, entityData.GetValue(property.Name));
                    IQuery query = new Query(entityType.TableName, entityType.Name);
                    property.Value = propertyValue;
                    primaryKeyProperty.Value = Common.ChangeType(primaryKeyProperty.Type, entityData.GetValue(primaryKeyProperty.Name));
                    IDataParameterList parameterList = new DataParameterList();
                    parameterList.Set(property.Name, property.Value);
                    parameterList.Set(primaryKeyProperty.Name, primaryKeyProperty.Value);
                    query.Where(String.format(" where %s=@%s and %s=@%s", entityType.PrimaryKey, entityType.PrimaryKey, propertyName, propertyName), parameterList);
                    if (this.SelectEntity(query) != null) {
                        message = "";
                    } else {
                        parameterList = new DataParameterList();
                        parameterList.Set(property.Name, property.Value);
                        query.Where(String.format(" where %s=@%s", propertyName, propertyName), parameterList);
                        if (this.SelectEntity(query) == null) {
                            message = "";
                        }
                    }
                }
                return message;
            }
            return "";
        } catch (Exception ex) {
            ExHandling(ex);
            return null;
        }
    }
}
