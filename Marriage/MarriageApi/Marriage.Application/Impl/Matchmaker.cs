using Marriage.Entity.Application;
using Marriage.Entity.Application.Matchmaker;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Application.Impl
{
    public class Matchmaker : BaseAction, IMatchmaker
    {
        public Domain.IMarriageUser _MarriageUser { get; set; }

        public Domain.IMatchmaker _Matchmaker { get; set; }

        /// <summary>
        /// 获取用户红娘
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public GetUserMatchmakerResponse GetUserMatchmaker(GetUserMatchmakerRequest request)
        {
            string title = "获取用户红娘";
            string requestContent = Utility.Common.ToJson(request);
            GetUserMatchmakerResponse response = new GetUserMatchmakerResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、获取用户信息
            int stepNo = 1;
            var user = GetUserInfoById(stepNo, request.LoginUserId, response);

            //2、获取用户红娘
            stepNo += 1;
            GetUserMatchmaker(stepNo, user, response);

            //2、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<GetUserMatchmakerResponse>(title, "GetUserInfo", requestContent, response);
        }

        /// <summary>
        /// 以微信OpenId获取红娘
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>

        public GetMatchmakerByOpenIdResponse GetMatchmakerByOpenId(GetMatchmakerByOpenIdRequest request)
        {
            string title = "以微信OpenId获取红娘";
            string requestContent = Utility.Common.ToJson(request);
            GetMatchmakerByOpenIdResponse response = new GetMatchmakerByOpenIdResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、验证数据
            int stepNo = 1;
            this.ValidateGetMatchmakerByOpenId(stepNo, request, response);

            //2、以微信OpenId获取红娘
            stepNo += 1;
            GetMatchmakerByOpenId(stepNo, request, response);

            //3、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<GetMatchmakerByOpenIdResponse>(title, "GetMatchmakerByOpenId", requestContent, response);
        }

        /// <summary>
        /// 注册
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public MatchmakerRegisterResponse Register(MatchmakerRegisterRequest request)
        {
            string title = "注册";
            string requestContent = Utility.Common.ToJson(request);
            MatchmakerRegisterResponse response = new MatchmakerRegisterResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、验证数据
            int stepNo = 1;
            this.ValidateRegister(stepNo, request, response);

            //2、创建红娘
            stepNo += 1;
            CreateMatchmaker(stepNo, request, response);

            //2、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<MatchmakerRegisterResponse>(title, "Register", requestContent, response);
        }

        /// <summary>
        /// 获取红娘信息
        /// </summary>
        public GetMatchmakerInfoResponse GetMatchmakerInfo(GetMatchmakerInfoRequest request)
        {
            string title = "获取红娘信息";
            string requestContent = Utility.Common.ToJson(request);
            GetMatchmakerInfoResponse response = new GetMatchmakerInfoResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、获取红娘信息
            int stepNo = 1;
            GetMatchmakerInfoById(stepNo, request, response);

            //2、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<GetMatchmakerInfoResponse>(title, "GetMatchmakerInfo", requestContent, response);
        }

        /// <summary>
        /// 获取红娘信息
        /// </summary>
        public GetMatchmakerResponse GetMatchmaker(GetMatchmakerRequest request)
        {
            string title = "获取红娘信息";
            string requestContent = Utility.Common.ToJson(request);
            GetMatchmakerResponse response = new GetMatchmakerResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、获取红娘信息
            int stepNo = 1;
            GetMatchmakerById(stepNo, request, response);

            //2、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<GetMatchmakerResponse>(title, "GetMatchmaker", requestContent, response);
        }

 

        /// <summary>
        /// 以主键获取红娘信息
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.Matchmaker GetMatchmakerInfoById(int stepNo, string userId, IResponse response)
        {
            Func<Entity.Domain.Matchmaker> execStep = () =>
            {
                return _Matchmaker.GetMatchmakerById(Guid.Parse(userId));
            };

            return this.GetEntityData<Entity.Domain.Matchmaker>(stepNo, "以主键获取红娘信息", "GetMatchmakerInfoById", response, execStep);
        }

        /// <summary>
        /// 更新红娘信息
        /// </summary>
        public UpdateMatchmakerInfoResponse UpdateMatchmakerInfo(UpdateMatchmakerInfoRequest request)
        {
            string title = "更新红娘信息";
            string requestContent = Utility.Common.ToJson(request);
            UpdateMatchmakerInfoResponse response = new UpdateMatchmakerInfoResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、验证数据
            int stepNo = 1;
            this.ValidateUpdateMatchmakerInfo(stepNo, request, response);

            //2、更新红娘信息
            stepNo += 1;
            UpdateMatchmakerInfo(stepNo, request, response);

            //2、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<UpdateMatchmakerInfoResponse>(title, "Register", requestContent, response);
        }

        /// <summary>
        /// 以主键获取红娘信息
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.Matchmaker GetMatchmakerById(int stepNo, GetMatchmakerRequest request, GetMatchmakerResponse response)
        {
            Func<Entity.Domain.Matchmaker> execStep = () =>
            {

                var entity = _Matchmaker.GetMatchmakerById(Guid.Parse(request.LoginUserId));

                if (entity != null)
                {
                    response.MatchmakerInfo = new MatchmakerInfo3()
                    {
                        HeadImgUrl = entity.HeadImgUrl,
                        NickName = entity.NickName,
                        Phone = entity.Phone
                    };

                    response.StatusInfo = new StatusInfo2()
                    {
                        NoPassReason = entity.NoPassReason,
                        Status = entity.Status
                    };
                }
                else response.Token = "null";

                return entity;
            };

            return this.GetEntityData<Entity.Domain.Matchmaker>(stepNo, "获取红娘信息", "GetMatchmakerInfoById", response, execStep);
        }

        /// <summary>
        /// 以主键获取红娘信息
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.Matchmaker GetMatchmakerInfoById(int stepNo, GetMatchmakerInfoRequest request, GetMatchmakerInfoResponse response)
        {
            Func<Entity.Domain.Matchmaker> execStep = () =>
            {

                var entity = _Matchmaker.GetMatchmakerById(Guid.Parse(request.LoginUserId));

                if (entity != null)
                {
                    response.MatchmakerInfo = new MatchmakerInfo()
                    {
                        Address = entity.Address,
                        City = entity.City,
                        HeadImgUrl = entity.HeadImgUrl,
                        IdCard = entity.IdCard,
                        MatchmakerId = entity.MatchmakerId,
                        Name = entity.Name,
                        NickName = entity.NickName,
                        OpenId = entity.OpenId,
                        Phone = entity.Phone,
                        Province = entity.Province,
                        Features = entity.Features,
                        Sex = entity.Sex
                    };
                }
                else response.Token = "null";

                return entity;
            };

            return this.GetEntityData<Entity.Domain.Matchmaker>(stepNo, "以主键获取红娘信息", "GetMatchmakerInfoById", response, execStep);
        }

        /// <summary>
        /// 创建红娘
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool CreateMatchmaker(int stepNo, MatchmakerRegisterRequest request, MatchmakerRegisterResponse response)
        {
            Func<bool> execStep = () =>
            {
                Entity.Domain.Matchmaker entity = new Entity.Domain.Matchmaker();

                entity.Address = request.Address;
                entity.City = request.City;
                entity.HeadImgUrl = request.HeadImgUrl;
                entity.IdCard = request.IdCard;
                entity.Name = request.Name;
                entity.NickName = request.NickName;
                entity.OpenId = request.OpenId;
                entity.Phone = request.Phone;
                entity.Province = request.Province;
                entity.Features = request.Features;
                entity.MatchmakerId = Guid.NewGuid();

                entity.Sex = (byte)(int.Parse(entity.IdCard.Substring(16, 1)) % 2 == 0 ? 2 : 1);

                var id = _Matchmaker.CreateMatchmaker(entity);
                if (id != Guid.Empty)
                {
                    response.Token = entity.MatchmakerId.ToString();
                }

                return id != Guid.Empty;
            };

            return this.InsertEntityData(stepNo, "创建红娘", "CreateMatchmaker", response, execStep);
        }

        /// <summary>
        /// 更新红娘信息
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool UpdateMatchmakerInfo(int stepNo, UpdateMatchmakerInfoRequest request, UpdateMatchmakerInfoResponse response)
        {
            Func<bool> execStep = () =>
            {
                Entity.Domain.Matchmaker entity = new Entity.Domain.Matchmaker();

                entity.Address = request.Address;
                entity.City = request.City;
                entity.HeadImgUrl = request.HeadImgUrl;
                entity.IdCard = request.IdCard;;
                entity.Name = request.Name;
                entity.NickName = request.NickName;
                entity.Phone = request.Phone;
                entity.Province = request.Province;
                entity.Features = request.Features;
                entity.MatchmakerId = Guid.Parse(request.LoginUserId);

                entity.Sex = (byte)(int.Parse(entity.IdCard.Substring(16, 1)) % 2 == 0 ? 2 : 1);

                return _Matchmaker.UpdateMatchmaker(entity);
            };

            return this.UpdateEntityData(stepNo, "更新红娘信息", "UpdateMatchmakerInfo", response, execStep);
        }

        /// <summary>
        /// 验证数据
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool ValidateRegister(int stepNo, MatchmakerRegisterRequest request, MatchmakerRegisterResponse response)
        {
            Func<bool> execStep = () =>
            {
                if (string.IsNullOrEmpty(request.Name)) this.SetValidateMessageRepsonse("姓名不能为空", response);
                else if (string.IsNullOrEmpty(request.NickName)) this.SetValidateMessageRepsonse("昵称不能为空", response);
                else if (string.IsNullOrEmpty(request.HeadImgUrl)) this.SetValidateMessageRepsonse("头像不能为空", response);
                else if (string.IsNullOrEmpty(request.IdCard)) this.SetValidateMessageRepsonse("身份证号不能为空", response);
                else if (string.IsNullOrEmpty(request.Phone)) this.SetValidateMessageRepsonse("手机号码不能为空", response);
                else if (string.IsNullOrEmpty(request.Address)) this.SetValidateMessageRepsonse("家庭地址不能为空", response);
                else if (string.IsNullOrEmpty(request.OpenId)) this.SetValidateMessageRepsonse("请使用微信打开或微信扫码授权", response);

                return response.Ack.IsSuccess;
            };

            return this.ExecValidate(stepNo, "验证数据", "ValidateRegister", response, execStep);
        }

        /// <summary>
        /// 更新红娘信息
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool ValidateUpdateMatchmakerInfo(int stepNo, UpdateMatchmakerInfoRequest request, UpdateMatchmakerInfoResponse response)
        {
            Func<bool> execStep = () =>
            {
                if (string.IsNullOrEmpty(request.Name)) this.SetValidateMessageRepsonse("姓名不能为空", response);
                else if (string.IsNullOrEmpty(request.NickName)) this.SetValidateMessageRepsonse("昵称不能为空", response);
                else if (string.IsNullOrEmpty(request.HeadImgUrl)) this.SetValidateMessageRepsonse("头像不能为空", response);
                else if (string.IsNullOrEmpty(request.IdCard)) this.SetValidateMessageRepsonse("身份证号不能为空", response);
                else if (string.IsNullOrEmpty(request.Phone)) this.SetValidateMessageRepsonse("手机号码不能为空", response);
                else if (string.IsNullOrEmpty(request.Address)) this.SetValidateMessageRepsonse("家庭地址不能为空", response);
    
                return response.Ack.IsSuccess;
            };

            return this.ExecValidate(stepNo, "验证数据", "ValidateUpdateMatchmakerInfo", response, execStep);
        }

        /// <summary>
        /// 以微信OpenId获取红娘
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="getAccessTokenResponse"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.Matchmaker GetMatchmakerByOpenId(int stepNo, GetMatchmakerByOpenIdRequest request, GetMatchmakerByOpenIdResponse response)
        {
            Func<Entity.Domain.Matchmaker> execStep = () =>
            {

                var entity = _Matchmaker.GetMatchmakerByOpenId(request.OpenId);

                if (entity != null)
                {
                    response.Token = entity.MatchmakerId.ToString();
                }

                return entity;
            };

            return this.GetEntityData<Entity.Domain.Matchmaker>(stepNo, "以微信OpenId获取红娘", "GetMatchmakerByOpenId", response, execStep, false);
        }

        /// <summary>
        /// 验证数据
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool ValidateGetMatchmakerByOpenId(int stepNo, GetMatchmakerByOpenIdRequest request, GetMatchmakerByOpenIdResponse response)
        {
            Func<bool> execStep = () =>
            {
                if (string.IsNullOrEmpty(request.OpenId))
                {
                    this.SetValidateMessageRepsonse("OpenId不能为空", response);
                }

                return response.Ack.IsSuccess;
            };

            return this.ExecValidate(stepNo, "验证数据", "ValidateGetMatchmakerByOpenId", response, execStep);
        }

        /// <summary>
        /// 获取用户红娘
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="user"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.Matchmaker GetUserMatchmaker(int stepNo, Entity.Domain.MarriageUser user, GetUserMatchmakerResponse response)
        {
            Func<Entity.Domain.Matchmaker> execStep = () =>
            {

                var entity = _Matchmaker.GetMatchmakerById(user.MatchmakerId);

                if (entity != null)
                {
                    response.MatchmakerInfo = new MatchmakerInfo2()
                    {
                        HeadImgUrl = entity.HeadImgUrl,
                        NickName = entity.NickName,
                        Phone = entity.Phone,
                        Sex = entity.Sex
                    };

                    response.Address = entity.Address;
                    response.City = entity.City;
                    response.Features = entity.Features;
                    response.Name = entity.Name;
                    response.Province = entity.Province;
                    response.Remark = entity.Remark;
                }

                return entity;
            };

            return this.GetEntityData<Entity.Domain.Matchmaker>(stepNo, "获取用户红娘", "GetUserMatchmakers", response, execStep);
        }

        /// <summary>
        /// 以主键获取用户信息
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.MarriageUser GetUserInfoById(int stepNo, string userId, IResponse response)
        {
            Func<Entity.Domain.MarriageUser> execStep = () =>
            {
                return _MarriageUser.GetUserInfoById(Guid.Parse(userId));
            };

            return this.GetEntityData<Entity.Domain.MarriageUser>(stepNo, "以主键获取用户信息", "GetUserInfoById", response, execStep);
        }
    }
}
