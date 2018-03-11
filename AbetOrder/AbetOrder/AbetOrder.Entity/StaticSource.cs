using OpenDataAccess.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AbetOrder.Entity
{
    [TableProperty(Name = "t_d_Static_Source", PrimaryKey = "Id")]
    public class StaticSource : EntityModel, IEntity
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
        /// 文件名
        /// </summary> 
        public string FileName { get; set; }
        /// <summary> 
        /// 文件类型
        /// </summary> 
        public string FileType { get; set; }
        /// <summary> 
        /// 文件大小
        /// </summary> 
        public string FileSize { get; set; }
        /// <summary> 
        /// 文件路径
        /// </summary> 
        public string FilePath { get; set; }
        /// <summary> 
        /// 逻辑删除，1：删除,0:正常
        /// </summary> 
        public byte IsDelete { get; set; }
        /// <summary> 
        /// 创建时间
        /// </summary> 
        public DateTime CreateDate { get; set; }

        public override void InsertValidate(List<Func<IValidate, IEntityData, string>> validateList)
        {
            validateList.Add(this.ValidateExists<StaticSource>("IsDelete=0 and Name=@Name", "对不起，该名称已存在！"));
        }

        public override void UpdateValidate(List<Func<IValidate, IEntityData, string>> validateList)
        {
            validateList.Add(this.ValidateExists<StaticSource>("Id=@Id and Name=@Name", "true"));
            validateList.Add(this.ValidateExists<StaticSource>("IsDelete=0 and Name=@Name", "对不起，该名称已存在！"));
        }
    }

    [TableProperty(Name = "v_Static_Source", PrimaryKey = "Id")]
    public class ViewStaticSource : StaticSource
    {
        public long RowVersion { get; set; }
    }
}
