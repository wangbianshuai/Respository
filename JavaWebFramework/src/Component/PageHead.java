package Component;

import OpenDataAccess.Data.IDataTransaction;
import OpenDataAccess.Data.IQuery;
import OpenDataAccess.Data.Query;
import OpenDataAccess.Entity.EntityData;
import OpenDataAccess.Entity.EntityType;
import OpenDataAccess.Entity.IEntityData;
import OpenDataAccess.Service.EntityRequest;
import OpenDataAccess.Service.Request;
import OpenDataAccess.Utility.Common;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class PageHead extends EntityRequest {
    EntityType _PageHeadJsCssEntity;

    public PageHead() {
    }

    public PageHead(Request request) {
        super(request);
        _PageHeadJsCssEntity = EntityType.GetEntityType(Model.PageHeadJsCss.class);
    }

    public Object InsertPageHead() {
        try {
            IDataTransaction trans = null;
            boolean blSucceed = true;
            Object primaryKey = null;
            Object pageHeadId = null;
            if (GetRequest().Entities.containsKey(this.GetEntityType().Name)) {
                IEntityData pageHeadEntityData = this.GetRequest().Entities.get(this.GetEntityType().Name).get(0);
                String message = this.Validate(pageHeadEntityData, this.GetEntityType().InsertValidateList);
                if (!Common.IsNullOrEmpty(message)) {
                    return this.GetMessageDict(message);
                }
                List<Map<String, Object>> jsList = (List<Map<String, Object>>) pageHeadEntityData.GetValue("JsList");
                List<Map<String, Object>> pageHeadJsCssList = new ArrayList<>();
                if (jsList != null && jsList.size() > 0) {
                    pageHeadJsCssList = jsList;
                }
                List<Map<String, Object>> cssList = (List<Map<String, Object>>) pageHeadEntityData.GetValue("CssList");
                if (cssList != null && cssList.size() > 0) {
                    pageHeadJsCssList.addAll(cssList);
                }
                pageHeadId = this.InsertEntity(pageHeadEntityData, trans);
                blSucceed = pageHeadId != null;
                if (blSucceed) {
                    this.SetEntityType(this._PageHeadJsCssEntity);
                    IEntityData pageHeadJsCssEntityData = null;
                    for (Map<String, Object> dict : pageHeadJsCssList) {
                        pageHeadJsCssEntityData = new EntityData(dict, this._PageHeadJsCssEntity);
                        pageHeadJsCssEntityData.SetValue("PageHeadId", pageHeadId);
                        pageHeadJsCssEntityData.SetValue("DisplayIndex", dict.get("Index"));
                        primaryKey = this.InsertEntity(pageHeadJsCssEntityData, trans);
                        blSucceed = primaryKey != null;
                        if (!blSucceed) {
                            break;
                        }
                    }
                }
                blSucceed = this.GetDataBase().CommitTransaction(trans, blSucceed);
                Map<String, Object> booleanDict = GetBoolDict(blSucceed);
                booleanDict.put("PrimaryKey", pageHeadId);
                return booleanDict;
            } else {
                return GetBoolDict(false);
            }
        } catch (Exception ex) {
            return this.GetExceptionDict(Common.GetRealException(ex).getMessage());
        }
    }

    public Object GetPageHead() {
        try {
            IEntityData entityData = (IEntityData) this.Select();
            if (entityData != null) {
                String pageHeadId = entityData.GetStringValue("PageHeadId");
                IQuery query = new Query("view_PageHead_JsCss");
                query.Where(String.format(" where PageHeadId='%s'", pageHeadId), null);
                List<IEntityData> pageHeadJsCssList = this.SelectEntities(query);

                List<IEntityData> jsList = new ArrayList<>();
                List<IEntityData> cssList = new ArrayList<>();
                for (IEntityData jsCss : pageHeadJsCssList) {
                    if (jsCss.GetValueByType(int.class, "Type") == 1) jsList.add(jsCss);
                    else if (jsCss.GetValueByType(int.class, "Type") == 2) cssList.add(jsCss);
                }

                entityData.SetValue("JsList", jsList);
                entityData.SetValue("CssList", cssList);

            }
            return entityData;
        } catch (Exception ex) {
            ExHandling(ex);
            return null;
        }
    }

    public Object UpdatePageHead() {
        try {
            IDataTransaction trans = null;
            boolean blSucceed = true;
            Object primaryKey = null;
            if (GetRequest().Entities.containsKey(this.GetEntityType().Name)) {
                IEntityData pageHeadEntityData = this.GetRequest().Entities.get(this.GetEntityType().Name).get(0);
                String message = this.Validate(pageHeadEntityData, this.GetEntityType().UpdateValidateList);
                if (!Common.IsNullOrEmpty(message)) {
                    return this.GetMessageDict(message);
                }
                List<Map<String, Object>> jsList = (List<Map<String, Object>>) pageHeadEntityData.GetValue("JsList");
                List<Map<String, Object>> pageHeadJsCssList = new ArrayList<>();
                if (jsList != null && jsList.size() > 0) {
                    pageHeadJsCssList = jsList;
                }
                List<Map<String, Object>> cssList = (List<Map<String, Object>>) pageHeadEntityData.GetValue("CssList");
                if (cssList != null && cssList.size() > 0) {
                    pageHeadJsCssList.addAll(cssList);
                }
                Object pageHeadId = pageHeadEntityData.GetValue(this.GetEntityType().PrimaryKey);
                blSucceed = this.UpdateEntity(this.GetQueryRequest().ToQuery(), pageHeadEntityData, trans);
                if (blSucceed) {
                    this.SetEntityType(this._PageHeadJsCssEntity);
                    IQuery query = new Query("t_d_PageHead_JsCss");
                    query.Where(String.format(" where PageHeadId='%s'", pageHeadId), null);
                    this.DeleteEntity(query, trans);
                    IEntityData pageHeadJsCssEntityData = null;
                    for (Map<String, Object> dict : pageHeadJsCssList) {
                        pageHeadJsCssEntityData = new EntityData(dict, this._PageHeadJsCssEntity);
                        pageHeadJsCssEntityData.SetValue("PageHeadId", pageHeadId);
                        pageHeadJsCssEntityData.SetValue("DisplayIndex", dict.get("Index"));
                        primaryKey = this.InsertEntity(pageHeadJsCssEntityData, trans);
                        blSucceed = primaryKey != null;
                        if (!blSucceed) {
                            break;
                        }
                    }
                }
                blSucceed = this.GetDataBase().CommitTransaction(trans, blSucceed);
                return GetBoolDict(blSucceed);
            } else {
                return GetBoolDict(false);
            }
        } catch (Exception ex) {
            return this.GetExceptionDict(Common.GetRealException(ex).getMessage());
        }
    }

    public Object DeletePageHead() {
        try {
            IDataTransaction trans = null;
            boolean blSucceed = true;
            blSucceed = this.DeleteEntity(this.GetQueryRequest().ToQuery(), trans);
            if (blSucceed) {
                this.SetEntityType(this._PageHeadJsCssEntity);
                IQuery query = new Query("t_d_PageHead_JsCss");
                query.Where(String.format(" where PageHeadId='%s'", this.GetQueryRequest().PrimaryKeyProperty.Value), null);
                this.DeleteEntity(query, trans);
            }
            blSucceed = this.GetDataBase().CommitTransaction(trans, blSucceed);
            return GetBoolDict(blSucceed);
        } catch (Exception ex) {
            return this.GetExceptionDict(Common.GetRealException(ex).getMessage());
        }
    }
}