package MySql

import java.sql.PreparedStatement

/**
  * Created by BianzhaiWang on 2017/1/19.
  */
trait TDataParameterList {

  //设置参数
  def Set(name: String, value: Any): Unit

  //设置参数
  def Set(map: Map[String, Any]): Unit

  //添加参数
  def AddMap(map: Map[String, Any]): Unit

  //获取参数值
  def Get(name: String): Any

  //移除参数
  def Remove(name: String): Unit

  //移除参数
  def RemoveAll(): Unit

  //参数化Sql
  def ToSql(sql: String): String

  //设置PreparedStatement参数
  def SetPreparedStatementParameters(preparedStatement: PreparedStatement): Unit
}