using OpenDataAccess.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AbetOrder.Entity
{
    [TableProperty(Name = "t_d_OperationLog", PrimaryKey="LogId")]
    public class OperationLog : EntityModel, IEntity
    {
        public Guid LogId { get; set; }

        public string LogType { get; set; }

        public string LogPath { get; set; }

        public string EntityName { get; set; }

        public string RequestType { get; set; }

        public string MethodName { get; set; }

        public string IPAddress { get; set; }

        public DateTime StartTime { get; set; }

        public DateTime EndTime { get; set; }

        public long ElapsedMilliseconds { get; set; }

        public string OperationUser { get; set; }

        public DateTime CreateDate { get; set; }
    }

    [TableProperty(Name = "v_OperationLog", PrimaryKey = "LogId")]
    public class ViewOperationLog : OperationLog
    {
        public string UserName { get; set; }
        public string LookDetail { get; set; }
    }
}
