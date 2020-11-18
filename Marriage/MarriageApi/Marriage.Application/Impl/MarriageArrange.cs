using Marriage.Entity.Application;
using Marriage.Entity.Application.MarriageArrange;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Marriage.Application.Impl
{
    /// <summary>
    /// 相亲安排
    /// </summary>
    public class MarriageArrange : BaseAction, IMarriageArrange
    {
        public Domain.IMarriageUser _MarriageUser { get; set; }
        public Domain.IMarriageArrange _MarriageArrange { get; set; }

        /// <summary>
        /// 查询相亲安排
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public QueryMarriageArrangeResponse QueryMarriageArrange(QueryMarriageArrangeRequest request)
        {
            string title = "查询相亲安排";
            string requestContent = Utility.Common.ToJson(request);
            QueryMarriageArrangeResponse response = new QueryMarriageArrangeResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、获取用户信息
            int stepNo = 1;
            Entity.Domain.MarriageUser user = this.GetUserInfoById(stepNo, request.LoginUserId, response);

            //2、查询相亲安排
            stepNo += 1;
            QueryMarriageArrange(stepNo, user, request, response);

            //3、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<QueryMarriageArrangeResponse>(title, "QueryMarriageArrange", requestContent, response);
        }

        /// <summary>
        /// 查询相亲安排
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="user"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private List<Entity.Domain.MarriageArrangeUser> QueryMarriageArrange(int stepNo, Entity.Domain.MarriageUser user, QueryMarriageArrangeRequest request, QueryMarriageArrangeResponse response)
        {
            if (user == null) return null;

            Func<List<Entity.Domain.MarriageArrangeUser>> execStep = () =>
            {
                List<Entity.Domain.MarriageArrangeUser> dataList = null;

                if (request.PageIndex > 0 && request.PageSize > 0)
                {
                    Parallel.Invoke(() =>
                    {
                        dataList = _MarriageArrange.QueryMarriageArrangeDataList(request, user.Sex);
                    },
                    () =>
                    {
                        response.PageInfo = _MarriageArrange.QueryMarriageArrangePageInfo(request, user.Sex);
                    });
                }
                else dataList = _MarriageArrange.QueryMarriageArrangeDataList(request, user.Sex);

                if (dataList != null) response.DataList = (from a in dataList
                                                           select GetMarriageUser(a)).ToList();

                return dataList;
            };

            return this.GetEntityDataList<Entity.Domain.MarriageArrangeUser>(stepNo, "查询相亲安排", "QueryUsersByMatchmaker", response, execStep, false);
        }

        MarriageArrangeUser GetMarriageUser(Entity.Domain.MarriageArrangeUser user)
        {
            return new MarriageArrangeUser()
            {
                Age = user.Age,
                HeadImgUrl = user.HeadImgUrl,
                NickName = user.NickName,
                Remark = user.Remark,
                UserId = user.UserId
            };
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
                var entity = _MarriageUser.GetUserInfoById(Guid.Parse(userId));

                if (entity.Status != 1) return null;
                return entity;
            };

            return this.GetEntityData<Entity.Domain.MarriageUser>(stepNo, "以主键获取用户信息", "GetUserInfoById", response, execStep, false);
        }
    }
}
