using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using WindowsFramework.Entity.Action;
using WindowsFramework.Utility;

namespace WindowsFramework.Action.Impl
{
    public class User: BaseAction,IUser
    {
        Domain.IUser _user;

        public User()
        {
            _user = new Domain.Impl.User();
            this.Name = "User";
        }

        /// <summary>
        /// 登录
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public Entity.Action.User.LoginResponse Login(Entity.Action.User.LoginRequest request)
        {
            string title = "登录";
            string requestContent = Common.ToJson(request);
            Entity.Action.User.LoginResponse response = new Entity.Action.User.LoginResponse();
            Dictionary<string, object> dict = new Dictionary<string, object>();

            this.InitMessage();

            if (!this.IsNullRequest(request, response))
            {
                return this.SetReturnResponse<Entity.Action.User.LoginResponse>(title, requestContent, response);
            }

            //1、获取投资申请信息
            int stepNo = 1;
            this.Login(stepNo, request, response);

            //3、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<Entity.Action.User.LoginResponse>(title, requestContent, response, dict);
        }

        /// <summary>
        /// 登录
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="id"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Service.User.LoginResponse Login(int stepNo, Entity.Action.User.LoginRequest request,  Entity.Action.User.LoginResponse response)
        {
            Func<Entity.Service.User.LoginResponse> execStep = () =>
            {
                Entity.Service.User.LoginResponse serviceResponse = _user.Login(request);

                if (serviceResponse.Result)
                {
                    response.LoginName = serviceResponse.LoginName;
                    response.UserId = serviceResponse.UserId;
                    response.UserName = serviceResponse.UserName;
                }
                else
                {
                    this.SetValidateMessageRepsonse(serviceResponse.Message, response);
                }

                return serviceResponse;
            };

            return this.GetEntityData<Entity.Service.User.LoginResponse>(stepNo, "登录", "Login", response, execStep);
        }
    }
}
