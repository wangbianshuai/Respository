using OpenDataAccessCore.Entity;
using OpenDataAccessCore.Service;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Component
{
    public class MarriageArrange : EntityRequest
    {
        public MarriageArrange()
        {
        }

        public MarriageArrange(Request request)
            : base(request)
        {
        }

        [Log]
        public object Delete2()
        {
            return CommonOperation.DeleteByLogic<MarriageArrange>(this);
        }

        /// <summary>
        /// 更新状态
        /// </summary>
        /// <returns></returns>
        [Log]
        public object UpdateStatus()
        {
            return this.Update();
        }
    }
}
