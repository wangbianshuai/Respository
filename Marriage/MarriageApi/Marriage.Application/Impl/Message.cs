using Marriage.Entity.Application;
using Marriage.Entity.Application.Message;
using Marriage.Entity.Application.User;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Marriage.Application.Impl
{
    public class Message : BaseAction, IMessage
    {
        public Domain.IAppAccount _AppAccount { get; set; }
        public Domain.IBasicSupport _BasicSupport { get; set; }
        public Domain.IServiceInterface _ServiceInterface { get; set; }
        public Domain.IMessageManage _MessageManage { get; set; }
        public Domain.IWeChatTemplate _WeChatTemplate { get; set; }

        /// <summary>
        /// 同步微信消息模板
        /// </summary>
        public SyncWeChatTemplateResponse SyncWeChatTemplate(SyncWeChatTemplateRequest request, string token)
        {
            string title = "同步微信消息模板";
            string requestContent = Utility.Common.ToJson(request);
            SyncWeChatTemplateResponse response = new SyncWeChatTemplateResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            string adminUserId = ParseToken(token, request.AppAccountId, response);
            string getAccessTokenName = "获取Access_Token";
            string getTemplateListName = "获取模板列表";

            //1、判断十分钟之内是否有更新
            int stepNo = 1;
            JudgeIsUpdate(stepNo, response);

            //2、获取App账号
            stepNo += 1;
            Entity.Domain.AppAccount appAccount = GetAppAccountById(stepNo, request.AppAccountId, response);

            //3、获取服务接口
            stepNo += 1;
            List<Entity.Domain.ServiceInterface> serviceInterfaceList = GetServiceInterfaceByNames(stepNo, new List<string>() { getAccessTokenName, getTemplateListName }, response);

            //4、获取Access_Token
            stepNo += 1;
            Entity.Service.BasicSupport.GetAccessTokenResponse getAccessTokenResponse = GetAccessToken(stepNo, getAccessTokenName, appAccount, serviceInterfaceList, response);

            //5、获取模板列表
            stepNo += 1;
            List<Entity.Service.MessageManage.TemplateInfo> templateInfoList = GetTemplateList(stepNo, getTemplateListName, getAccessTokenResponse, serviceInterfaceList, response);

            //6、更新本地微信消息模板数据
            stepNo += 1;
            UpdateWeChatTemplateData(stepNo, templateInfoList, appAccount, adminUserId, response);

            //7、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<SyncWeChatTemplateResponse>(title, "SyncWeChatTemplate", requestContent, response);
        }

        /// <summary>
        /// 判断十分钟之内是否有更新
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="userInfoList"></param>
        /// <param name="appAccount"></param>
        /// <param name="adminUserId"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool JudgeIsUpdate(int stepNo, IResponse response)
        {
            Func<bool> execStep = () =>
            {
                string message = _WeChatTemplate.JudgeIsUpdate();
                if (!string.IsNullOrEmpty(message)) this.SetValidateMessageRepsonse(message, response);

                return response.Ack.IsSuccess;
            };

            return this.ExecValidate(stepNo, "判断十分钟之内是否有更新", "JudgeIsUpdate", response, execStep);
        }

        /// <summary>
        /// 更新本地微信消息模板数据
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="templateInfoList"></param>
        /// <param name="appAccount"></param>
        /// <param name="adminUserId"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool UpdateWeChatTemplateData(int stepNo, List<Entity.Service.MessageManage.TemplateInfo> templateInfoList, Entity.Domain.AppAccount appAccount, string adminUserId, IResponse response)
        {
            Func<bool> execStep = () =>
            {
                _WeChatTemplate.UpdateWeChatTemplateData(templateInfoList, appAccount.AppAccountId, new Guid(adminUserId));

                return response.Ack.IsSuccess;
            };

            return this.UpdateEntityData(stepNo, "更新本地微信消息模板数据", "UpdateWeChatTemplateData", response, execStep);
        }

        /// <summary>
        /// 获取模板列表
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="getUserListName"></param>
        /// <param name="getAccessTokenResponse"></param>
        /// <param name="serviceInterfaceList"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private List<Entity.Service.MessageManage.TemplateInfo> GetTemplateList(int stepNo, string getTemplateListName, Entity.Service.BasicSupport.GetAccessTokenResponse getAccessTokenResponse, List<Entity.Domain.ServiceInterface> serviceInterfaceList, IResponse response)
        {
            Func<List<Entity.Service.MessageManage.TemplateInfo>> execStep = () =>
            {
                var serviceInterface = serviceInterfaceList.Where(w => w.Name == getTemplateListName).FirstOrDefault();
                if (serviceInterface == null)
                {
                    this.SetValidateMessageRepsonse("获取‘获取模板列表’接口不存在！", response);
                    return null;
                }
                var serviceReponse = _MessageManage.GetTemplateList(getAccessTokenResponse.Access_Token, serviceInterface);

                this.SetServiceFailedResponse(serviceReponse, response);

                return serviceReponse.Template_List;
            };

            return this.GetEntityDataList<Entity.Service.MessageManage.TemplateInfo>(stepNo, "获取模板列表", "GetTemplateList", response, execStep, false);
        }

        /// <summary>
        /// 获取Access Token
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="app"></param>
        /// <param name="serviceInterfaceList"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Service.BasicSupport.GetAccessTokenResponse GetAccessToken(int stepNo, string getAccessTokenName, Entity.Domain.AppAccount appAccount, List<Entity.Domain.ServiceInterface> serviceInterfaceList, IResponse response)
        {
            Func<Entity.Service.BasicSupport.GetAccessTokenResponse> execStep = () =>
            {
                var serviceInterface = serviceInterfaceList.Where(w => w.Name == getAccessTokenName).FirstOrDefault();
                if (serviceInterface == null)
                {
                    this.SetValidateMessageRepsonse("获取‘获取Access Token服务’接口不存在！", response);
                    return null;
                }
                var serviceReponse = _BasicSupport.GetAccessToken(appAccount, serviceInterface);

                this.SetServiceFailedResponse(serviceReponse, response);
                return serviceReponse;
            };

            return this.GetEntityData<Entity.Service.BasicSupport.GetAccessTokenResponse>(stepNo, "获取Access Token", "GetAccessToken", response, execStep);
        }

        /// <summary>
        /// 获取App账号
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.AppAccount GetAppAccountById(int stepNo, Guid appAccountId, IResponse response)
        {
            Func<Entity.Domain.AppAccount> execStep = () =>
            {
                return _AppAccount.GetAppAccountById(appAccountId);
            };

            return this.GetEntityData<Entity.Domain.AppAccount>(stepNo, "获取App账号", "GetAppAccountById", response, execStep);
        }

        /// <summary>
        /// 获取服务接口
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="nameList"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private List<Entity.Domain.ServiceInterface> GetServiceInterfaceByNames(int stepNo, List<string> nameList, IResponse response)
        {
            Func<List<Entity.Domain.ServiceInterface>> execStep = () =>
            {
                var list = _ServiceInterface.GetServiceInterfaceByNames(nameList);

                if (list.Count != nameList.Count)
                {
                    this.SetValidateMessageRepsonse(string.Format("获取服务接口{0}返回数据计数不一致", string.Join("、", nameList)), response);
                }

                return list;
            };

            return this.GetEntityDataList<Entity.Domain.ServiceInterface>(stepNo, "获取服务接口", "GetServiceInterfaceByNames", response, execStep);
        }
    }
}
