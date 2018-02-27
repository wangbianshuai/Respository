using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;
using System.Data;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using DocumentFormat.OpenXml;
using NPOI.SS.UserModel;
using NPOI.HSSF.UserModel;

namespace OpenDataAccess.Utility
{
    public class ExcelUtility
    {
        public static List<Dictionary<string, object>> ExcelImport(Stream stream, Func<Dictionary<string, object>, string> validateData = null, int maxRowCount = 5000)
        {
            List<Dictionary<string, object>> dictList = new List<Dictionary<string, object>>();
            using (SpreadsheetDocument doc = SpreadsheetDocument.Open(stream, false))
            {
                WorkbookPart workbook = doc.WorkbookPart;
                List<Sheet> sheetList = doc.WorkbookPart.Workbook.Descendants<Sheet>().ToList();
                if (sheetList.Count == 0)
                {
                    throw new Exception("对不起，Excel中没有Sheet！");
                }

                WorksheetPart worksheetPart = (WorksheetPart)doc.WorkbookPart.GetPartById(sheetList.First().Id);
                SharedStringTablePart stringTablePart = doc.WorkbookPart.SharedStringTablePart;

                Dictionary<string, object> dict = null;
                List<Cell> cellList = null;
                Cell currentCell = null;
                List<Row> rowList = worksheetPart.Worksheet.Descendants<Row>().ToList();
                if (rowList.Count > maxRowCount)
                {
                    throw new Exception(string.Format("对不起，导入行数不能大于{0}！", maxRowCount));
                }
                Dictionary<string, string> columneNameDict = new Dictionary<string, string>();
                string value = string.Empty;
                bool blEmpty = true;
                string message = string.Empty;
                char[] rowChars = null;
                rowList.ForEach(row =>
                {
                    cellList = row.Descendants<Cell>().ToList();
                    rowChars = (rowList.IndexOf(row) + 1).ToString().ToCharArray();

                    //取列名
                    if (rowList.IndexOf(row) == 0)
                    {
                        cellList.ForEach(cell =>
                        {
                            value = GetCellValue(cell, stringTablePart);
                            if (!string.IsNullOrEmpty(value))
                            {
                                columneNameDict.Add(cell.CellReference.Value.TrimEnd(rowChars), value);
                            }
                        });
                    }
                    else
                    {
                        dict = new Dictionary<string, object>();
                        blEmpty = true;
                        foreach (KeyValuePair<string, string> kvp in columneNameDict)
                        {
                            value = string.Empty;
                            currentCell = cellList.Where(c => c.CellReference.Value.TrimEnd(rowChars) == kvp.Key).FirstOrDefault();
                            if (currentCell != null)
                            {
                                value = GetCellValue(currentCell, stringTablePart);
                            }
                            if (!string.IsNullOrEmpty(value))
                            {
                                blEmpty = false;
                            }
                            dict.Add(kvp.Value, value);
                        }
                        if (!blEmpty)
                        {
                            if (validateData != null)
                            {
                                message = validateData(dict);
                                if (!string.IsNullOrEmpty(message))
                                {
                                    throw new Exception(message);
                                }
                            }
                            dictList.Add(dict);
                        }
                    }
                });
            }
            return dictList;
        }

        public static string GetCellValue(Cell cell, SharedStringTablePart stringTablePart)
        {
            if (cell.ChildElements.Count == 0)
            {
                return string.Empty;
            }
            string value = cell.CellValue.InnerText;
            if (cell.DataType != null && cell.DataType == CellValues.SharedString)
            {
                value = stringTablePart.SharedStringTable.ChildElements[int.Parse(value)].InnerText;
            }
            return string.IsNullOrEmpty(value) ? string.Empty : value.Trim();
        }

        public static string JudgeColumnValue(Dictionary<string, object> dict, string name, bool blNullable)
        {
            if (dict.ContainsKey(name))
            {
                if (!blNullable && string.IsNullOrEmpty(dict[name].ToString()))
                {
                    return string.Format("对不起，{0}不能为空！", name);
                }
            }
            else
            {
                return string.Format("对不起，列名\"{0}\"不存在！", name);
            }
            return string.Empty;
        }

        public static DataTable DictionaryListToDataTable(List<Dictionary<string, object>> dictList, List<ExcelDataColumn> columnList, Action<Dictionary<string, object>, DataRow> expandSetRow = null)
        {
            DataTable dt = new DataTable();
            columnList.ForEach(column =>
            {
                dt.Columns.Add(new DataColumn(column.DataColumnName, column.DataType));
            });
            if (dictList.Count == 0)
            {
                return dt;
            }
            DataRow dr = null;

            dictList.ForEach(dict =>
            {
                dr = dt.NewRow();
                columnList.ForEach(column =>
                {
                    if (dict.ContainsKey(column.ExcelColumnName))
                    {
                        dr[column.DataColumnName] = dict[column.ExcelColumnName];
                    }
                });
                if (expandSetRow != null)
                {
                    expandSetRow(dict, dr);
                }
                dt.Rows.Add(dr);
            });
            return dt;
        }

        /// <summary>
        /// 导出Excel
        /// </summary>
        /// <param name="dictList"></param>
        /// <param name="headerDict"></param>
        /// <param name="isExcel2003"></param>
        /// <returns></returns>
        public static MemoryStream ExportExcel(List<Dictionary<string, object>> dictList, Dictionary<string, string> headerDict)
        {
            IWorkbook workbook = new HSSFWorkbook();
            ISheet sheet = workbook.CreateSheet("Sheet1");

            //取得列宽
            int width = 0;
            int index = 0;
            object value = null;
            Dictionary<string, int> columnWidthDict = new Dictionary<string, int>();
            Dictionary<string, int> columnIndexDict = new Dictionary<string, int>();
            foreach (KeyValuePair<string, string> kvp in headerDict)
            {
                columnIndexDict.Add(kvp.Key, index);
                columnWidthDict.Add(kvp.Key, Encoding.GetEncoding(936).GetBytes(kvp.Value).Length);
                index++;
            }
            dictList.ForEach(d =>
            {
                foreach (KeyValuePair<string, string> kvp in headerDict)
                {
                    value = d.ContainsKey(kvp.Key) && d[kvp.Key] != null ? d[kvp.Key] : null;
                    if (value != null)
                    {
                        width = Encoding.GetEncoding(936).GetBytes(value.ToString()).Length;
                        if (width > columnWidthDict[kvp.Key])
                        {
                            columnWidthDict[kvp.Key] = width;
                        }
                    }
                }
            });


            //列头
            IRow headerRow = sheet.CreateRow(0);
            //样式
            ICellStyle headStyle = workbook.CreateCellStyle();
            headStyle.Alignment = NPOI.SS.UserModel.HorizontalAlignment.Center;
            IFont font = workbook.CreateFont();
            font.FontHeightInPoints = 10;
            font.Boldweight = 700;
            headStyle.SetFont(font);

            foreach (var kvp in headerDict)
            {
                index = columnIndexDict[kvp.Key];
                headerRow.CreateCell(index).SetCellValue(kvp.Value);
                headerRow.GetCell(index).CellStyle = headStyle;
                //设置列宽
                sheet.SetColumnWidth(index, columnWidthDict[kvp.Key] * 256 + 1000);
            }

            //日期格式
            ICellStyle dateStyle = workbook.CreateCellStyle();
            IDataFormat format = workbook.CreateDataFormat();
            dateStyle.DataFormat = format.GetFormat("yyyy-MM-dd");

            ICellStyle dateTimeStyle = workbook.CreateCellStyle();
            dateTimeStyle.DataFormat = format.GetFormat("yyyy-MM-dd HH:mm:ss");

            //内容数据
            IRow dataRow = null;
            ICell cell = null;
            double dValue = 0;
            dictList.ForEach(d =>
            {
                dataRow = sheet.CreateRow(dictList.IndexOf(d) + 1);

                foreach (var kvp in headerDict)
                {
                    index = columnIndexDict[kvp.Key];

                    value = d.ContainsKey(kvp.Key) && d[kvp.Key] != null ? d[kvp.Key] : null;
                    cell = dataRow.CreateCell(index);
                    if (value != null)
                    {
                        if (value is bool)
                        {
                            cell.SetCellValue((bool)value);
                        }
                        else if (value is DateTime)
                        {
                            cell.SetCellValue((DateTime)value);
                            if (((DateTime)value).Ticks == ((DateTime)value).Date.Ticks)
                            {
                                cell.CellStyle = dateStyle;
                            }
                            else
                            {
                                cell.CellStyle = dateTimeStyle;
                            }
                        }
                        else if (value is string)
                        {
                            cell.SetCellValue((string)value);
                        }
                        else
                        {
                            if (double.TryParse(value.ToString(), out dValue))
                            {
                                cell.SetCellValue(dValue);
                            }
                            else
                            {
                                cell.SetCellValue(value.ToString());
                            }
                        }
                    }
                    else
                    {
                        cell.SetCellValue(string.Empty);
                    }
                }
            });

            MemoryStream ms = new MemoryStream();
            workbook.Write(ms);
            ms.Flush();
            ms.Position = 0;
            sheet = null;
            workbook = null;
            return ms;
        }
    }

    public class ExcelDataColumn
    {
        public string ExcelColumnName { get; set; }
        public string DataColumnName { get; set; }
        public Type DataType { get; set; }

        public ExcelDataColumn(string excelColumnName, string dataColumnName, Type dataType)
        {
            this.ExcelColumnName = excelColumnName;
            this.DataColumnName = dataColumnName;
            this.DataType = dataType;
        }
    }
}
