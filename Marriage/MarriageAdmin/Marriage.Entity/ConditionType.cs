using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using OpenDataAccessCore.Entity;

namespace Marriage.Entity
{
    [TableProperty(Name = "t_ConditionType", PrimaryKey = "ConditionTypeId")]
    public class ConditionType : EntityModel, IEntity
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid ConditionTypeId { get; set; }
        /// <summary> 
        /// 名称
        /// </summary> 
        public string Name { get; set; }
        /// <summary> 
        /// 备注
        /// </summary> 
        public string Remark { get; set; }
        /// <summary> 
        /// 是否删除
        /// </summary> 
        public byte IsDelete { get; set; }
        /// <summary> 
        /// 创建人
        /// </summary> 
        public Guid CreateUser { get; set; }
        /// <summary> 
        /// 创建时间
        /// </summary> 
        public DateTime CreateDate { get; set; }
        /// <summary> 
        /// 更新人
        /// </summary> 
        public Guid UpdateUser { get; set; }
        /// <summary> 
        /// 更新时间
        /// </summary> 
        public DateTime UpdateDate { get; set; }
        /// <summary> 
        /// 行版本
        /// </summary> 
        public string RowVersion { get; set; }


        public override void InsertValidate(List<Func<IValidate, IEntityData, string>> validateList)
        {
            validateList.Add(this.ValidateExists<ConditionType>("IsDelete=0 and Name=@Name", "对不起，该名称已存在！"));
        }

        public override void UpdateValidate(List<Func<IValidate, IEntityData, string>> validateList)
        {
            validateList.Add(this.ValidateExists<ConditionType>("ConditionTypeId=@ConditionTypeId and Name=@Name", "true"));
            validateList.Add(this.ValidateExists<ConditionType>("IsDelete=0 and Name=@Name", "对不起，该名称已存在！"));
        }
    }

    [TableProperty(Name = "v_ConditionType", PrimaryKey = "ConditionTypeId", NoSelectNames = "IsDelete")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false)]
    public class ViewConditionType : ConditionType
    {
    }

    [TableProperty(Name = "t_ConditionItem", PrimaryKey = "ItemId")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false, IsGet = false)]
    public class ConditionItem : EntityModel, IEntity
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid ItemId { get; set; }
        /// <summary> 
        /// 条件类型Id
        /// </summary> 
        public Guid ConditionTypeId { get; set; }
        /// <summary> 
        /// 标题
        /// </summary> 
        public string Title { get; set; }
        /// <summary> 
        /// 性别，1：男生，2：女生
        /// </summary> 
        public byte Sex { get; set; }
        /// <summary> 
        /// 数据类型
        /// </summary> 
        public string DataType { get; set; }
        /// <summary> 
        /// 数据源ID
        /// </summary> 
        public Guid DataSourceId { get; set; }
        /// <summary> 
        /// 是否单选，1：是
        /// </summary> 
        public byte IsSingle { get; set; }
        /// <summary> 
        /// 是否区间，1：是，一般数据类型为数值
        /// </summary> 
        public byte IsInterval { get; set; }
        /// <summary> 
        /// 显示顺序
        /// </summary> 
        public int DisplayIndex { get; set; }
    }
}