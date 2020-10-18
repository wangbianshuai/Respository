using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Domain
{
    /// <summary>
    ///  服务接口
    /// </summary>
    public interface IServiceInterface
    {
        /// <summary>
        /// 以名称集合获取服务接口列表
        /// </summary>
        /// <param name="nameList"></param>
        /// <returns></returns>
        List<Entity.Domain.ServiceInterface> GetServiceInterfaceByNames(List<string> nameList);
    }
}
