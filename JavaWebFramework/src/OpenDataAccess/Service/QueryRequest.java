package OpenDataAccess.Service;

import OpenDataAccess.Data.*;
import OpenDataAccess.Entity.IEntityAccess;
import OpenDataAccess.Entity.IEntityData;
import OpenDataAccess.Entity.Property;
import OpenDataAccess.LambdaInterface.IExceptionHandle;

import java.net.MalformedURLException;
import java.util.*;
import java.util.stream.Collectors;

public class QueryRequest
{
    public Map<String,String> GetQueryString(){return  _QueryString;}
    private  Map<String,String> _QueryString=null;
    private Request _Request;
    private IEntityAccess _EntityAccess;

    public IExceptionHandle ExceptionHandle = null;

    public QueryRequest(Request request, IEntityAccess entityAccess, IExceptionHandle exHandle) {
        _QueryString = request.QueryString;
        _Request = request;
        _EntityAccess = entityAccess;
        ExceptionHandle= exHandle;
        Parse();
    }

    private void ExHandling(Exception ex) {
        if (this.ExceptionHandle != null) {
            this.ExceptionHandle.Handling(ex);
        }
    }

    public IQuery ToQuery() throws  Exception {
        IQuery query = new Query(_Request.Entity.TableName, _Request.Entity.Name);
        if (PrimaryKeyProperty != null) {
            List<WhereStatement> whereList = new ArrayList<>();
            IDataParameterList parameterList = new DataParameterList();
            parameterList.Set(PrimaryKeyProperty.Name, PrimaryKeyProperty.Value);
            whereList.add(new WhereStatement(PrimaryKeyProperty.Name, "=", PrimaryKeyProperty.ParameterName));
            query.Where(whereList, parameterList);
        } else if (!OpenDataAccess.Utility.Common.IsNullOrEmpty(Filter))
            query.Where(String.format("%s%s", " where ", Filter), this.FilterParamterList);

        query.Select(Select);
        if (!OpenDataAccess.Utility.Common.IsNullOrEmpty(GroupBy)) {
            this.GroupBy = this.ValidateGroupBy(this.GroupBy);
            query.GroupBy(String.format("%s%s", " group by ", GroupBy));
        }
        if (!OpenDataAccess.Utility.Common.IsNullOrEmpty(OrderBy)) {
            this.OrderBy = this.ValidateOrderBy(this.OrderBy);
            query.OrderBy(String.format("%s%s", " order by ", OrderBy));
        }
        if (OpenDataAccess.Utility.Common.IsNullOrEmpty(GroupBy) && OpenDataAccess.Utility.Common.IsNullOrEmpty(OrderBy)) {
            if (OpenDataAccess.Utility.Common.IsNullOrEmpty(this._Request.Entity.PrimaryKey)) {
                throw new Exception("对不起，实体没有主键！");
            }
            query.OrderBy(String.format("%s%s", " order by ", this._Request.Entity.PrimaryKey));
        } else if (!OpenDataAccess.Utility.Common.IsNullOrEmpty(GroupBy) && OpenDataAccess.Utility.Common.IsNullOrEmpty(OrderBy)) {
            query.OrderBy(String.format("%s%s", " order by ", this.GroupBy.split(",")[0]));
        }
        return query;
    }

    private  boolean IsNullOrEmpty(String str){
        return OpenDataAccess.Utility.Common.IsNullOrEmpty(str);
    }

    public void Parse() {
        try {
            this.PrimaryKeyProperty = this.GetPrimaryKeyProperty();
            Select = _Request.GetParameterValue("$select");
            OrderBy = _Request.GetParameterValue("$orderby");
            GroupBy = _Request.GetParameterValue("$groupby");
            Filter = _Request.GetParameterValue("$filter");
            String query = _Request.GetParameterValue("$query");
            String data = _Request.GetParameterValue("$data");
            String page = _Request.GetParameterValue("$page");
            String width = _Request.GetParameterValue("$width");
            String groupbyinfo = _Request.GetParameterValue("$groupbyinfo");
            this.IsWidth = IsNullOrEmpty(width) ? false : Boolean.parseBoolean(width);
            IsQuery = IsNullOrEmpty(query) ? false : Boolean.parseBoolean(query);
            IsPage = IsNullOrEmpty(page) ? false : Boolean.parseBoolean(page);
            IsData = IsNullOrEmpty(data) ? false : Boolean.parseBoolean(data);
            IsGroupByInfo = IsNullOrEmpty(groupbyinfo) ? false : Boolean.parseBoolean(groupbyinfo);
            if (!IsNullOrEmpty(this.Filter)) {
                List<String> conditionList = new ArrayList<>();
                this.ParseFilter(this.Filter, conditionList);
                this.Filter = String.join("", conditionList);
            }
            this.Filter = this.replaceOperator(this.Filter);
            if (this.FilterParamterList == null) {
                this.FilterParamterList = this.GetFileterParameterList();
            } else {
                IDataParameterList parameterList = this.GetFileterParameterList();
                if (parameterList != null) {
                    this.FilterParamterList.AddMap(parameterList.Get());
                }
            }
            this.GetQueryInfo();
            this.Component = _Request.GetParameterValue("$component");
        } catch (Exception ex) {
            this.ExHandling(ex);
        }
    }

    private void ParseFilter(String filter, List<String> conditionList) throws Exception {
        while (filter.indexOf("  ") > 0) {
            filter = filter.replace("  ", " ");
        }
        String propertyValue = "";
        int logicIndex = 0;
        int andOrIndex = 0;
        String loginStr = "";
        String andOrStr = "";
        String condition = "";
        boolean blParam = false;
        List<String> logicList = Arrays.asList(new String[]{" eq ", " ne ", " gt ", " ge ", " lt ", " le "});
        for (int i = 0; i < logicList.size(); i++) {
            logicIndex = filter.indexOf(logicList.get(i));
            if (logicIndex > 0) {
                loginStr = logicList.get(i);
                break;
            }
        }
        if (logicIndex > 0) {
            String propertyName = filter.substring(0, logicIndex);
            Property property = OpenDataAccess.Utility.Common.GetFirstOrDefault(Property.class, this._Request.Entity.Properties, p -> p.Name.trim().toLowerCase().equals(propertyName.trim().toLowerCase()));
            if (property == null) {
                throw new Exception("字符串格式不正确！");
            }

            property.ParameterName = String.format("%s%s%s%s", "@", property.Name, "_", OpenDataAccess.Utility.Common.CreateGuid().substring(0, 8).toUpperCase());
            andOrIndex = filter.indexOf(" and ", logicIndex);
            if (andOrIndex < 0) {
                andOrIndex = filter.indexOf(" or ", logicIndex);
                if (andOrIndex > 0) {
                    andOrStr = " or ";
                } else andOrStr = " and ";

                if (andOrIndex > 0)
                    propertyValue = filter.substring(logicIndex + loginStr.length(), andOrIndex);
                else propertyValue = filter.substring(logicIndex + loginStr.length());

                if (propertyValue.trim() != "@" + property.Name) {
                    if (property.Type.getClass().equals(String.class) || property.Type.getClass().equals(Date.class)) {
                        if (propertyValue.indexOf("'") == 0 && propertyValue.indexOf("'", propertyValue.length() - 1) == propertyValue.length() - 1) {
                            propertyValue = propertyValue.substring(1, propertyValue.length() - 2);
                        } else throw new Exception("字符串格式不正确！");
                    }
                    property.Value = Common.ChangeType(property.Type, propertyValue);
                    if (this.FilterParamterList == null) this.FilterParamterList = new DataParameterList();

                    this.FilterParamterList.Set(property.Name, property.Value);
                    blParam = true;
                } else property.ParameterName = propertyValue;

                if (andOrIndex > 0) {
                    if (blParam)
                        condition = filter.substring(0, logicIndex + loginStr.length()) + property.ParameterName + andOrStr;
                    else condition = filter.substring(0, andOrIndex + andOrStr.length());
                    conditionList.add(condition);
                    this.ParseFilter(filter.substring(andOrIndex + loginStr.length()), conditionList);
                } else {
                    if (blParam)
                        condition = filter.substring(0, logicIndex + loginStr.length()) + property.ParameterName;
                    else condition = filter;

                    conditionList.add(condition);
                }
            } else throw new Exception("字符串格式不正确！");
        }
    }

    private String ValidateGroupBy(String groupby) throws  Exception
    {
        while (groupby.indexOf("  ") > 0)
        {
            groupby = groupby.replace("  ", " ");
        }
        List<String> groupByList = Arrays.asList( groupby.split(","));
        boolean blExists = true;
        for (int i=0;i<groupByList.size();i++)
        {
            String g = groupByList.get(i);
            if(!OpenDataAccess.Utility.Common.Exists(_Request.Entity.Properties,e->e.Name.trim().toLowerCase().equals(g.trim().toLowerCase()))){
                blExists = false;
                break;
            }
        }
        if (!blExists)
        {
            throw new Exception("字符串格式不正确！");
        }
        return groupby;
    }

    private String ValidateOrderBy(String orderby) throws  Exception {
        while (orderby.indexOf("  ") > 0) {
            orderby = orderby.replace("  ", " ");
        }
        List<String> orderByList = Arrays.asList(orderby.split(","));
        boolean blExists = true;
        for (int i = 0; i < orderByList.size(); i++) {
            String o = orderByList.get(i);
            String propertyName = o.toLowerCase().replace("desc", "");
            propertyName.toLowerCase().replace("asc", "");

            if (!OpenDataAccess.Utility.Common.Exists(_Request.Entity.Properties, e -> e.Name.trim().toLowerCase().equals(propertyName.trim().toLowerCase()))) {
                blExists = false;
                break;
            }
        }
        if (!blExists) {
            throw new Exception("字符串格式不正确！");
        }
        return orderby;
    }

    private String replaceOperator(String filter) {
        filter = filter.replace(" eq ", "=");
        filter = filter.replace(" ne ", "<>");
        filter = filter.replace(" gt ", ">");
        filter = filter.replace(" ge ", ">=");
        filter = filter.replace(" lt ", "<");
        filter = filter.replace(" le ", "<=");
        return filter;
    }

    public boolean IsEdit =false;
    public boolean IsQuery=false;
    public boolean IsPage=false;
    public boolean IsData=false;
    public boolean IsWidth=false;
    public boolean IsGroupByInfo=false;
    public String GroupByInfoWhereSql =null;
    public DataParameterList GroupByInfoParameterList =null;
    public Property PrimaryKeyProperty =null;
    public String Select  =null;
    public String OrderBy  =null;
    public String GroupBy  =null;
    public String Filter =null;
    public String Component  =null;
    public IDataParameterList FilterParamterList =null;

    private Property GetPrimaryKeyProperty() throws  Exception {
        String pathInfo = _Request.PathAndQuery;
        int startIndex = 0;
        int endIndex = 0;
        String primeryKeyString = "";
        String prefix = IsNullOrEmpty(this._Request.MethodName) ? _Request.Entity.Name : _Request.MethodName;
        startIndex = pathInfo.indexOf(prefix + "(");
        if (startIndex >= 0) {
            endIndex = pathInfo.indexOf(")", startIndex + prefix.length() + 1);
            primeryKeyString = pathInfo.substring(startIndex + prefix.length() + 1, endIndex);
            Property property = _Request.Entity.GetProperty(_Request.Entity.PrimaryKey);
            if (property != null) {
                property.Value = Common.ChangeType(property.Type, primeryKeyString);
                return property;
            }
        }
        return null;
    }

    private IDataParameterList GetFileterParameterList() throws MalformedURLException, Exception {
        if (this._QueryString != null) {
            List<String> propertyNameList = new ArrayList<>();
            for (String key : this._QueryString.keySet()) {
                if (key.startsWith("@")) propertyNameList.add(key.substring(1));
            }

            IDataParameterList parameterList = new DataParameterList();
            List<Property> propertyList = _Request.Entity.GetPropertyList(propertyNameList);
            for (int i = 0; i < propertyList.size(); i++) {
                Property property = propertyList.get(i);
                property.Value = Common.ChangeType(property.Type, this._Request.GetParameterValue("@" + property.Name));
                parameterList.Set(property.Name, property.Value);
            };
            return parameterList;
        }
        return null;
    }

    public QueryInfo QueryInfo =null;

    private  String GetLikeSql(WhereField whereField, List<String> fieldList) {
        List<String> sqlList = new ArrayList<>();
        for (int i = 0; i < fieldList.size(); i++) {
            String field = fieldList.get(i);
            sqlList.add(String.format("%s %s %s", field, whereField.OperateLogic, whereField.ParameterName));
        }

        whereField.ObjValue = "%" + whereField.Value + "%";

        return "(" + String.join(" or ", sqlList) + ")";
    }

    private  String GetInSql(WhereField whereField)  throws  Exception {
        List<String> valueList = Arrays.asList(whereField.Value.split(",|，"));
        List<String> paramNameList = new ArrayList<>();

        for (int n = 0; n < valueList.size(); n++) {
            String value = valueList.get(n);
            String paramName = whereField.ParameterName + n;
            paramNameList.add(paramName);
            this.QueryInfo.ParameterList.Set(paramName, Common.ChangeType(whereField.Type, value));
        }

        return String.format("%s %s %s", whereField.Name, whereField.OperateLogic, "(" + String.join(",", paramNameList) + ")");
    }

    private void GetWhereSql() throws  Exception
    {
        List<String> whereSqlList = new ArrayList<>();
        this.QueryInfo.ParameterList = new DataParameterList();

        for (int i=0; i< this.QueryInfo.WhereFields.size();i++) {
            WhereField whereField = this.QueryInfo.WhereFields.get(i);
            whereField.ParameterName = "@" + OpenDataAccess.Utility.Common.CreateGuid().toUpperCase().substring(0, 8);
            whereField.Type = this.GetType(whereField.DataType);
            if (!IsNullOrEmpty(whereField.Value)) {
                if (!whereField.OperateLogic.equals("in") && !whereField.OperateLogic.equals("like")) {
                    try {
                        whereField.ObjValue = Common.ChangeType(whereField.Type, whereField.Value);
                    } catch (Exception ex) {
                        throw new Exception(String.format("对不起，您输入的%s值类型格式不正确！%s", whereField.Label, ex.getMessage()));
                    }
                }
                if (whereField.OperateLogic.equals("like")) {
                    List<String> fieldList = new ArrayList<>();
                    fieldList.addAll(Arrays.asList(whereField.Name.split(",|，")));
                    whereSqlList.add(GetLikeSql(whereField,fieldList));
                } else if (whereField.OperateLogic.equals("in")) {
                    whereSqlList.add(GetInSql(whereField));
                } else {
                    whereSqlList.add(String.format("%s %s %s", whereField.Name, whereField.OperateLogic, whereField.ParameterName));
                }
                if (!whereField.OperateLogic.equals("in")) {
                    if (whereField.OperateLogic == "<" && whereField.DataType == "DateTime" && whereField.ObjValue != null) {
                        whereField.ObjValue = OpenDataAccess.Utility.Common.AddDays((Date) whereField.ObjValue, 1);
                    }
                    this.QueryInfo.ParameterList.Set(whereField.ParameterName, whereField.ObjValue);
                }
            }
        }

        this.QueryInfo.WhereSql = String.join(" and ", whereSqlList);
        if (!IsNullOrEmpty(this.QueryInfo.WhereSql))
        {
            this.QueryInfo.WhereSql = " where " + this.QueryInfo.WhereSql;

            if (this.IsGroupByInfo) {
                this.GroupByInfoWhereSql = this.QueryInfo.WhereSql;
                this.GroupByInfoParameterList = new DataParameterList();

                this.GroupByInfoParameterList.AddMap(this.QueryInfo.ParameterList.Get());
            }
        }
    }

    public Class<?> GetType(String typeName) {
        switch (typeName.trim().toUpperCase()) {
            case "string":
                return String.class;
            case "long":
                return long.class;
            case "int":
                return int.class;
            case "short":
                return short.class;
            case "byte":
                return byte.class;
            case "boolean":
                return boolean.class;
            case "decimal":
            case "double":
                return double.class;
            case "float":
                return float.class;
            case "guid":
                return String.class;
            case "datetime":
                return Date.class;
            case "time":
                return Date.class;
            default:
                return String.class;
        }
    }

    private void GetQueryInfo() throws IllegalAccessException, InstantiationException, Exception {
        if (this._Request.Entities != null && this._Request.Entities.containsKey("QueryInfo")) {
            IEntityData entityData = OpenDataAccess.Utility.Common.GetFirstOrDefault(IEntityData.class, this._Request.Entities.get("QueryInfo"));
            if (entityData != null) {
                this.QueryInfo = (QueryInfo) entityData.ToEntity(OpenDataAccess.Service.QueryInfo.class);
                if (this.QueryInfo != null && IsNullOrEmpty(this.QueryInfo.ProcName)) {
                    String groupByFieldSql = OpenDataAccess.Utility.Common.TrimEnd(OpenDataAccess.Utility.Common.Trim(this.QueryInfo.GroupByFieldSql), ",");

                    if (!IsNullOrEmpty(this.QueryInfo.FieldSql)) {
                        if (!IsNullOrEmpty(groupByFieldSql)) {
                            this.QueryInfo.FieldSql = " " + this.GetEntityPropertySql(this.QueryInfo.FieldSql) + "," + groupByFieldSql + " ";
                        } else {
                            this.QueryInfo.FieldSql = " " + this.GetEntityPropertySql(this.QueryInfo.FieldSql) + " ";
                        }
                    } else {
                        if (!IsNullOrEmpty(groupByFieldSql)) {
                            this.QueryInfo.FieldSql = " " + groupByFieldSql + " ";
                        } else {
                            this.QueryInfo.FieldSql = " t.* ";
                        }
                    }
                    if (!IsNullOrEmpty(this.QueryInfo.GroupBySql)) {
                        this.QueryInfo.GroupBySql = " group by " + this.GetEntityPropertySql(this.QueryInfo.GroupBySql) + " ";
                    } else {
                        this.QueryInfo.GroupBySql = "";
                    }
                    if (!IsNullOrEmpty(this.QueryInfo.OrderBySql)) {
                        this.QueryInfo.OrderBySql = " order by " + OpenDataAccess.Utility.Common.TrimEnd(OpenDataAccess.Utility.Common.Trim(this.QueryInfo.OrderBySql), ",") + " ";
                    } else {
                        this.QueryInfo.OrderBySql = "";
                    }
                    this.GetWhereSql();
                }
            }
        }
    }

    private String GetEntityPropertySql(String sql) {
        List<String> fields = Arrays.asList(sql.trim().split(","));

        List<String> list = new ArrayList<>();

        this._Request.Entity.Properties.forEach(p -> {
            if (p.IsSelect && OpenDataAccess.Utility.Common.Exists(fields, e -> e.trim().toLowerCase().equals(p.Name.trim().toLowerCase()))) {
                list.add(p.Name);
            }
        });

        String fieldSql = String.join(",", list);
        if (fields.contains("RowVersion") && fieldSql.indexOf("RowVersion") < 0) {
            fieldSql += ",RowVersion";
        }
        return fieldSql;
    }
}
