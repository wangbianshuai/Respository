using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using OpenDataAccessCore.Entity;
using System.Configuration;
using System.Diagnostics;
using OpenDataAccessCore.Utility;

namespace OpenDataAccessCore.Service
{
    public class RequestHandler
    {
        public string ProcessRequest(Request request, string entityName = null, string methodName = null)
        {
            request.StartTime = DateTime.Now;
            Stopwatch sw = new Stopwatch();
            sw.Start();

            string responseContent = string.Empty;
            object obj = null;

            try
            {
                string put = request.QueryString["$put"];
                string get = request.QueryString["$get"];
                string delete = request.QueryString["$delete"];
                if (put == "true")
                {
                    request.RequestType = "PUT";
                }
                else if (get == "true")
                {
                    request.RequestType = "GET";
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

                obj = this.InvokeMethod(request);
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

        private object InvokeMethod(Request request)
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
                entityType = EntityType.GetEntityType("OperationLog");
                if (entityType != null)
                {
                    request.OperationLogEntity = entityType;
                }
            }

            if (request.EntityName == "$entity")
            {
                return this.GetEntityInfo();
            }

            entityType = EntityType.GetEntityType(request.EntityName);
            if (entityType == null)
            {
                throw new Exception("实体不存在！");
            }
            request.Entity = entityType;
            request.Entities = this.GetEntities(request);

            object returnObj = null;

            if (!string.IsNullOrEmpty(request.MethodName))
            {
                Type type = ComponentType.GetComponentType(request.EntityName);
                if (type == null)
                {
                    throw new Exception("实体不存在！");
                }
                object instanceObj = Activator.CreateInstance(type, request);
                entityRequest = instanceObj as EntityRequest;

                MethodInfo methodInfo = type.GetMethod(request.MethodName);
                if (methodInfo != null)
                {
                    LogAttribute log = methodInfo.GetCustomAttributes(typeof(LogAttribute), false).FirstOrDefault() as LogAttribute;

                    request.IsLog = log != null;
                   
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
            EntityType.EntityTypeList.ToList().ForEach(entity =>
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
