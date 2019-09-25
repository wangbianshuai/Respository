using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Configuration;
using System.Data.SqlClient;
using Oracle.ManagedDataAccess.Client;
using MySql.Data.MySqlClient;

namespace OpenDataAccess.Data
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
