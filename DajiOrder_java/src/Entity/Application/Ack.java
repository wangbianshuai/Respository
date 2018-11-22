package Entity.Application;

import Utility.Common;

/**
 * Created by Bianshuai on 2017/1/8.
 */
public class Ack {

    //ID
    public String Id = null;

    // 是否成功
    public Boolean IsSuccess = false;

    //状态编号
    public int StatusCode = 0;

    // 信息
    public String Message = null;

    public Ack() {
        Id = Common.CreateGuid();
        IsSuccess = true;
        Message = "";
    }
}
