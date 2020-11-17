﻿using OpenDataAccessCore.Data;
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
        EntityType _MatchmakerFeeDetailEntity { get; set; }
        public MarriageArrange()
        {
        }

        public MarriageArrange(Request request)
            : base(request)
        {
            _MatchmakerFeeDetailEntity = EntityType.GetEntityType<Entity.MatchmakerFeeDetail>();
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

        [Log]
        public object UpdateFee()
        {
            IEntityData entityData = this._Request.Entities[this.EntityType.Name].FirstOrDefault();

            IDbTransaction trans = this.CurrentDataBase.BeginTransaction(this.CurrentDataBase.ConnectionString);
            bool blSucceed = UpdateFee(trans, entityData);
            return GetBoolDict(this.CurrentDataBase.CommitTransaction(trans, blSucceed));
        }

        bool UpdateFee(IDbTransaction trans, IEntityData entityData)
        {
            bool blSucceed = true;

            object marriageArrangeId = this._QueryRequest.PrimaryKeyProperty.Value;

            List<IEntityData> detailList = new List<IEntityData>();

            detailList.Add(GetDetail(entityData, marriageArrangeId, "Man"));
            detailList.Add(GetDetail(entityData, marriageArrangeId, "Woman"));
            detailList.Add(GetDetail(entityData, marriageArrangeId, "App"));

            DeleteMatchmakerFeeDetail(trans);

            blSucceed = InsertMatchmakerFeeDetailList(detailList, trans);

            if (blSucceed)
            {
                entityData.SetValue("UpdateUser", Guid.Parse(_Request.OperationUser));
                entityData.SetValue("UpdateDate", DateTime.Now);
                blSucceed = this.UpdateEntityByPrimaryKey(marriageArrangeId, entityData, trans);
            }

            return blSucceed;
        }

        IEntityData GetDetail(IEntityData entityData, object marriageArrangeId, string type)
        {
            IEntityData detail = new EntityData(_MatchmakerFeeDetailEntity);
            detail.SetValue("MatchmakerId", entityData.GetValue(type + "MatchmakerId"));
            detail.SetValue("MarriageArrangeId", marriageArrangeId);
            detail.SetValue("FeeDate", entityData.GetValue("FeeDate"));
            detail.SetValue("Amount", entityData.GetValue(type + "Amount"));
            detail.SetValue("AppAmount", entityData.GetValue(type + "AppAmount"));
            detail.SetValue("Remark", entityData.GetValue(type + "Remark"));
            detail.SetValue("CreateUser", Guid.Parse(_Request.OperationUser));

            return detail;
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

        bool InsertMatchmakerFeeDetailList(List<IEntityData> entityDataList, IDbTransaction trans)
        {
            foreach (var e in entityDataList)
            {
                if (!this.InsertEntity(_MatchmakerFeeDetailEntity, e, out _, trans))
                {
                    return false;
                }
            }
            return true;
        }

        bool DeleteMatchmakerFeeDetail(IDbTransaction trans)
        {
            IQuery query = new Query("t_MatchmakerFeeDetail");

            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            parameterList.Add(this.InParameter("@MarriageArrangeId", this._QueryRequest.PrimaryKeyProperty.Value));

            query.Where("where MarriageArrangeId=@MarriageArrangeId", parameterList);

            return this.DeleteEntity(query, trans);
        }
    }
}
