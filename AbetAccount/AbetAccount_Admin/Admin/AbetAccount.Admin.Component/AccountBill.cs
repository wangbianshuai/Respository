using OpenDataAccessCore.Entity;
using OpenDataAccessCore.Service;
using System;
using System.Collections.Generic;
using System.Text;

namespace AbetAccount.Admin.Component
{
    public class AccountBill : EntityRequest
    {
        public AccountBill()
        {
        }

        public AccountBill(Request request)
            : base(request)
        {
        }

        [Log]
        public object Delete2()
        {
            return CommonOperation.DeleteByLogic<AccountBill>(this);
        }
    }
}
