using Marriage.Entity.Application;
using Marriage.Entity.Application.MarriageUser;
using Marriage.Entity.Application.WxUser;
using OpenDataAccessCore.Utility;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;

namespace Marriage.Application.Impl
{
    /// <summary>
    /// 相亲人员
    /// </summary>
    public class MarriageUser : BaseAction, IMarriageUser
    {
        public Domain.IMarriageUser _MarriageUser { get; set; }

        public Domain.IDictionaryConfig _DictionaryConfig { get; set; }

        public Domain.IUserConditionType _UserConditionType { get; set; }

        public Domain.IConditionType _ConditionType { get; set; }

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
        /// 注册
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public RegisterResponse Register(RegisterRequest request)
        {
            string title = "注册";
            string requestContent = Utility.Common.ToJson(request);
            RegisterResponse response = new RegisterResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、验证数据
            int stepNo = 1;
            this.ValidateRegister(stepNo, request, response);

            //2、以获取集合获取键值配置集合
            List<string> nameList = new List<string>() { "DefaultMatchmakerId" };

            stepNo += 1;
            var dictionaryConfigList = GetDictionaryConfigListByNames(stepNo, nameList, response);

            //2、创建相亲用户
            stepNo += 1;
            CreateMarriageUser(stepNo, dictionaryConfigList, request, response);

            //2、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<RegisterResponse>(title, "Register", requestContent, response);
        }

        /// <summary>
        /// 获取用户信息
        /// </summary>
        public GetUserInfoResponse GetUserInfo(GetUserInfoRequest request)
        {
            string title = "获取用户信息";
            string requestContent = Utility.Common.ToJson(request);
            GetUserInfoResponse response = new GetUserInfoResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、获取用户信息
            int stepNo = 1;
            GetUserInfoById(stepNo, request, response);

            //2、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<GetUserInfoResponse>(title, "GetUserInfo", requestContent, response);
        }

        /// <summary>
        /// 获取用户信息
        /// </summary>
        public GetUserResponse GetUser(GetUserRequest request)
        {
            string title = "获取用户信息";
            string requestContent = Utility.Common.ToJson(request);
            GetUserResponse response = new GetUserResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、获取用户信息
            int stepNo = 1;
            GetUserById(stepNo, request, response);

            //2、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<GetUserResponse>(title, "GetUser", requestContent, response);
        }

        /// <summary>
        /// 获取用户条件类型列表
        /// </summary>
        public GetUserConditionTypesResponse GetUserConditionTypes(GetUserConditionTypesRequest request)
        {
            string title = "获取用户条件类型列表";
            string requestContent = Utility.Common.ToJson(request);
            GetUserConditionTypesResponse response = new GetUserConditionTypesResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、获取用户信息
            int stepNo = 1;
            var user = GetUserInfoById(stepNo, request.LoginUserId, response);

            //2、获取用户条件类型列表
            stepNo += 1;
            GetUserConditionTypes(stepNo, user, request, response);

            //2、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<GetUserConditionTypesResponse>(title, "GetUserConditionTypes", requestContent, response);
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

        /// <summary>
        /// 更新用户信息
        /// </summary>
        public UpdateUserInfoResponse UpdateUserInfo(UpdateUserInfoRequest request)
        {
            string title = "更新用户信息";
            string requestContent = Utility.Common.ToJson(request);
            UpdateUserInfoResponse response = new UpdateUserInfoResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、验证数据
            int stepNo = 1;
            this.ValidateUpdateUserInfo(stepNo, request, response);

            //2、更新用户信息
            stepNo += 1;
            UpdateUserInfo(stepNo, request, response);

            //2、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<UpdateUserInfoResponse>(title, "Register", requestContent, response);
        }


        /// <summary>
        /// 获取用户条件类型
        /// </summary>
        public GetUserConditionTypeResponse GetUserConditionType(GetUserConditionTypeRequest request)
        {
            string title = "获取用户条件类型";
            string requestContent = Utility.Common.ToJson(request);
            GetUserConditionTypeResponse response = new GetUserConditionTypeResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、获取用户信息
            int stepNo = 1;
            var user = GetUserInfoById(stepNo, request.LoginUserId, response);

            //2、获取条件类型
            stepNo += 1;
            GetConditionType(stepNo, request, response);

            //3、获取用户条件类型
            stepNo += 1;
            GetUserConditionType(stepNo, user, request, response);

            //4、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<GetUserConditionTypeResponse>(title, "GetUserConditionType", requestContent, response);
        }

        /// <summary>
        /// 获取条件类型
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="user"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.ConditionType GetConditionType(int stepNo, GetUserConditionTypeRequest request, GetUserConditionTypeResponse response)
        {
            Func<Entity.Domain.ConditionType> execStep = () =>
            {
                return _ConditionType.GetConditionTypeById(request.ConditionTypeId);
            };

            return this.GetEntityData<Entity.Domain.ConditionType>(stepNo, "获取条件类型", "GetConditionType", response, execStep);
        }

        /// <summary>
        /// 获取用户条件类型
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="user"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.UserConditionType GetUserConditionType(int stepNo, Entity.Domain.MarriageUser user, GetUserConditionTypeRequest request, GetUserConditionTypeResponse response)
        {
            Func<Entity.Domain.UserConditionType> execStep = () =>
            {
                var entity = _UserConditionType.GetUserConditionTypeById(request.ConditionTypeId, request.UserConditionTypeId, user.Sex, request.SelectType);

                if (entity != null)
                {
                    response.ConditionTypeId = entity.ConditionTypeId;
                    response.IsPublic = entity.IsPublic;
                    response.UserConditionTypeId = entity.UserConditionTypeId;
                    if (entity.Items != null)
                    {
                        response.Items = (from a in entity.Items
                                          select new ConditionItem()
                                          {
                                              DataSourceItems = GetDataSourceItems(a.DataSourceItems),
                                              DataType = a.DataType,
                                              DisplayIndex = a.DisplayIndex,
                                              IsInterval = a.IsInterval,
                                              IsSingle = a.IsSingle,
                                              ItemId = a.ItemId,
                                              Title = a.Title,
                                              Value = a.Value
                                          }).ToList();
                    }
                }
                return entity;
            };

            return this.GetEntityData<Entity.Domain.UserConditionType>(stepNo, "获取用户条件类型", "GetUserConditionType", response, execStep);
        }

        List<DataSourceItem> GetDataSourceItems(List<Entity.Domain.DataSourceItem> items)
        {
            if (items == null || items.Count == 0) return null;

            return (from a in items
                    select new DataSourceItem()
                    {
                        text = a.Name,
                        value = a.Value
                    }).ToList();
        }

        /// <summary>
        /// 获取用户条件类型列表
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="user"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private List<Entity.Domain.ViewUserConditionType> GetUserConditionTypes(int stepNo, Entity.Domain.MarriageUser user, GetUserConditionTypesRequest request, GetUserConditionTypesResponse response)
        {
            Func<List<Entity.Domain.ViewUserConditionType>> execStep = () =>
            {

                var list = _UserConditionType.GetUserConditionTypeList(Guid.Parse(request.LoginUserId), request.SelectType);

                response.DataList = (from a in list
                                     select new UserConditionType()
                                     {
                                         ConditionTypeId = a.ConditionTypeId,
                                         ConditionTypeName = a.ConditionTypeName,
                                         Percentage = request.SelectType == 1 ? string.Format("完善：{0}%", user.Sex == 1 ? a.ManPercentage : a.WomanPercentage) : string.Empty,
                                         UserConditionTypeId = a.UserConditionTypeId,
                                         UserItemCount = request.SelectType == 2 ? string.Format("选择：{0}/{1}", a.UserItemCount, user.Sex == 1 ? a.ManItemCount : a.WomanItemCount) : string.Empty
                                     }).ToList();

                return list;
            };

            return this.GetEntityDataList<Entity.Domain.ViewUserConditionType>(stepNo, "获取用户条件类型列表", "GetUserConditionTypes", response, execStep);
        }

        /// <summary>
        /// 以主键获取用户信息
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.MarriageUser GetUserById(int stepNo, GetUserRequest request, GetUserResponse response)
        {
            Func<Entity.Domain.MarriageUser> execStep = () =>
            {

                var entity = _MarriageUser.GetUserInfoById(Guid.Parse(request.LoginUserId));

                if (entity != null)
                {
                    response.UserInfo = new UserInfo2()
                    {
                        HeadImgUrl = entity.HeadImgUrl,
                        NickName = entity.NickName,
                        Phone = entity.Phone
                    };

                    response.StatusInfo = new StatusInfo()
                    {
                        NoPassReason = entity.NoPassReason,
                        Status = entity.Status
                    };
                }
                else response.Token = "null";

                return entity;
            };

            return this.GetEntityData<Entity.Domain.MarriageUser>(stepNo, "获取用户信息", "GetUserInfoById", response, execStep);
        }

        /// <summary>
        /// 以主键获取用户信息
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.MarriageUser GetUserInfoById(int stepNo, GetUserInfoRequest request, GetUserInfoResponse response)
        {
            Func<Entity.Domain.MarriageUser> execStep = () =>
            {

                var entity = _MarriageUser.GetUserInfoById(Guid.Parse(request.LoginUserId));

                if (entity != null)
                {
                    response.UserInfo = new UserInfo()
                    {
                        Address = entity.Address,
                        Birthday = entity.Birthday.ToString("yyyy-MM-dd"),
                        BirthEight = entity.BirthEight,
                        BirthTime = entity.BirthTime,
                        City = entity.City,
                        HeadImgUrl = entity.HeadImgUrl,
                        IdCard = entity.IdCard,
                        IsPublic = entity.IsPublic,
                        LunarBirthday = entity.LunarBirthday,
                        MatchmakerId = entity.MatchmakerId,
                        Name = entity.Name,
                        NickName = entity.NickName,
                        NoPassReason = entity.NoPassReason,
                        NowAddress = entity.NowAddress,
                        OpenId = entity.OpenId,
                        Phone = entity.Phone,
                        Province = entity.Province,
                        Remark = entity.Remark,
                        Sex = entity.Sex,
                        Status = entity.Status,
                        UserId = entity.UserId
                    };
                }
                else response.Token = "null";

                return entity;
            };

            return this.GetEntityData<Entity.Domain.MarriageUser>(stepNo, "以主键获取用户信息", "GetUserInfoById", response, execStep);
        }

        /// <summary>
        /// 创建相亲用户
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="dictionaryConfigList"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool CreateMarriageUser(int stepNo, List<Entity.Domain.DictionaryConfig> dictionaryConfigList, RegisterRequest request, RegisterResponse response)
        {
            Func<bool> execStep = () =>
            {
                Entity.Domain.MarriageUser entity = new Entity.Domain.MarriageUser();


                entity.Address = request.Address;
                entity.Birthday = request.Birthday;
                entity.BirthEight = request.BirthEight;
                entity.BirthTime = request.BirthTime;
                entity.City = request.City;
                entity.HeadImgUrl = request.HeadImgUrl;
                entity.IdCard = request.IdCard;
                entity.IsPublic = request.IsPublic;
                entity.LunarBirthday = request.LunarBirthday;
                entity.MatchmakerId = request.MatchmakerId;
                entity.Name = request.Name;
                entity.NickName = request.NickName;
                entity.NowAddress = request.NowAddress;
                entity.OpenId = request.OpenId;
                entity.Phone = request.Phone;
                entity.Province = request.Province;
                entity.Remark = request.Remark;
                entity.UserId = Guid.NewGuid();

                entity.Sex = (byte)(int.Parse(entity.IdCard.Substring(16, 1)) % 2 == 0 ? 2 : 1);
                if (entity.MatchmakerId == Guid.Empty)
                {
                    entity.MatchmakerId = new Guid(dictionaryConfigList[0].Value);
                }

                var id = _MarriageUser.CreateMarriageUser(entity);
                if (id != Guid.Empty)
                {
                    response.Token = entity.UserId.ToString();
                }

                return id != Guid.Empty;
            };

            return this.InsertEntityData(stepNo, "创建相亲用户", "CreateMarriageUser", response, execStep);
        }

        /// <summary>
        /// 更新用户信息
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool UpdateUserInfo(int stepNo, UpdateUserInfoRequest request, UpdateUserInfoResponse response)
        {
            Func<bool> execStep = () =>
            {
                Entity.Domain.MarriageUser entity = new Entity.Domain.MarriageUser();

                entity.Address = request.Address;
                entity.Birthday = request.Birthday;
                entity.BirthEight = request.BirthEight;
                entity.BirthTime = request.BirthTime;
                entity.City = request.City;
                entity.HeadImgUrl = request.HeadImgUrl;
                entity.IdCard = request.IdCard;
                entity.IsPublic = request.IsPublic;
                entity.LunarBirthday = request.LunarBirthday;
                entity.Name = request.Name;
                entity.NickName = request.NickName;
                entity.NowAddress = request.NowAddress;
                entity.Phone = request.Phone;
                entity.Province = request.Province;
                entity.Remark = request.Remark;
                entity.UserId = Guid.Parse(request.LoginUserId);

                entity.Sex = (byte)(int.Parse(entity.IdCard.Substring(16, 1)) % 2 == 0 ? 2 : 1);

                return _MarriageUser.UpdateMarriageUser(entity);
            };

            return this.UpdateEntityData(stepNo, "更新用户信息", "UpdateUserInfo", response, execStep);
        }
        
        /// <summary>
        /// 验证数据
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool ValidateRegister(int stepNo, RegisterRequest request, RegisterResponse response)
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
                else if (request.Birthday == DateTime.MinValue) this.SetValidateMessageRepsonse("公历生日不能为空", response);

                return response.Ack.IsSuccess;
            };

            return this.ExecValidate(stepNo, "验证数据", "ValidateRegister", response, execStep);
        }

        /// <summary>
        /// 更新用户信息
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool ValidateUpdateUserInfo(int stepNo, UpdateUserInfoRequest request, UpdateUserInfoResponse response)
        {
            Func<bool> execStep = () =>
            {
                if (string.IsNullOrEmpty(request.Name)) this.SetValidateMessageRepsonse("姓名不能为空", response);
                else if (string.IsNullOrEmpty(request.NickName)) this.SetValidateMessageRepsonse("昵称不能为空", response);
                else if (string.IsNullOrEmpty(request.HeadImgUrl)) this.SetValidateMessageRepsonse("头像不能为空", response);
                else if (string.IsNullOrEmpty(request.IdCard)) this.SetValidateMessageRepsonse("身份证号不能为空", response);
                else if (string.IsNullOrEmpty(request.Phone)) this.SetValidateMessageRepsonse("手机号码不能为空", response);
                else if (string.IsNullOrEmpty(request.Address)) this.SetValidateMessageRepsonse("家庭地址不能为空", response);
                else if (request.Birthday == DateTime.MinValue) this.SetValidateMessageRepsonse("公历生日不能为空", response);

                return response.Ack.IsSuccess;
            };

            return this.ExecValidate(stepNo, "验证数据", "ValidateUpdateUserInfo", response, execStep);
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
    }
}
