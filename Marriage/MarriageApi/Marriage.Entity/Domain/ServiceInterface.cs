using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Entity.Domain
{
    /// <summary>
    /// 服务接口
    /// </summary>
    public class ServiceInterface
    {
        /// <summary> 
        /// 主键
        /// </summary> 
        public Guid ServiceInterfaceId { get; set; }
        /// <summary> 
        /// 名称
        /// </summary> 
        public string Name { get; set; }
        /// <summary> 
        /// 接口名
        /// </summary> 
        public string InterfaceName { get; set; }
        /// <summary> 
        /// 方法名
        /// </summary> 
        public string MethodName { get; set; }
        /// <summary> 
        /// URL
        /// </summary> 
        public string Url { get; set; }
    }
}
