using OpenDataAccessCore.Data;
using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace Marriage.Data.Impl
{
    public class MatchmakerFeeDetail : BaseData, IMatchmakerFeeDetail
    {
        public MatchmakerFeeDetail()
        {
            this.EntityType = EntityType.GetEntityType<Entity.Data.MatchmakerFeeDetail>();
        }

        /// <summary>
        /// 以相亲安排Id获取费用明细
        /// </summary>
        /// <param name="marriageArrangeId"></param>
        /// <returns></returns>
        public List<IEntityData> GetEntityDataList(Guid marriageArrangeId)
        {
            IQuery query = new Query(this.EntityType.TableName);

            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            parameterList.Add(this.InParameter("@MarriageArrangeId", marriageArrangeId));

            query.Where("where MarriageArrangeId=@MarriageArrangeId", parameterList);

            return this.SelectEntities(query);
        }

        /// <summary>
        /// 以相亲安排Id删除
        /// </summary>
        /// <param name="marriageArrangeId"></param>
        /// <returns></returns>
        public bool DeleteByMarriageArrangId(Guid marriageArrangeId)
        {
            IQuery query = new Query(this.EntityType.TableName);

            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            parameterList.Add(this.InParameter("@MarriageArrangeId", marriageArrangeId));

            query.Where("where MarriageArrangeId=@MarriageArrangeId", parameterList);

            return this.DeleteEntity(query);
        }

        /// <summary>
        /// 插入
        /// </summary>
        /// <param name="entityData"></param>
        /// <returns></returns>
        public Guid Insert(IEntityData entityData)
        {
            object primaryKey = null;
            if (this.InsertEntity(entityData, out primaryKey)) return (Guid)primaryKey;
            return Guid.Empty;
        }

        /// <summary>
        /// 获取红娘总金额
        /// </summary>
        /// <param name="matchmakerId"></param>
        /// <returns></returns>
        public IEntityData GetTotalAmountByMatchmakerId(Guid matchmakerId)
        {
            IQuery query = new Query(this.EntityType.TableName);

            List<IDbDataParameter> parameterList = new List<IDbDataParameter>();
            parameterList.Add(this.InParameter("@MatchmakerId", matchmakerId));

            query.Where("where MatchmakerId=@MatchmakerId", parameterList);

            query.Select("sum(Amount) Amount");

            return this.SelectEntity(query);
        }
    }
}
