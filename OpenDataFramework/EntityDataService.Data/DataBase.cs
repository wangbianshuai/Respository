using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Collections;
using System.Configuration;
using System.Reflection;
using Oracle.ManagedDataAccess.Client;
using System.Text.RegularExpressions;

namespace EntityDataService.Data
{
    /// <summary>
    /// 访问数据接口实现类
    /// </summary>
    internal abstract class DataBase : IDataBase
    {
        public ServerClient ClientType { get; set; }

        /// <summary>
        /// 连接字符串
        /// </summary>
        public string ConnectionString { get; set; }
        /// <summary>
        /// 数据库名
        /// </summary>
        public string DataBaseName { get; set; }

        /// <summary>
        /// 获取链接对象
        /// </summary>
        /// <param name="connectionString"></param>
        /// <param name="clientType"></param>
        /// <returns></returns>
        public IDbConnection GetConnection(string connectionString, ServerClient clientType)
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
            connection.ConnectionString = connectionString;

            return connection;
        }

        /// <summary>
        /// This method is connect to the database
        /// </summary>
        private IDbCommand GetCommand(string commandText, bool blSql, IDbTransaction trans = null)
        {
            IDbCommand _IDBCommand = null;
            if (ClientType == ServerClient.SqlClient)
            {
                _IDBCommand = new SqlCommand();
            }
            else if (ClientType == ServerClient.OracleClient)
            {
                _IDBCommand = new OracleCommand() { BindByName = true };
            }
            _IDBCommand.CommandText = commandText;
            _IDBCommand.CommandType = blSql ? CommandType.Text : CommandType.StoredProcedure;
            if (trans != null)
            {
                _IDBCommand.Connection = trans.Connection;
                _IDBCommand.Transaction = trans;
            }
            else
            {
                _IDBCommand.Connection = this.GetConnection(this.ConnectionString, ClientType);
            }

            return _IDBCommand;
        }

        /// <summary>
        /// 该方法把参数数组加入命令对象
        /// </summary>
        private void AddParameter(IDbCommand command, List<IDbDataParameter> parameterList)
        {
            if (parameterList != null)
            {
                parameterList.ForEach(parameter =>
                {
                    command.Parameters.Add(parameter);
                });
            }
        }

        /// <summary>
        /// 该方法执行查询，访问数据库类型为返回引用数据集DataSet
        /// </summary>
        /// <param name="ds">数据库DataSet</param>
        private DataSet FillDataSet(IDbCommand command)
        {
            IDbDataAdapter _IDBDataAdapter = null;
            DataSet ds = new DataSet();
            if (ClientType == ServerClient.SqlClient)
            {
                _IDBDataAdapter = new SqlDataAdapter((SqlCommand)command);
            }
            else if (ClientType == ServerClient.OracleClient)
            {
                _IDBDataAdapter = new OracleDataAdapter((OracleCommand)command);
            }
            try
            {
                _IDBDataAdapter.Fill(ds);
                return ds;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (command.Connection.State == ConnectionState.Open && command.Transaction == null)
                {
                    command.Connection.Close();
                }
            }
        }

        /// <summary>
        /// 该方法对连接执行 Transact-SQL 语句并返回受影响的行数。
        /// </summary>
        private bool ExecuteNonQuery(IDbCommand command)
        {
            try
            {
                if (command.Connection.State == ConnectionState.Closed && command.Transaction == null)
                {
                    command.Connection.Open();
                }
                DataBaseName = command.Connection.Database;
                if (command.ExecuteNonQuery() > 0)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (command.Connection.State == ConnectionState.Open && command.Transaction == null)
                {
                    command.Connection.Close();
                }
            }
        }

        /// <summary>
        /// 该方法执行查询，并返回查询所返回的结果集中第一行的第一列
        /// </summary>
        private object ExecuteScalar(IDbCommand command)
        {
            try
            {
                if (command.Connection.State == ConnectionState.Closed && command.Transaction == null)
                {
                    command.Connection.Open();
                }
                return command.ExecuteScalar();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (command.Connection.State == ConnectionState.Open && command.Transaction == null)
                {
                    command.Connection.Close();
                }
            }
        }

        /// <summary>
        /// 该方法使用SqlDataAdapter 添充数据到DateSet中
        /// </summary>
        public DataSet ExecProc(string procName, List<IDbDataParameter> parameterList = null)
        {
            return ExecSelect(procName, false, parameterList);
        }

        /// <summary>
        /// 该方法使用SqlDataAdapter 添充数据到DateSet中
        /// </summary>
        public DataSet ExecSql(string sqlText, List<IDbDataParameter> parameterList = null)
        {
            return ExecSelect(sqlText, true, parameterList);
        }

        private DataSet ExecSelect(string sqlText, bool blSql, List<IDbDataParameter> parameterList = null)
        {
            sqlText = this.ReplaceParameterNames(sqlText, blSql, parameterList);
            IDbCommand command = this.GetCommand(sqlText, blSql);
            AddParameter(command, parameterList);
            DataSet ds = FillDataSet(command);
            ReplaceBackParameterNames(parameterList);
            return ds;
        }

        private void ReplaceBackParameterNames(List<IDbDataParameter> parameterList = null)
        {
            if (ClientType == ServerClient.OracleClient && parameterList != null && parameterList.Count > 0)
            {
                parameterList.ForEach(p =>
                {
                    p.ParameterName = string.Concat("@", p.ParameterName.Substring(2));
                });
            }
        }

        private string ReplaceParameterNames(string sqlText, bool blSql, List<IDbDataParameter> parameterList = null)
        {
            if (ClientType == ServerClient.OracleClient && parameterList != null && parameterList.Count > 0)
            {
                parameterList.ForEach(p =>
                {
                    if (blSql)
                    {
                        sqlText = sqlText.Replace(p.ParameterName, string.Concat(":P_", p.ParameterName.Substring(1)));
                    }
                    p.ParameterName = p.ParameterName.Replace("@", "P_");
                });
            }

            return sqlText;
        }

        /// <summary>
        /// 该方法Command执行ExecuteReader操作
        /// </summary>
        public IDataReader ExecProcReader(string procName, List<IDbDataParameter> parameterList = null)
        {
            return this.ExecReader(procName, false, parameterList);
        }

        /// <summary>
        /// 该方法Command执行ExecuteReader操作
        /// </summary>
        public IDataReader ExecSqlReader(string sqlText, List<IDbDataParameter> parameterList = null)
        {
            return this.ExecReader(sqlText, true, parameterList);
        }

        private IDataReader ExecReader(string sqlText, bool blSql, List<IDbDataParameter> parameterList = null)
        {
            sqlText = this.ReplaceParameterNames(sqlText, blSql, parameterList);
            IDbCommand command = this.GetCommand(sqlText, blSql);
            AddParameter(command, parameterList);
            if (command.Connection.State == ConnectionState.Closed && command.Transaction == null)
            {
                command.Connection.Open();
            }
            IDataReader reader = command.ExecuteReader(System.Data.CommandBehavior.CloseConnection);
            ReplaceBackParameterNames(parameterList);
            return reader;
        }

        /// <summary>
        /// 该方法Command执行ExecuteNonQuery操作
        /// </summary>
        public bool ExecProcNonQuery(string procName, List<IDbDataParameter> parameterList = null, IDbTransaction trans = null)
        {
            return this.ExecNonQuery(procName, false, parameterList, trans);
        }

        /// <summary>
        ///  该方法Command执行ExecuteNonQuery操作
        /// </summary>
        public bool ExecSqlNonQuery(string sqlText, List<IDbDataParameter> parameterList = null, IDbTransaction trans = null)
        {
            return this.ExecNonQuery(sqlText, true, parameterList, trans);
        }

        private bool ExecNonQuery(string sqlText, bool blSql,  List<IDbDataParameter> parameterList = null, IDbTransaction trans = null)
        {
            sqlText = this.ReplaceParameterNames(sqlText, blSql, parameterList);
            IDbCommand command = this.GetCommand(sqlText, blSql, trans);
            AddParameter(command, parameterList);
            bool blSucceed = ExecuteNonQuery(command);
            ReplaceBackParameterNames(parameterList);
            return blSucceed;
        }

        /// <summary>
        /// 该方法Command执行ExecuteScalar操作
        /// </summary>
        public object ExecProcScalar(string procName, List<IDbDataParameter> parameterList = null, IDbTransaction trans = null)
        {
            return ExecScalar(procName, false, parameterList, trans);
        }

        /// <summary>
        /// 该方法Command执行ExecuteScalar操作
        /// </summary>
        public object ExecSqlScalar(string sqlText, List<IDbDataParameter> parameterList = null, IDbTransaction trans = null)
        {
            return ExecScalar(sqlText, true, parameterList, trans);
        }

        private object ExecScalar(string sqlText, bool blSql, List<IDbDataParameter> parameterList = null, IDbTransaction trans = null)
        {
            sqlText = this.ReplaceParameterNames(sqlText, blSql, parameterList);
            IDbCommand command = this.GetCommand(sqlText, blSql, trans);
            AddParameter(command, parameterList);
            object obj = ExecuteScalar(command);
            ReplaceBackParameterNames(parameterList);
            return obj;
        }

        public List<Dictionary<string, object>> DataReaderToDictionaryList(IDataReader reader)
        {
            try
            {
                List<Dictionary<string, object>> dictList = new List<Dictionary<string, object>>();
                if (reader != null)
                {
                    while (reader.Read())
                    {
                        Dictionary<string, object> dict = new Dictionary<string, object>();
                        for (int i = 0; i <= reader.FieldCount - 1; i++)
                        {
                            object value = reader.GetValue(i);
                            if (value is DBNull)
                            {
                                dict[reader.GetName(i)] = null;
                            }
                            else
                            {
                                dict[reader.GetName(i)] = value;
                            }
                        }
                        dictList.Add(dict);
                    }
                    reader.Close();
                }
                return dictList;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (!reader.IsClosed)
                {
                    reader.Close();
                }
            }
        }

        public bool CommitTransaction(IDbTransaction trans, bool blSucceed)
        {
            try
            {
                if (blSucceed)
                {
                    trans.Commit();
                    return true;
                }
                else
                {
                    trans.Rollback();
                    return false;
                }
            }
            catch
            {
                trans.Rollback();
                return false;
            }
            finally
            {
                trans.Dispose();
            }
        }

        /// <summary>
        /// 该方法初始化事务
        /// </summary>
        /// <returns></returns>
        public IDbTransaction BeginTransaction(string connectionString)
        {
            IDbConnection conn = this.GetConnection(connectionString, ClientType);
            if (conn.State == ConnectionState.Closed)
            {
                conn.Open();
            }
            return conn.BeginTransaction();
        }

        /// <summary>
        /// 该方法设置参数
        /// </summary>
        /// <param name="parameterName"></param>
        /// <param name="paramDirection"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public IDbDataParameter Parameter(string parameterName, ParameterDirection paramDirection, object value)
        {
            IDbDataParameter param = null;
            if (this.ClientType == ServerClient.OracleClient)
            {
                if (value is Guid)
                {
                    value = value.ToString().ToLower();
                }
                else if (value is string && !string.IsNullOrEmpty((string)value) && value.ToString().Length == 36)
                {
                    value = GetGuidValue(value.ToString());
                }
                else if (value is bool)
                {
                    value = (bool)value ? 1 : 0;
                }
                param = new OracleParameter(parameterName, value);
            }
            else
            {
                param = new SqlParameter(parameterName, value);

            }
            param.Direction = paramDirection;

            return param;
        }

        private string GetGuidValue(string value)
        {
            if (Regex.IsMatch(value, "^\\d|-|[a-f]+$", RegexOptions.IgnoreCase))
            {
                Guid gValue = Guid.Empty;
                if (Guid.TryParse(value, out gValue))
                {
                    return value.ToLower();
                }
            }
            return value;
        }

        /// <summary>
        /// 输入参数
        /// </summary>
        /// <param name="parameterName"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public IDbDataParameter InParameter(string parameterName, object value)
        {
            return Parameter(parameterName, ParameterDirection.Input, value);
        }

        /// <summary>
        /// Input output parameter 
        /// </summary>
        /// <param name="parameterName"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public IDbDataParameter InOutParameter(string parameterName, object value)
        {
            return Parameter(parameterName, ParameterDirection.InputOutput, value);
        }
  
        /// <summary>
        /// Output parameter
        /// </summary>
        /// <param name="parameterName"></param>
        /// <returns></returns>
        public IDbDataParameter OutParameter(string parameterName)
        {
            return Parameter(parameterName, ParameterDirection.Output, null);
        }
    }
}
