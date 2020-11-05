using Marriage.Entity.Application;
using Marriage.Entity.Application.MarriageUser;
using Marriage.Entity.Application.WxUser;
using OpenDataAccessCore.Utility;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Application.Impl
{
    /// <summary>
    /// 相亲人员
    /// </summary>
    public class MarriageUser : BaseAction, IMarriageUser
    {
        public Domain.IMarriageUser _MarriageUser { get; set; }

        /// <summary>
        /// 以微信OpenId获取用户
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>

        public GetUserByOpenIdResponse GetUserByOpenId(GetUserByOpenIdRequest request)
        {
            string title = "以微信OpenId获取用户";
            string requestContent = Utility.Common.ToJson(request);
            GetUserByOpenIdResponse response = new GetUserByOpenIdResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、验证数据
            int stepNo = 1;
            this.ValidateGetUserByOpenId(stepNo, request, response);

            //2、以微信OpenId获取用户
            stepNo += 1;
            GetUserByOpenId(stepNo, request, response);

            //3、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<GetUserByOpenIdResponse>(title, "GetUserByOpenId", requestContent, response);
        }

        /// <summary>
        /// 以微信OpenId获取用户
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="getAccessTokenResponse"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.MarriageUser GetUserByOpenId(int stepNo, GetUserByOpenIdRequest request, GetUserByOpenIdResponse response)
        {
            Func<Entity.Domain.MarriageUser> execStep = () =>
            {

                var entity = _MarriageUser.GetUserByOpenId(request.OpenId);

                if (entity != null)
                {
                    response.Data = new UserInfo()
                    {
                        Address = entity.Address,
                        City = entity.City,
                        HeadImgUrl = entity.HeadImgUrl,
                        IdCard = entity.IdCard,
                        Name = entity.Name,
                        NickName = entity.NickName,
                        OpenId = entity.OpenId,
                        Phone = entity.Phone,
                        Province = entity.Province,
                        Sex = entity.Sex,
                        UserId = entity.UserId
                    };

                    response.Token = entity.UserId.ToString();
                }

                return entity;
            };

            return this.GetEntityData<Entity.Domain.MarriageUser>(stepNo, "以微信OpenId获取用户", "GetUserByOpenId", response, execStep, false);
        }

        /// <summary>
        /// 验证数据
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool ValidateGetUserByOpenId(int stepNo, GetUserByOpenIdRequest request, GetUserByOpenIdResponse response)
        {
            Func<bool> execStep = () =>
            {
                if (string.IsNullOrEmpty(request.OpenId))
                {
                    this.SetValidateMessageRepsonse("OpenId不能为空", response);
                }

                return response.Ack.IsSuccess;
            };

            return this.ExecValidate(stepNo, "验证数据", "ValidateGetUserByOpenId", response, execStep);
        }
    }
}
