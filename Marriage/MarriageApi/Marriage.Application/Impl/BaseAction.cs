using Marriage.Entity.Application;
using Marriage.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Marriage.Application.Impl
{
    public class BaseAction
    {
        //记录信息列表
        protected List<string> MessageList { get; set; }
        //执行耗时信息
        protected StopwatchMessage StopwatchMessage { get; set; }
        //类名
        protected string Name { get; set; }

        public BaseAction()
        {
            Name = GetType().Name;
        }

        /// <summary>
        /// 设置异常响应与日志
        /// </summary>
        /// <param name="response"></param>
        /// <param name="message"></param>
        /// <param name="ex"></param>
        protected void SetExceptionResponse(IResponse response, string methodName, Exception ex)
        {
            ex = Common.GetInnerException(ex);
            response.Ack.IsSuccess = false;
            response.Ack.Code = (int)ResponseStatusEnum.Exception;
            response.Ack.Message = ex.Message;

            string title = string.Format("Exception/{0}/{1}", this.Name, methodName);
            LoggerProxy.Exception(Name, methodName, ex);

            if (this.MessageList != null)
            {
                this.MessageList.Add(string.Format("调用异常,详见路径为：{0}信息。", title));
            }
        }

        /// <summary>
        /// 执行步骤
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="stepName"></param>
        /// <param name="stepTitle"></param>
        /// <param name="methodName"></param>
        /// <param name="response"></param>
        /// <param name="execStep"></param>
        /// <param name="setStepMessage"></param>
        /// <returns></returns>
        protected T ExecuteStep<T>(string stepTitle, string methodName, IResponse response, Func<T> execStep, Action<T> setStepMessage)
        {
            if (!response.Ack.IsSuccess)
            {
                return default(T);
            }

            this.MessageList.Add(stepTitle);
            T obj = default(T);

            try
            {
                obj = execStep();
            }
            catch (Exception ex)
            {
                this.SetExceptionResponse(response, methodName, ex);
            }

            setStepMessage(obj);

            this.MessageList.Add(this.StopwatchMessage.StepElapsed());

            return obj;
        }

        /// <summary>
        /// 获取实体数据
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="stepNo"></param>
        /// <param name="stepName"></param>
        /// <param name="methodName"></param>
        /// <param name="response"></param>
        /// <param name="execStep"></param>
        /// <param name="blJudgeNull"></param>
        /// <returns></returns>
        protected T GetEntityData<T>(int stepNo, string stepName, string methodName, IResponse response, Func<T> execStep, bool blJudgeNull = true)
        {
            Action<T> setStepMessage = (entity) =>
            {
                this.SetGetDataMessageResponse(stepName, entity, response, blJudgeNull);
            };

            return this.ExecuteStep<T>(string.Format("{0}、{1}。", stepNo, stepName), methodName, response, execStep, setStepMessage);
        }

        /// <summary>
        /// 获取实体数据列表
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="stepNo"></param>
        /// <param name="stepName"></param>
        /// <param name="methodName"></param>
        /// <param name="response"></param>
        /// <param name="execStep"></param>
        /// <param name="blJudgeNull"></param>
        /// <returns></returns>
        protected List<T> GetEntityDataList<T>(int stepNo, string stepName, string methodName, IResponse response, Func<List<T>> execStep, bool blJudgeNull = true)
        {
            Action<List<T>> setStepMessage = (entity) =>
            {
                this.SetGetDataListMessageResponse<T>(stepName, entity, response, blJudgeNull);
            };

            return this.ExecuteStep<List<T>>(string.Format("{0}、{1}。", stepNo, stepName), methodName, response, execStep, setStepMessage);
        }

        /// <summary>
        /// 插入实体数据
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="stepName"></param>
        /// <param name="methodName"></param>
        /// <param name="response"></param>
        /// <param name="execStep"></param>
        /// <returns></returns>
        protected bool InsertEntityData(int stepNo, string stepName, string methodName, IResponse response, Func<bool> execStep)
        {
            Action<bool> setStepMessage = (blSucceed) =>
            {
                this.SetInsertDataMessageRepsonse(stepName, blSucceed, response);
            };

            return this.ExecuteStep<bool>(string.Format("{0}、{1}。", stepNo, stepName), methodName, response, execStep, setStepMessage);
        }


        /// <summary>
        /// 插入实体数据
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="stepName"></param>
        /// <param name="methodName"></param>
        /// <param name="response"></param>
        /// <param name="execStep"></param>
        /// <returns></returns>
        protected T InsertEntityData<T>(int stepNo, string stepName, string methodName, IResponse response, Func<T> execStep, Func<T, bool> setSucceed)
        {
            Action<T> setStepMessage = (entity) =>
            {
                this.SetInsertDataMessageRepsonse(stepName, setSucceed(entity), response);
            };

            return this.ExecuteStep<T>(string.Format("{0}、{1}。", stepNo, stepName), methodName, response, execStep, setStepMessage);
        }

        /// <summary>
        /// 更新实体数据
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="stepName"></param>
        /// <param name="methodName"></param>
        /// <param name="response"></param>
        /// <param name="execStep"></param>
        /// <returns></returns>
        protected bool UpdateEntityData(int stepNo, string stepName, string methodName, IResponse response, Func<bool> execStep)
        {
            Action<bool> setStepMessage = (blSucceed) =>
            {
                this.SetUpdateDataMessageRepsonse(stepName, blSucceed, response);
            };

            return this.ExecuteStep<bool>(string.Format("{0}、{1}。", stepNo, stepName), methodName, response, execStep, setStepMessage);
        }

        /// <summary>
        /// 执行
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="stepName"></param>
        /// <param name="methodName"></param>
        /// <param name="response"></param>
        /// <param name="execStep"></param>
        /// <returns></returns>
        protected bool Exce(int stepNo, string stepName, string methodName, IResponse response, Func<bool> execStep)
        {
            Action<bool> setStepMessage = (blSucceed) =>
            {
                this.SetExceMessageRepsonse(stepName, blSucceed, response);
            };

            return this.ExecuteStep<bool>(string.Format("{0}、{1}。", stepNo, stepName), methodName, response, execStep, setStepMessage);
        }

        /// <summary>
        /// 设置执行响应
        /// </summary>
        /// <param name="stepName"></param>
        /// <param name="blSucceed"></param>
        /// <param name="response"></param>
        protected void SetExceMessageRepsonse(string stepName, bool blSucceed, IResponse response)
        {
            if (response.Ack.IsSuccess && !blSucceed)
            {
                response.Ack.IsSuccess = false;
                response.Ack.Code = (int)ResponseStatusEnum.RequestSeviceFail;
                response.Ack.Message = string.Format("{0}失败！", stepName);
            }

            this.MessageList.Add(string.Format("执行状态：{0}。", blSucceed ? "成功" : "失败"));
        }

        /// <summary>
        /// 获取请求对象
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="requestContent"></param>
        /// <returns></returns>
        protected T GetRequest<T>(string requestContent)
        {
            if (string.IsNullOrEmpty(requestContent)) return default(T);
            return  Common.JsonToObject<T>(requestContent);
        }

        /// <summary>
        /// 设置获取数据响应信息
        /// </summary>
        /// <param name="stepName"></param>
        /// <param name="obj"></param>
        /// <param name="response"></param>
        /// <param name="blJudgeNull"></param>
        protected void SetGetDataMessageResponse(string stepName, object obj, IResponse response, bool blJudgeNull)
        {
            if (response.Ack.IsSuccess && blJudgeNull && obj == null)
            {
                response.Ack.IsSuccess = false;
                response.Ack.Code = (int)ResponseStatusEnum.RequestSeviceFail;
                response.Ack.Message = string.Format("{0}失败，请刷新数据稍后再试！", stepName);
            }

            this.MessageList.Add(string.Format("获取数据计数：{0}。", obj == null ? 0 : 1));
        }

        /// <summary>
        /// 设置获取数据响应信息
        /// </summary>
        /// <param name="stepName"></param>
        /// <param name="obj"></param>
        /// <param name="response"></param>
        /// <param name="blJudgeNull"></param>
        protected void SetGetDataListMessageResponse<T>(string stepName, List<T> obj, IResponse response, bool blJudgeNull)
        {
            if (response.Ack.IsSuccess && blJudgeNull && (obj == null || obj.Count == 0))
            {
                response.Ack.IsSuccess = false;
                response.Ack.Code = (int)ResponseStatusEnum.RequestSeviceFail;
                response.Ack.Message = string.Format("{0}失败，请刷新数据稍后再试！", stepName);
            }

            this.MessageList.Add(string.Format("获取数据计数：{0}。", obj == null ? 0 : obj.Count));
        }

        /// <summary>
        /// 设置添加数据响应信息
        /// </summary>
        /// <param name="stepName"></param>
        /// <param name="obj"></param>
        /// <param name="response"></param>
        protected void SetInsertDataMessageRepsonse(string stepName, bool blSucceed, IResponse response)
        {
            if (response.Ack.IsSuccess && !blSucceed)
            {
                response.Ack.IsSuccess = false;
                response.Ack.Code = (int)ResponseStatusEnum.RequestSeviceFail;
                response.Ack.Message = string.Format("{0}失败，请刷新数据稍后再试！", stepName);
            }

            this.MessageList.Add(string.Format("执行状态：{0}。", blSucceed ? "成功" : "失败"));
        }

        /// <summary>
        /// 设置添加数据响应信息
        /// </summary>
        /// <param name="stepName"></param>
        /// <param name="obj"></param>
        /// <param name="response"></param>
        protected void SetUpdateDataMessageRepsonse(string stepName, bool blSucceed, IResponse response)
        {
            if (response.Ack.IsSuccess && !blSucceed)
            {
                response.Ack.IsSuccess = false;
                response.Ack.Code = (int)ResponseStatusEnum.RequestSeviceFail;
                response.Ack.Message = string.Format("{0}失败，请刷新数据稍后再试！", stepName);
            }

            this.MessageList.Add(string.Format("执行状态：{0}。", blSucceed ? "成功" : "失败"));
        }

        /// <summary>
        /// 判断是否空请求
        /// </summary>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        protected bool IsNullRequest(IRequest request, IResponse response)
        {
            if (request == null)
            {
                response.Ack.IsSuccess = false;
                response.Ack.Code = (int)ResponseStatusEnum.ValidateDataFail;
                response.Ack.Message = "请求参数数据为空！";
            }

            return response.Ack.IsSuccess;
        }

        /// <summary>
        /// 初始化信息
        /// </summary>
        protected void InitMessage()
        {
            this.MessageList = new List<string>();
            this.StopwatchMessage = new StopwatchMessage();
        }

        /// <summary>
        /// 设置信息日志
        /// </summary>
        /// <param name="title"></param>
        /// <param name="requestContent"></param>
        /// <param name="response"></param>
        /// <param name="dict"></param>
        protected void SetInfoLog(string title, string methodName, string requestContent, IResponse response, Dictionary<string, object> dict = null, bool blResponseLog = true)
        {
            Dictionary<string, object> message = new Dictionary<string, object>();
            message["Title"] = title;
            message["RequestContent"] = requestContent;
            if (blResponseLog || !response.Ack.IsSuccess) message["ResponseContent"] = Common.ToJson(response);
            message["Status"] = response.Ack.IsSuccess ? "Success" : "Failed";
            message["Elapsed"] = this.StopwatchMessage.ElapsedMilliseconds.ToString();
            if (dict != null)
            {
                foreach (var kvp in dict)
                {
                    if (kvp.Value != null) message.Add(kvp.Key, kvp.Value);
                }
            }
            message["Message"] = string.Join(" \n ", this.MessageList.ToList());

            LoggerProxy.Info(Name, methodName, message);
        }

        /// <summary>
        /// 执行结束
        /// </summary>
        /// <param name="response"></param>
        protected void ExecEnd(IResponse response)
        {
            this.MessageList.Add(this.StopwatchMessage.EndElapsed());
        }

        /// <summary>
        /// 验证
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="stepName"></param>
        /// <param name="methodName"></param>
        /// <param name="response"></param>
        /// <param name="execStep"></param>
        /// <returns></returns>
        protected bool ExecValidate(int stepNo, string stepName, string methodName, IResponse response, Func<bool> execStep)
        {
            Action<bool> setStepMessage = (blSucceed) =>
            {
                this.MessageList.Add(string.Format("执行状态：{0}。", blSucceed ? "成功" : "失败"));
            };

            return this.ExecuteStep<bool>(string.Format("{0}、{1}。", stepNo, stepName), methodName, response, execStep, setStepMessage);
        }

        /// <summary>
        /// 设置数据
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="stepName"></param>
        /// <param name="methodName"></param>
        /// <param name="response"></param>
        /// <param name="execStep"></param>
        /// <returns></returns>
        protected bool ExecSetData(int stepNo, string stepName, string methodName, IResponse response, Func<bool> execStep)
        {
            Action<bool> setStepMessage = (blSucceed) =>
            {
                this.MessageList.Add(string.Format("执行状态：{0}。", blSucceed ? "成功" : "失败"));
            };

            return this.ExecuteStep<bool>(string.Format("{0}、{1}。", stepNo, stepName), methodName, response, execStep, setStepMessage);
        }

        /// <summary>
        /// 设置服务失败响应
        /// </summary>
        /// <param name="serviceResponse"></param>
        /// <param name="response"></param>
        protected void SetServiceFailedResponse(Entity.Service.IResponse serviceResponse, IResponse response)
        {
            if (serviceResponse.ErrCode != 0)
            {
                response.Ack.IsSuccess = false;
                response.Ack.Code = (int)ResponseStatusEnum.RequestSeviceFail;
                if (serviceResponse.ErrCode == -2) response.Ack.Message = serviceResponse.ErrMsg;
                else response.Ack.Message = string.Format("请求服务失败，{0}:{1}", serviceResponse.ErrCode, serviceResponse.ErrMsg);
            }
            else if (!serviceResponse.result)
            {
                response.Ack.IsSuccess = false;
                response.Ack.Code = (int)ResponseStatusEnum.RequestSeviceFail;
                response.Ack.Message = serviceResponse.errMessage;
            }
        }

        /// <summary>
        /// 设置数据
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="stepNo"></param>
        /// <param name="stepName"></param>
        /// <param name="methodName"></param>
        /// <param name="response"></param>
        /// <param name="execStep"></param>
        /// <returns></returns>
        protected T ExecSetData<T>(int stepNo, string stepName, string methodName, IResponse response, Func<T> execStep)
        {
            Action<T> setStepMessage = (obj) =>
            {
                this.MessageList.Add(string.Format("执行状态：{0}。", obj != null ? "成功" : "失败"));
            };

            return this.ExecuteStep<T>(string.Format("{0}、{1}。", stepNo, stepName), methodName, response, execStep, setStepMessage);
        }

        /// <summary>
        /// 设置验证返回信息
        /// </summary>
        /// <param name="message"></param>
        /// <param name="response"></param>
        protected void SetValidateMessageRepsonse(string message, IResponse response)
        {
            response.Ack.IsSuccess = false;
            response.Ack.Code = (int)ResponseStatusEnum.ValidateDataFail;
            response.Ack.Message = message;
        }

        /// <summary>
        /// 设置返回响应
        /// </summary>
        /// <param name="title"></param>
        /// <param name="requestContent"></param>
        /// <param name="response"></param>
        /// <param name="dict"></param>
        /// <returns></returns>
        protected T SetReturnResponse<T>(string title, string methodName, string requestContent, T response, Dictionary<string, object> dict = null, bool blResponseLog = true) where T : IResponse
        {
            //日志记录
            this.SetInfoLog(title, methodName, requestContent, response, dict, blResponseLog);

            return response;
        }
    }

    /// <summary>
    /// 响应状态状态
    /// </summary>
    public enum ResponseStatusEnum
    {
        /// <summary>
        /// 成功
        /// </summary>
        Success = 0,
        /// <summary>
        /// 异常
        /// </summary>
        Exception = 101,
        /// <summary>
        /// 验证数据失败
        /// </summary>
        ValidateDataFail = 102,
        /// <summary>
        /// 请求服务数据失败
        /// </summary>
        RequestSeviceFail = 103
    }
}
