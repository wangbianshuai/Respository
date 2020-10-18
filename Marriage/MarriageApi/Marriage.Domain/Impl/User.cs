using OfficeOpenXml.FormulaParsing.Excel.Functions.DateTime;
using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace Marriage.Domain.Impl
{
    public class User : IUser
    {
        public Data.IUser _User { get; set; }

        /// <summary>
        /// 判断十分钟之内是否已更新
        /// </summary>
        /// <returns></returns>
        public string JudgeIsUpdate()
        {
            DateTime updateDate = _User.GetLastUpdateDate();
            if (updateDate == DateTime.MinValue) return string.Empty;
            if (updateDate.AddMinutes(10) > DateTime.Now) return string.Format("对不起，在{0}时已更新，请稍后再同步！", updateDate);
            return string.Empty;
        }

        /// <summary>
        /// 更新用户数据
        /// </summary>
        /// <param name="userInfoList"></param>
        /// <param name="appAccountId"></param>
        /// <param name="adminUserId"></param>
        /// <returns></returns>
        public void UpdateUserData(List<Entity.Service.UserManage.UserInfo> userInfoList, Guid appAccountId, Guid adminUserId)
        {
            //1、删除当前App账号下用户
            _User.DeleteByAppAccountId(appAccountId);

            List<List<Entity.Service.UserManage.UserInfo>> batchList = Utility.Common.ListToBatchList<Entity.Service.UserManage.UserInfo>(userInfoList, 1000);

            ParallelOptions po = new ParallelOptions();
            po.MaxDegreeOfParallelism = 3;

            Parallel.ForEach(batchList, po, (list) =>
            {
                _User.BullInsert(GetEntityDataList(list, appAccountId, adminUserId));
            });
        }

        /// <summary>
        /// 获取数据列表
        /// </summary>
        /// <param name="userInfoList"></param>
        /// <param name="appAccountId"></param>
        /// <param name="adminUserId"></param>
        /// <returns></returns>
        List<IEntityData> GetEntityDataList(List<Entity.Service.UserManage.UserInfo> userInfoList, Guid appAccountId, Guid adminUserId)
        {
            List<IEntityData> entityDataList = new List<IEntityData>();

            IEntityData entityData = null;

            userInfoList.ForEach(d =>
            {
                entityData = new EntityData("User");

                entityData.SetValue("City", d.City);
                entityData.SetValue("HeadImgUrl", d.HeadImgUrl);
                entityData.SetValue("NickName", d.NickName);
                entityData.SetValue("OpenId", d.OpenId);
                entityData.SetValue("Province", d.Province);
                entityData.SetValue("Remark", d.Remark);
                entityData.SetValue("Sex", d.Sex);
                entityData.SetValue("UnionId", d.UnionId);
                entityData.SetValue("AppAccountId", appAccountId);
                entityData.SetValue("UpdateUser", adminUserId);
                entityData.SetValue("UpdateDate", DateTime.Now);

                entityDataList.Add(entityData);
            });

            return entityDataList;
        }
    }
}
