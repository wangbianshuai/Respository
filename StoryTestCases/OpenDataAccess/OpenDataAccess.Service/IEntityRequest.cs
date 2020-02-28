﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Collections.Specialized;
using OpenDataAccess.Data;
using OpenDataAccess.Entity;
using System.Data;
using System.IO;

namespace OpenDataAccess.Service
{
    public interface IEntityRequest : IEntityAccess, IValidate
    {
        QueryRequest _QueryRequest { get; set; }
        Request _Request { get; set; }
        Func<IQuery, IQuery> ExpandSelectQuery { get; set; }
        Dictionary<string, object> GetExceptionDict(string message);
        Dictionary<string, object> GetMessageDict(string message);
        Dictionary<string, object> GetBoolDict(bool blSucceed);
        string CompareVersion(IEntityData newEntityData, IEntityData oldEntityData);
        bool JudgeIsEdit(EntityType entityType, IEntityData newEntityData, IEntityData oldEntityData);
        object Select();
        object Insert();
        object Update();
        object Delete();
    }
}
