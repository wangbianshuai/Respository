using Marriage.Entity.Application;
using Marriage.Entity.Application.WxUser;
using OpenDataAccessCore.Utility;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;

namespace Marriage.Application.Impl
{
    /// <summary>
    /// 微信用户
    /// </summary>
    public class WxUser : BaseAction, IWxUser
    {
        public Domain.IDictionaryConfig _DictionaryConfig { get; set; }

        public Domain.IUserManage _UserManage { get; set; }

        public Domain.IBasicSupport _BasicSupport { get; set; }

        /// <summary>
        /// 获取微信用户
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public GetWxUserResponse GetWxUser(GetWxUserRequest request)
        {
            string title = "获取微信用户";
            string requestContent = Utility.Common.ToJson(request);
            GetWxUserResponse response = new GetWxUserResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、验证数据
            int stepNo = 1;
            this.ValidateGetWxUser(stepNo, request, response);


            //2、以获取集合获取键值配置集合
            List<string> nameList = new List<string>() { "Wx_AppId", "Wx_Secret" };

            stepNo += 1;
            var dictionaryConfigList = GetDictionaryConfigListByNames(stepNo, nameList, response);

            //3、获取Access_Token
            stepNo += 1;
            Entity.Service.BasicSupport.GetWebAccessTokenResponse getAccessTokenResponse = GetAccessToken(stepNo, dictionaryConfigList, request.Code, response);

            //2、获取微信用户
            stepNo += 1;
            GetWxUser(stepNo, getAccessTokenResponse, response);
   
            //3、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<GetWxUserResponse>(title, "GetWxUser", requestContent, response);
        }

        /// <summary>
        /// 通过微信小程序获取微信用户
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public GetOpenIdByCodeResponse GetOpenIdByCode(GetOpenIdByCodeRequest request)
        {
            string title = "通过微信小程序获取微信用户openid";
            string requestContent = Utility.Common.ToJson(request);
            GetOpenIdByCodeResponse response = new GetOpenIdByCodeResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、验证数据
            int stepNo = 1;
            this.ValidateGetOpenIdByCode(stepNo, request, response);


            //2、以获取集合获取键值配置集合
            List<string> nameList = new List<string>() { "WxMini_AppId", "WxMini_Secret" };

            stepNo += 1;
            var dictionaryConfigList = GetDictionaryConfigListByNames(stepNo, nameList, response);

            //3、通过微信小程序获取微信用户openid
            stepNo += 1;
            GetOpenIdByCode(stepNo, dictionaryConfigList, request.Code, response);

            //4、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<GetOpenIdByCodeResponse>(title, "GetOpenIdByCode", requestContent, response);
        }

        /// <summary>
        /// 微信用户授权登录
        /// </summary>
        public AuthLoginResponse AuthLogin(AuthLoginRequest request)
        {
            string title = "通过微信小程序获取微信用户openid";
            string requestContent = Utility.Common.ToJson(request);
            AuthLoginResponse response = new AuthLoginResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);


            //4、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<AuthLoginResponse>(title, "AuthLogin", requestContent, response);
        }
        /// <summary>
        /// 通过微信小程序获取微信用户openid
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="app"></param>
        /// <param name="serviceInterfaceList"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Service.UserManage.GetOpenIdByCodeResponse GetOpenIdByCode(int stepNo, List<Entity.Domain.DictionaryConfig> dictionaryConfigs, string code, GetOpenIdByCodeResponse response)
        {
            Func<Entity.Service.UserManage.GetOpenIdByCodeResponse> execStep = () =>
            {
                var serviceResponse = _UserManage.GetOpenIdByCode(dictionaryConfigs, code);

                this.SetServiceFailedResponse(serviceResponse, response);

                response.openid = serviceResponse.openid;
                response.session_key = serviceResponse.session_key;

                return serviceResponse;
            };

            return this.GetEntityData<Entity.Service.UserManage.GetOpenIdByCodeResponse>(stepNo, "通过微信小程序获取微信用户openid", "GetOpenIdByCode", response, execStep);
        }

        /// <summary>
        /// 验证数据
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool ValidateGetWxUser(int stepNo, GetWxUserRequest request, GetWxUserResponse response)
        {
            Func<bool> execStep = () =>
            {
                if (string.IsNullOrEmpty(request.Code))
                {
                    this.SetValidateMessageRepsonse("Code不能为空", response);
                }

                return response.Ack.IsSuccess;
            };

            return this.ExecValidate(stepNo, "验证数据", "ValidateGetWxUser", response, execStep);
        }

        /// <summary>
        /// 获取微信用户
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="getAccessTokenResponse"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Service.UserManage.GetUserInfoResponse GetWxUser(int stepNo, Entity.Service.BasicSupport.GetWebAccessTokenResponse getAccessTokenResponse, GetWxUserResponse response)
        {
            Func<Entity.Service.UserManage.GetUserInfoResponse> execStep = () =>
            {

                var serviceResponse = _UserManage.GetUserInfo(getAccessTokenResponse.Access_Token, getAccessTokenResponse.OpenId);

                this.SetServiceFailedResponse(serviceResponse, response);

                if (response.Ack.IsSuccess)
                {
                    response.Data = new Entity.Application.WxUser.WxUser()
                    {
                        nickname = serviceResponse.NickName,
                        openid = serviceResponse.OpenId,
                        city = serviceResponse.City,
                        headimgurl = serviceResponse.HeadImgUrl,
                        province = serviceResponse.Province,
                        sex = serviceResponse.Sex
                    };
                }

                return serviceResponse;
            };

            return this.GetEntityData<Entity.Service.UserManage.GetUserInfoResponse>(stepNo, "获取微信用户", "GetWxUser", response, execStep);
        }

        /// <summary>
        /// 验证数据
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool ValidateGetOpenIdByCode(int stepNo, GetOpenIdByCodeRequest request, GetOpenIdByCodeResponse response)
        {
            Func<bool> execStep = () =>
            {
                if (string.IsNullOrEmpty(request.Code))
                {
                    this.SetValidateMessageRepsonse("Code不能为空", response);
                }

                return response.Ack.IsSuccess;
            };

            return this.ExecValidate(stepNo, "验证数据", "ValidateGetOpenIdByCode", response, execStep);
        }

        /// <summary>
        /// 获取类型名称集合键值配置
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="nameList"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private List<Entity.Domain.DictionaryConfig> GetDictionaryConfigListByNames(int stepNo, List<string> nameList, IResponse response)
        {
            Func<List<Entity.Domain.DictionaryConfig>> execStep = () =>
            {
                return _DictionaryConfig.GetDictionaryConfigListByNames(nameList);
            };

            return this.GetEntityDataList<Entity.Domain.DictionaryConfig>(stepNo, "获取类型名称集合键值配置", "GetDictionaryConfigListByNames", response, execStep);
        }

        /// <summary>
        /// 获取Access Token
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="app"></param>
        /// <param name="serviceInterfaceList"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Service.BasicSupport.GetWebAccessTokenResponse GetAccessToken(int stepNo, List<Entity.Domain.DictionaryConfig> dictionaryConfigs, string code, IResponse response)
        {
            Func<Entity.Service.BasicSupport.GetWebAccessTokenResponse> execStep = () =>
            {
                var serviceResponse = _BasicSupport.GetWebAccessToken(dictionaryConfigs, code);

                this.SetServiceFailedResponse(serviceResponse, response);
                return serviceResponse;
            };

            return this.GetEntityData<Entity.Service.BasicSupport.GetWebAccessTokenResponse>(stepNo, "获取Access Token", "GetAccessToken", response, execStep);
        }
    }
}
