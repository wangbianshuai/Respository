using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;

namespace OpenDataAccess.Data
{
    /// <summary>
    /// 访问MySql数据库类
    /// </summary>
    internal sealed class MySqlDataBase : DataBase, IMySqlDataBase
    {
        public MySqlDataBase()
        {
            this.ClientType = ServerClient.MySqlClient;
        }
    }
}
