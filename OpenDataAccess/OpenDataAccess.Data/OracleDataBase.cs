using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OpenDataAccess.Data
{
    internal sealed class OracleDataBase : DataBase, IOracleDataBase
    {
        public OracleDataBase()
        {
            this.ClientType = ServerClient.SqlClient;
        }
    }
}
