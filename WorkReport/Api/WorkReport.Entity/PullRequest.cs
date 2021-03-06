﻿using OpenDataAccess.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WorkReport.Entity
{
    [TableProperty(Name = "t_PullRequest", PrimaryKey = "Id", NoSelectNames = "IsDelete")]
    [RequestMethod(IsDelete = false)]
    public class PullRequest : EntityModel, IEntity
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
        /// Pull Request Title
        /// </summary>
        public string PullRequestTitle { get; set; }
        /// <summary>
        /// Pull Request Url
        /// </summary>
        public string PullRequestUrl { get; set; }
        /// <summary>
        /// Test Cases
        /// </summary>
        public int TestCases { get; set; }
        /// <summary>
        /// Comments
        /// </summary>
        public int Comments { get; set; }
        /// <summary> 
        /// Start Date
        /// </summary> 
        public DateTime StartDate { get; set; }
        /// <summary>
        /// End Date
        /// </summary>
        public DateTime EndDate { get; set; }
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
            validateList.Add(this.ValidateExists<PullRequest>("IsDelete=0 and PullRequestUrl=@PullRequestUrl and CreateUser=@CreateUser", "Sorry, The Pull Request Url already exist!"));
        }

        public override void UpdateValidate(List<Func<IValidate, IEntityData, string>> validateList)
        {
            validateList.Add(this.ValidateExists<PullRequest>("Id=@Id and PullRequestUrl=@PullRequestUrl and CreateUser=@UpdateUser", "true"));
            validateList.Add(this.ValidateExists<PullRequest>("IsDelete=0 and PullRequestUrl=@PullRequestUrl and CreateUser=@UpdateUser", "Sorry, The Pull Request Url already exist!"));
        }
    }

    [TableProperty(Name = "v_PullRequest", PrimaryKey = "Id", NoSelectNames = "IsDelete")]
    [RequestMethod(IsDelete = false, IsPost = false, IsPut = false)]
    public class ViewPullRequest : PullRequest
    {
        public string StartMonth { get; set; }
        public string EndMonth { get; set; }
        public string StoryName { get; set; }
        public string StoryUrl { get; set; }
        public string CreateUserName { get; set; }
    }
}
