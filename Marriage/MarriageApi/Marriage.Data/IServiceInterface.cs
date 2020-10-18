using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Data
{
    public interface IServiceInterface
    {
        /// <summary>
        /// 以名称集合获取服务接口列表
        /// </summary>
        /// <param name="nameList"></param>
        /// <returns></returns>
        List<IEntityData> GetServiceInterfaceByNames(List<string> nameList);
    }
}
