using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Threading;
using System.Runtime.Remoting.Messaging;
using System.Diagnostics;

namespace EntityDataService.Utility
{
    public class Mail
    {
        public string Sender { get; set; }
        public List<string> ToList { get; set; }
        public List<string> CcList { get; set; }
        public List<string> AttachmentPathList { get; set; }
        public List<Dictionary<string, object>> AttachmentList { get; set; }
        public string Host { get; set; }
        public int Port { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Subject { get; set; }
        public string Boby { get; set; }
        public string BobyKeyword { get; set; }
        public Guid RelationId { get; set; }
        public List<Mail> ToMailList { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public long ElapsedMilliseconds { get; set; }

        public Exception Exception { get; set; }
    }

    public delegate void AsyncSendMailDelegate(Mail mail);

    public class MailUtility
    {
        public static void SendMail(Mail mail)
        {
            mail.StartTime = DateTime.Now;
            Stopwatch sw = new Stopwatch();
            sw.Start();

            MailMessage message = null;
            SmtpClient smtp = null;
            string msg = string.Empty;
            try
            {
                message = new MailMessage();
                smtp = new SmtpClient(mail.Host, mail.Port);

                message.From = new MailAddress(mail.Sender);
                if (mail.ToList != null && mail.ToList.Count > 0)
                {
                    mail.ToList.ForEach(t =>
                    {
                        message.To.Add(t);
                    });
                }
                if (mail.CcList != null && mail.CcList.Count > 0)
                {
                    mail.CcList.ForEach(c =>
                    {
                        message.CC.Add(c);
                    });
                }
                if (mail.AttachmentPathList != null && mail.AttachmentPathList.Count > 0)
                {
                    GetAttachments(mail.AttachmentPathList).ForEach(a =>
                    {
                        message.Attachments.Add(a);
                    });
                }
                message.Body = mail.Boby;
                message.BodyEncoding = Encoding.UTF8;
                message.IsBodyHtml = true;
                message.Subject = mail.Subject;
                message.SubjectEncoding = Encoding.UTF8;

                smtp.Credentials = new NetworkCredential(mail.UserName, mail.Password);
                smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                smtp.Send(message);
            }
            catch (Exception ex)
            {
                if (ex.InnerException != null)
                {
                    throw new Exception(ex.InnerException.Message);
                }
                else
                {
                    throw new Exception(ex.Message);
                }
            }
            finally
            {
                if (message != null)
                {
                    message.Dispose();
                }
                if (smtp != null)
                {
                    smtp.Dispose();
                }

                mail.EndTime = DateTime.Now;
                sw.Stop();
                mail.ElapsedMilliseconds = sw.ElapsedMilliseconds;
            }
        }

        public static void SendMail(string host, int port, string userName, string password, string subject, string boby, string sender, List<string> toList, List<string> ccList = null, List<string> attachmentPathList = null)
        {
            Mail mail = new Mail();
            mail.Host = host;
            mail.Port = port;
            mail.UserName = userName;
            mail.Password = password;
            mail.Subject = subject;
            mail.Boby = boby;
            mail.Sender = sender;
            mail.CcList = ccList;
            mail.ToList = toList;
            mail.AttachmentPathList = attachmentPathList;
            SendMail(mail);
        }

        public static List<Attachment> GetAttachments(List<string> pathList)
        {
            List<Attachment> attachmentList = new List<Attachment>();
            Attachment attachment = null;
            if (pathList != null)
            {
                pathList.ForEach(path =>
                {
                    attachment = new Attachment(path, MediaTypeNames.Application.Octet);
                    attachmentList.Add(attachment);
                });
            }
            return attachmentList;
        }

        public static void AsyncSendMail(Mail mail, Action<IAsyncResult, bool> callback = null)
        {
            AsyncSendMailDelegate asyncSendMail = AsyncSendMailHandler;
            IAsyncResult asyncResult = asyncSendMail.BeginInvoke(mail, AsyncSendMailCallback, null);
            ThreadPool.RegisterWaitForSingleObject(
              asyncResult.AsyncWaitHandle,
              AsyncSendMailCompleteCallback,
              new List<object>() { asyncResult, callback },
              1800000,
              true);
        }

        public static void AsyncSendMail(string host, int port, string userName, string password, string subject, string boby, string sender, List<string> toList, List<string> ccList = null, List<string> attachmentPathList = null, Action<IAsyncResult, bool> callback = null)
        {
            Mail mail = new Mail();
            mail.Host = host;
            mail.Port = port;
            mail.UserName = userName;
            mail.Password = password;
            mail.Subject = subject;
            mail.Boby = boby;
            mail.Sender = sender;
            mail.CcList = ccList;
            mail.ToList = toList;
            mail.AttachmentPathList = attachmentPathList;
            AsyncSendMail(mail, callback);
        }

        private static void AsyncSendMailHandler(Mail mail)
        {
            try
            {
                SendMail(mail);
            }
            catch (Exception ex)
            {
                mail.Exception = ex;
            }
        }

        private static void AsyncSendMailCallback(IAsyncResult result)
        {
            AsyncSendMailDelegate d = (AsyncSendMailDelegate)((AsyncResult)result).AsyncDelegate;
            d.EndInvoke(result);
        }

        private static void AsyncSendMailCompleteCallback(object state, bool isTimeout)
        {
            List<object> stateList = state as List<object>;
            IAsyncResult result = stateList[0] as IAsyncResult;
            Action<IAsyncResult, bool> callback = stateList[1] as Action<IAsyncResult, bool>;

            if (isTimeout)
            {
                if (!result.IsCompleted)
                {
                    result.AsyncWaitHandle.Close();
                }
            }

            callback(result, isTimeout);
        }
    }
}
