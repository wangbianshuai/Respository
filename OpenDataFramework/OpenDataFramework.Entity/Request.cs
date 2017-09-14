using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OpenDataFramework.Entity
{
    public interface IRequest
    {
    }

    public interface IBaseRequest
    {
        /// <summary>
        /// 实体名
        /// </summary>
        string EntityName { get; set; }

        IRequest IRequest { get; set; }
    }

    public class BaseRequest<T> : IBaseRequest where T : class, IRequest, new()
    {
        /// <summary>
        /// 实体名
        /// </summary>
        public string EntityName { get; set; }

        public IRequest IRequest
        {
            get
            {
                return Request;
            }
            set
            {
                Request = value as T;
            }
        }

        public T Request { get; set; }
    }
}
