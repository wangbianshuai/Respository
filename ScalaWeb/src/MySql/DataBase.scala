package MySql

import java.sql._
import java.lang.reflect.Method
import scala.util.control.Breaks._

import Utility.Common

/**
  * Created by BianzhaiWang on 2017/1/19.
  */
class DataBase extends TDataBase {
  private var _Connection: Connection = null
  private var _Statement: Statement = null
  private var _ConnectionString: String = DataBase.ConnectionString
  private var _PreparedStatement: PreparedStatement = null
  private var _ResultSet: ResultSet = null

  //获取链接
  override def GetConnection(): Connection = {
    return this._Connection
  }

  //设置链接字符串
  override def SetConnectionString(connectionString: String): String = {
    this._ConnectionString = connectionString
    return this._ConnectionString
  }

  //获取链接字符串
  override def GetConnectionString(): String = {
    return this._ConnectionString;
  }

  private def CreateConnection(): Unit = {
    try {
      Class.forName("com.mysql.jdbc.Driver")
      _Connection = DriverManager.getConnection(this._ConnectionString)
    }
    catch {
      case ex: ClassNotFoundException => throw new SQLException(ex)
    }
  }

  //执行无查询语句
  override def ExceNoQuery(sql: String, parameterList: TDataParameterList): Int = {
    try {
      this.CreateConnection()

      if (parameterList == null) {
        this._Statement = this._Connection.createStatement()
        return this._Statement.executeUpdate(sql)
      } else {
        this._PreparedStatement = this._Connection.prepareStatement(parameterList.ToSql(sql))
        parameterList.SetPreparedStatementParameters(this._PreparedStatement)
        return this._PreparedStatement.executeUpdate()
      }
    }
    catch {
      case ex: SQLException => throw ex
    }
    finally {
      this.CloseConnection()
    }
  }

  private def CloseConnection(): Unit = {
    if (this._Statement != null) {
      this._Statement.close()
      this._Statement = null
    }

    if (this._PreparedStatement != null) {
      this._PreparedStatement.close()
      this._PreparedStatement = null
    }

    if (this._ResultSet != null) {
      this._ResultSet.close()
      this._ResultSet = null
    }

    if (this._Connection != null) {
      this._Connection.close()
      this._Connection = null
    }
  }

  //执行查询语句
  override def ExceSelect(sql: String, parameterList: TDataParameterList): List[Map[String, Any]] = {
    try {
      this.ExcelQueryToResultSet(sql, parameterList)
      return this.ResultSetToList()
    }
    catch {
      case ex: SQLException => throw ex
    }
    finally {
      this.CloseConnection()
    }
  }

  private def ExcelQueryToResultSet(sql: String, parameterList: TDataParameterList): Unit = {
    this.CreateConnection()

    if (parameterList == null) {
      this._Statement = this._Connection.createStatement()
      this._ResultSet = this._Statement.executeQuery(sql)
    }
    else {
      this._PreparedStatement = this._Connection.prepareStatement(parameterList.ToSql(sql))
      parameterList.SetPreparedStatementParameters(this._PreparedStatement)
      this._ResultSet = this._PreparedStatement.executeQuery()
    }
  }

  override //执行查询语句
  def ExceSelectTo[T](cls: Class[_], sql: String, parameterList: TDataParameterList): List[T] = {
    try {
      this.ExcelQueryToResultSet(sql, parameterList)
      return this.ResultSetToList2[T](cls)
    }
    catch {
      case ex: SQLException => throw ex
      case ex: IllegalAccessException => throw ex
      case ex: InstantiationException => throw ex
      case ex: Exception => throw ex
    }
    finally {
      this.CloseConnection()
    }
  }

  private def ResultSetToList(): List[Map[String, Any]] = {
    if (this._ResultSet != null) {
      var list = List[Map[String, Any]]()
      var map: Map[String, Any] = null

      val metaData = this._ResultSet.getMetaData()
      val iColNum = metaData.getColumnCount()
      var columnName = ""

      while (this._ResultSet.next()) {
        map = Map[String, Any]()

        for (i <- 1 to iColNum) {
          columnName = metaData.getColumnName(i)
          map += (columnName -> this._ResultSet.getObject(i))
        }

        list = list :+ map
      }
      return list
    }

    return null
  }


  private def ResultSetToList2[T](cls: Class[_]): List[T] = {
    if (this._ResultSet != null) {
      var list = List[T]()
      var obj: T = null.asInstanceOf[T]
      var methodMap = Map[Int, Method]()

      val metaData = this._ResultSet.getMetaData()
      val iColNum = metaData.getColumnCount()
      val methodList = cls.getMethods().filter(m => m.getName().endsWith("_$eq")).toList

      var columnName = ""
      var method: Method = null
      var blFirst = true

      while (this._ResultSet.next()) {
        obj = cls.newInstance().asInstanceOf[T]

        for (i <- 1 to iColNum) {
          if (blFirst) {
            columnName = metaData.getColumnName(i)
          }

          method = this.GetMethod(i, methodList, methodMap, (k, v) => methodMap += (k -> v), columnName)
          if (method != null) {
            method.invoke(obj, Common.ChangeType(method.getParameterTypes().apply(0), this._ResultSet.getObject(i)).asInstanceOf[AnyRef])
          }
        }

        blFirst = false
        columnName = null
        list = list :+ obj
      }
      return list
    }

    return null
  }

  private def GetMethod(index: Int, methodList: List[Method], methodMap: Map[Int, Method], addMap: (Int, Method) => Unit, columnName: String): Method = {
    var method: Method = null

    methodMap.get(index) match {
      case Some(x) => method = x
      case None => null
    }

    if (method == null && columnName != null) {
      breakable {
        for (i <- 0 until methodList.size) {
          if (methodList.apply(i).getName().toLowerCase().equals(String.format("%s_$eq", columnName.toLowerCase()))) {
            method = methodList.apply(i)
            addMap(index, method)
            break()
          }
        }
      }
    }

    return method
  }
}

object DataBase {
  var ConnectionString: String = null
}
