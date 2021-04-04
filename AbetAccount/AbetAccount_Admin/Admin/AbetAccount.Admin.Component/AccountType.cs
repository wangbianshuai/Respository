using OpenDataAccessCore.Entity;
using OpenDataAccessCore.Service;
using System;
using System.Collections.Generic;
using System.Text;

namespace AbetAccount.Admin.Component
{
    public class AccountType : EntityRequest
    {
        public AccountType()
        {
        }

        public AccountType(Request request)
            : base(request)
        {
        }

        [Log]
        public object Delete2()
        {
            return CommonOperation.DeleteByLogic<AccountType>(this);
        }
    }
}
