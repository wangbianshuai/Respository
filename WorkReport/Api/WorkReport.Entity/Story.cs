using OpenDataAccess.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WorkReport.Entity
{
    [TableProperty(Name = "t_Story", PrimaryKey = "Id", NoSelectNames = "IsDelete")]
    [RequestMethod(IsDelete = false)]
    public class Story : EntityModel, IEntity
    {
        /// <summary> 
        /// Id
        /// </summary> 
        public Guid Id { get; set; }
        /// <summary> 
        /// Story Id
        /// </summary> 
        public int StoryId { get; set; }
        /// <summary>
        /// Story Title
        /// </summary>
        public string StoryTitle { get; set; }
        /// <summary>
        /// Story Url
        /// </summary>
        public string StoryUrl { get; set; }
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
            validateList.Add(this.ValidateExists<Story>("IsDelete=0 and StoryId=@StoryId", "Sorry, The Story Id already exist!"));
        }

        public override void UpdateValidate(List<Func<IValidate, IEntityData, string>> validateList)
        {
            validateList.Add(this.ValidateExists<Story>("Id=@Id and StoryId=@StoryId", "true"));
            validateList.Add(this.ValidateExists<Story>("IsDelete=0 and StoryId=@StoryId", "Sorry, The Story Id already exist!"));
        }
    }

    [TableProperty(Name = "v_Story", PrimaryKey = "Id", NoSelectNames = "IsDelete")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false)]
    public class ViewStory : Story
    {
        public string StoryName { get; set; }
    }
}
