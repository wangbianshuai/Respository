using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Marriage.Domain.Impl
{
    public class WeChatTemplate : IWeChatTemplate
    {
        public Data.IWeChatTemplate _WeChatTemplate { get; set; }

        /// <summary>
        /// 判断十分钟之内是否已更新
        /// </summary>
        /// <returns></returns>
        public string JudgeIsUpdate()
        {
            DateTime updateDate = _WeChatTemplate.GetLastUpdateDate();
            if (updateDate == DateTime.MinValue) return string.Empty;
            if (updateDate.AddMinutes(10) > DateTime.Now) return string.Format("对不起，在{0}时已更新，请稍后再同步！", updateDate);
            return string.Empty;
        }

        /// <summary>
        /// 更新微信消息模板数据
        /// </summary>
        /// <param name="templateInfoList"></param>
        /// <param name="appAccountId"></param>
        /// <param name="adminUserId"></param>
        /// <returns></returns>
        public void UpdateWeChatTemplateData(List<Entity.Service.MessageManage.TemplateInfo> templateInfoList, Guid appAccountId, Guid adminUserId)
        {
            //1、删除当前App账号下用户
            _WeChatTemplate.DeleteByAppAccountId(appAccountId);

            List<List<Entity.Service.MessageManage.TemplateInfo>> batchList = Utility.Common.ListToBatchList<Entity.Service.MessageManage.TemplateInfo>(templateInfoList, 1000);

            ParallelOptions po = new ParallelOptions();
            po.MaxDegreeOfParallelism = 3;

            Parallel.ForEach(batchList, po, (list) =>
            {
                _WeChatTemplate.BullInsert(GetEntityDataList(list, appAccountId, adminUserId));
            });
        }

        /// <summary>
        /// 获取数据列表
        /// </summary>
        /// <param name="userInfoList"></param>
        /// <param name="appAccountId"></param>
        /// <param name="adminUserId"></param>
        /// <returns></returns>
        List<IEntityData> GetEntityDataList(List<Entity.Service.MessageManage.TemplateInfo> userInfoList, Guid appAccountId, Guid adminUserId)
        {
            List<IEntityData> entityDataList = new List<IEntityData>();

            IEntityData entityData = null;

            userInfoList.ForEach(d =>
            {
                entityData = new EntityData("WeChatTemplates");

                entityData.SetValue("Content", d.Content);
                entityData.SetValue("DeputyIndustry", d.Deputy_Industry);
                entityData.SetValue("Example", d.Example);
                entityData.SetValue("PrimaryIndustry", d.Primary_Industry);
                entityData.SetValue("TemplateId", d.Template_Id);
                entityData.SetValue("Title", d.Title);
                entityData.SetValue("AppAccountId", appAccountId);
                entityData.SetValue("UpdateUser", adminUserId);
                entityData.SetValue("UpdateDate", DateTime.Now);

                entityDataList.Add(entityData);
            });

            return entityDataList;
        }
    }
}
