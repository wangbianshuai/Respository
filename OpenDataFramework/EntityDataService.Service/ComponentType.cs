using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EntityDataService.Service
{
    public class ComponentType
    {
        public static List<Type> TypeList = new List<Type>();

        public static Type GetComponentType(string name)
        {
            return TypeList.Where(where => where.Name.Trim().ToLower() == name.Trim().ToLower()).FirstOrDefault();
        }

        public static void SetComponentType(Type type)
        {
            if (!TypeList.Exists(exists => exists.Name == type.Name))
            {
                TypeList.Add(type);
            }
        }
    }
}
