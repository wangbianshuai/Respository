using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace EntityDataService.Data
{
    internal sealed class SqlDataBase : DataBase, ISqlDataBase
    {
        public SqlDataBase()
        {
            this.ClientType = ServerClient.SqlClient;
        }

        public void SqlBulkCopyInsert(DataTable dt, string tableName, IDbTransaction trans = null)
        {
            IDbConnection IDBConnection = null;
            SqlBulkCopy sqlBulkCopy;
            if (trans != null)
            {
                sqlBulkCopy = new SqlBulkCopy((SqlConnection)trans.Connection, SqlBulkCopyOptions.CheckConstraints, (SqlTransaction)trans);
            }
            else
            {
                IDBConnection = this.GetConnection(this.ConnectionString, ServerClient.SqlClient);
                if (IDBConnection.State == ConnectionState.Closed)
                {
                    IDBConnection.Open();
                }
                sqlBulkCopy = new SqlBulkCopy((SqlConnection)IDBConnection);
            }
            try
            {
                sqlBulkCopy.DestinationTableName = tableName;
                sqlBulkCopy.BatchSize = dt.Rows.Count;
                sqlBulkCopy.WriteToServer(dt);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (IDBConnection != null && IDBConnection.State == ConnectionState.Open)
                {
                    IDBConnection.Close();
                }
                sqlBulkCopy.Close();
            }
        }

    }
}
