package Domain.Impl;

import LambdaInterface.IExceptionHandle;
/**
 * Created by BianzhaiWang on 2017/1/12.
 */
public class BaseDomain {
    public IExceptionHandle ExceptionHandle = null;

    public BaseDomain() {
    }

    public BaseDomain(IExceptionHandle exHandle) {
        this.ExceptionHandle = exHandle;
    }
}
