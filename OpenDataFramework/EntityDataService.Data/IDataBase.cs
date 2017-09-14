using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Data.OracleClient;

namespace EntityDataService.Data
{
    /// <summary>
    /// 数据库服务类型枚举
    /// </summary>
    public enum ServerClient
    {
        SqlClient,
        OracleClient
    }

    /// <summary>
    /// 访问数据库通用接口
    /// </summary>
    public interface IDataBase
    {
        /// <summary>
        /// 数据库类型
        /// </summary>
        ServerClient ClientType { get; set; }
        /// <summary>
        /// 连接字符串
        /// </summary>
        string ConnectionString { get; set; }
        /// <summary>
        /// 数据库名
        /// </summary>
        string DataBaseName { get; set; }

         /// <summary>
        /// 获取链接对象
        /// </summary>
        /// <param name="connectionString"></param>
        /// <param name="clientType"></param>
        /// <returns></returns>
        IDbConnection GetConnection(string connectionString, ServerClient clientType);

        /// <summary>
        /// 该方法使用SqlDataAdapter 添充数据到DateSet中
        /// </summary>
        DataSet ExecProc(string procName, List<IDbDataParameter> parameterList = null);

        /// <summary>
        /// 该方法使用SqlDataAdapter 添充数据到DateSet中
        /// </summary>
        DataSet ExecSql(string sqlText, List<IDbDataParameter> parameterList = null);

        /// <summary>
        /// 该方法Command执行ExecuteReader操作
        /// </summary>
        IDataReader ExecProcReader(string procName, List<IDbDataParameter> parameterList = null);

        /// <summary>
        /// 该方法Command执行ExecuteReader操作
        /// </summary>
        IDataReader ExecSqlReader(string sqlText, List<IDbDataParameter> parameterList = null);

        /// <summary>
        /// 该方法Command执行ExecuteNonQuery操作
        /// </summary>
        bool ExecProcNonQuery(string procName, List<IDbDataParameter> parameterList = null, IDbTransaction trans = null);

        /// <summary>
        ///  该方法Command执行ExecuteNonQuery操作
        /// </summary>
        bool ExecSqlNonQuery(string sqlText, List<IDbDataParameter> parameterList = null, IDbTransaction trans = null);

        /// <summary>
        /// 该方法Command执行ExecuteScalar操作
        /// </summary>
        object ExecProcScalar(string procName, List<IDbDataParameter> parameterList = null, IDbTransaction trans = null);

        /// <summary>
        /// 该方法Command执行ExecuteScalar操作
        /// </summary>
        object ExecSqlScalar(string sqlText, List<IDbDataParameter> parameterList = null, IDbTransaction trans = null);

        List<Dictionary<string, object>> DataReaderToDictionaryList(IDataReader reader);

        bool CommitTransaction(IDbTransaction trans, bool blSucceed);

        IDbTransaction BeginTransaction(string connectionString);

        /// <summary>
        /// 该方法设置参数
        /// </summary>
        /// <param name="parameterName"></param>
        /// <param name="paramDirection"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        IDbDataParameter Parameter(string parameterName, ParameterDirection paramDirection, object value);

        /// <summary>
        /// 输入参数
        /// </summary>
        /// <param name="parameterName"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        IDbDataParameter InParameter(string parameterName, object value);
    
        /// <summary>
        /// Input output parameter 
        /// </summary>
        /// <param name="parameterName"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        IDbDataParameter InOutParameter(string parameterName, object value);

        /// <summary>
        /// Output parameter
        /// </summary>
        /// <param name="parameterName"></param>
        /// <returns></returns>
        IDbDataParameter OutParameter(string parameterName);
    }
}
