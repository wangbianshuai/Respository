namespace OpenDataAccessCore.Data
{
    internal sealed class OracleDataBase : DataBase, IOracleDataBase
    {
        public OracleDataBase()
        {
            this.ClientType = ServerClient.OracleClient;
        }
    }
}
