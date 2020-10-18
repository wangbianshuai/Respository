using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Marriage.Domain.Impl
{
    /// <summary>
    /// 用户管理
    /// </summary>
    public class UserManage : IUserManage
    {
        public Service.IUserManage _UserManage { get; set; }

        /// <summary>
        /// 获取用户列表
        /// </summary>
        /// <param name="accessToken"></param>
        /// <param name="adminUserId"></param>
        /// <param name="serviceInterface"></param>
        public Entity.Service.UserManage.GetUserListResponse GetUserList(string accessToken, Entity.Domain.ServiceInterface serviceInterface)
        {
            //获取用户列表
            List<Entity.Service.UserManage.GetUserListResponse> responseList = new List<Entity.Service.UserManage.GetUserListResponse>();
            GetUserList(responseList, accessToken, string.Empty, serviceInterface.Url);
            var response = responseList.Where(w => w.ErrCode != 0).FirstOrDefault();
            if (response != null) return response;

            response = responseList[0];

            for (int i = 0; i < responseList.Count; i++)
            {
                if (i > 0) response.Data.OpenId.AddRange(responseList[i].Data.OpenId);
            }

            return response;
        }

        /// <summary>
        /// 批量获取用户基本信息
        /// </summary>
        /// <param name="openIdList"></param>
        /// <param name="accessToken"></param>
        /// <param name="serviceInterface"></param>
        /// <returns></returns>
        public Entity.Service.UserManage.BatchGetUserInfoResponse BatchGetUserInfo(List<string> openIdList, string accessToken, Entity.Domain.ServiceInterface serviceInterface)
        {
            List<List<string>> batchList = Utility.Common.ListToBatchList<string>(openIdList, 100);

            List<Entity.Service.UserManage.BatchGetUserInfoResponse> responseList = new List<Entity.Service.UserManage.BatchGetUserInfoResponse>();

            ParallelOptions po = new ParallelOptions();
            po.MaxDegreeOfParallelism = 3;

            Parallel.ForEach(batchList, po, (list) =>
            {
                this.BatchGetUserInfo(responseList, list, accessToken, serviceInterface.Url);
            });

            var response = responseList.Where(w => w.ErrCode != 0).FirstOrDefault();
            if (response != null) return response;

            response = responseList[0];

            for (int i = 0; i < responseList.Count; i++)
            {
                if (i > 0) response.User_Info_List.AddRange(responseList[i].User_Info_List);
            }

            return response;
        }

        void BatchGetUserInfo(List<Entity.Service.UserManage.BatchGetUserInfoResponse> responseList, List<string> openIdList, string accessToken, string url)
        {
            responseList.Add(_UserManage.BatchGetUserInfo(new Entity.Service.UserManage.BatchGetUserInfoRequest()
            {
                AccessToken = accessToken,
                user_list = (from a in openIdList
                             select new Entity.Service.UserManage.UserList()
                             {
                                 openid = a
                             }).ToList(),
                Url = url
            }));
        }

        /// <summary>
        /// 获取用户列表
        /// </summary>
        /// <param name="responseList"></param>
        /// <param name="accessToken"></param>
        /// <param name="nextOpenId"></param>
        /// <param name="url"></param>
        void GetUserList(List<Entity.Service.UserManage.GetUserListResponse> responseList, string accessToken, string nextOpenId, string url)
        {
            Entity.Service.UserManage.GetUserListResponse response = _UserManage.GetUserList(new Entity.Service.UserManage.GetUserListRequest()
            {
                AccessToken = accessToken,
                NextOpenId = nextOpenId,
                Url = url
            });

            int totalCount = responseList.Sum(s => s.Count) + response.Count;

            ///当公众号关注者数量超过10000时，可通过填写next_openid的值，从而多次拉取列表的方式来满足需求。
            if (response.ErrCode == 0 && totalCount < response.Total && !string.IsNullOrEmpty(response.Next_OpenId))
            {
                GetUserList(responseList, accessToken, response.Next_OpenId, url);
            }

            responseList.Add(response);
        }
    }
}
