package MySql
import java.sql.{PreparedStatement, Types}
import java.util.Date

/**
  * Created by BianzhaiWang on 2017/1/19.
  */
class DataParameterList extends TDataParameterList {
  private var _Parameters: Map[String, Any] = Map[String, Any]()

  private var _PreparedParameters: List[Any] = null

  //设置参数
  override def Set(name: String, value: Any): Unit = {
    this._Parameters += (name -> value)
  }

  //设置参数
  override def Set(map: Map[String, Any]): Unit = {
    this._Parameters = map
  }

  //添加参数
  override def AddMap(map: Map[String, Any]): Unit = {
    if (this._Parameters == null) {
      this._Parameters = map
    } else {
      this._Parameters = this._Parameters ++ map
    }
  }

  //获取参数值
  override def Get(name: String): Any = {
    return this._Parameters.get(name)
  }


  private def AddFrefix(name: String): String = {
    var name2 = name
    if (!name2.startsWith("@")) {
      name2 = "@" + name2
    }
    return name2
  }

  //移除参数
  override def Remove(name: String): Unit = {
    this._Parameters = this._Parameters - name
  }

  //移除参数
  override def RemoveAll(): Unit = {
    this._Parameters = null
  }

  //参数化Sql
  override def ToSql(sql: String): String = {
    this._PreparedParameters = List[Object]()
    var sql2 = sql

    for ((k, v) <- this._Parameters) {
      sql2 = this.GetPreparedParameters(k, v, sql2)
    }

    return sql2
  }

  //设置PreparedStatement参数
  override def SetPreparedStatementParameters(preparedStatement: PreparedStatement): Unit = {
    if (this._PreparedParameters != null && !this._PreparedParameters.isEmpty) {

      var value: Any = null
      for (i <- 0 until this._PreparedParameters.size) {
        value = this._PreparedParameters.apply(i)
        this.SetPreparedParameter(preparedStatement, i + 1, value)
      }
    }
  }

  private def SetPreparedParameter(preparedStatement: PreparedStatement, index: Int, value: Any): Unit = {
    value match {
      case null => preparedStatement.setNull(index, Types.NULL)
      case x: String => preparedStatement.setString(index, x)
      case x: Int => preparedStatement.setInt(index, x)
      case x: Long => preparedStatement.setLong(index, x)
      case x: Double => preparedStatement.setDouble(index, x)
      case x: Float => preparedStatement.setFloat(index, x)
      case x: Boolean => preparedStatement.setBoolean(index, x)
      case x: Byte => preparedStatement.setByte(index, x)
      case x: Char => preparedStatement.setString(index, x.toString())
      case x: Date => preparedStatement.setDate(index, new java.sql.Date(x.getTime()))
      case _ => preparedStatement.setString(index, value.toString())
    }
  }

  private def GetPreparedParameters(name: String, value: Any, sql: String): String = {
    val name2 = this.AddFrefix(name)
    var sql2 = sql
    var index = 0
    while (index >= 0) {
      index = sql2.indexOf(name2, index)
      if (index >= 0) {
        if (index == 0) {
          sql2 = "?" + sql2.substring(name2.length())
        } else if (index == sql2.length() - name2.length()) {
          sql2 = sql2.substring(0, index) + "?"
        } else {
          sql2 = sql2.substring(0, index) + "?" + sql2.substring(index + name2.length())
        }
        this._PreparedParameters = this._PreparedParameters :+ value
      }
    }

    return sql2
  }
}
