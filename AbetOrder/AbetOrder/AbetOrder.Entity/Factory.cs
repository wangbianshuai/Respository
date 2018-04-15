﻿using OpenDataAccess.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AbetOrder.Entity
{
    [TableProperty(Name = "t_d_Factory", PrimaryKey = "Id", NoSelectNames = "IsDelete")]
    public class Factory : EntityModel, IEntity
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid Id { get; set; }
        /// <summary> 
        /// 名称
        /// </summary> 
        public string Name { get; set; }
        /// <summary> 
        /// 备注
        /// </summary> 
        public string Remark { get; set; }
        /// 逻辑删除，1：删除,0:正常
        /// </summary> 
        public byte IsDelete { get; set; }
        /// <summary>
        /// 往来账本
        /// </summary>
        public Guid DealingsBookId { get; set; }
        /// <summary> 
        /// 创建时间
        /// </summary> 
        public DateTime CreateDate { get; set; }

        public string RowVersion { get; set; }

        public override void InsertValidate(List<Func<IValidate, IEntityData, string>> validateList)
        {
            validateList.Add(this.ValidateExists<Factory>("IsDelete=0 and Name=@Name", "对不起，该名称已存在！"));
        }

        public override void UpdateValidate(List<Func<IValidate, IEntityData, string>> validateList)
        {
            validateList.Add(this.ValidateExists<Factory>("Id=@Id and Name=@Name", "true"));
            validateList.Add(this.ValidateExists<Factory>("IsDelete=0 and Name=@Name", "对不起，该名称已存在！"));
        }
    }

    [TableProperty(Name = "v_Factory", PrimaryKey = "Id", NoSelectNames = "IsDelete")]
    public class ViewFactory : Factory
    {
        public string DealingsBookName { get; set; }
    }
}