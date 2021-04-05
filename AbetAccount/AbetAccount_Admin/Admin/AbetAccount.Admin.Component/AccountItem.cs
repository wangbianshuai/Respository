using OpenDataAccessCore.Data;
using OpenDataAccessCore.Entity;
using OpenDataAccessCore.Service;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace AbetAccount.Admin.Component
{
    public class AccountItem : EntityRequest
    {
        public AccountItem()
        {
        }

        public AccountItem(Request request)
            : base(request)
        {
        }

        [Log]
        public object Delete2()
        {
            return CommonOperation.DeleteByLogic<AccountItem>(this);
        }
    }
}
