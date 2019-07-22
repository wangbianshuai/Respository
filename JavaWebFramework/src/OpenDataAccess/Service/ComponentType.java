package OpenDataAccess.Service;

import OpenDataAccess.Utility.Common;

import java.util.ArrayList;
import java.util.List;

public class ComponentType {
    public static List<Class<?>> TypeList = new ArrayList<>();

    public static Class<?> GetComponentType(String name) {
        for (int i = 0; i < TypeList.size(); i++) {
            if (TypeList.get(i).getName().equals(name)) return TypeList.get(i);
        }
        return null;
    }

    public static void SetComponentType(Class<?> type) {
        if (!Common.Exists(TypeList, e -> e.getName().equals(type.getName()))) TypeList.add(type);
    }
}
