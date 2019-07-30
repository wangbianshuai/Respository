package Component;

import OpenDataAccess.Data.DataTransaction;
import OpenDataAccess.Data.IDataTransaction;
import OpenDataAccess.Data.IQuery;
import OpenDataAccess.Data.Query;
import OpenDataAccess.Entity.EntityData;
import OpenDataAccess.Entity.EntityType;
import OpenDataAccess.Entity.IEntityData;
import OpenDataAccess.Service.EntityRequest;
import OpenDataAccess.Service.Request;
import OpenDataAccess.Utility.Common;

import javax.xml.crypto.Data;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class Page extends EntityRequest {
    EntityType _PageJsCssEntity;
    EntityType _ViewEntity;

    public Page() {
    }

    public Page(Request request) {
        super(request);
        _PageJsCssEntity = EntityType.GetEntityType(Model.PageJsCss.class);
        _ViewEntity = EntityType.GetEntityType(Model.View.class);
    }

    public Object GetPage() {
        try {
            IEntityData entityData = (IEntityData) this.Select();
            if (entityData != null) {
                String pageId = entityData.GetStringValue("PageId");
                IQuery query = new Query("view_Page_JsCss");
                query.Where(String.format(" where PageId='%s'", pageId), null);
                List<IEntityData> pageHeadJsCssList = this.SelectEntities(query);

                List<IEntityData> jsList = new ArrayList<>();
                List<IEntityData> cssList = new ArrayList<>();
                for (IEntityData e : pageHeadJsCssList) {
                    if (e.GetValueByType(int.class, "Type") == 1) jsList.add(e);
                    else if (e.GetValueByType(int.class, "Type") == 2) cssList.add(e);
                }

                entityData.SetValue("JsList", jsList.stream().sorted().collect(Collectors.toList()));
                entityData.SetValue("CssList", cssList.stream().sorted().collect(Collectors.toList()));
            }
            return entityData;
        } catch (Exception ex) {
            ExHandling(ex);
            return null;
        }
    }

    public Object UpdatePage() {
        try {
            IDataTransaction trans = new DataTransaction(GetDataBase().CreateConnection());
            boolean blSucceed = true;
            Object primaryKey = null;
            if (GetRequest().Entities.containsKey(this.GetEntityType().Name)) {
                IEntityData pageEntityData = this.GetRequest().Entities.get(this.GetEntityType().Name).get(0);
                List<Map<String, Object>> jsList = (List<Map<String, Object>>) pageEntityData.GetValue("JsList");
                List<Map<String, Object>> pageJsCssList = new ArrayList<>();
                if (jsList != null && jsList.size() > 0) {
                    pageJsCssList = jsList;
                }
                List<Map<String, Object>> cssList = (List<Map<String, Object>>) pageEntityData.GetValue("CssList");
                if (cssList != null && cssList.size() > 0) {
                    pageJsCssList.addAll(cssList);
                }
                Object pageId = pageEntityData.GetValue(this.GetEntityType().PrimaryKey);
                blSucceed = this.UpdateEntity(this.GetQueryRequest().ToQuery(), pageEntityData, trans);
                if (blSucceed) {
                    this.SetEntityType(this._PageJsCssEntity);
                    IQuery query = new Query("t_d_Page_JsCss");
                    query.Where(String.format(" where PageId='%s'", pageId), null);
                    this.DeleteEntity(query, trans);
                    IEntityData pageHeadJsCssEntityData = null;
                    for (Map<String, Object> dict : pageJsCssList) {
                        pageHeadJsCssEntityData = new EntityData(dict, this._PageJsCssEntity);
                        pageHeadJsCssEntityData.SetValue("PageId", pageId);
                        pageHeadJsCssEntityData.SetValue("DisplayIndex", dict.get("Index"));
                        primaryKey = this.InsertEntity(pageHeadJsCssEntityData, trans);
                        blSucceed = primaryKey != null;
                        if (!blSucceed) {
                            break;
                        }
                    }
                }
                blSucceed = trans.CommitTransaction(blSucceed);
                return GetBoolDict(blSucceed);
            } else {
                return GetBoolDict(false);
            }
        } catch (Exception ex) {
            return this.GetExceptionDict(Common.GetRealException(ex).getMessage());
        }
    }

    public Object DeletePage() {
        try {
            IDataTransaction trans = new DataTransaction(GetDataBase().CreateConnection());
            boolean blSucceed = true;
            blSucceed = this.DeleteEntity(this.GetQueryRequest().ToQuery(), trans);
            if (blSucceed) {
                this.SetEntityType(this._PageJsCssEntity);
                IQuery query = new Query("t_d_Page_JsCss");
                query.Where(String.format(" where PageId='%s'", this.GetQueryRequest().PrimaryKeyProperty.Value), null);
                this.DeleteEntity(query, trans);
            }
            blSucceed = trans.CommitTransaction(blSucceed);
            return GetBoolDict(blSucceed);
        } catch (Exception ex) {
            return this.GetExceptionDict(Common.GetRealException(ex).getMessage());
        }
    }
}