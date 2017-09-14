using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;
using System.Web;
using System.Runtime.Serialization.Json;
using System.Web.Script.Serialization;
using System.Collections;
using System.Reflection;

namespace EntityDataService.Entity
{
    public class Parse
    {
        public static T DictionaryTo<T>(Dictionary<string, object> dict) where T : class
        {
            T obj = Activator.CreateInstance<T>();
            return DictionaryToObject(dict, obj) as T;
        }

        public static List<Dictionary<string, object>> ToDictionaryList(object obj)
        {
            if (obj is List<Dictionary<string, object>>)
            {
                return obj as List<Dictionary<string, object>>;
            }
            else if (obj is Dictionary<string, object>)
            {
                return new List<Dictionary<string, object>>() { obj as Dictionary<string, object> };
            }
            else
            {
                return new List<Dictionary<string, object>>();
            }
        }

        public static List<T> DictionaryListToList<T>(List<Dictionary<string, object>> dictList) where T : class
        {
            List<T> objList = new List<T>();
            dictList.ForEach(dict =>
            {
                objList.Add(DictionaryTo<T>(dict));
            });
            return objList;
        }

        public static object DictionaryToObject(Dictionary<string, object> dict, object obj)
        {
            Type type = obj.GetType();
            List<PropertyInfo> propertyList = type.GetProperties().ToList();
            foreach (KeyValuePair<string, object> kvp in dict)
            {
                PropertyInfo property = type.GetProperty(kvp.Key);
                
                if (property == null)
                {
                    property = propertyList.Where(w => w.Name.ToLower().Equals(kvp.Key.ToLower())).FirstOrDefault();
                }

                if (property != null && kvp.Value != null && kvp.Value != DBNull.Value)
                {
                    Type propertyType = property.PropertyType;
                    object childObj = null;
                    if (kvp.Value is List<Dictionary<string, object>>)
                    {
                        if (propertyType.IsGenericType)
                        {
                            object childList = Activator.CreateInstance(propertyType);
                            Type argumentType = propertyType.GetGenericArguments()[0];
                            foreach (Dictionary<string, object> childDict in kvp.Value as List<Dictionary<string, object>>)
                            {
                                childObj = Activator.CreateInstance(argumentType);
                                childObj = DictionaryToObject(childDict, childObj);
                                propertyType.InvokeMember("Add", BindingFlags.InvokeMethod | BindingFlags.Public | BindingFlags.Instance, null, childList, new object[] { childObj });
                            }
                            property.SetValue(obj, childList, null);
                        }
                    }
                    else if (kvp.Value is Dictionary<string, object>)
                    {
                        childObj = Activator.CreateInstance(propertyType);
                        property.SetValue(obj, DictionaryToObject(kvp.Value as Dictionary<string, object>, childObj), null);
                    }
                    else
                    {
                        if (kvp.Value.GetType().Name.ToList().Equals(property.PropertyType.Name.ToLower()))
                        {
                            property.SetValue(obj, kvp.Value, null);
                        }
                        else
                        {
                            property.SetValue(obj, Data.DataCommon.ChangeType(kvp.Value, property.PropertyType), null);
                        }
                    }
                }
            }
            return obj;
        }

        public static string ToJson(object obj)
        {
            if (obj == null)
            {
                return string.Empty;
            }
            else if (obj is Dictionary<string, object>)
            {
                return DictionaryToJson(obj as Dictionary<string, object>);
            }
            else if (obj is List<Dictionary<string, object>>)
            {
                return DictionaryListToJson(obj as List<Dictionary<string, object>>);
            }
            else if (obj is IEntity)
            {
                return IEntityToJson(obj as IEntity);
            }
            else if (obj is List<IEntity>)
            {
                return IEntityListToJson(obj as List<IEntity>);
            }
            else if (obj is IEntityData)
            {
                return IEntityToJson(obj as IEntityData);
            }
            else if (obj is List<IEntityData>)
            {
                return IEntityListToJson(obj as List<IEntityData>);
            }
            else
            {
                return ObjectToJson(obj);
            }
        }

        public static T JsonTo<T>(string jsonString)
        {
            return (T)JsonToObject(jsonString, typeof(T));
        }

        public static object JsonToObject(string jsonText, Type type)
        {
            DataContractJsonSerializer serializer = new System.Runtime.Serialization.Json.DataContractJsonSerializer(type);
            using (MemoryStream ms = new MemoryStream(Encoding.UTF8.GetBytes(jsonText)))
            {
                return serializer.ReadObject(ms);
            }
        }

        public static T JsonToObject<T>(string jsonText)
        {
            JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
            return jsSerializer.Deserialize<T>(jsonText);
        }

        public static string ObjectToJson(object obj)
        {
            JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
            return jsSerializer.Serialize(obj);
        }

        public static Dictionary<string, object> JsonToDictionary(string jsonText)
        {
            Dictionary<string, object> dict = JsonToObject<Dictionary<string, object>>(jsonText);
            return ParseJsonContent(dict);
        }

        public static List<Dictionary<string, object>> ParseJsonContent(string jsonText)
        {
            List<Dictionary<string, object>> dictList = new List<Dictionary<string, object>>();
            JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
            object obj = jsSerializer.DeserializeObject(jsonText);
            ParseJsonContent(obj, dictList);
            return dictList;
        }

        public static List<Dictionary<string, object>> ParseDictionaryList(List<Dictionary<string, object>> dictList)
        {
            List<Dictionary<string, object>> dictList2 = new List<Dictionary<string, object>>();
            dictList.ForEach(d =>
            {
                ParseJsonContent(d, dictList2);
            });
            return dictList2;
        }

        private static void ParseJsonContent(object obj, List<Dictionary<string, object>> dictList)
        {
            if (obj is Dictionary<string, object>)
            {
                dictList.Add(ParseJsonContent(obj));
            }
            else if (obj is object[] || obj is ArrayList)
            {
                dictList.AddRange(ParseJsonContentList(obj));
            }
        }

        private static Dictionary<string, object> ParseJsonContent(object obj)
        {
            Dictionary<string, object> dict = new Dictionary<string, object>();
            if (obj is Dictionary<string, object>)
            {
                foreach (KeyValuePair<string, object> kvp in obj as Dictionary<string, object>)
                {
                    if (kvp.Value is Dictionary<string, object>)
                    {
                        dict.Add(kvp.Key, ParseJsonContent(kvp.Value));
                    }
                    else if (kvp.Value is object[])
                    {
                        dict.Add(kvp.Key, ParseJsonContentList(kvp.Value));
                    }
                    else if (kvp.Value is ArrayList)
                    {
                        dict.Add(kvp.Key, ParseJsonContentList(kvp.Value));
                    }
                    else
                    {
                        dict.Add(kvp.Key, kvp.Value);
                    }
                }
            }
            return dict;
        }

        private static List<Dictionary<string, object>> ParseJsonContentList(object obj)
        {
            List<Dictionary<string, object>> dictList = new List<Dictionary<string, object>>();
            if (obj is object[])
            {
                object[] arrayObj = obj as object[];
                foreach (object item in arrayObj)
                {
                    if (item is Dictionary<string, object>)
                    {
                        dictList.Add(ParseJsonContent(item));
                    }
                }

            }
            else if (obj is ArrayList)
            {
                ArrayList arrayList = obj as ArrayList;
                foreach (object item in arrayList)
                {
                    if (item is Dictionary<string, object>)
                    {
                        dictList.Add(ParseJsonContent(item));
                    }
                }
            }
            return dictList;
        }

        public static string IEntityToJson(IEntity entity)
        {
            return IEntityToJson(entity.ToEntityData());
        }

        public static T IEntityDataTo<T>(IEntityData entityData) where T : class
        {
            return DictionaryTo<T>(entityData.ToDictionary());
        }

        public static List<T> IEntityDataListTo<T>(List<IEntityData> entityDataList) where T : class
        {
            List<T> list = new List<T>();
            entityDataList.ForEach(entityData =>
            {
                list.Add(IEntityDataTo<T>(entityData));
            });
            return list;
        }

        public static string IEntityListToJson(List<IEntity> entityList)
        {
            string entityName = string.Empty;
            List<Dictionary<string, object>> dictList = new List<Dictionary<string, object>>();
            if (entityList.Count > 0)
            {
                entityName = entityList[0].GetType().Name;
            }
            entityList.ForEach(entity =>
            {
                dictList.Add(entity.ToEntityData().ToDictionary());
            });
            if (!string.IsNullOrEmpty(entityName))
            {
                Dictionary<string, object> dict = new Dictionary<string, object>();
                dict.Add(entityName, dictList);
                return DictionaryToJson(dict);
            }
            else
            {
                return DictionaryListToJson(dictList);
            }

        }

        public static string IEntityToJson<T>(T entity) where T : IEntity
        {
            return IEntityToJson(entity.ToEntityData());
        }

        public static string IEntityListToJson<T>(List<T> entityList) where T : IEntity
        {
            string entityName = string.Empty;
            List<Dictionary<string, object>> dictList = new List<Dictionary<string, object>>();
            if (entityList.Count > 0)
            {
                entityName = entityList[0].GetType().Name; 
            }
            entityList.ForEach(entity =>
            {
                dictList.Add(entity.ToEntityData().ToDictionary());
            });
            if (!string.IsNullOrEmpty(entityName))
            {
                Dictionary<string, object> dict = new Dictionary<string, object>();
                dict.Add(entityName, dictList);
                return DictionaryToJson(dict);
            }
            else
            {
                return DictionaryListToJson(dictList);
            }
        }

        public static string IEntityToJson(IEntityData entityData)
        {
            if (!string.IsNullOrEmpty(entityData.EntityName))
            {
                Dictionary<string, object> dict = new Dictionary<string, object>();
                dict.Add(entityData.EntityName, entityData.ToDictionary());
                return DictionaryToJson(dict);
            }
            else
            {
                return DictionaryToJson(entityData.ToDictionary());
            }
        }

        public static List<Dictionary<string, object>> IEntityToDictionaryList(List<IEntityData> entityDataList)
        {
            List<Dictionary<string, object>> dictList = new List<Dictionary<string, object>>();
            entityDataList.ForEach(entityData =>
            {
                dictList.Add(entityData.ToDictionary());
            });
            return dictList;
        }

        public static string DictionaryToJson(Dictionary<string, object> dict)
        {
            List<string> kvpValueList = new List<string>();
            List<Dictionary<string,object>> dictList = null;
            foreach (KeyValuePair<string, object> kvp in dict)
            {
                if (kvp.Value != null)
                {
                    if (kvp.Value is Dictionary<string, object>)
                    {
                        kvpValueList.Add(string.Format("{0}:{1}", AddQuotation(kvp.Key), DictionaryToJson(kvp.Value as Dictionary<string, object>)));
                    }
                    else if (kvp.Value is List<Dictionary<string, object>>)
                    {
                        kvpValueList.Add(string.Format("{0}:{1}", AddQuotation(kvp.Key), DictionaryListToJson(kvp.Value as List<Dictionary<string, object>>)));
                    }
                    else if (kvp.Value is IEntityData)
                    {
                        kvpValueList.Add(string.Format("{0}:{1}", AddQuotation(kvp.Key), DictionaryToJson((kvp.Value as IEntityData).ToDictionary())));
                    }
                    else if (kvp.Value is List<IEntityData>)
                    {
                        dictList = new List<Dictionary<string, object>>();
                        (kvp.Value as List<IEntityData>).ForEach(entityData =>
                        {
                            dictList.Add(entityData.ToDictionary());
                        });
                        kvpValueList.Add(string.Format("{0}:{1}", AddQuotation(kvp.Key), DictionaryListToJson(dictList)));                     
                    }
                    else if (kvp.Value is IEntity)
                    {
                        kvpValueList.Add(string.Format("{0}:{1}", AddQuotation(kvp.Key), DictionaryToJson((kvp.Value as IEntity).ToEntityData().ToDictionary())));
                    }
                    else if (kvp.Value is List<IEntity>)
                    {
                        dictList = new List<Dictionary<string, object>>();
                        (kvp.Value as List<IEntity>).ForEach(entity =>
                        {
                            dictList.Add(entity.ToEntityData().ToDictionary());
                        });
                        kvpValueList.Add(string.Format("{0}:{1}", AddQuotation(kvp.Key), DictionaryListToJson(dictList)));
                    }
                    else
                    {
                        kvpValueList.Add(string.Format("{0}:{1}", AddQuotation(kvp.Key), GetValueString(kvp.Value)));
                    }
                }
            }
            return string.Concat("{", string.Join(",", kvpValueList.ToArray()), "}");
        }

        public static string DictionaryListToJson(List<Dictionary<string, object>> dictList)
        {
            List<string> itemList = new List<string>();
            dictList.ForEach(dict =>
            {
                itemList.Add(DictionaryToJson(dict));
            });
            return string.Concat("[", string.Join(",", itemList.ToArray()), "]");
        }

        public static string IEntityListToJson(List<IEntityData> entityDataList)
        {
            string entityName = string.Empty;
            List<Dictionary<string, object>> dictList = new List<Dictionary<string, object>>();
            if (entityDataList.Count > 0)
            {
                entityName = entityDataList[0].EntityName;
            }
            entityDataList.ForEach(entityData =>
            {
                dictList.Add(entityData.ToDictionary());
            });
            if (!string.IsNullOrEmpty(entityName))
            {
                Dictionary<string, object> dict = new Dictionary<string, object>();
                dict.Add(entityName, dictList);
                return DictionaryToJson(dict);
            }
            else
            {
                return DictionaryListToJson(dictList);
            }
        }

        private static string AddQuotation(string str)
        {
            return "\"" + str + "\"";
        }

        private static string GetValueString(object value)
        {
            if (value is byte)
            {
                return value.ToString();
            }
            else if (value is short)
            {
                return value.ToString();
            }
            else if (value is int)
            {
                return value.ToString();
            }
            else if (value is long)
            {
                return value.ToString();
            }
            else if (value is double)
            {
                return value.ToString();
            }
            else if (value is float)
            {
                return value.ToString();
            }
            else if (value is decimal)
            {
                return value.ToString();
            }
            else if (value is Guid)
            {
                return AddQuotation(value.ToString());
            }
            else if (value is string)
            {
                return AddQuotation(Encode(value.ToString()));
            }
            else if (value is bool)
            {
                return value.ToString().ToLower();
            }
            else if (value is DateTime)
            {
                if (((DateTime)value).Ticks == ((DateTime)value).Date.Ticks)
                {
                    return AddQuotation(((DateTime)value).ToString("yyyy-MM-dd"));
                }
                else
                {
                    return AddQuotation(((DateTime)value).ToString("yyyy-MM-dd HH:mm:ss"));
                }
            }
            else if (value is byte[])
            {
                return AddQuotation(string.Join(",", ((byte[])value)));
            }
            else if (value is string)
            {
                return AddQuotation(value.ToString());
            }
            else
            {
                return ObjectToJson(value);
            }
        }

        private static string Encode(string unencoded)
        {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < unencoded.Length; i++)
            {
                char c = unencoded[i];
                if (c == '\\')
                    sb.Append("\\\\");
                else if (c == '"')
                    sb.Append("\\\"");
                else if (c == '\n')
                    sb.Append("\\n");
                else if (c == '\r')
                    sb.Append("\\r");
                else if (c == '\f')
                    sb.Append("\\f");
                else if (c == '\b')
                    sb.Append("\\b");
                else if (c == '\t')
                    sb.Append("\\t");
                else
                    sb.Append(c);
            }
            return sb.ToString();
        }

        public static IEntityData DictionaryToIEntity(Dictionary<string, object> dict)
        {
            return new EntityData(dict);
        }

        public static T DictionaryToIEntity<T>(Dictionary<string, object> dict) where T : IEntity
        {
            return (T)new EntityData(dict).ToEntity<T>();
        }

        public static List<IEntityData> DictionaryListToIEntityList(List<Dictionary<string, object>> dictList)
        {
            List<IEntityData> entityDataList = new List<IEntityData>();
            dictList.ForEach(dict =>
            {
                entityDataList.Add(new EntityData(dict));
            });
            return entityDataList;
        }

        public static List<T> DictionaryListToIEntityList<T>(List<Dictionary<string, object>> dictList) where T : IEntity
        {
            List<T> entityDataList = new List<T>();
            dictList.ForEach(dict =>
            {
                entityDataList.Add(DictionaryToIEntity<T>(dict));
            });
            return entityDataList;
        }

        public static List<Dictionary<string, object>> JsonToDictionaryList(string jsonText)
        {
            List<Dictionary<string, object>> dictList = new List<Dictionary<string, object>>();
            JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
            object obj = jsSerializer.DeserializeObject(jsonText);
            ObjectToDictionaryList(obj, dictList);
            return dictList;
        }

        private static void ObjectToDictionaryList(object obj, List<Dictionary<string, object>> dictList)
        {
            if (obj is Dictionary<string, object>)
            {
                dictList.Add(ObjectToDictionary(obj));
            }
            else if (obj is object[] || obj is ArrayList)
            {
                dictList.AddRange(ObjectToDictionaryList(obj));
            }
        }

        private static Dictionary<string, object> ObjectToDictionary(object obj)
        {
            Dictionary<string, object> dict = new Dictionary<string, object>();
            if (obj is Dictionary<string, object>)
            {
                foreach (KeyValuePair<string, object> kvp in obj as Dictionary<string, object>)
                {
                    if (kvp.Value is Dictionary<string, object>)
                    {
                        dict.Add(kvp.Key, ObjectToDictionary(kvp.Value));
                    }
                    else if (kvp.Value is object[])
                    {
                        dict.Add(kvp.Key, ObjectToDictionaryList(kvp.Value));
                    }
                    else if (kvp.Value is ArrayList)
                    {
                        dict.Add(kvp.Key, ObjectToDictionaryList(kvp.Value));
                    }
                    else
                    {
                        dict.Add(kvp.Key, kvp.Value);
                    }
                }
            }
            return dict;
        }

        private static List<Dictionary<string, object>> ObjectToDictionaryList(object obj)
        {
            List<Dictionary<string, object>> dictList = new List<Dictionary<string, object>>();
            if (obj is object[])
            {
                object[] arrayObj = obj as object[];
                foreach (object item in arrayObj)
                {
                    if (item is Dictionary<string, object>)
                    {
                        dictList.Add(ObjectToDictionary(item));
                    }
                }
            }
            else if (obj is ArrayList)
            {
                ArrayList arrayList = obj as ArrayList;
                foreach (object item in arrayList)
                {
                    if (item is Dictionary<string, object>)
                    {
                        dictList.Add(ObjectToDictionary(item));
                    }
                }
            }
            return dictList;
        }
    }
}
