using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Transactions;

namespace Marriage.Domain.Impl
{
    /// <summary>
    /// 相亲费用
    /// </summary>
    public class MarriageFee : IMarriageFee
    {
        public Data.IMarriageArrange _MarriageArrange { get; set; }
        public Data.IMatchmakerFeeDetail _MatchmakerFeeDetail { get; set; }

        /// <summary>
        /// 获取相亲费用
        /// </summary>
        /// <param name="marriageArrangeId"></param>
        /// <param name="manMatchmakerId"></param>
        /// <param name="womanMatchmakerId"></param>
        /// <param name="appMatchmakerId"></param>
        /// <returns></returns>
        public Entity.Domain.MarriageFee GetMarriageFee(Guid marriageArrangeId, Guid manMatchmakerId, Guid womanMatchmakerId, Guid appMatchmakerId)
        {
            List<IEntityData> detailList = _MatchmakerFeeDetail.GetEntityDataList(marriageArrangeId);

            if (detailList.Count == 0) return null;

            IEntityData entityData = new EntityData("MarriageFee");
            entityData.SetValue("MarriageArrangeId", marriageArrangeId);

            SetMarriageFee(entityData, manMatchmakerId, detailList, 1, "Man");
            SetMarriageFee(entityData, womanMatchmakerId, detailList, 2, "Woman");
            SetMarriageFee(entityData, appMatchmakerId, detailList, 3, "App");

            return Parse.IEntityDataTo<Entity.Domain.MarriageFee>(entityData);
        }

        void SetMarriageFee(IEntityData entityData, Guid matchmakerId, List<IEntityData> detailList, byte matchmakerType, string type)
        {
            if (detailList.Count == 0) return;

            var detail = detailList.Where(w => w.GetValue<Guid>("MatchMakerId") == matchmakerId && w.GetValue<byte>("MatchmakerType") == matchmakerType).FirstOrDefault();
            if (detail == null) return;

            entityData.SetValue(type + "Amount", detail.GetValue("Amount"));
            entityData.SetValue(type + "AppAmount", detail.GetValue("AppAmount"));
            entityData.SetValue(type + "Remark", detail.GetValue("Remark"));
        }

        /// <summary>
        /// 保存相亲费用
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public bool SaveMarriageFee(Entity.Domain.MarriageFee entity)
        {
            IEntityData entityData = new EntityData("MarriageFee");

            entity.GetType().GetProperties().ToList().ForEach(p =>
            {
                entityData.SetValue(p.Name, p.GetValue(entity));
            });

            List<IEntityData> detailList = new List<IEntityData>();

            detailList.Add(GetDetail(entityData, entity.MarriageArrangeId, "Man", 1));
            detailList.Add(GetDetail(entityData, entity.MarriageArrangeId, "Woman", 2));
            detailList.Add(GetDetail(entityData, entity.MarriageArrangeId, "App", 3));

            using (TransactionScope scope = new TransactionScope())
            {
                try
                {
                    _MatchmakerFeeDetail.DeleteByMarriageArrangId(entity.MarriageArrangeId);

                    bool blSucceed = InsertMatchmakerFeeDetailList(detailList);

                    if (blSucceed)   blSucceed= UpdateMarraigeArrange(entity);
     
                    if (blSucceed) scope.Complete();
                    else scope.Dispose();

                    return blSucceed;
                }
                catch (Exception ex)
                {
                    scope.Dispose();
                    throw ex;
                }
            }
        }

        bool InsertMatchmakerFeeDetailList(List<IEntityData> entityDataList)
        {
            foreach (var e in entityDataList)
            {
                if (_MatchmakerFeeDetail.Insert(e) == Guid.Empty)
                {
                    return false;
                }
            }
            return true;
        }

        bool UpdateMarraigeArrange(Entity.Domain.MarriageFee entity)
        {
            IEntityData entityData = new EntityData("MarriageArrange");
            entityData.SetValue("MarriageArrangeId", entity.MarriageArrangeId);
            entityData.SetValue("Amount", entity.Amount);
            entityData.SetValue("FeeDate", entity.FeeDate);
            entityData.SetValue("UpdateUser", entity.UpdateUser);
            entityData.SetValue("UpdateDate", DateTime.Now);

            return _MarriageArrange.Update(entityData);
        }

        IEntityData GetDetail(IEntityData entityData, object marriageArrangeId, string type, int matchmakerType)
        {
            IEntityData detail = new EntityData("MatchmakerFeeDetail");
            detail.SetValue("MatchmakerId", entityData.GetValue(type + "MatchmakerId"));
            detail.SetValue("MarriageArrangeId", marriageArrangeId);
            detail.SetValue("FeeDate", entityData.GetValue("FeeDate"));
            detail.SetValue("Amount", entityData.GetValue(type + "Amount"));
            detail.SetValue("AppAmount", entityData.GetValue(type + "AppAmount"));
            detail.SetValue("Remark", entityData.GetValue(type + "Remark"));
            detail.SetValue("CreateUser", entityData.GetValue("UpdateUser"));
            detail.SetValue("MatchmakerType", matchmakerType);

            return detail;
        }

        /// <summary>
        /// 获取红娘总金额
        /// </summary>
        /// <param name="matchmakerId"></param>
        /// <returns></returns>
        public Entity.Domain.MarriageFee GetTotalMarriageFee(Guid matchmakerId)
        {
            return Parse.IEntityDataTo<Entity.Domain.MarriageFee>(_MatchmakerFeeDetail.GetTotalAmountByMatchmakerId(matchmakerId));
        }

        /// <summary>
        /// 查询数据列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public List<Entity.Domain.MatchmakerFeeDetail> QueryMatchmakerFeeDataList(Entity.Application.MarriageFee.QueryMatchmakerFeeRequest request)
        {
            Entity.Data.QueryInfo queryInfo = new Entity.Data.QueryInfo();
            queryInfo.ConditionList = GetConditionList(request);
            queryInfo.OrderByList = GetOrderByList(request);
            queryInfo.TableName = "v_MatchmakerFeeDetail2";

            queryInfo.PageIndex = request.PageIndex;
            queryInfo.PageSize = request.PageSize;

            return Parse.IEntityDataListTo<Entity.Domain.MatchmakerFeeDetail>(_MatchmakerFeeDetail.QueryDataList(queryInfo));
        }

        /// <summary>
        /// 查询分页信息
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public Entity.Application.PageInfo QueryMatchmakerFeePageInfo(Entity.Application.MarriageFee.QueryMatchmakerFeeRequest request)
        {
            Entity.Data.QueryInfo queryInfo = new Entity.Data.QueryInfo();
            queryInfo.ConditionList = GetConditionList(request);
            queryInfo.OrderByList = GetOrderByList(request);
            queryInfo.TableName = "v_MatchmakerFeeDetail2";

            int totalCount = _MatchmakerFeeDetail.QueryCount(queryInfo);

            return new Entity.Application.PageInfo(request.PageIndex, request.PageSize, totalCount);
        }

        List<Entity.Data.OrderByType> GetOrderByList(Entity.Application.MarriageFee.QueryMatchmakerFeeRequest request)
        {
            Entity.Data.OrderByType orderBy = new Entity.Data.OrderByType("FeeDate", "desc");

            return new List<Entity.Data.OrderByType>() { orderBy };
        }

        List<Entity.Data.QueryCondition> GetConditionList(Entity.Application.MarriageFee.QueryMatchmakerFeeRequest request)
        {
            List<Entity.Data.QueryCondition> queryConditionList = new List<Entity.Data.QueryCondition>();

            queryConditionList.Add(new Entity.Data.QueryCondition("MatchmakerId", "=", Guid.Parse(request.LoginUserId)));

            return queryConditionList;
        }
    }
}
