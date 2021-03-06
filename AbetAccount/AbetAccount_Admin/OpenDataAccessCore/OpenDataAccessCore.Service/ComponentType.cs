﻿using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;

namespace OpenDataAccessCore.Service
{
    public class ComponentType
    {
        public static ConcurrentBag<Type> TypeList = new ConcurrentBag<Type>();

        public static Type GetComponentType(string name)
        {
            return TypeList.Where(where => where.Name.Trim().ToLower() == name.Trim().ToLower()).FirstOrDefault();
        }

        public static void SetComponentType(Type type)
        {
            if (TypeList.Where(exists => exists.Name == type.Name).FirstOrDefault() == null)
            {
                TypeList.Add(type);
            }
        }

        public static void SetComponentType<T>() where T : IEntityRequest
        {
            SetComponentType(typeof(T));
        }
    }
}
