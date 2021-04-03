using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OpenDataAccessCore.Service;
using OpenDataAccessCore.Utility;

namespace AbetAccount.Admin.Web.Controllers
{
    [Route("download/{name}")]
    public class DownloadController : Controller
    {
        [HttpGet]
        public FileStreamResult Get()
        {
            try
            {
                string fileName = Code.Request.GetParameterValue(this.Request, "fn");

                ExcelExportData execlExportData = DataCache.GetExcelExportData(fileName.ToLower());

                if (execlExportData != null)
                {
                    MemoryStream stream = ExcelUtility.ExportExcel2007(execlExportData.DataList, execlExportData.HeadDictionary);

                    return new FileStreamResult(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                }
            }
            catch (Exception ex)
            {
                this.Response.ContentType = "text/html";
                this.Response.WriteAsync("下载异常：" + Common.GetInnerException(ex).Message);
            }

            return null;
        }
    }
}