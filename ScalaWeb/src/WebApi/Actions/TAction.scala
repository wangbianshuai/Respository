package WebApi.Actions

/**
  * Created by BianzhaiWang on 2017/1/18.
  */
trait TAction {
  def RequestAction(request: Request): String
}
