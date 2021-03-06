﻿using OpenDataAccess.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AbetOrder.Entity
{
    [TableProperty(Name = "t_d_DealingsBook", PrimaryKey = "BookId", NoSelectNames = "IsDelete")]
    public class DealingsBook : EntityModel, IEntity
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid BookId { get; set; }
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
        /// 创建时间
        /// </summary> 
        public DateTime CreateDate { get; set; }

        public string RowVersion { get; set; }

        public override void InsertValidate(List<Func<IValidate, IEntityData, string>> validateList)
        {
            validateList.Add(this.ValidateExists<DealingsBook>("IsDelete=0 and Name=@Name", "对不起，该名称已存在！"));
        }

        public override void UpdateValidate(List<Func<IValidate, IEntityData, string>> validateList)
        {
            validateList.Add(this.ValidateExists<DealingsBook>("BookId=@BookId and Name=@Name", "true"));
            validateList.Add(this.ValidateExists<DealingsBook>("IsDelete=0 and Name=@Name", "对不起，该名称已存在！"));
        }
    }

    [TableProperty(Name = "v_DealingsBook", PrimaryKey = "BookId", NoSelectNames = "IsDelete")]
    public class ViewDealingsBook : DealingsBook
    {
    }

    [TableProperty(Name = "t_d_DealingsBookUser", PrimaryKey = "Id")]
    public class DealingsBookUser : EntityModel, IEntity
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid Id { get; set; }
        public byte UserType { get; set; }
        /// <summary> 
        /// BookId
        /// </summary> 
        public Guid BookId { get; set; }
        /// <summary> 
        /// UserId
        /// </summary> 
        public Guid UserId { get; set; }
    }
}
