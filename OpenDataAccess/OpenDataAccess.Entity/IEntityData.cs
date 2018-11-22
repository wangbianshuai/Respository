using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OpenDataAccess.Entity
{
    public interface IEntityData
    {
        string EntityName { get; set; }
        object GetValue(string propertyName);
        object GetValue(int i);
        void SetValue(string propertyName, object value);
        void SetValue(int i, object value);
        void Remove(string propertyName);
        void Remove(int i);
        IEntity ToEntity<T>() where T : IEntity;
        Dictionary<string, object> ToDictionary();
        Dictionary<string, object> GetDictionary();
        int Count { get; }
        string GetPropertyName(int i);
        string GetStringValue(string propertyName);
        T GetValue<T>(string propertyName);
    }
}
