using iTextSharp.text;
using iTextSharp.text.html.simpleparser;
using iTextSharp.text.pdf;
using iTextSharp.tool.xml;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpenDataAccess.Utility
{
    public class PdfDocument
    {
        public static void CreatePdfFromHtml(string html, string css, string fileName)
        {
            Common.SaveFile(CreatePdfFromHtml(html, css), fileName);
        }

        public static byte[] CreatePdfFromHtml(string html, string css)
        {
            //内存流
            using (MemoryStream ms = new MemoryStream())
            {
                Document doc = new Document(PageSize.A4, 10, 10, 10, 10);
                //为该Document创建一个Writer实例
                PdfWriter writer = PdfWriter.GetInstance(doc, ms);
                writer.CloseStream = false;
                //打开
                doc.Open();

                AddHtml(doc, writer, html, css);

                // 重置页面数量 
                doc.ResetPageCount();
                //关闭目标文件 
                doc.Close();
                //关闭写入流 
                writer.Close();

                ms.Position = 0;
                ms.Flush();

                return ms.ToArray();
            }
        }

        static void AddHtml(Document doc, PdfWriter writer, string html, string css)
        {
            MemoryStream stream = new MemoryStream(System.Text.Encoding.UTF8.GetBytes(html));
            MemoryStream cssStream = new MemoryStream(System.Text.Encoding.UTF8.GetBytes(css));
            XMLWorkerHelper.GetInstance().ParseXHtml(writer, doc, stream, cssStream, System.Text.Encoding.UTF8, new SongFontFactory());
        }

        public static void CreatePdfFromImage(List<byte[]> imageList, string fileName)
        {
            Common.SaveFile(CreatePdfFromImage(imageList), fileName);
        }

        public static byte[] CreatePdfFromImage(List<byte[]> imageList)
        {
            //内存流
            using (MemoryStream ms = new MemoryStream())
            {
                Document doc = new Document(PageSize.A4, 0, 0, 0, 0);
                //为该Document创建一个Writer实例
                PdfWriter writer = PdfWriter.GetInstance(doc, ms);
                writer.CloseStream = false;
                //打开
                doc.Open();

                imageList.ForEach(i =>
                {
                    Image image = Image.GetInstance(i);
                    image.ScaleAbsolute(image.Width / 4, image.Height / 4);

                    doc.NewPage();
                    doc.Add(image);
                });

                // 重置页面数量 
                doc.ResetPageCount();
                //关闭目标文件 
                doc.Close();
                //关闭写入流 
                writer.Close();

                ms.Position = 0;
                ms.Flush();

                return ms.ToArray();
            }
        }
    }

    /// <summary>
    /// 重写iTextSharp字体(仅仅使用宋体)
    /// </summary>
    public class SongFontFactory : IFontProvider
    {
        public Font GetFont(string fontname, string encoding, bool embedded, float size, int style, BaseColor color)
        {
            BaseFont bf3 = BaseFont.CreateFont(@"c:\windows\fonts\simsun.ttc,1", BaseFont.IDENTITY_H, BaseFont.NOT_EMBEDDED);
            Font fontContent = new Font(bf3, size, style, color);
            return fontContent;
        }

        public Boolean IsRegistered(string fontname)
        {
            return false;
        }
    }
}
