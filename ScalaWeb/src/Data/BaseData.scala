package Data

import MySql.{DataBase, DataParameterList, TDataBase, TDataParameterList}
import Utility.{AppSettings, Common}

/**
  * Created by BianzhaiWang on 2017/1/19.
  */
class BaseData {
  var DBAccess: TDataBase = null

  var TableName: String = null

  var PrimaryKey: String = null

  Init()

  private def Init() {
    if (DataBase.ConnectionString == null) {
      DataBase.ConnectionString = AppSettings.ConnectionString
    }
    this.DBAccess = new DataBase()
  }

  def SelectEntities[T](cls: Class[_], sql: String, parameterList: TDataParameterList): List[T] = {
    return this.DBAccess.ExceSelectTo(cls, sql, parameterList)
  }

  def SelectEntities[T](cls: Class[_], selectFieldList: List[String], whereNameValues: Map[String, Any]): List[T] = {
    val parameterList: TDataParameterList = new DataParameterList()

    val fieldList = whereNameValues.keys.map(m => String.format("%s=@%s ", m, m)).toList
    parameterList.Set(whereNameValues)

    val selectFieldSql = if (selectFieldList == null) "*" else Common.StringJoin(",", selectFieldList)
    val sql = String.format("select %s from %s where %s", selectFieldSql, this.TableName, Common.StringJoin(" and ", fieldList))

    return this.SelectEntities(cls, sql, parameterList)
  }

  def SelectEntities[T](cls: Class[_]): List[T] = {
    val sql = String.format("select * from %s", this.TableName)
    return this.SelectEntities(cls, sql, null)
  }

  def SelectEntity[T](cls: Class[_], sql: String, parameterList: TDataParameterList): T = {
    return Common.GetFirstOrDefault(cls, this.SelectEntities(cls, sql, parameterList))
  }

  def SelectEntity[T](cls: Class[_], selectFieldList: List[String], whereNameValues: Map[String, Any]): T = {
    return Common.GetFirstOrDefault(cls, this.SelectEntities(cls, selectFieldList, whereNameValues))
  }

  def Insert(nameValues: Map[String, Any]): Boolean = {
    val nameList = nameValues.keys.toList

    val sql = String.format("insert %s (%s) values (%s)", this.TableName, Common.StringJoin(",", nameList),
      Common.StringJoin(",", nameList.map(s => String.format("@%s", s)).toList))

    val parameterList: TDataParameterList = new DataParameterList()
    parameterList.Set(nameValues)

    return this.ExceNoQuery(sql, parameterList) == 1
  }

  def ExceNoQuery(sql: String, parameterList: TDataParameterList): Int = {
    return this.DBAccess.ExceNoQuery(sql, parameterList)
  }

  def Update(nameValues: Map[String, Any], whereSql: String, parameterList: TDataParameterList): Boolean = {
    val parameterList2 = if (parameterList == null) new DataParameterList() else parameterList

    val fieldList = nameValues.keys.map(m => String.format("%s=@%s", m, m)).toList
    val sql = String.format("udpate %s set %s %s", this.TableName, Common.StringJoin(",", fieldList), whereSql)
    parameterList2.AddMap(nameValues)

    return this.ExceNoQuery(sql, parameterList2) == 1
  }

  def Update(nameValues: Map[String, Any], whereNameValues: Map[String, Any]): Boolean = {
    val parameterList: TDataParameterList = new DataParameterList()
    parameterList.Set(whereNameValues)

    val fieldList = whereNameValues.keys.map(m => String.format("%s=@%s", m, m)).toList
    val whereSql = String.format("where %s", Common.StringJoin(" and ", fieldList))

    return this.Update(nameValues, whereSql, parameterList)
  }

  def Update(nameValues: Map[String, Any], primaryKeyValue: Any): Boolean = {
    var whereNameValues = Map[String, Any]()
    whereNameValues += (this.PrimaryKey -> primaryKeyValue)
    return this.Update(nameValues, whereNameValues)
  }

  def Delete(whereNameValues: Map[String, Any]): Boolean = {
    val parameterList: TDataParameterList = new DataParameterList()
    parameterList.Set(whereNameValues)

    val fieldList = whereNameValues.keys.map(m => String.format("%s=@%s", m, m)).toList
    val sql = String.format("delete from %s where %s", this.TableName, Common.StringJoin(" and ", fieldList))

    return this.ExceNoQuery(sql, parameterList) > 0
  }

  def Delete(primaryKeyValue: Any): Boolean = {
    var whereNameValues = Map[String, Any]()
    whereNameValues += (this.PrimaryKey -> primaryKeyValue)
    return this.Delete(whereNameValues)
  }
}