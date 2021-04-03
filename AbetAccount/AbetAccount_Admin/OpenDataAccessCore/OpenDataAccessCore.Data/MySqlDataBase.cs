namespace OpenDataAccessCore.Data
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
