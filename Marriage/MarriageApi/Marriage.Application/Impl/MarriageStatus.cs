using Marriage.Entity.Application;
using Marriage.Entity.Application.MarriageStatus;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Application.Impl
{
    /// <summary>
    /// 相亲状态
    /// </summary>
    public class MarriageStatus : BaseAction, IMarriageStatus
    {
        public Domain.IMatchmaker _Matchmaker { get; set; }
        public Domain.IMarriageArrange _MarriageArrange { get; set; }

        /// <summary>
        /// 获取相亲状态
        /// </summary>
        public GetMarriageStatusResponse GetMarriageStatus(GetMarriageStatusRequest request)
        {
            string title = "获取相亲状态";
            string requestContent = Utility.Common.ToJson(request);
            GetMarriageStatusResponse response = new GetMarriageStatusResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、获取用户信息
            int stepNo = 1;
            this.GetMatchmakerById(stepNo, request.LoginUserId, response);

            //2、获取相亲安排
            stepNo += 1;
            var marriageArrange = GetViewMarriageArrange(stepNo, request.MarriageArrangeId, response);

            //2、获取相亲状态
            stepNo += 1;
            GetMarriageStatus(stepNo, marriageArrange, request, response);

            //3、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<GetMarriageStatusResponse>(title, "GetMarriageStatus", requestContent, response);
        }

        /// <summary>
        /// 保存相亲状态
        /// </summary>
        public SaveMarriageStatusResponse SaveMarriageStatus(SaveMarriageStatusRequest request)
        {
            string title = "保存相亲状态";
            string requestContent = Utility.Common.ToJson(request);
            SaveMarriageStatusResponse response = new SaveMarriageStatusResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、获取用户信息
            int stepNo = 1;
            this.GetMatchmakerById(stepNo, request.LoginUserId, response);

            //2、获取相亲安排
            stepNo += 1;
            var marriageArrange = GetViewMarriageArrange(stepNo, request.MarriageArrangeId, response);

            //2、保存相亲状态
            stepNo += 1;
            SaveMarriageStatus(stepNo, marriageArrange, request, response);

            //3、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<SaveMarriageStatusResponse>(title, "SaveMarriageStatus", requestContent, response);
        }

        /// <summary>
        /// 保存相亲状态
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="marriageArrange"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool SaveMarriageStatus(int stepNo, Entity.Domain.MarriageArrange marriageArrange, SaveMarriageStatusRequest request, IResponse response)
        {
            Func<bool> execStep = () =>
            {
                Guid loginUserId = Guid.Parse(request.LoginUserId);

                if (marriageArrange.AppMatchmakerId != loginUserId) return false;

                Entity.Domain.MarriageArrange entity = new Entity.Domain.MarriageArrange();

                entity.BookMarryDate = GetStringDate(request.BookMarryDate);
                entity.BreakUpDate = GetStringDate(request.BreakUpDate);
                entity.BreakUpReason = request.BreakUpReason;
                entity.CancelReason = request.CancelReason;
                entity.IsManAgree = request.IsManAgree;
                entity.IsWomanAgree = request.IsWomanAgree;
                entity.MarriageArrangeId = request.MarriageArrangeId;
                entity.MarryDate = GetStringDate(request.MarryDate);
                entity.NoManAgreeRemark = request.NoManAgreeRemark;
                entity.UpdateUser = loginUserId;
                entity.NoWomanAgreeRemark = request.NoWomanAgreeRemark;
                entity.Status = request.Status;

                return _MarriageArrange.SaveMarriageStatus(entity);
            };

            return this.UpdateEntityData(stepNo, "保存相亲状态", "GetMarriageArrange", response, execStep);
        }

        DateTime GetStringDate(string date)
        {
            if (string.IsNullOrEmpty(date)) return DateTime.MinValue;

            return DateTime.Parse(date);
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
        /// GetMarriageStatus
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="marriageArrange"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.MarriageArrange GetMarriageStatus(int stepNo, Entity.Domain.MarriageArrange marriageArrange, GetMarriageStatusRequest request, GetMarriageStatusResponse response)
        {
            Func<Entity.Domain.MarriageArrange> execStep = () =>
            {
                Guid loginUserId = Guid.Parse(request.LoginUserId);

                if (marriageArrange.AppMatchmakerId != loginUserId) return null;

                response.BookMarryDate = GetDateString(marriageArrange.BookMarryDate);
                response.BreakUpDate = GetDateString(marriageArrange.BreakUpDate);
                response.MarryDate = GetDateString(marriageArrange.MarryDate);
                response.BreakUpReason = marriageArrange.BreakUpReason;
                response.CancelReason = marriageArrange.CancelReason;
                response.IsManAgree = marriageArrange.IsManAgree;
                response.IsWomanAgree = marriageArrange.IsWomanAgree;
                response.MarriageArrangeId = marriageArrange.MarriageArrangeId;
                response.NoManAgreeRemark = marriageArrange.NoManAgreeRemark;
                response.NoWomanAgreeRemark = marriageArrange.NoWomanAgreeRemark;
                response.Status = marriageArrange.Status;

                return marriageArrange;
            };

            return this.GetEntityData<Entity.Domain.MarriageArrange>(stepNo, "以用户获取相亲安排", "GetMarriageArrangeByUser", response, execStep);
        }

        string GetDateString(DateTime date)
        {
            if (date == DateTime.MinValue) return null;
            return date.ToString("yyyy-MM-dd");
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
