using OpenDataAccess.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WorkReport.Entity
{
    [TableProperty(Name = "t_Daily", PrimaryKey = "Id", NoSelectNames = "IsDelete")]
    [RequestMethod(IsDelete = false)]
    public class Daily : EntityModel, IEntity
    {
        /// <summary> 
        /// Id
        /// </summary> 
        public Guid Id { get; set; }
        /// <summary> 
        /// Story Id
        /// </summary> 
        public Guid StoryId { get; set; }
        /// <summary>
        /// Content
        /// </summary>
        public string Content { get; set; }
        /// <summary>
        /// Working Date
        /// </summary>
        public DateTime WorkingDate { get; set; }
        /// <summary>
        /// Hours Count
        /// </summary>
        public float HoursCount { get; set; }
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
    }

    [TableProperty(Name = "v_Daily", PrimaryKey = "Id", NoSelectNames = "IsDelete")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false)]
    public class ViewDaily : Daily
    {
        public string StoryName { get; set; }
        public string StoryTitle { get; set; }
        public string StoryUrl { get; set; }
        public string CreateUserName { get; set; }
    }
}
