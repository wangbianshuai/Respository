using Marriage.Entity.Application;
using Marriage.Entity.Application.MarriageFee;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Application.Impl
{
    /// <summary>
    /// 相亲费用
    /// </summary>
    public class MarriageFee : BaseAction, IMarriageFee
    {
        public Domain.IMatchmaker _Matchmaker { get; set; }
        public Domain.IMarriageArrange _MarriageArrange { get; set; }

        public Domain.IMarriageFee _MarriageFee { get; set; }

        /// <summary>
        /// 获取相亲费用
        /// </summary>
        public GetMarriageFeeResponse GetMarriageFee(GetMarriageFeeRequest request)
        {
            string title = "获取相亲费用";
            string requestContent = Utility.Common.ToJson(request);
            GetMarriageFeeResponse response = new GetMarriageFeeResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、获取用户信息
            int stepNo = 1;
            this.GetMatchmakerById(stepNo, request.LoginUserId, response);

            //2、获取相亲安排
            stepNo += 1;
            var marriageArrange = GetViewMarriageArrange(stepNo, request.MarriageArrangeId, response);

            //2、获取相亲费用
            stepNo += 1;
            GetMarriageFee(stepNo, marriageArrange, request, response);

            //3、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<GetMarriageFeeResponse>(title, "GetMarriageFee", requestContent, response);
        }

        /// <summary>
        /// 保存相亲费用
        /// </summary>
        public SaveMarriageFeeResponse SaveMarriageFee(SaveMarriageFeeRequest request)
        {
            string title = "保存相亲费用";
            string requestContent = Utility.Common.ToJson(request);
            SaveMarriageFeeResponse response = new SaveMarriageFeeResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、获取用户信息
            int stepNo = 1;
            this.GetMatchmakerById(stepNo, request.LoginUserId, response);

            //2、获取相亲安排
            stepNo += 1;
            var marriageArrange = GetViewMarriageArrange(stepNo, request.MarriageArrangeId, response);

            //2、保存相亲费用
            stepNo += 1;
            SaveMarriageFee(stepNo, marriageArrange, request, response);

            //3、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<SaveMarriageFeeResponse>(title, "SaveMarriageFee", requestContent, response);
        }

        private bool SaveMarriageFee(int stepNo, Entity.Domain.MarriageArrange marriageArrange, SaveMarriageFeeRequest request, IResponse response)
        {
            Func<bool> execStep = () =>
            {
                Guid loginUserId = Guid.Parse(request.LoginUserId);

                if (marriageArrange.AppMatchmakerId != loginUserId) return false;

                Entity.Domain.MarriageFee entity = new Entity.Domain.MarriageFee();

                entity.Amount = request.Amount;
                entity.AppAmount = request.AppAmount;
                entity.AppAppAmount = request.AppAppAmount;
                entity.AppRemark = request.AppRemark;
                entity.FeeDate = request.FeeDate;
                entity.ManAmount = request.ManAmount;
                entity.ManAppAmount = request.ManAppAmount;
                entity.ManRemark = request.ManRemark;
                entity.MarriageArrangeId = request.MarriageArrangeId;
                entity.UpdateUser = loginUserId;
                entity.WomanAmount = request.WomanAmount;
                entity.WomanAppAmount = request.WomanAppAmount;
                entity.WomanRemark = request.WomanRemark;
                entity.ManMatchmakerId = marriageArrange.ManMatchmakerId;
                entity.WomanMatchmakerId = marriageArrange.WomanMatchmakerId;
                entity.AppMatchmakerId = marriageArrange.AppMatchmakerId;

                return _MarriageFee.SaveMarriageFee(entity);
            };

            return this.UpdateEntityData(stepNo, "保存相亲费用", "GetMarriageArrange", response, execStep);
        }

        /// <summary>
        /// 以主键获取相亲安排
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="marriageArrangeId"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.MarriageArrange GetViewMarriageArrange(int stepNo, Guid marriageArrangeId, IResponse response)
        {
            Func<Entity.Domain.MarriageArrange> execStep = () =>
            {
                return _MarriageArrange.GetViewMarriageArrange(marriageArrangeId);
            };

            return this.GetEntityData<Entity.Domain.MarriageArrange>(stepNo, "以主键获取相亲安排", "GetMarriageArrange", response, execStep);
        }

        /// <summary>
        /// GetMarriageFee
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="marriageArrange"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.MarriageArrange GetMarriageFee(int stepNo, Entity.Domain.MarriageArrange marriageArrange, GetMarriageFeeRequest request, GetMarriageFeeResponse response)
        {
            Func<Entity.Domain.MarriageArrange> execStep = () =>
            {
                Guid loginUserId = Guid.Parse(request.LoginUserId);

                if (marriageArrange.AppMatchmakerId != loginUserId) return null;

                var entity = _MarriageFee.GetMarriageFee(marriageArrange.MarriageArrangeId, marriageArrange.ManMatchmakerId, marriageArrange.WomanMatchmakerId, marriageArrange.AppMatchmakerId);

                response.AppMatchmakerName = marriageArrange.AppMatchmakerName;
                response.ManMatchmakerName = marriageArrange.ManMatchmakerName;
                response.WomanMatchmakerName = marriageArrange.WomanMatchmakerName;
                response.MarriageArrangeId = marriageArrange.MarriageArrangeId;

                if (entity != null)
                {
                    response.Amount = marriageArrange.Amount;
                    response.AppAmount = entity.AppAmount;
                    response.AppAppAmount = entity.AppAppAmount;
                    response.AppRemark = entity.AppRemark;
                    response.FeeDate = marriageArrange.FeeDate.ToString("yyyy-MM-dd");
                    response.ManAmount = entity.ManAmount;
                    response.ManAppAmount = entity.ManAppAmount;
                    response.ManRemark = entity.ManRemark;
                    response.WomanAmount = entity.WomanAmount;
                    response.WomanAppAmount = entity.WomanAppAmount;
                    response.WomanRemark = entity.WomanRemark;
                }

                return marriageArrange;
            };

            return this.GetEntityData<Entity.Domain.MarriageArrange>(stepNo, "以用户获取相亲安排", "GetMarriageArrangeByUser", response, execStep);
        }

        /// <summary>
        /// 以主键获取红娘信息
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="userId"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.Matchmaker GetMatchmakerById(int stepNo, string userId, IResponse response)
        {
            Func<Entity.Domain.Matchmaker> execStep = () =>
            {
                var entity = _Matchmaker.GetMatchmakerById(Guid.Parse(userId));
                if (entity == null || entity.Status != 1) return null;
                return entity;
            };

            return this.GetEntityData<Entity.Domain.Matchmaker>(stepNo, "以主键获取红娘信息", "GetMatchmakerInfoById", response, execStep);
        }
    }
}
