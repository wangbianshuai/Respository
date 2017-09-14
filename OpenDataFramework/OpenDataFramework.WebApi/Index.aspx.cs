using EntityDataService.Service;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace OpenDataFramework.WebApi
{
    public partial class Index : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
                string pageName = this.Request.QueryString["page"];
                string debug = this.Request.QueryString["debug"];

                this.InitJsCss();

                if (string.IsNullOrEmpty(pageName))
                {
                    pageName = "登录";
                }

                bool blDebug = debug == "true";
                bool blLogin = pageName.Equals("登录");
                string page = blLogin ? string.Empty : this.GetPageName(blDebug);

                if (blDebug)
                {
                    if (blLogin)
                    {
                        this.InitJsCss();
                        Component.RequestEntityType.VesionId = string.Format("V{0}", Guid.NewGuid().ToString().Substring(0, 8).ToUpper());
                    }

                    if (!string.IsNullOrEmpty(page) && this.Cache[page] != null) this.Cache.Remove(page);
                    page = string.Empty;
                }

                string html = string.Empty;
                if (!string.IsNullOrEmpty(page))
                {
                    html = this.GetHtml2(page);
                    if (string.IsNullOrEmpty(html)) page = string.Empty;
                }

                if (string.IsNullOrEmpty(page))
                {
                    page = blLogin ? "web/login.html" : "web/index.html";
                    html = this.GetHtml(page, blDebug);
                }

                if (blLogin)
                {
                    string publicCss = debug == "true" ? "web/css/1_public.css?v=${PageVersion}" : "css/public?s=true&v=${PageVersion}";
                    string indexPath = debug == "true" ? "web/index.src.js?v=${PageVersion}" : "js/index?s=true&v=${PageVersion}";

                    html = html.Replace("${PublicCss}", publicCss);
                    html = html.Replace("${IndexPath}", indexPath);
                }

                html = html.Replace("${PageVersion}", Component.RequestEntityType.VesionId);
                html = html.Replace("${PageName}", HttpUtility.UrlEncode(pageName));
                this.Response.Write(html);
            }
            catch (Exception ex)
            {
                this.Response.Write(ex.Message);
            }
        }

        private string GetPageName(bool blDebug)
        {
            string key = "RootPageName";
            if (blDebug && this.Cache[key] != null) this.Cache.Remove(key);

            if (this.Cache[key] != null) return this.Cache[key].ToString();

            string name = Code.Request.GetKeyValue("启动页面");
            this.Cache[key] = name;
            return name;
        }

        private string GetHtml(string page, bool blDebug)
        {
            if (blDebug && this.Cache[page] != null)
            {
                this.Cache.Remove(page);
            }

            string html = string.Empty;

            if (this.Cache[page] != null) return this.Cache[page].ToString();

            using (TextReader reader = new StreamReader(this.Server.MapPath(page)))
            {
                html = reader.ReadToEnd();
            }

            this.Cache[page] = html;

            return html;
        }

        private void InitJsCss()
        {
            DataCache.JsList = new System.Collections.Concurrent.ConcurrentDictionary<string, string>();
            DataCache.CssList = new System.Collections.Concurrent.ConcurrentDictionary<string, string>();
        }

        private string GetHtml2(string page)
        {
            string html = string.Empty;

            if (this.Cache[page] != null) return this.Cache[page].ToString();

            html = Code.Request.GetSource(page, "html");

            this.Cache[page] = html;

            return html;
        }
    }
}