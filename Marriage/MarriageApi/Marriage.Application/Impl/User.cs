using Marriage.Entity.Application;
using Marriage.Entity.Application.User;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Marriage.Application.Impl
{
    public class User : BaseAction, IUser
    {
        public Domain.IUser _User { get; set; }
        public Domain.IAppAccount _AppAccount { get; set; }
        public Domain.IBasicSupport _BasicSupport { get; set; }
        public Domain.IServiceInterface _ServiceInterface { get; set; }
        public Domain.IUserManage _UserManage { get; set; }


        /// <summary>
        /// 同步微信用户
        /// </summary>
        public SyncWeChatUserResponse SyncWeChatUser(SyncWeChatUserRequest request, string token)
        {
            string title = "同步微信用户";
            string requestContent = Utility.Common.ToJson(request);
            SyncWeChatUserResponse response = new SyncWeChatUserResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            string adminUserId = ParseToken(token, request.AppAccountId, response);
            string getAccessTokenName = "获取Access_Token";
            string getUserListName = "获取用户列表";
            string batchGetUserInfoName = "批量获取用户基本信息";

            //1、判断十分钟之内是否有更新
            int stepNo = 1;
            JudgeIsUpdate(stepNo, response);

            //2、获取App账号
            stepNo += 1;
            Entity.Domain.AppAccount appAccount = GetAppAccountById(stepNo, request.AppAccountId, response);

            //3、获取服务接口
            stepNo += 1;
            List<Entity.Domain.ServiceInterface> serviceInterfaceList = GetServiceInterfaceByNames(stepNo, new List<string>() { getAccessTokenName, getUserListName, batchGetUserInfoName }, response);

            //4、获取Access_Token
            stepNo += 1;
            Entity.Service.BasicSupport.GetAccessTokenResponse getAccessTokenResponse = GetAccessToken(stepNo, getAccessTokenName, appAccount, serviceInterfaceList, response);

            //5、获取用户列表
            stepNo += 1;
            List<string> openIdList = GetUserList(stepNo, getUserListName, getAccessTokenResponse, serviceInterfaceList, response);

            //6、批量获取用户基本信息
            stepNo += 1;
            List<Entity.Service.UserManage.UserInfo> userInfoList = BatchGetUserInfo(stepNo, openIdList, batchGetUserInfoName, getAccessTokenResponse, serviceInterfaceList, response);

            //7、更新本地用户数据
            stepNo += 1;
            UpdateUserData(stepNo, userInfoList, appAccount, adminUserId, response);

            //8、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<SyncWeChatUserResponse>(title, "SyncWeChatUser", requestContent, response);
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
                string message = _User.JudgeIsUpdate();
                if (!string.IsNullOrEmpty(message)) this.SetValidateMessageRepsonse(message, response);

                return response.Ack.IsSuccess;
            };

            return this.ExecValidate(stepNo, "判断十分钟之内是否有更新", "JudgeIsUpdate", response, execStep);
        }

        /// <summary>
        /// 更新本地用户数据
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="userInfoList"></param>
        /// <param name="appAccount"></param>
        /// <param name="adminUserId"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool UpdateUserData(int stepNo, List<Entity.Service.UserManage.UserInfo> userInfoList, Entity.Domain.AppAccount appAccount, string adminUserId, IResponse response)
        {
            Func<bool> execStep = () =>
            {
                _User.UpdateUserData(userInfoList, appAccount.AppAccountId, new Guid(adminUserId));

                return response.Ack.IsSuccess;
            };

            return this.UpdateEntityData(stepNo, "更新本地用户数据", "UpdateUserData", response, execStep);
        }

        /// <summary>
        /// 批量获取用户基本信息
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="openIdList"></param>
        /// <param name="batchGetUserInfoName"></param>
        /// <param name="getAccessTokenResponse"></param>
        /// <param name="serviceInterfaceList"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private List<Entity.Service.UserManage.UserInfo> BatchGetUserInfo(int stepNo, List<string> openIdList, string batchGetUserInfoName, Entity.Service.BasicSupport.GetAccessTokenResponse getAccessTokenResponse, List<Entity.Domain.ServiceInterface> serviceInterfaceList, IResponse response)
        {
            if (openIdList == null || openIdList.Count == 0) return null;

            Func<List<Entity.Service.UserManage.UserInfo>> execStep = () =>
            {
                var serviceInterface = serviceInterfaceList.Where(w => w.Name == batchGetUserInfoName).FirstOrDefault();
                if (serviceInterface == null)
                {
                    this.SetValidateMessageRepsonse("获取‘批量获取用户基本信息’接口不存在！", response);
                    return null;
                }
                var serviceReponse = _UserManage.BatchGetUserInfo(openIdList, getAccessTokenResponse.Access_Token, serviceInterface);

                this.SetServiceFailedResponse(serviceReponse, response);


                return serviceReponse.User_Info_List;
            };

            return this.GetEntityDataList<Entity.Service.UserManage.UserInfo>(stepNo, "批量获取用户基本信息", "BatchGetUserInfo", response, execStep, false);
        }

        /// <summary>
        /// 获取用户列表
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="getUserListName"></param>
        /// <param name="getAccessTokenResponse"></param>
        /// <param name="serviceInterfaceList"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private List<string> GetUserList(int stepNo, string getUserListName, Entity.Service.BasicSupport.GetAccessTokenResponse getAccessTokenResponse, List<Entity.Domain.ServiceInterface> serviceInterfaceList, IResponse response)
        {
            Func<List<string>> execStep = () =>
            {
                var serviceInterface = serviceInterfaceList.Where(w => w.Name == getUserListName).FirstOrDefault();
                if (serviceInterface == null)
                {
                    this.SetValidateMessageRepsonse("获取‘获取用户列表’接口不存在！", response);
                    return null;
                }
                var serviceReponse = _UserManage.GetUserList(getAccessTokenResponse.Access_Token, serviceInterface);

                this.SetServiceFailedResponse(serviceReponse, response);

                if (serviceReponse.Data != null) return serviceReponse.Data.OpenId;
                else return null;
            };

            return this.GetEntityDataList<string>(stepNo, "获取用户列表", "GetUserList", response, execStep, false);
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
                var serviceReponse= _BasicSupport.GetAccessToken(appAccount, serviceInterface);

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
