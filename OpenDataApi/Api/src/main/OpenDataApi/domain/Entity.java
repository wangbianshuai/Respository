package OpenDataApi.domain;

import OpenDataAccess.Data.DataParameterList;
import OpenDataAccess.Data.IDataParameterList;
import OpenDataAccess.Data.IQuery;
import OpenDataAccess.Data.Query;
import OpenDataAccess.Entity.*;
import OpenDataAccess.Service.EntityByComplexTypeOperation;
import OpenDataAccess.Service.EntityRequest;
import OpenDataAccess.Service.Request;
import OpenDataAccess.Utility.Common;
import OpenDataApi.models.EntityProperty;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class Entity extends EntityRequest {
    EntityType _EntityPropertyEntity;

    public Entity() {
        SetEntityType(EntityType.GetEntityType(OpenDataApi.models.Entity.class));
        _EntityPropertyEntity = EntityType.GetEntityType(EntityProperty.class);
    }

    public Entity(Request request) {
        super(request);
        _EntityPropertyEntity = EntityType.GetEntityType(EntityProperty.class);
    }

    public Object InsertEntity() {
        return EntityByComplexTypeOperation.Insert(this, _EntityPropertyEntity, "Properties", null);
    }

    public Object GetEntity() {
        return EntityByComplexTypeOperation.GetEntityData(this, _EntityPropertyEntity, "Properties");
    }

    public Object UpdateEntity() {
        return EntityByComplexTypeOperation.Update(this, _EntityPropertyEntity, "Properties", null);
    }

    public Object DeleteEntity() {
        return EntityByComplexTypeOperation.Delete(this, _EntityPropertyEntity);
    }

    public void SetEntityList(String applicationId) {
        List<IEntityData> entityDataList = GetEntityPropertyList(applicationId);

        Map<String, List<IEntityData>> groupby = entityDataList.stream().collect(Collectors.groupingBy(g -> g.GetStringValue("Id")));

        for (Map.Entry<String, List<IEntityData>> kvp : groupby.entrySet()) {
            SetEntityType(kvp.getValue());
        }
    }

    private void SetEntityType(List<IEntityData> entityDataList) {
        try {
            OpenDataApi.models.Entity entity = (OpenDataApi.models.Entity) entityDataList.get(0).ToEntity(OpenDataApi.models.Entity.class);

            EntityType entityType = null;

            entityType = EntityType.GetEntityType(entity.Entity_Name, false);
            if (entityType == null) {
                entityType = new EntityType();
                EntityType.EntityTypeList.add(entityType);
            }

            entityType.Name = entity.Entity_Name;
            entityType.Properties = new ArrayList<>();

            entityType.TableName = entity.Table_Name;
            entityType.WithSql = entity.With_Sql;
            entityType.PrimaryKey = entity.Primary_Key;
            entityType.NoSelectNameList = Common.IsNullOrEmpty(entity.No_Select_Names) ? new ArrayList<>() : Arrays.asList(entity.No_Select_Names.split(","));

            entityType.IsDelete = entity.Is_Delete == 1;
            entityType.IsGet = entity.Is_Get == 1;
            entityType.IsPost = entity.Is_Post == 1;
            entityType.IsPut = entity.Is_Put == 1;

            entityType.LogAttribute= new LogAttribute();
            entityType.LogAttribute.IsDelete = entity.Is_Delete_log == 1;
            entityType.LogAttribute.IsGet = entity.Is_Get_log == 1;
            entityType.LogAttribute.IsPost = entity.Is_Post_Log == 1;
            entityType.LogAttribute.IsPostQuery = entity.Is_Post_Query_Log == 1;
            entityType.LogAttribute.IsPut = entity.Is_Put_Log == 1;

            Property p = null;
            for (IEntityData entityData : entityDataList) {
                p = new Property();

                p.Name = entityData.GetStringValue("PropertyName");
                p.Type = Common.GetType(entityData.GetStringValue("PropertyType"));
                p.ParameterName = "@" + p.Name;
                p.IsSelect = !entityType.NoSelectNameList.contains(p.Name);

                entityType.Properties.add(p);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    private List<IEntityData> GetEntityPropertyList(String applicationId) {
        IQuery query = new Query(_EntityPropertyEntity.TableName +" a");
        query.Select("b.*,a.Name PropertyName,a.Type PropertyType");
        query.Join(" inner join t_d_Entity b on a.Entity_Id=b.Id");
        IDataParameterList parameterList = new DataParameterList();
        parameterList.Set("Application_Id", applicationId);
        query.Where("where Application_Id=@Application_Id", parameterList);
        return this.SelectEntities(query);
    }
}