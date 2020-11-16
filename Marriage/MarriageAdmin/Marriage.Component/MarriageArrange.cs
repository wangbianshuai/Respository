using OpenDataAccessCore.Data;
using OpenDataAccessCore.Entity;
using OpenDataAccessCore.Service;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace Marriage.Component
{
    public class MarriageArrange : EntityRequest
    {
        public MarriageArrange()
        {
        }

        public MarriageArrange(Request request)
            : base(request)
        {
        }

        [Log]
        public object Delete2()
        {
            return CommonOperation.DeleteByLogic<MarriageArrange>(this);
        }

        /// <summary>
        /// 更新状态
        /// </summary>
        /// <returns></returns>
        [Log]
        public object UpdateStatus()
        {
            return this.Update();
        }

        public object GetMarriageFee()
        {
            IEntityData entityData = GetMarriageArrange();
            if (entityData == null) return GetMessageDict("数据不存在");

            List<IEntityData> detailList = GetMatchmakerFeeDetailList();

            Guid manMatchmakerId = entityData.GetValue<Guid>("ManMatchmakerId");
            Guid womanMatchmakerId = entityData.GetValue<Guid>("WomanMatchmakerId");
            Guid appMatchmakerId = entityData.GetValue<Guid>("AppMatchmakerId");

            SetMarriageFee(entityData,manMatchmakerId, detailList, "Man");
            SetMarriageFee(entityData,womanMatchmakerId, detailList, "Woman");
            SetMarriageFee(entityData,appMatchmakerId, detailList, "App");

            Dictionary<string, object> dict = new Dictionary<string, object>();
            dict.Add("MarriageArrange", entityData);
            return dict;
        }

        void SetMarriageFee(IEntityData entityData, Guid matchmakerId, List<IEntityData> detailList, string type)
        {
            if (detailList.Count == 0) return;

            var detail = detailList.Where(w => w.GetValue<Guid>("MatchMakerId") == matchmakerId).FirstOrDefault();
            if (detail == null) return;

            entityData.SetValue(type + "Amount", detail.GetValue("Amount"));
            entityData.SetValue(type + "AppAmount", detail.GetValue("AppAmount"));
            entityData.SetValue(type + "Remark", detail.GetValue("Remark"));
        }

        IEntityData GetMarriageArrange()
        {
            IQuery query = new Query("v_MarriageArrange");

            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            parameterList.Add(this.InParameter("@MarriageArrangeId", this._QueryRequest.PrimaryKeyProperty.Value));

            query.Select("MarriageArrangeId,ManMatchmakerId,WomanMatchmakerId,ManMatchmakerName,WomanMatchmakerName,AppMatchmakerId,AppMatchmakerName,Amount,FeeDate");
            query.Where("where MarriageArrangeId=@MarriageArrangeId", parameterList);

            return this.SelectEntity(query);
        }

        List<IEntityData> GetMatchmakerFeeDetailList()
        {
            IQuery query = new Query("t_MatchmakerFeeDetail");

            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            parameterList.Add(this.InParameter("@MarriageArrangeId", this._QueryRequest.PrimaryKeyProperty.Value));

            query.Where("where MarriageArrangeId=@MarriageArrangeId", parameterList);

            return this.SelectEntities(query);
        }
    }
}
