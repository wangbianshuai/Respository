using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Service.UserManage
{
    /// <summary>
    /// 获取用户列表请求
    /// </summary>
    public class GetUserListRequest : Request, IRequest
    {
        /// <summary>
        /// 第一个拉取的OPENID，不填默认从头开始拉取
        /// </summary>
        public string NextOpenId { get; set; }
    }

    /// <summary>
    /// 获取用户列表响应
    /// </summary>
    public class GetUserListResponse: Response, IResponse
    {
        /// <summary>
        /// 关注该公众账号的总用户数
        /// </summary>
        public int Total { get; set; }
        /// <summary>
        /// 拉取的OPENID个数，最大值为10000
        /// </summary>
        public int Count { get; set; }
        /// <summary>
        /// 列表数据，OPENID的列表
        /// </summary>
        public UserListData Data { get; set; }
        /// <summary>
        /// 拉取列表的最后一个用户的OPENID
        /// </summary>
        public string Next_OpenId { get; set; }
    }

    /// <summary>
    /// 用户列表数据
    /// </summary>
    public class UserListData
    {
        /// <summary>
        /// OPENID的列表
        /// </summary>
        public List<string> OpenId { get;set; }
    }
}
