using OpenDataAccessCore.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Domain.Impl
{
    /// <summary>
    /// 服务接口
    /// </summary>
    public class ServiceInterface : IServiceInterface
    {
        public Data.IServiceInterface _ServiveInterface { get; set; }

        /// <summary>
        /// 以名称集合获取服务接口列表
        /// </summary>
        /// <param name="nameList"></param>
        /// <returns></returns>
        public List<Entity.Domain.ServiceInterface> GetServiceInterfaceByNames(List<string> nameList)
        {
            return Parse.IEntityDataListTo<Entity.Domain.ServiceInterface>(_ServiveInterface.GetServiceInterfaceByNames(nameList));
        }
    }
}
