using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OpenDataAccessCore.Utility;

namespace Marriage.Api.Controllers
{
    [Route("api/image")]
    [ApiController]
    public class ImageController : ControllerBase
    {
        [HttpGet]
        public async Task<FileContentResult> Get(string connectionId)
        {
            return await Task<FileContentResult>.Run(() => { return GetImage(connectionId); });
        }

        private FileContentResult GetImage(string connectionId)
        {
            try
            {
                string token = GetToken();

                byte[] fileContents = GetUnlimited(token, connectionId);

                return new FileContentResult(fileContents, "image/*");
            }
            catch
            {

            }

            return null;
        }

        string GetToken()
        {
            string appId = "wx48b8a2ada91bb9a7";
            string secret = "ecbdce061e763a0fe8ba02c0c804ca61";
            string url = string.Format("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={0}&secret={1}", appId, secret);

            string result = new HttpClient().GetAsync(url).Result.Content.ReadAsStringAsync().Result;
            Dictionary<string, object> dict = Common.JsonToDictionary(result);
            return dict.GetStringValue("access_token");
        }

        byte[] GetUnlimited(string token, string scene)
        {
            string url = "https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=" + token;
            Dictionary<string, object> dict = new Dictionary<string, object>();
            dict.Add("scene", scene);
            dict.Add("page", "page/index/index");

            HttpClient client = new HttpClient();
            var response = client.PostAsync(url, new StringContent(Common.ToJsJson(dict), Encoding.UTF8, "application/json"));

            return response.Result.Content.ReadAsByteArrayAsync().Result;
        }
    }
}
