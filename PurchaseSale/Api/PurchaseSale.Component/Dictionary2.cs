using OpenDataAccess.Data;
using OpenDataAccess.Entity;
using OpenDataAccess.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PurchaseSale.Component
{
    public class Dictionary2 : EntityRequest
    {
        public Dictionary2()
        {
        }

        public Dictionary2(Request request)
            : base(request)
        {
        }

        [Log]
        public object Delete2()
        {
            return CommonOperation.DeleteByLogic<Dictionary2>(this, null);
        }

        public object GetUnits()
        {
            IQuery query = new Query(this.EntityType.TableName);
            query.Select("Value");
            query.Where("where IsDelete=0 and Name ='单位'");
            IEntityData entityData = this.SelectEntity(query);

            if (entityData != null)
            {
                string value = entityData.GetStringValue("Value");
                if (!string.IsNullOrEmpty(value))
                {
                    var list = value.Split(new char[] { '，', ',', '、', ';', '；' });

                    List<Dictionary<string, object>> dictList = new List<Dictionary<string, object>>();

                    Dictionary<string, object> dict = null;
                    foreach (var v in list)
                    {
                        dict = new Dictionary<string, object>();
                        dict.Add("Value", v);
                        dictList.Add(dict);
                    }

                    return dictList;
                }
            }

            return new List<string>();
        }
    }
}
