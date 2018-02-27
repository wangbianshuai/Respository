using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Reflection;
using OpenDataAccess.Entity;
using System.Configuration;
using System.Diagnostics;
using OpenDataAccess.Utility;

namespace OpenDataAccess.Service
{
    public class RequestHandler
    {
        public string ProcessRequest(HttpContext context, Func<string, string, Type> getClassType, string operationUser = null)
        {
            return ProcessRequest(new HttpContextWrapper(context), getClassType, operationUser);
        }

        public string ProcessRequest(HttpContextBase context, Func<string, string, Type> getClassType, string operationUser = null, string entityName = null, string methodName = null, string rootPath = null)
        {
            if (string.IsNullOrEmpty(rootPath))
            {
                rootPath = context.Server.MapPath("/");
            }

            Request request = this.ParseReqeust(context);

            request.OperationUser = operationUser;
            request.RootPath = rootPath;

            return this.ProcessRequest(request, getClassType, entityName, methodName);
        }

        public string ProcessRequest(Request request, Func<string, string, Type> getClassType, string entityName = null, string methodName = null)
        {
            DateTime startTime = DateTime.Now;
            Stopwatch sw = new Stopwatch();
            sw.Start();

            string responseContent = string.Empty;
            object obj = null;

            try
            {
                string put = request.QueryString["$put"];
                string delete = request.QueryString["$delete"];
                if (put == "true")
                {
                    request.RequestType = "PUT";
                }
                else if (delete == "true")
                {
                    request.RequestType = "DELETE";
                }
                if (string.IsNullOrEmpty(entityName))
                {
                    string[] names = request.PathInfo.TrimStart('/').Trim().Split('/');
                    request.EntityName = names[0];
                    if (names.Length > 1)
                    {
                        request.MethodName = names[1];
                    }
                }
                else
                {
                    request.EntityName = entityName;
                    request.MethodName = methodName;
                }
                this.SetEntityAndMethodName(request, request.EntityName, request.MethodName);

                obj = this.InvokeMethod(request, getClassType);
                responseContent = Parse.ToJson(obj);
            }
            catch (Exception ex)
            {
                ex = Common.GetInnerException(ex);
                Dictionary<string, object> dict = new Dictionary<string, object>();

                request.Excption = ex;
                dict.Add("Exception", ex.Message);

                obj = dict;
                responseContent = Parse.DictionaryToJson(dict);
            }

            request.EndTime = DateTime.Now;
            sw.Stop();
            request.ElapsedMilliseconds = sw.ElapsedMilliseconds;

            if (!string.IsNullOrEmpty(request.EntityName))
            {
                RequestLog.AddRequestLog(request, obj, responseContent);
            }

            return responseContent;
        }

        private void SetEntityAndMethodName(Request request, string entityName, string methodName)
        {
            int startIndex = 0;
            if (!string.IsNullOrEmpty(entityName))
            {
                request.EntityName = entityName;
                startIndex = request.EntityName.IndexOf("(");
                if (startIndex > 0)
                {
                    request.EntityName = request.EntityName.Substring(0, startIndex);
                }
            }
            if (!string.IsNullOrEmpty(methodName))
            {
                request.MethodName = methodName;
                startIndex = request.MethodName.IndexOf("(");
                if (startIndex > 0)
                {
                    request.MethodName = request.MethodName.Substring(0, startIndex);
                }
            }
        }

        private Request ParseReqeust(HttpContextBase context)
        {
            Request request = new Request();
            request.QueryString = context.Request.QueryString;
            request.QueryString.Add(context.Request.Form);
            request.RequestType = context.Request.RequestType;
            request.Content = context.Request.ContentEncoding.GetString(context.Request.BinaryRead(context.Request.ContentLength));
            request.Content = request.Content.Replace("&#63;", "?");
            request.PathAndQuery = context.Request.Url.PathAndQuery;
            request.RawUrl = context.Request.RawUrl;
            request.IPAddress = OpenDataAccess.Utility.Common.GetRealIP(context.Request);
            request.PathInfo = context.Request.PathInfo;

            return request;
        }

        private EntityType GetEntityType(string className, Func<string, string, Type> getClassType)
        {
            EntityType entityType = null;
            string classNamespace = ConfigurationManager.AppSettings["EntityModelNamespace"];
            try
            {
                entityType = EntityType.GetEntityType(className);
                if (entityType == null)
                {
                    EntityType.SetEntityType(getClassType(classNamespace, className));
                    entityType = EntityType.GetEntityType(className);
                }
            }
            catch
            {
                try
                {
                    entityType = EntityType.GetEntityType(className);
                    if (entityType == null)
                    {
                        EntityType.SetEntityType(getClassType(classNamespace, className));
                        entityType = EntityType.GetEntityType(className);
                    }
                }
                catch
                {
                }
            }
            return entityType;
        }

        private Type GetClassType(string className, Func<string, string, Type> getClassType)
        {
            Type type = null;
            string classNamespace = ConfigurationManager.AppSettings["ComponentNamespace"];
            try
            {
                type = ComponentType.GetComponentType(className);
                if (type == null)
                {
                    ComponentType.SetComponentType(getClassType(classNamespace, className));
                    type = ComponentType.GetComponentType(className);
                }
            }
            catch
            {
                try
                {
                    type = ComponentType.GetComponentType(className);
                    if (type == null)
                    {
                        ComponentType.SetComponentType(getClassType(classNamespace, className));
                        type = ComponentType.GetComponentType(className);
                    }
                }
                catch
                {
                }
            }
            return type;
        }

        private object InvokeMethod(Request request, Func<string, string, Type> getClassType)
        {
            EntityRequest entityRequest = null;

            if (string.IsNullOrEmpty(request.EntityName))
            {
                return null;
            }

            if (string.IsNullOrEmpty(request.Content) && (request.RequestType == "POST" || request.RequestType == "PUT" || (request.RequestType == "DELETE" && request.QueryString["$data"] == "true")))
            {
                request.IsLog = false;
                Dictionary<string, object> dict = new Dictionary<string, object>();
                dict.Add("NoData", true);
                return dict;
            }

            EntityType entityType = null;

            if (RequestLog.IsLog)
            {
                entityType = this.GetEntityType("OperationLog", getClassType);
                if (entityType != null)
                {
                    request.OperationLogEntity = entityType;
                }
            }

            if (request.EntityName == "$entity")
            {
                return this.GetEntityInfo();
            }

            string classNamespace = string.Empty;

            entityType = this.GetEntityType(request.EntityName, getClassType);
            if (entityType == null)
            {
                throw new Exception("实体不存在！");
            }
            request.Entity = entityType;
            request.Entities = this.GetEntities(request);

            object returnObj = null;

            if (!string.IsNullOrEmpty(request.MethodName))
            {
                Type type = this.GetClassType(request.EntityName, getClassType);
                if (type == null)
                {
                    throw new Exception("实体不存在！");
                }
                object instanceObj = Activator.CreateInstance(type, request);
                entityRequest = instanceObj as EntityRequest;

                MethodInfo methodInfo = type.GetMethod(request.MethodName);
                if (methodInfo != null)
                {
                    NoLogAttribute nolog = methodInfo.GetCustomAttributes(typeof(NoLogAttribute), false).FirstOrDefault() as NoLogAttribute;
                    if (nolog != null)
                    {
                        request.IsLog = false;
                    }
                    else
                    {
                        request.IsLog = true;
                    }
                    returnObj = methodInfo.Invoke(instanceObj, null);
                }
                else
                {
                    throw new Exception("方法不存在！");
                }
            }
            else
            {
                switch (request.RequestType)
                {
                    case "GET":
                        {
                            if (!request.Entity.IsGet)
                            {
                                throw new Exception("请求不允许！");
                            }
                            entityRequest = new EntityRequest(request);
                            returnObj = entityRequest.Select();
                            break;
                        }
                    case "POST":
                        {
                            entityRequest = new EntityRequest(request);
                            if (entityRequest._QueryRequest.IsQuery)
                            {
                                request.IsPostQuery = true;
                                returnObj = entityRequest.Select();
                            }
                            else
                            {
                                if (!request.Entity.IsPost)
                                {
                                    throw new Exception("请求不允许！");
                                }
                                returnObj = entityRequest.Insert();
                            }
                            break;
                        }
                    case "PUT":
                        {
                            if (!request.Entity.IsPut)
                            {
                                throw new Exception("请求不允许！");
                            }
                            entityRequest = new EntityRequest(request);
                            returnObj = entityRequest.Update();
                            break;
                        }
                    case "DELETE":
                        {
                            if (!request.Entity.IsDelete)
                            {
                                throw new Exception("请求不允许！");
                            }
                            entityRequest = new EntityRequest(request);
                            returnObj = entityRequest.Delete();
                            break;
                        }
                    default:
                        {
                            throw new ArgumentException();
                        }
                }
            }
            return returnObj;
        }

        private object GetEntityInfo()
        {
            Dictionary<string, object> dict = new Dictionary<string,object>();
            Dictionary<string,object> entityDict = new Dictionary<string,object>();
            List<Dictionary<string,object>> propertyList =null;
            Dictionary<string, object> propertyDict = null;
            EntityType.EntityTypeList.ForEach(entity =>
            {
                entityDict = new Dictionary<string,object>();
                entityDict.Add("Name", entity.Name);
                entityDict.Add("PrimaryKey", entity.PrimaryKey);
                propertyList = new List<Dictionary<string, object>>();
                entity.Properties.ForEach(property =>
                {
                    propertyDict = new Dictionary<string, object>();
                    propertyDict.Add("Name", property.Name);
                    propertyDict.Add("Type", property.Type.Name);
                    propertyList.Add(propertyDict);
                });
                entityDict.Add("Properties", propertyList);
                dict.Add(entity.Name, entityDict);
            });
            return dict;
        }

        private Dictionary<string, List<IEntityData>> GetEntities(Request request)
        {
            if (!string.IsNullOrEmpty(request.Content))
            {
                Dictionary<string, List<IEntityData>> entityDict = new Dictionary<string, List<IEntityData>>();
                Dictionary<string, object> dict = Parse.ParseJsonContent(request.Content).FirstOrDefault();
                if (dict != null)
                {
                    foreach (KeyValuePair<string, object> kvp in dict)
                    {
                        entityDict.Add(kvp.Key, Parse.DictionaryListToIEntityList(Parse.ToDictionaryList(kvp.Value)));
                    }
                    return entityDict;
                }
            }
            return null;
        }
    }
}
