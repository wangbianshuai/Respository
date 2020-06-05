using OpenDataAccessCore.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OpenDataAccessCore.Entity
{
    public class EntityData : IEntityData
    {
        private Dictionary<string, object> _data = new Dictionary<string, object>();
        string _PropertyName = null;
        private EntityType _EntityType = null;
        public string EntityName { get; set; }

        public EntityData(string entityName)
        {
            EntityName = entityName;
        }

        public EntityData(Dictionary<string, object> dict,string entityName)
        {
            _data = dict;
            EntityName = entityName;
        }

        public EntityData(Dictionary<string, object> dict)
        {
            _data = dict;
        }

        public EntityData(Dictionary<string, object> dict, EntityType entityType)
        {
            _data = new Dictionary<string, object>();
            _EntityType = entityType;
            EntityName = _EntityType.Name;

            var abList = (from a in dict.Keys
                          from b in entityType.Properties
                          where a.ToLower().Equals(b.Name.ToLower())
                          && b.IsSelect
                          select new { a, b.Name });

            if (abList.Count() > 0)
            {
                foreach (var ab in abList)
                {
                    _data[ab.Name] = dict[ab.a];
                }
            }
            else
            {
                _data = dict;
            }
        }

        public EntityData(EntityType entityType)
        {
            _EntityType = entityType;
            EntityName = _EntityType.Name;
        }

        public object GetValue(string propertyName)
        {
            if (_data.ContainsKey(propertyName))
            {
                return _data[propertyName];
            }
            else
            {
                foreach (var kvp in _data)
                {
                    if (kvp.Key.ToLower().Equals(propertyName.ToLower()))
                    {
                        return kvp.Value;
                    }
                }
            }
            return null;
        }

        public object GetValue(int i)
        {
            _PropertyName = GetPropertyName(i);
            if (_data.ContainsKey(_PropertyName))
            {
                return _data[_PropertyName];
            }
            return null;
        }

        public void SetValue(string propertyName, object value)
        {
            if (_data.ContainsKey(propertyName))
            {
                _data[propertyName] = value;
            }
            else
            {
                _PropertyName = _data.Keys.Where(w => w.ToLower().Equals(propertyName.ToLower())).FirstOrDefault();
                if (!string.IsNullOrEmpty(_PropertyName))
                {
                    _data[_PropertyName] = value;
                }
                else
                {
                    _data.Add(propertyName, value);
                }
            }
        }

        public void SetDefaultValue(string propertyName, object value)
        {
            string strValue = GetStringValue(propertyName);
            if (string.IsNullOrEmpty(strValue)) SetValue(propertyName, value);
        }

        public void SetValue(int i, object value)
        {
            _PropertyName = GetPropertyName(i);
            if (_data.ContainsKey(_PropertyName))
            {
                _data[_PropertyName] = value;
            }
            else
            {
                _data.Add(_PropertyName, value);
            }
        }

        public void Remove(string propertyName)
        {
            if (_data.ContainsKey(propertyName))
            {
                _data.Remove(propertyName);
            }
        }

        public void Remove(int i)
        {
            _PropertyName = GetPropertyName(i);
            if (_data.ContainsKey(_PropertyName))
            {
                _data.Remove(_PropertyName);
            }
        }

        public IEntity ToEntity<T>() where T : IEntity
        {
            IEntity obj = Activator.CreateInstance<T>();
            return (IEntity)Parse.DictionaryToObject(_data, obj);
        }

        public Dictionary<string, object> ToDictionary()
        {
            return ToDictionary(_data);
        }

        public Dictionary<string, object> GetDictionary()
        {
            return _data;
        }

        private Dictionary<string, object> ToDictionary(Dictionary<string,object> dict)
        {
            Dictionary<string, object> newDict = new Dictionary<string, object>();
            List<Dictionary<string, object>> dictList = null;
            foreach (KeyValuePair<string, object> kvp in dict)
            {
                if (kvp.Value is IEntityData)
                {
                    newDict.Add(kvp.Key, (kvp.Value as IEntityData).ToDictionary());
                }
                else if (kvp.Value is List<IEntityData>)
                {
                    dictList = new List<Dictionary<string, object>>();
                    (kvp.Value as List<IEntityData>).ForEach(entityData =>
                    {
                        dictList.Add(entityData.ToDictionary());  
                    });
                    newDict.Add(kvp.Key, dictList);
                }
                else
                {
                    newDict.Add(kvp.Key, kvp.Value);
                }
            }
            return newDict;
        }

        public int Count
        {
            get
            {
                return _data.Count;
            }
        }

        public string GetPropertyName(int i)
        {
            string[] propertyNameList = _data.Keys.ToArray();
            if (i < propertyNameList.Length)
            {
                return propertyNameList[i];
            }
            return string.Empty;
        }

        public string GetStringValue(string propertyName)
        {
            if (this._data.ContainsKey(propertyName) && this._data[propertyName] != null)
            {
                return this._data[propertyName].ToString();
            }
            else
            {
                object value = this.GetValue(propertyName);
                return value == null ? string.Empty : value.ToString();
            }
        }

        public T GetValue<T>(string propertyName)
        {
            if (this._data.ContainsKey(propertyName) && this._data[propertyName] != null)
            {
                if (this._data[propertyName] is T)
                {
                    return (T)this._data[propertyName];
                }
                else
                {
                    object value = Data.Common.ChangeType(this._data[propertyName], typeof(T));
                    if (value != null)
                    {
                        return (T)value;
                    }
                }
            }
            else
            {
                object value = this.GetValue(propertyName);
                return value == null ? default(T) : value is T ? (T)value : (T)Common.ChangeType(value, typeof(T));
            }
            return default(T);
        }
    }
}
