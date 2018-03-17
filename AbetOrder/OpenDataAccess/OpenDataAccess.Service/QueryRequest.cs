using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using OpenDataAccess.Entity;
using OpenDataAccess.Data;
using System.Web;
using System.Data;

namespace OpenDataAccess.Service
{
    public class QueryRequest
    {
        public NameValueCollection QueryString { get; private set; }
        private Request _Request;
        private IEntityAccess _EntityAccess;

        public QueryRequest(Request request, IEntityAccess entityAccess)
        {
            QueryString = request.QueryString;
            _Request = request;
            _EntityAccess = entityAccess;
            Parse();
        }

        public string GetParameterValue(string name)
        {
            string key = this.QueryString.AllKeys.Where(where => where.Trim().ToLower() == name.Trim().ToLower()).FirstOrDefault();
            if (key != null)
            {
                if (this.QueryString[key] == "undefined")
                {
                    return string.Empty;
                }
                else
                {
                    return HttpUtility.UrlDecode(this.QueryString[key].Trim());
                }
            }
            else
            {
                return string.Empty;
            }
        }

        public IQuery ToQuery()
        {
            IQuery query = new Query(_Request.Entity.TableName, _Request.Entity.Name);
            if (PrimaryKeyProperty !=null)
            {
                List<WhereStatement> whereList = new List<WhereStatement>();
                List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
                parameterList.Add(this._EntityAccess.GetInParameter(PrimaryKeyProperty));
                whereList.Add(new WhereStatement(PrimaryKeyProperty.Name, "=", PrimaryKeyProperty.ParameterName));
                query.Where(whereList, parameterList);
            }
            else
            {
                if (!string.IsNullOrEmpty(Filter))
                {
                    query.Where(string.Concat(" where ", Filter), this.FilterParamterList);
                }
            }
            query.Select(Select);
            if (!string.IsNullOrEmpty(GroupBy))
            {
                this.GroupBy = this.ValidateGroupBy(this.GroupBy);
                query.GroupBy(string.Concat(" group by ", GroupBy));
            }
            if (!string.IsNullOrEmpty(OrderBy))
            {
                this.OrderBy = this.ValidateOrderBy(this.OrderBy);
                query.OrderBy(string.Concat(" order by ", OrderBy));
            }
            if (string.IsNullOrEmpty(GroupBy) && string.IsNullOrEmpty(OrderBy))
            {
                if (string.IsNullOrEmpty(this._Request.Entity.PrimaryKey))
                {
                    throw new Exception("对不起，实体没有主键！");
                }
                query.OrderBy(string.Concat(" order by ", this._Request.Entity.PrimaryKey));
            }
            else if (!string.IsNullOrEmpty(GroupBy) && string.IsNullOrEmpty(OrderBy))
            {
                query.OrderBy(string.Concat(" order by ", this.GroupBy.Split(',')[0]));
            }
            return query;
        }

        public void Parse()
        {
            this.PrimaryKeyProperty = this.GetPrimaryKeyProperty();
            Select = GetParameterValue("$select");
            OrderBy = GetParameterValue("$orderby");
            GroupBy = GetParameterValue("$groupby");
            Filter = GetParameterValue("$filter");
            string query = GetParameterValue("$query");
            string data = GetParameterValue("$data");
            string page = GetParameterValue("$page");
            string width = GetParameterValue("$width");
            this.IsWidth = string.IsNullOrEmpty(width) ? false : bool.Parse(width);
            IsQuery = string.IsNullOrEmpty(query) ? false : bool.Parse(query);
            IsPage = string.IsNullOrEmpty(page) ? false : bool.Parse(page);
            IsData = string.IsNullOrEmpty(data) ? false : bool.Parse(data);
            if (!string.IsNullOrEmpty(this.Filter))
            {
                List<string> conditionList = new List<string>();
                this.ParseFilter(this.Filter, conditionList);
                this.Filter = string.Join("", conditionList.ToArray());
            }
            this.Filter = this.ReplaceOperator(this.Filter);
            if (this.FilterParamterList == null)
            {
                this.FilterParamterList = this.GetFileterParameterList();
            }
            else
            {
                List<IDbDataParameter> parameterList = this.GetFileterParameterList();
                if (parameterList != null)
                {
                    this.FilterParamterList.AddRange(parameterList);
                }
            }
            this.GetQueryInfo();
            this.Component = GetParameterValue("$component");
        }

        private void ParseFilter(string filter, List<string> conditionList)
        {
            while (filter.IndexOf("  ") > 0)
            {
                filter = filter.Replace("  ", " ");
            }
            string propertyName = string.Empty;
            string propertyValue = string.Empty;
            int logicIndex = 0;
            int andOrIndex = 0;
            string loginStr = string.Empty;
            string andOrStr = string.Empty;
            string condition = string.Empty;
            bool blParam = false;
            List<string> logicList = new List<string>()
            {
                " eq ",
                " ne ",
                " gt ",
                " ge ",
                " lt ",
                " le "
            };
            foreach (string logic in logicList)
            {
                logicIndex = filter.IndexOf(logic);
                if (logicIndex > 0)
                {
                    loginStr = logic;
                    break;
                }
            }
            if (logicIndex > 0)
            {
                propertyName = filter.Substring(0, logicIndex);
                Property property = this._Request.Entity.Properties.Where(p => p.Name.Trim().ToLower() == propertyName.Trim().ToLower()).FirstOrDefault();
                if (property == null)
                {
                    throw new Exception("字符串格式不正确！");
                }

                property.ParameterName = string.Concat("@", property.Name, "_", Guid.NewGuid().ToString().Substring(0, 8).ToUpper());
                andOrIndex = filter.IndexOf(" and ", logicIndex);
                if (andOrIndex < 0)
                {
                    andOrIndex = filter.IndexOf(" or ", logicIndex);
                    if (andOrIndex > 0)
                    {
                        andOrStr = " or ";
                    }
                }
                else
                {
                    andOrStr = " and ";
                }
                if (andOrIndex > 0)
                {
                    propertyValue = filter.Substring(logicIndex + loginStr.Length, andOrIndex - logicIndex - loginStr.Length);
                }
                else
                {
                    propertyValue = filter.Substring(logicIndex + loginStr.Length);
                }
                if (propertyValue.Trim() != "@" + property.Name)
                {
                    if (property.Type == typeof(string) || property.Type == typeof(Guid) || property.Type == typeof(DateTime))
                    {
                        if (propertyValue.IndexOf("'") == 0 && propertyValue.IndexOf("'", propertyValue.Length - 1) == propertyValue.Length - 1)
                        {
                            propertyValue = propertyValue.Substring(1, propertyValue.Length - 2);
                        }
                        else
                        {
                            throw new Exception("字符串格式不正确！");
                        }
                    }
                    property.Value = Common.ChangeType(propertyValue, property.Type);
                    if (this.FilterParamterList == null)
                    {
                        this.FilterParamterList = new List<IDbDataParameter>();
                    }
                    this.FilterParamterList.Add(this._EntityAccess.GetInParameter(property));
                    blParam = true;
                }
                else
                {
                    property.ParameterName = propertyValue;
                }

                if (andOrIndex > 0)
                {
                    if (blParam)
                    {
                        condition = filter.Substring(0, logicIndex + loginStr.Length) + property.ParameterName + andOrStr;
                    }
                    else
                    {
                        condition = filter.Substring(0, andOrIndex + andOrStr.Length);
                    }
                    conditionList.Add(condition);
                    this.ParseFilter(filter.Substring(andOrIndex + loginStr.Length), conditionList);
                }
                else
                {
                    if (blParam)
                    {
                        condition = filter.Substring(0, logicIndex + loginStr.Length) + property.ParameterName;
                    }
                    else
                    {
                        condition = filter;
                    }
                    conditionList.Add(condition);
                }
            }
            else
            {
                throw new Exception("字符串格式不正确！");
            }
        }

        private string ValidateGroupBy(string groupby)
        {
            while (groupby.IndexOf("  ") > 0)
            {
                groupby = groupby.Replace("  ", " ");
            }
            List<string> groupByList = groupby.Split(',').ToList();
            bool blExists = true;
            foreach (string g in groupByList)
            {
                if (!this._Request.Entity.Properties.Exists(p => p.Name.Trim().ToLower() == g.Trim().ToLower()))
                {
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

        private string ValidateOrderBy(string orderby)
        {
            while (orderby.IndexOf("  ") > 0)
            {
                orderby = orderby.Replace("  ", " ");
            }
            List<string> orderByList = orderby.Split(',').ToList();
            bool blExists = true;
            string propertyName = string.Empty;
            foreach (string o in orderByList)
            {
                propertyName = o.ToLower().Replace("desc", "");
                propertyName = propertyName.ToLower().Replace("asc", "");
                if (!this._Request.Entity.Properties.Exists(p => p.Name.Trim().ToLower() == propertyName.Trim().ToLower()))
                {
                    blExists = false;
                    break;
                }
            }
            if (!blExists)
            {
                throw new Exception("字符串格式不正确！");
            }
            return orderby;
        }

        private string ReplaceOperator(string filter)
        {
            filter = filter.Replace(" eq ", "=");
            filter = filter.Replace(" ne ", "<>");
            filter = filter.Replace(" gt ", ">");
            filter = filter.Replace(" ge ", ">=");
            filter = filter.Replace(" lt ", "<");
            filter = filter.Replace(" le ", "<=");
            return filter;
        }

        public bool IsEdit { get; private set; }
        public bool IsQuery { get; private set; }
        public bool IsPage { get; private set; }
        public bool IsData { get; private set; }
        public bool IsWidth { get; private set; }
        public Property PrimaryKeyProperty { get; private set; }
        public string Select { get; private set; }
        public string OrderBy { get; private set; }
        public string GroupBy { get; private set; }
        public string Filter { get; private set; }
        public string Component { get; private set; }
        public List<IDbDataParameter> FilterParamterList { get; private set; }

        private Property GetPrimaryKeyProperty()
        {
            string pathInfo = _Request.PathAndQuery;
            int startIndex = 0;
            int endIndex = 0;
            string primeryKeyString = string.Empty;
            string prefix = string.IsNullOrEmpty(this._Request.MethodName) ? _Request.Entity.Name : _Request.MethodName;
            startIndex = pathInfo.IndexOf(prefix + "(");
            if (startIndex >= 0)
            {
                endIndex = pathInfo.IndexOf(")", startIndex + prefix.Length + 1);
                primeryKeyString = pathInfo.Substring(startIndex + prefix.Length + 1, endIndex - startIndex - prefix.Length - 1);
                Property property = _Request.Entity.GetProperty(_Request.Entity.PrimaryKey);
                if (property != null)
                {
                    property.Value = Common.ChangeType(primeryKeyString, property.Type);
                    return property;
                }
            }
            return null;
        }

        private List<IDbDataParameter> GetFileterParameterList()
        {
            if (this.QueryString.AllKeys != null)
            {
                List<string> propertyNameList = (from key in this.QueryString.AllKeys
                                                  where key.IndexOf("@") == 0
                                                  select key.Substring(1)).ToList();
                if (propertyNameList != null)
                {
                    List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
                    List<Property> propertyList = _Request.Entity.GetPropertyList(propertyNameList);
                    propertyList.ForEach(property =>
                    {
                        property.Value = Common.ChangeType(this.GetParameterValue("@" + property.Name), property.Type);
                        parameterList.Add(this._EntityAccess.GetInParameter(property));
                    });
                    return parameterList;
                }
            }
            return null;
        }
 
        public QueryInfo QueryInfo { get; private set; }

        private void GetWhereSql()
        {
            StringBuilder sb = new StringBuilder();
            this.QueryInfo.ParameterList = new List<IDbDataParameter>();
            this.QueryInfo.WhereFields.ForEach(whereField =>
            {
                whereField.ParameterName = "@" + Guid.NewGuid().ToString().ToUpper().Substring(0, 8);
                whereField.Type = this.GetType(whereField.DataType);
                if (!string.IsNullOrEmpty(whereField.Value))
                {
                    if (whereField.OperateLogic != "in" && whereField.OperateLogic != "like")
                    {
                        try
                        {
                            whereField.ObjValue = Common.ChangeType(whereField.Value, whereField.Type);
                        }
                        catch
                        {
                            throw new Exception(string.Format("对不起，您输入的{0}值类型格式不正确！", whereField.Label));
                        }
                    }
                    if (whereField.OperateLogic == "like")
                    {
                        List<string> fieldList = new List<string>();
                        fieldList.AddRange(whereField.Name.Split(new char[] { ',', '，' }).ToList());
                        fieldList.ForEach(field =>
                        {
                            if (fieldList.Count == 1)
                            {
                                sb.AppendFormat(" and {0} {1} {2}", field, whereField.OperateLogic, whereField.ParameterName);
                            }
                            else
                            {
                                if (fieldList.IndexOf(field) == 0)
                                {
                                    sb.AppendFormat(" and ({0} {1} {2}", field, whereField.OperateLogic, whereField.ParameterName);
                                }
                                else if (fieldList.IndexOf(field) == fieldList.Count - 1)
                                {
                                    sb.AppendFormat(" or {0} {1} {2}", field, whereField.OperateLogic, whereField.ParameterName + ")");
                                }
                                else
                                {
                                    sb.AppendFormat(" or {0} {1} {2}", field, whereField.OperateLogic, whereField.ParameterName);
                                }
                            }
                            whereField.ObjValue = "%" + whereField.Value + "%";
                        });
                    }
                    else if (whereField.OperateLogic == "in")
                    {
                        List<string> valueList = whereField.Value.Split(new Char[] { ',', '，' }).ToList();
                        List<string> paramNameList = valueList.Select(select => whereField.ParameterName + valueList.IndexOf(select).ToString()).ToList();
                        sb.AppendFormat(" and {0} {1} {2}", whereField.Name, whereField.OperateLogic, "(" + string.Join(",", paramNameList.ToArray()) + ")");
                        valueList.ForEach(value =>
                        {
                            this.QueryInfo.ParameterList.Add(this._EntityAccess.CurrentDataBase.InParameter(whereField.ParameterName + valueList.IndexOf(value).ToString(), Common.ChangeType(value, whereField.Type)));
                        });
                    }
                    else
                    {
                        sb.AppendFormat(" and {0} {1} {2}", whereField.Name, whereField.OperateLogic, whereField.ParameterName);
                    }
                    if (whereField.OperateLogic != "in")
                    {
                        if (whereField.OperateLogic == "<" && whereField.DataType == "DateTime" && whereField.ObjValue != null)
                        {
                            whereField.ObjValue = ((DateTime)whereField.ObjValue).AddDays(1);
                        }
                        this.QueryInfo.ParameterList.Add(this._EntityAccess.CurrentDataBase.InParameter(whereField.ParameterName, whereField.ObjValue));
                    }
                }
            });
            this.QueryInfo.WhereSql = sb.ToString();
            if (!string.IsNullOrEmpty(this.QueryInfo.WhereSql.Trim()))
            {
                this.QueryInfo.WhereSql = " where " + this.QueryInfo.WhereSql.TrimStart().TrimStart(new char[] { 'a', 'n', 'd' }) + " ";
            }
        }

        private void GetProcParameterList()
        {
            this.QueryInfo.ParameterList = new List<IDbDataParameter>();
            this.QueryInfo.WhereFields.ForEach(whereField =>
            {
                whereField.ParameterName = "@" + whereField.Name;
                whereField.Type = this.GetType(whereField.DataType);
                if (!string.IsNullOrEmpty(whereField.Value))
                {
                    try
                    {
                        whereField.ObjValue = Common.ChangeType(whereField.Value, whereField.Type);
                    }
                    catch
                    {
                        throw new Exception(string.Format("对不起，您输入的{0}值类型格式不正确！", whereField.Label));
                    }
                    if (whereField.OperateLogic == "<" && whereField.DataType == "DateTime" && whereField.ObjValue != null)
                    {
                        whereField.ObjValue = ((DateTime)whereField.ObjValue).AddDays(1);
                    }
                    this.QueryInfo.ParameterList.Add(this._EntityAccess.CurrentDataBase.InParameter(whereField.ParameterName, whereField.ObjValue));
                }
                else
                {
                    this.QueryInfo.ParameterList.Add(this._EntityAccess.CurrentDataBase.InParameter(whereField.ParameterName, DBNull.Value));
                }
            });

            string pageSizeString = this.GetParameterValue("PageSize");
            string pageIndexString = this.GetParameterValue("PageIndex");
            string action = this.GetParameterValue("Action");
            int pageSize = string.IsNullOrEmpty(pageSizeString) ? 20 : int.Parse(pageSizeString);
            int pageIndex = string.IsNullOrEmpty(pageIndexString) ? 1 : int.Parse(pageIndexString);
            if (action == "Excel")
            {
                this.IsPage = false;
                pageSize = 0;
                pageIndex = 0;
            }
            this.QueryInfo.ParameterList.Add(this._EntityAccess.CurrentDataBase.InParameter("IsPage", this.IsPage));
            this.QueryInfo.ParameterList.Add(this._EntityAccess.CurrentDataBase.InParameter("PageIndex", pageIndex));
            this.QueryInfo.ParameterList.Add(this._EntityAccess.CurrentDataBase.InParameter("PageSize", pageSize));
        }

        public Type GetType(string typeName)
        {
            switch (typeName.Trim().ToLower())
            {
                case "string":
                    {
                        return typeof(string);
                    }
                case "long":
                    {
                        return typeof(long);
                    }
                case "int":
                    {
                        return typeof(int);
                    }
                case "short":
                    {
                        return typeof(short);
                    }
                case "byte":
                    {
                        return typeof(byte);
                    }
                case "bool":
                    {
                        return typeof(bool);
                    }
                case "decimal":
                    {
                        return typeof(decimal);
                    }
                case "double":
                    {
                        return typeof(double);
                    }
                case "float":
                    {
                        return typeof(float);
                    }
                case "guid":
                    {
                        return typeof(Guid);
                    }
                case "datetime":
                    {
                        return typeof(DateTime);
                    }
                default:
                    {
                        return typeof(string);
                    }
            }
        }

        public SqlDbType GetSqlType(string typeName)
        {
            switch (typeName.Trim().ToLower())
            {
                case "string":
                    {
                        return SqlDbType.NVarChar;
                    }
                case "long":
                    {
                        return SqlDbType.BigInt;
                    }
                case "int":
                    {
                        return SqlDbType.Int;
                    }
                case "short":
                    {
                        return SqlDbType.SmallInt;
                    }
                case "byte":
                    {
                        return SqlDbType.TinyInt;
                    }
                case "bool":
                    {
                        return SqlDbType.Bit;
                    }
                case "decimal":
                    {
                        return SqlDbType.Decimal;
                    }
                case "double":
                    {
                        return SqlDbType.Float;
                    }
                case "float":
                    {
                        return SqlDbType.Float;
                    }
                case "guid":
                    {
                        return SqlDbType.UniqueIdentifier;
                    }
                case "datetime":
                    {
                        return SqlDbType.DateTime;
                    }
                default:
                    {
                        return SqlDbType.VarChar;
                    }
            }
        }

        public int GetMaxLength(string typeName)
        {
            switch (typeName.Trim().ToLower())
            {
                case "string":
                    {
                        return 100;
                    }
                case "long":
                    {
                        return 8;
                    }
                case "int":
                    {
                        return 4;
                    }
                case "short":
                    {
                        return 2;
                    }
                case "byte":
                    {
                        return 1;
                    }
                case "bool":
                    {
                        return 1;
                    }
                case "decimal":
                    {
                        return 17;
                    }
                case "double":
                    {
                        return 8;
                    }
                case "float":
                    {
                        return 8;
                    }
                case "guid":
                    {
                        return 16;
                    }
                case "datetime":
                    {
                        return 8;
                    }
                default:
                    {
                        return 100;
                    }
            }
        }

        private void GetQueryInfo()
        {
            if (this._Request.Entities != null && this._Request.Entities.ContainsKey("QueryInfo"))
            {
                IEntityData entityData = this._Request.Entities["QueryInfo"].FirstOrDefault();
                if (entityData != null)
                {
                    this.QueryInfo = entityData.ToEntity<QueryInfo>() as QueryInfo;
                    if (this.QueryInfo != null && string.IsNullOrEmpty(this.QueryInfo.ProcName))
                    {
                        if (!string.IsNullOrEmpty(this.QueryInfo.FieldSql))
                        {
                            if (!string.IsNullOrEmpty(this.QueryInfo.GroupByFieldSql))
                            {
                                this.QueryInfo.FieldSql = " " + this.GetEntityPropertySql(this.QueryInfo.FieldSql) + "," + this.QueryInfo.GroupByFieldSql.Trim().TrimEnd(',') + " ";
                            }
                            else
                            {
                                this.QueryInfo.FieldSql = " " + this.GetEntityPropertySql(this.QueryInfo.FieldSql) + " ";
                            }
                        }
                        else
                        {
                            if (!string.IsNullOrEmpty(this.QueryInfo.GroupByFieldSql))
                            {
                                this.QueryInfo.FieldSql = " " + this.QueryInfo.GroupByFieldSql.Trim().TrimEnd(',') + " ";
                            }
                            else
                            {
                                this.QueryInfo.FieldSql = " t.* ";
                            }
                        }
                        if (!string.IsNullOrEmpty(this.QueryInfo.GroupBySql))
                        {
                            this.QueryInfo.GroupBySql = " group by " + this.GetEntityPropertySql(this.QueryInfo.GroupBySql) + " ";
                        }
                        else
                        {
                            this.QueryInfo.GroupBySql = string.Empty;
                        }
                        if (!string.IsNullOrEmpty(this.QueryInfo.OrderBySql))
                        {
                            this.QueryInfo.OrderBySql = " order by " + this.QueryInfo.OrderBySql.Trim().TrimEnd(',') + " ";
                        }
                        else
                        {
                            this.QueryInfo.OrderBySql = string.Empty;
                        }
                        this.GetWhereSql();
                    }
                    else
                    {
                        this.GetProcParameterList();
                    }
                }
            }
        }

        private string GetEntityPropertySql(string sql)
        {
            List<string> fields = sql.Trim().TrimEnd(',').Split(',').ToList();
            string fieldSql = string.Join(",", (from property in this._Request.Entity.Properties
                                                from filed in fields
                                                where property.Name.Trim().ToLower() == filed.Trim().ToLower() && property.IsSelect
                                                select property.Name).ToArray());
            if (fields.Exists(e => e == "RowVersion") && fieldSql.IndexOf("RowVersion") < 0)
            {
                fieldSql += ",RowVersion";
            }
            return fieldSql;
        }
    }
}