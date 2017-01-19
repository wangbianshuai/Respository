package MySql

import java.sql.Connection

/**
  * Created by BianzhaiWang on 2017/1/19.
  */
trait TDataBase {
  //获取链接
  def GetConnection(): Connection

  //设置链接字符串
  def SetConnectionString(connectionString: String): String

  //获取链接字符串
  def GetConnectionString(): String

  //执行无查询语句
  def ExceNoQuery(sql: String, parameterList: TDataParameterList): Int

  //执行查询语句
  def ExceSelect(sql: String, parameterList: TDataParameterList): List[Map[String, Any]]

  //执行查询语句
  def ExceSelectTo[T](cls: Class[_], sql: String, parameterList: TDataParameterList): List[T]
}
