package Utility

import scala.util.matching.Regex
import java.text.SimpleDateFormat
import java.util.Date
/**
  * Created by Bianshuai on 2017/1/15.
  */
object Common {

  def StringIsNullOrEmpty(str: String): Boolean = {
    return str.isEmpty() || StringTrim(str).equals("")
  }

  def StringTrim(str: String): String = {
    var str2: String = StringReplace(str, "(^\\s*)|(\\s*$)", "")
    str2 = StringReplace(str2, "(^　*)|(　*$)", "")
    return str2.trim()
  }

  def StringReplace(str: String, reg: String, rpValue: String): String = {
    val pattern: Regex = reg.r
    return pattern replaceAllIn(str, rpValue)
  }

  def CreateGuid(): String = {
    val sb: StringBuilder = new StringBuilder
    var n: Int = 0
    for (i <- 1 to 32) {
      n = math.floor(math.random() * 16.0).asInstanceOf[Int]
      n match {
        case 10 => sb.append("A")
        case 11 => sb.append("B")
        case 12 => sb.append("C")
        case 13 => sb.append("D")
        case 14 => sb.append("E")
        case 15 => sb.append("F")
        case _ => sb.append(n.toString())
      }
      i match {
        case 8 => sb.append("-")
        case 12 => sb.append("-")
        case 16 => sb.append("-")
        case 20 => sb.append("-")
        case _ =>
      }
    }
    return sb.toString()
  }

  def StringTrimEnter(str: String): String = {
    val str2 = StringReplace(str, "(^\ns*)|(\ns*$)", "");
    return StringReplace(str2, "(^\rs*)|(\rs*$)", "");
  }

  def CheckDouble(value: String): Boolean = {
    var regex = "^[-+]?(/d+(/./d*)?|(/./d+))([eE]([-+]?([012]?/d{1,2}|30[0-7])|-3([01]?[4-9]|[012]?[0-3])))?[dD]?$"
    return value.matches(regex)
  }

  def CheckNumber(value: String): Boolean = {
    var regex = "^(-?[1-9]\\d*)$"
    return value.matches(regex)
  }

  private def GetCharValue(value: Any): Char = {
    val cs = value.toString().toCharArray()
    cs.length match {
      case 0 => '\0'
      case 1 => cs.apply(0)
      case _ => throw new Exception("String转char长度不正确！")
    }
  }

  private def GetDateValue(value: Any): Date = {
    val sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS")
    return sdf.parse(GetDateString(value.toString()))
  }

  def ChangeType(cls: Class[_], value: Any): Any = {
    val names = cls.getTypeName().replace(".", "-").split("-")
    val typeName = names.apply(names.length - 1).replace("$", "")
    typeName match {
      case "String" => if (value.isInstanceOf[String]) value else value.toString()
      case "Byte" => if (value.isInstanceOf[Byte]) value else value.toString().toByte
      case "Char" => if (value.isInstanceOf[Char]) value else GetCharValue(value)
      case "Short" => if (value.isInstanceOf[Short]) value else value.toString().toShort
      case "Int" => if (value.isInstanceOf[Int]) value else value.toString().toInt
      case "Long" => if (value.isInstanceOf[Long]) value else value.toString().toLong
      case "Float" => if (value.isInstanceOf[Float]) value else value.toString().toFloat
      case "Double" => if (value.isInstanceOf[Double]) value else value.toString().toDouble
      case "Boolean" => if (value.isInstanceOf[Boolean]) value else value.toString().toBoolean
      case "Date" => if (value.isInstanceOf[Date]) value else GetDateValue(value)
      case _ => value
    }
  }

  def ChangeArrayType(cls: Class[_], value: Array[_]): AnyRef = {
    val typeName = cls.getTypeName()
    typeName match {
      case "String[]" => for (v <- value) yield v.toString()
      case "byte[]" => for (v <- value) yield if (v.isInstanceOf[Byte]) v.asInstanceOf[Byte] else v.toString().toByte
      case "char[]" => for (v <- value) yield if (v.isInstanceOf[Char]) v.asInstanceOf[Char] else GetCharValue(v)
      case "short[]" => for (v <- value) yield if (v.isInstanceOf[Short]) v.asInstanceOf[Short] else v.toString().toShort
      case "int[]" => for (v <- value) yield (if (v.isInstanceOf[Int]) v.asInstanceOf[Int] else v.toString().toInt)
      case "long[]" => for (v <- value) yield if (v.isInstanceOf[Long]) v.asInstanceOf[Long] else v.toString().toLong
      case "float[]" => for (v <- value) yield if (v.isInstanceOf[Float]) v.asInstanceOf[Float] else v.toString().toFloat
      case "double[]" => for (v <- value) yield if (v.isInstanceOf[Double]) v.asInstanceOf[Double] else v.toString().toDouble
      case "boolean[]" => for (v <- value) yield if (v.isInstanceOf[Boolean]) v.asInstanceOf[Boolean] else v.toString().toBoolean
      case "Date[]" => for (v <- value) yield if (v.isInstanceOf[Date]) v.asInstanceOf[Date] else GetDateValue(v)
      case _ => value
    }
  }

  private def GetDateString(dateString: String): String = {
    val len = dateString.length
    if (len >= 10) {
      val yyyy = dateString.substring(0, 4)
      val MM = dateString.substring(5, 7)
      val dd = dateString.substring(8, 10)

      var HH = "00"
      var mm = "00"
      var ss = "00"
      var SSS = "000"
      if (len >= 16) {
        HH = dateString.substring(11, 13)
        mm = dateString.substring(14, 16)
        if (len >= 19) {
          ss = dateString.substring(17, 19)
          if (len == 23) {
            SSS = dateString.substring(20, 23)
          }
        }
      }

      return String.format("%s-%s-%s %s:%s:%s.%s", yyyy, MM, dd, HH, mm, ss, SSS)
    }
    return dateString
  }

  def StringJoin(joinStr: String, list: List[String]): String = {
    var sb = new StringBuilder()
    for (str <- list) sb.append(joinStr.concat(str))

    return sb.toString().replaceFirst(joinStr, "")
  }

  def GetRealException(ex: Throwable): Throwable = {
    val throwable = ex.getCause()
    if (throwable != null) {
      return GetRealException(throwable)
    }
    return ex
  }

  def GetFirstOrDefault[T](cls: Class[_], list: List[T]): T = {
    if (list != null && !list.isEmpty) {
      return list.apply(0)
    }
    return null.asInstanceOf[T]
  }
}
