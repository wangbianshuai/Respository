using Marriage.Entity.Service.UserManage;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;

namespace Marriage.Service.Impl
{
    /// <summary>
    /// 用户管理
    /// </summary>
    public class UserManage : BaseService, IUserManage
    {
        /// <summary>
        /// 获取用户列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public GetUserListResponse GetUserList(GetUserListRequest request)
        {
            Dictionary<string, string> dict = new Dictionary<string, string>();
            dict.Add("access_token", request.AccessToken);
            dict.Add("next_openid", request.NextOpenId);

            string url = string.Format("{0}?{1}", request.Url, new FormUrlEncodedContent(dict).ReadAsStringAsync().Result);
            return this.GetRequest2<GetUserListResponse>(url);
        }

        /// <summary>
        /// 批量获取用户基本信息
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public BatchGetUserInfoResponse BatchGetUserInfo(BatchGetUserInfoRequest request)
        {
            Dictionary<string, string> dict = new Dictionary<string, string>();
            dict.Add("access_token", request.AccessToken);

            Dictionary<string, object> entity = new Dictionary<string, object>();
            entity.Add("user_list", request.user_list);

            string url = string.Format("{0}?{1}", request.Url, new FormUrlEncodedContent(dict).ReadAsStringAsync().Result);
            return this.PostRequest<BatchGetUserInfoResponse>(url, entity);
        }
    }
}
