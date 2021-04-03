using MySql.Data.MySqlClient;
using System.Data;
using System.Data.OracleClient;
using System.Data.SqlClient;

namespace OpenDataAccessCore.Data
{
    public static class ConnectionPool
    {
        public static IDbConnection GetConnection(string connectionString, ServerClient clientType)
        {
            IDbConnection connection = null;

            if (clientType == ServerClient.SqlClient)
            {
                connection = new SqlConnection();
            }
            else if (clientType == ServerClient.OracleClient)
            {
                connection = new OracleConnection();
            }
            else if (clientType == ServerClient.MySqlClient)
            {
                connection = new MySqlConnection();
            }
            connection.ConnectionString = connectionString;

            return connection;
        }
    }
}
