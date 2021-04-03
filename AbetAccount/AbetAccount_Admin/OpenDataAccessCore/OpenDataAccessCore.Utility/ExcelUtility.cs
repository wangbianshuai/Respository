using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace OpenDataAccessCore.Utility
{
    public class ExcelUtility
    {
        /// <summary>
        /// 导出Excel2007
        /// </summary>
        /// <param name="dictList"></param>
        /// <param name="headerDict"></param>
        /// <returns></returns>
        public static MemoryStream ExportExcel2007(List<Dictionary<string, object>> dictList, Dictionary<string, string> headerDict)
        {
            MemoryStream stream = new MemoryStream();

            using (ExcelPackage package = new ExcelPackage(stream))
            {
                // 添加worksheet
                ExcelWorksheet worksheet = package.Workbook.Worksheets.Add("Sheet1");

                Dictionary<string, int> columnIndexDict = new Dictionary<string, int>();
                Dictionary<int, int> columnWidthDict = new Dictionary<int, int>();

                //添加头
                int index = 0;
                foreach (var kvp in headerDict)
                {
                    index += 1;
                    worksheet.Cells[1, index].Value = kvp.Value;
                    worksheet.Cells[1, index].Style.Font.Bold = true;
                    columnIndexDict.Add(kvp.Key, index);
                    columnWidthDict.Add(index, ComputeWidth(kvp.Value, true));
                }


                //添加值
                int rowIndex = 1;
                object value = null;
                int columnIndex = 0;
                int width = 0;
                dictList.ForEach(d =>
                {
                    rowIndex += 1;
                    foreach (var kvp in d)
                    {
                        if (columnIndexDict.ContainsKey(kvp.Key))
                        {
                            value = ChangeValue(kvp.Value);
                            columnIndex = columnIndexDict[kvp.Key];
                            width = ComputeWidth(value, false);
                            worksheet.Cells[rowIndex, columnIndex].Value = value;
                            if (columnWidthDict[columnIndex] < width) columnWidthDict[columnIndex] = width;
                        }
                    }
                });

                foreach (var kvp in columnWidthDict) worksheet.Column(kvp.Key).Width = kvp.Value;

                package.Save();
            }

            stream.Flush();
            stream.Position = 0;
            return stream;
        }

        static int ComputeWidth(object value, bool blBold)
        {
            if (value == null) return 0;
            string str = value.ToString();
            int width = blBold ? Common.GetStringHeaderWidth(str) : Common.GetStringWidth(str);
            return Convert.ToInt32(width / 6) + 2;
        }

        static object ChangeValue(object value)
        {
            if (value == null) return null;

            if (value is DateTime)
            {
                DateTime date = (DateTime)value;
                if (date == date.Date) return date.ToString("yyyy-MM-dd");
                else return date.ToString("yyyy-MM-dd HH:mm:ss");
            }

            return value;
        }

        /// <summary>
        /// Excel2007导入
        /// </summary>
        /// <param name="stream"></param>
        /// <param name="validateColumn"></param>
        /// <param name="validateData"></param>
        /// <param name="maxRowCount"></param>
        /// <returns></returns>
        public static List<Dictionary<string, object>> Excel2007Import(Stream stream, Func<List<string>, string> validateColumn = null, Func<Dictionary<string, object>, string> validateData = null, int maxRowCount = 5000)
        {
            List<Dictionary<string, object>> dataList = new List<Dictionary<string, object>>();

            Dictionary<int, string> columnNameDict = null;
            Dictionary<string, object> data = null;

            using (ExcelPackage package = new ExcelPackage(stream))
            {
                if (package.Workbook.Worksheets.Count == 0) throw new Exception("对不起，Excel中没有Sheet！");

                ExcelWorksheet worksheet = package.Workbook.Worksheets[1];

                int rowCount = worksheet.Dimension.Rows;
                if (rowCount > maxRowCount) throw new Exception(string.Format("对不起，导入行数不能大于{0}！", maxRowCount));

                //列名
                columnNameDict = GetColumnNameDict(worksheet, validateColumn);

                //数据
                for (int row = 2; row <= rowCount; row++)
                {
                    data = new Dictionary<string, object>();
                    foreach (var kvp in columnNameDict) data[kvp.Value] = worksheet.Cells[row, kvp.Key].Value;
                    dataList.Add(data);
                }
            }

            //验证数据
            if (validateData != null)
            {
                string message = string.Empty;
                foreach (var dict in dataList)
                {
                    message = validateData(dict);
                    if (!string.IsNullOrEmpty(message)) throw new Exception(message);
                }
            }

            return dataList;
        }

        private static Dictionary<int, string> GetColumnNameDict(ExcelWorksheet worksheet, Func<List<string>, string> validateColumn = null)
        {
            int colCount = worksheet.Dimension.Columns;
            Dictionary<int, string> columneNameDict = new Dictionary<int, string>();
            object value = null;
            string message = string.Empty;

            for (int col = 1; col <= colCount; col++)
            {
                value = worksheet.Cells[1, col].Value;
                if (value != null) columneNameDict.Add(col, value.ToString());
            }

            //验证列名
            if (validateColumn != null) message = validateColumn(columneNameDict.Values.ToList());

            if (!string.IsNullOrEmpty(message)) throw new Exception(message);

            return columneNameDict;
        }
    }
}
