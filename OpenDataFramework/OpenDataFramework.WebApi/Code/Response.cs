using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OpenDataFramework.WebApi.Code
{
    public class Response
    {
        public Ack Ack { get; set; }

        public object Data { get; set; }

        public Response()
        {
            this.Ack = new Ack();
        }
    }

    public class Ack
    {
        public bool IsSuccess { get; set; }
        public int StatusCode { get; set; }
        public string StatusMessage { get; set; }

        public Ack()
        {
            this.IsSuccess = true;
            this.StatusMessage = string.Empty;
        }
    }
}