package Application.Impl;

import Entity.Application.Request;
import Entity.Application.Response;
import LambdaInterface.IExceptionHandle;
import LambdaInterface.IVoidFunction;
import Utility.Common;
import Utility.JsonParse;
import Utility.StopwatchMessage;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Supplier;

/**
 * Created by BianzhaiWang on 2017/1/12.
 */
public class BaseAction {
    public IExceptionHandle ExceptionHandle = null;

    //记录信息列表
    protected List<String> MessageList = null;
    //执行耗时信息
    protected Utility.StopwatchMessage StopwatchMessage = null;
    //类名
    protected String Name = null;

    public BaseAction() {
        this.ExceptionHandle = (ex) -> {
            throw new RuntimeException(ex);
        };
    }

    // 设置异常响应与日志
    protected void SetExceptionResponse(Response response, String methodName, Exception ex) {
        response.Ack.IsSuccess = false;
        response.Ack.StatusCode = 101;
        response.Ack.Message = Common.GetRealException(ex.getCause()).getMessage();

        String title = String.format("%s.%s.Exception", this.Name, methodName);

        if (this.MessageList != null) {
            this.MessageList.add(String.format("调用异常,详见异常标题为：{0}信息。", title));
        }
    }

    // 执行步骤
    protected <T> T ExecuteStep(Class<T> cls, String stepTitle, String methodName, Response response, Supplier<T> execStep, IVoidFunction<T> setStepMessage) {
        if (!response.Ack.IsSuccess) {
            return null;
        }

        this.MessageList.add(stepTitle);
        T obj = (T)Common.GetTypeDefaultValue(cls);

        try {
            obj = execStep.get();
        } catch (RuntimeException ex) {
            this.SetExceptionResponse(response, methodName, ex);
        }

        setStepMessage.Invoke(obj);

        this.MessageList.add(this.StopwatchMessage.StepElapsed());

        return obj;
    }

    // 获取实体数据
    protected <T> T GetEntityData(Class<T> cls, int stepNo, String stepName, String methodName, Response response, Supplier<T> execStep, boolean blNull) {
        IVoidFunction<T> setStepMessage = entity ->
        {
            this.SetGetDataMessageResponse(stepName, entity, response, blNull);
        };

        return this.ExecuteStep(cls, String.format("%s、%s。", stepNo, stepName), methodName, response, execStep, setStepMessage);
    }

    //设置获取数据响应信息
    protected void SetGetDataMessageResponse(String stepName, Object obj, Response response, boolean blNull) {
        if (response.Ack.IsSuccess && blNull && obj == null) {
            response.Ack.IsSuccess = false;
            response.Ack.StatusCode = 102;
            response.Ack.Message = String.format("%s失败，请刷新数据稍后再试！", stepName);
        }

        this.MessageList.add(String.format("获取数据计数：{0}。", obj == null ? 0 : 1));
    }

    // 插入实体数据
    protected String InsertEntityData(int stepNo, String stepName, String methodName, Response response, Supplier<String> execStep) {
        IVoidFunction<String> setStepMessage = id ->
        {
            this.SetInsertDataMessageRepsonse(stepName, id, response);
        };

        return this.ExecuteStep(String.class, String.format("%s、%s。", stepNo, stepName), methodName, response, execStep, setStepMessage);
    }

    // 设置添加数据响应信息
    protected void SetInsertDataMessageRepsonse(String stepName, String primaryKey, Response response) {
        if (response.Ack.IsSuccess && Common.StringIsNullOrEmpty(primaryKey)) {
            response.Ack.IsSuccess = false;
            response.Ack.StatusCode = (int) 102;
            response.Ack.Message = String.format("%s失败，请刷新数据稍后再试！", stepName);
        }

        this.MessageList.add(String.format("执行状态：%s。", Common.StringIsNullOrEmpty(primaryKey) ? "失败" : "成功"));
    }

    // 更新实体数据
    protected boolean UpdateEntityData(int stepNo, String stepName, String methodName, Response response, Supplier<Boolean> execStep) {
        IVoidFunction<Boolean> setStepMessage = blSucceed ->
        {
            this.SetUpdateDataMessageRepsonse(stepName, blSucceed, response);
        };

        return this.ExecuteStep(boolean.class, String.format("%s、%s。", stepNo, stepName), methodName, response, execStep, setStepMessage);
    }

    // 设置更新数据响应信息
    protected void SetUpdateDataMessageRepsonse(String stepName, boolean blSucceed, Response response) {
        if (response.Ack.IsSuccess && !blSucceed) {
            response.Ack.IsSuccess = false;
            response.Ack.StatusCode = (int) 102;
            response.Ack.Message = String.format("%s失败，请刷新数据稍后再试！", stepName);
        }

        this.MessageList.add(String.format("执行状态：%s。", blSucceed ? "成功" : "失败"));
    }

    // 判断是否空请求
    protected boolean IsNullRequest(Request request, Response response) {
        if (request == null) {
            response.Ack.IsSuccess = false;
            response.Ack.StatusCode = (int) 103;
            response.Ack.Message = "请求参数数据为空！";
        }

        return response.Ack.IsSuccess;
    }

    // 初始化信息
    protected void InitMessage() {
        this.MessageList = new ArrayList<>();
        this.StopwatchMessage = new StopwatchMessage();
    }

    // 设置信息日志
    protected void SetInfoLog(String title, String requestContent, Response response, Map<String, Object> map) {
        try {
            Map<String, Object> message = new HashMap<>();
            message.put("Title", title);
            message.put("RequestContent", requestContent);
            message.put("ResponseContent", JsonParse.ToJson(response));
            message.put("Status", response.Ack.IsSuccess ? "Success" : "Failed");
            message.put("Elapsed", this.StopwatchMessage.ElapsedMilliseconds);
            if (map != null) {
                for (Map.Entry<String, Object> entry : map.entrySet()) {
                    message.put(entry.getKey(), entry.getValue());
                }
            }
            message.put("Message", String.join(" \n ", this.MessageList));

            //LoggerProxy.Info(message);
        } catch (Exception ex) {
            this.ExceptionHandle.Handling(ex);
        }
    }

    /// <summary>
    /// 执行结束
    /// </summary>
    /// <param name="response"></param>
    protected void ExecEnd(Response response) {
        this.MessageList.add(this.StopwatchMessage.EndElapsed());
    }

    // 验证
    protected boolean ExecValidate(int stepNo, String stepName, String methodName, Response response, Supplier<Boolean> execStep) {
        IVoidFunction<Boolean> setStepMessage = blSucceed ->
        {
            this.MessageList.add(String.format("执行状态：%s。", blSucceed ? "成功" : "失败"));
        };

        return this.ExecuteStep(boolean.class, String.format("%s、%s。", stepNo, stepName), methodName, response, execStep, setStepMessage);
    }

    // 设置验证返回信息
    protected void SetValidateMessageRepsonse(String message, Response response) {
        response.Ack.IsSuccess = false;
        response.Ack.StatusCode = 103;
        response.Ack.Message = message;
    }
}
