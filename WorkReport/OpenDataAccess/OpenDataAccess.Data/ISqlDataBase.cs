﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace OpenDataAccess.Data
{
    public interface ISqlDataBase : IDataBase
    {
        void SqlBulkCopyInsert(DataTable dt, string tableName, IDbTransaction trans = null);
    }
}
