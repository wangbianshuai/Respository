using Marriage.Entity.Application;
using Marriage.Entity.Application.WxUser;
using OpenDataAccessCore.Utility;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Application.Impl
{
    /// <summary>
    /// 微信用户
    /// </summary>
    public class WxUser : BaseAction, IWxUser
    {
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

            //2、获取微信用户
            stepNo += 1;
            GetWxUser(stepNo, request, response);
   
            //3、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<GetWxUserResponse>(title, "GetWxUser", requestContent, response);
        }

        /// <summary>
        /// 获取微信用户
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Application.WxUser.WxUser GetWxUser(int stepNo, GetWxUserRequest request, GetWxUserResponse response)
        {
            Func<Entity.Application.WxUser.WxUser> execStep = () =>
            {
                
                return null;
            };

            return this.GetEntityData<Entity.Application.WxUser.WxUser>(stepNo, "获取微信用户", "GetWxUser", response, execStep);
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
    }
}
