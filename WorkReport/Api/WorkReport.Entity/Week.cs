using OpenDataAccess.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WorkReport.Entity
{
    [TableProperty(Name = "t_Week", PrimaryKey = "Id", NoSelectNames = "IsDelete")]
    [RequestMethod(IsDelete = false)]
    public class Week : EntityModel, IEntity
    {
        /// <summary> 
        /// Id
        /// </summary> 
        public Guid Id { get; set; }
        /// <summary> 
        /// Start Date
        /// </summary> 
        public DateTime StartDate { get; set; }
        /// <summary>
        /// End Date
        /// </summary>
        public DateTime EndDate { get; set; }
        /// <summary>
        /// Working Hours
        /// </summary>
        public int WorkingHours { get; set; }
        /// <summary>
        /// Remark
        /// </summary>
        public string Remark { get; set; }
        /// <summary> 
        /// 逻辑删除，1：删除,0:正常
        /// </summary> 
        public byte IsDelete { get; set; }
        /// <summary> 
        /// 创建时间
        /// </summary> 
        public DateTime CreateDate { get; set; }

        public string CreateUser { get; set; }

        public string UpdateUser { get; set; }

        public DateTime UpdateDate { get; set; }

        public string RowVersion { get; set; }

        public override void InsertValidate(List<Func<IValidate, IEntityData, string>> validateList)
        {
            validateList.Add(this.ValidateExists<Week>("IsDelete=0 and StartDate=@StartDate and EndDate=@EndDate", "Sorry, The Start Date and End Date already exist!"));
        }

        public override void UpdateValidate(List<Func<IValidate, IEntityData, string>> validateList)
        {
            validateList.Add(this.ValidateExists<Week>("Id=@Id and StartDate=@StartDate and EndDate=@EndDate", "true"));
            validateList.Add(this.ValidateExists<Week>("IsDelete=0 and StartDate=@StartDate and EndDate=@EndDate", "Sorry, The Start Date and End Date already exist!"));
        }
    }

    [TableProperty(Name = "v_Week", PrimaryKey = "Id", NoSelectNames = "IsDelete")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false)]
    public class ViewWeek : Week
    {
        public string WeekName { get; set; }
    }
}
