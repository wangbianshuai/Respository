using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Configuration;

namespace OpenDataAccess.Data
{
    public static class DataAccess
    {
        private static string _ConnectionString { get; set; }
        private static string _ServerClient { get; set; }

        public static T GetDataBase<T>() where T : IDataBase
        {
            IDataBase dataBase = null;
            if (typeof(T) == typeof(ISqlDataBase))
            {
                dataBase = new SqlDataBase();
                dataBase.ConnectionString = ConnectionString;
            }
            else if (typeof(T) == typeof(IOracleDataBase))
            {
                dataBase = new OracleDataBase();
                dataBase.ConnectionString = ConnectionString;
            }
            else if (typeof(T) == typeof(IMySqlDataBase))
            {
                dataBase = new MySqlDataBase();
                dataBase.ConnectionString = ConnectionString;
            }
            else
            {
                throw new ArgumentException();
            }
            return (T)dataBase;
        }

        public static IDataBase GetDataBase()
        {
            IDataBase dataBase = null;
            if (ServerClient.Equals("Sql"))
            {
                dataBase = new SqlDataBase();
                dataBase.ConnectionString = ConnectionString;
            }
            else if (ServerClient.Equals("Oracle"))
            {
                dataBase = new OracleDataBase();
                dataBase.ConnectionString = ConnectionString;
            }
            else if (ServerClient.Equals("MySql"))
            {
                dataBase = new MySqlDataBase();
                dataBase.ConnectionString = ConnectionString;
            }
            else
            {
                throw new ArgumentException();
            }

            return dataBase;
        }

        private static string ServerClient
        {
            get
            {
                if (string.IsNullOrEmpty(_ServerClient))
                {
                    _ServerClient = ConfigurationManager.AppSettings["ServerClient"];
                    _ServerClient = string.IsNullOrEmpty(_ServerClient) ? "Sql" : _ServerClient;
                }
                return _ServerClient;
            }
        }

        private static string ConnectionString
        {
            get
            {
                if (string.IsNullOrEmpty(_ConnectionString) && ConfigurationManager.ConnectionStrings["ConnectionString"] != null)
                {
                    _ConnectionString = ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;
                }
                return _ConnectionString;
            }
        }
    }
}
