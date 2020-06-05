using System.Data;

namespace OpenDataAccessCore.Data
{
    public interface ISqlDataBase : IDataBase
    {
        void SqlBulkCopyInsert(DataTable dt, string tableName, IDbTransaction trans = null);
    }
}
