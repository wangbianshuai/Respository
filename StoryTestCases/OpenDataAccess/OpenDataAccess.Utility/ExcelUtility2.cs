using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using NPOI.HSSF.UserModel;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpenDataAccess.Utility
{
    public class ExcelUtility2
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

            using (SpreadsheetDocument doc = SpreadsheetDocument.Create(stream, SpreadsheetDocumentType.Workbook))
            {
                WorkbookPart workbook = doc.AddWorkbookPart();
                workbook.Workbook = new Workbook();

                WorksheetPart worksheetPart = CreateWorksheet(workbook, string.Empty);

                SheetData sheetData = worksheetPart.Worksheet.GetFirstChild<SheetData>();

                CreateStylesheet(workbook);

                //取得列宽
                int width = 0;
                int columnIndex = 0;
                object value = null;
                Dictionary<string, int> columnWidthDict = new Dictionary<string, int>();
                Dictionary<string, int> columnIndexDict = new Dictionary<string, int>();
                foreach (KeyValuePair<string, string> kvp in headerDict)
                {
                    columnIndexDict.Add(kvp.Key, columnIndex);
                    columnWidthDict.Add(kvp.Key, Encoding.GetEncoding(936).GetBytes(kvp.Value).Length);
                    columnIndex++;
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
                                width = width > 200 ? 200 : width;
                                columnWidthDict[kvp.Key] = width;
                            }
                        }
                    }
                });

                Row row = null;
                Cell cell = null;

                //列头
                row = new Row();
                row.RowIndex = 0;
                foreach (var kvp in headerDict)
                {
                    cell = CreateTextCell(columnIndexDict[kvp.Key], 0, kvp.Value, 2U);
                    row.AppendChild(cell);
                }
                sheetData.AppendChild(row);

                decimal dValue = 0;
                int rowIndex = 0;
                dictList.ForEach(d =>
                {
                    rowIndex = dictList.IndexOf(d) + 1;
                    row = new Row() { RowIndex = (uint)rowIndex };

                    foreach (var kvp in headerDict)
                    {
                        columnIndex = columnIndexDict[kvp.Key];
                        value = d.ContainsKey(kvp.Key) && d[kvp.Key] != null ? d[kvp.Key] : null;
                        if (value != null)
                        {
                            if (decimal.TryParse(value.ToString(), out dValue))
                            {
                                cell = CreateValueCell(columnIndex, rowIndex, value, 3U);
                            }
                            else
                            {
                                cell = CreateTextCell(columnIndex, rowIndex, value, 3U);
                            }
                        }
                        else
                        {
                            cell = CreateTextCell(columnIndex, rowIndex, string.Empty, 3U);
                        }
                        row.AppendChild(cell);
                    }

                    sheetData.AppendChild(row);
                });

            }
            stream.Flush();
            stream.Position = 0;
            return stream;
        }

        /// <summary>
        /// 导出Excel2003
        /// </summary>
        /// <param name="dictList"></param>
        /// <param name="headerDict"></param>
        /// <returns></returns>
        public static MemoryStream ExportExcel2003(List<Dictionary<string, object>> dictList, Dictionary<string, string> headerDict)
        {
            NPOI.SS.UserModel.IWorkbook workbook = new NPOI.HSSF.UserModel.HSSFWorkbook();
            NPOI.SS.UserModel.ISheet sheet = workbook.CreateSheet("Sheet1");

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
                            width = width > 200 ? 200 : width;
                            columnWidthDict[kvp.Key] = width;
                        }
                    }
                }
            });

            //列头
            NPOI.SS.UserModel.IRow headerRow = sheet.CreateRow(0);
            //样式
            NPOI.SS.UserModel.ICellStyle headStyle = workbook.CreateCellStyle();
            headStyle.Alignment = NPOI.SS.UserModel.HorizontalAlignment.Center;
            NPOI.SS.UserModel.IFont font = workbook.CreateFont();
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
            NPOI.SS.UserModel.ICellStyle dateStyle = workbook.CreateCellStyle();
            NPOI.SS.UserModel.IDataFormat format = workbook.CreateDataFormat();
            dateStyle.DataFormat = format.GetFormat("yyyy-MM-dd");

            NPOI.SS.UserModel.ICellStyle dateTimeStyle = workbook.CreateCellStyle();
            dateTimeStyle.DataFormat = format.GetFormat("yyyy-MM-dd HH:mm:ss");

            //内容数据
            NPOI.SS.UserModel.IRow dataRow = null;
            NPOI.SS.UserModel.ICell cell = null;
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

        /// <summary>
        /// 导出Excel2003
        /// </summary>
        /// <param name="dictList"></param>
        /// <returns></returns>
        public static MemoryStream ExportExcel2003(List<Dictionary<string, object>> dictList)
        {
            Dictionary<string, string> headerDict = new Dictionary<string, string>();
            if (dictList.Count > 0)
            {
                dictList[0].Keys.ToList().ForEach(a =>
                {
                    headerDict.Add(a, a);
                });
            }
            return ExportExcel2003(dictList, headerDict);
        }

        /// <summary>
        /// Excel2007导入
        /// </summary>
        /// <param name="stream"></param>
        /// <param name="validateData"></param>
        /// <param name="maxRowCount"></param>
        /// <returns></returns>
        public static List<List<Dictionary<string, string>>> Excel2007Import(Stream stream, out List<string> columnNameList, List<string> dateColumnNameList, Func<List<string>, string> validateColumn = null, Func<Dictionary<string, string>, string> validateData = null, int maxRowCount = 5000)
        {
            List<List<Dictionary<string, string>>> dataList = new List<List<Dictionary<string, string>>>();

            columnNameList = new List<string>();
            Dictionary<string, string> columnNameDict = null;

            List<string> stringValueList = null;
            List<Dictionary<uint, IEnumerable<Cell>>> cellList = null;
            int rowCount = 0;

            using (SpreadsheetDocument doc = SpreadsheetDocument.Open(stream, false))
            {
                WorkbookPart workbook = doc.WorkbookPart;
                List<Sheet> sheetList = doc.WorkbookPart.Workbook.Descendants<Sheet>().ToList();
                if (sheetList.Count == 0)
                {
                    throw new Exception("对不起，Excel中没有Sheet！");
                }

                WorksheetPart worksheetPart = (WorksheetPart)doc.WorkbookPart.GetPartById(sheetList.First().Id);

                List<Row> rowList = worksheetPart.Worksheet.Descendants<Row>().ToList();
                rowCount = rowList.Count;
                if (rowCount > maxRowCount)
                {
                    throw new Exception(string.Format("对不起，导入行数不能大于{0}！", maxRowCount));
                }

                stringValueList = SharedStringTablePartToStringValueList(doc.WorkbookPart.SharedStringTablePart);

                columnNameDict = GetColumnNameDict(rowList.First(), stringValueList, validateColumn);
                rowList.RemoveAt(0);

                cellList = GetRowCellList(rowList);
            }

            ParallelOptions po = new ParallelOptions();
            po.MaxDegreeOfParallelism = (rowCount / 10000) / 2 + 1;

            Parallel.ForEach(cellList, po, (dict) =>
            {
                dataList.Add(RowsToList(columnNameDict, dateColumnNameList, dict, stringValueList, validateData));
            });

            columnNameList = columnNameDict.Values.Distinct().ToList();

            return dataList;
        }

        private static Dictionary<string, string> GetColumnNameDict(Row columnRow, List<string> stringValueList, Func<List<string>, string> validateColumn = null)
        {
            List<Cell> cellList = null;

            Dictionary<string, string> columneNameDict = new Dictionary<string, string>();
            string value = string.Empty;
            string key = string.Empty;
            string message = string.Empty;

            cellList = columnRow.Descendants<Cell>().ToList();

            //取列名

            cellList.ForEach(cell =>
            {
                value = GetCellValue(cell, stringValueList, false);
                if (!string.IsNullOrEmpty(value))
                {
                    key = cell.CellReference.Value.Replace(columnRow.RowIndex.ToString(), string.Empty);
                    columneNameDict[key]= value;
                }
            });

            //验证列名
            if (validateColumn != null)
            {
                message = validateColumn(columneNameDict.Values.ToList());
            }

            if (!string.IsNullOrEmpty(message))
            {
                throw new Exception(message);
            }

            return columneNameDict;
        }

        private static List<Dictionary<uint, IEnumerable<Cell>>> GetRowCellList(List<Row> rowList)
        {
            List<Dictionary<uint, IEnumerable<Cell>>> batchList = new List<Dictionary<uint, IEnumerable<Cell>>>();
            Dictionary<uint, IEnumerable<Cell>> dict = null;

            int size = 10000;
            int iCount = rowList.Count / size + 1;
            int startIndex = 0;
            int endIndex = 0;

            Row row = null;

            for (var i = 1; i <= iCount; i++)
            {
                dict = new Dictionary<uint, IEnumerable<Cell>>();
                startIndex = (i - 1) * size;
                endIndex = i * size > rowList.Count ? rowList.Count : i * size;

                for (var j = startIndex; j < endIndex; j++)
                {
                    row = rowList[j];
                    dict.Add(row.RowIndex, row.Descendants<Cell>());
                }

                batchList.Add(dict);
            }

            return batchList;
        }

        private static List<Dictionary<string, string>> RowsToList(Dictionary<string, string> columneNameDict,List<string> dateColumnNameList, Dictionary<uint, IEnumerable<Cell>> cellDict, List<string> stringValueList, Func<Dictionary<string, string>, string> validateData = null)
        {
            List<Dictionary<string, string>> dictList = new List<Dictionary<string, string>>();
            Dictionary<string, string> dict = null;
          
            string value = string.Empty;
            string key = string.Empty;
            string message = string.Empty;
            bool blEmpty = true;

            foreach (var kvp in cellDict)
            {
                dict = new Dictionary<string, string>();
                blEmpty = true;

                foreach (var cell in kvp.Value)
                {
                    key = cell.CellReference.Value.Replace(kvp.Key.ToString(), string.Empty);
                    if (columneNameDict.ContainsKey(key))
                    {
                        key = columneNameDict[key];
                    }

                    value = GetCellValue(cell, stringValueList, dateColumnNameList.Contains(key));

                    value = string.IsNullOrEmpty(value) ? string.Empty : value.Trim();
                    if (blEmpty && !string.IsNullOrEmpty(value))
                    {
                        blEmpty = false;
                    }

                    dict[key] = value;
                }

                if (!blEmpty)
                {
                    //验证数据
                    if (validateData != null)
                    {
                        message = validateData(dict);
                    }

                    dictList.Add(dict);
                }

                if (!string.IsNullOrEmpty(message))
                {
                    throw new Exception(message);
                }
            }

            return dictList;
        }

        /// <summary>
        /// Excel2003导入
        /// </summary>
        /// <param name="stream"></param>
        /// <param name="validateData"></param>
        /// <param name="maxRowCount"></param>
        /// <returns></returns>
        public static List<Dictionary<string, string>> Excel2003Import(Stream stream, out List<string> columnNameList, Func<List<string>, string> validateColumn = null, Func<Dictionary<string, string>, string> validateData = null, int maxRowCount = 5000)
        {
            columnNameList = new List<string>();

            List<Dictionary<string, string>> dictList = new List<Dictionary<string, string>>();

            NPOI.SS.UserModel.IWorkbook hssfworkbook = new NPOI.HSSF.UserModel.HSSFWorkbook(stream);

            NPOI.HSSF.UserModel.HSSFSheet sheet = hssfworkbook.GetSheetAt(0) as NPOI.HSSF.UserModel.HSSFSheet;

            if (sheet == null)
            {
                throw new Exception("对不起，Excel中没有Sheet！");
            }

            List<NPOI.SS.UserModel.IRow> rowList = GetRowList(sheet).ToList();

            if (rowList.Count > maxRowCount)
            {
                throw new Exception(string.Format("对不起，导入行数不能大于{0}！", maxRowCount));
            }

            Dictionary<string, string> dict = null;

            string value = string.Empty;
            string message = string.Empty;
            Dictionary<int, string> columneNameDict = new Dictionary<int, string>();
            List<NPOI.SS.UserModel.ICell> cellList = null;
            NPOI.SS.UserModel.ICell cell = null;
            bool blEmpty = true;

            rowList.ForEach(row =>
            {
                dict = new Dictionary<string, string>();

                cellList = row.Cells.Cast<NPOI.SS.UserModel.ICell>().ToList();

                //取列名
                if (rowList.IndexOf(row) == 0)
                {
                    cellList.ForEach(c =>
                    {
                        c.SetCellType(NPOI.SS.UserModel.CellType.String);
                        value = c.StringCellValue;
                        if (!string.IsNullOrEmpty(value))
                        {
                            columneNameDict.Add(c.ColumnIndex, value.Trim());
                        }
                    });

                    //验证列名
                    if (validateColumn != null)
                    {
                        message = validateColumn(columneNameDict.Values.ToList());
                    }
                }
                else
                {
                    dict = new Dictionary<string, string>();
                    blEmpty = true;

                    foreach (KeyValuePair<int, string> kvp in columneNameDict)
                    {
                        value = string.Empty;
                        cell = cellList.Where(w => w.ColumnIndex == kvp.Key).FirstOrDefault();
                        if (cell != null)
                        {
                            if (cell.CellType == NPOI.SS.UserModel.CellType.Numeric && HSSFDateUtil.IsCellDateFormatted(cell))
                            {
                                value = Common.DateToString(cell.DateCellValue);
                            }
                            else
                            {
                                cell.SetCellType(NPOI.SS.UserModel.CellType.String);
                                value = cell.StringCellValue;
                            }
                        }
                        value = string.IsNullOrEmpty(value) ? string.Empty : value.Trim();
                        if (blEmpty && !string.IsNullOrEmpty(value))
                        {
                            blEmpty = false;
                        }
                        dict.Add(kvp.Value, value);
                    }

                    if (!blEmpty)
                    {
                        //验证数据
                        if (validateData != null)
                        {
                            message = validateData(dict);
                        }

                        dictList.Add(dict);
                    }
                }

                if (!string.IsNullOrEmpty(message))
                {
                    throw new Exception(message);
                }
            });

            columnNameList = columneNameDict.Values.Distinct().ToList();

            return dictList;
        }

        /// <summary>
        /// Excel2007获取单元格值
        /// </summary>
        /// <param name="cell"></param>
        /// <param name="stringValueList"></param>
        /// <returns></returns>
        private static string GetCellValue(Cell cell, List<string> stringValueList, bool blDate)
        {
            if (cell.ChildElements.Count == 0)
            {
                return string.Empty;
            }
            string value = cell.CellValue.InnerText;
            if (cell.DataType != null && cell.DataType == CellValues.SharedString)
            {
                value = stringValueList[int.Parse(value)];
            }
            if (cell.DataType == null && blDate)
            {
                double dDate = 0;
                if (double.TryParse(value, out dDate))
                {
                    value = DateTime.FromOADate(dDate).ToString("yyyy-MM-dd HH:mm:ss.fff");
                }
            }
            return string.IsNullOrEmpty(value) ? string.Empty : value.Trim();
        }

        private static List<string> SharedStringTablePartToStringValueList(SharedStringTablePart stringTablePart)
        {
            List<string> valueList = new List<string>();

            foreach (var element in stringTablePart.SharedStringTable.ChildElements)
            {
                valueList.Add(element.InnerText);
            }

            return valueList;
        }

        /// <summary>
        /// 获取Excel2003行列表
        /// </summary>
        /// <param name="sheet"></param>
        /// <returns></returns>
        private static IEnumerable<NPOI.SS.UserModel.IRow> GetRowList(NPOI.HSSF.UserModel.HSSFSheet sheet)
        {
            IEnumerator point = sheet.GetRowEnumerator();
            while (point.MoveNext())
            {
                object content = point.Current;
                yield return (NPOI.SS.UserModel.IRow)content;
            }
        }

        /// <summary>
        /// 创建Sheet
        /// </summary>
        /// <param name="workbookPart"></param>
        /// <param name="sheetName"></param>
        /// <returns></returns>
        private static WorksheetPart CreateWorksheet(WorkbookPart workbookPart, string sheetName)
        {
            WorksheetPart newWorksheetPart = workbookPart.AddNewPart<WorksheetPart>();

            newWorksheetPart.Worksheet = new Worksheet(new SheetData());

            newWorksheetPart.Worksheet.Save();

            Sheets sheets = workbookPart.Workbook.GetFirstChild<Sheets>();
            if (sheets == null)
            {
                sheets = workbookPart.Workbook.AppendChild<Sheets>(new Sheets());
            }
            string relationshipId = workbookPart.GetIdOfPart(newWorksheetPart);

            uint sheetId = 1;

            if (sheets.Elements<Sheet>().Count() > 0)
            {
                sheetId = sheets.Elements<Sheet>().Select(s => s.SheetId.Value).Max() + 1;
            }
            if (string.IsNullOrEmpty(sheetName))
            {
                sheetName = "Sheet" + sheetId;
            }

            Sheet sheet = new Sheet() { Id = relationshipId, SheetId = sheetId, Name = sheetName };
            sheets.Append(sheet);

            workbookPart.Workbook.Save();

            return newWorksheetPart;
        }

        /// <summary>
        /// 创建Sheet样式
        /// </summary>
        /// <param name="workbookPart"></param>
        /// <returns></returns>
        private static Stylesheet CreateStylesheet(WorkbookPart workbookPart)
        {
            Stylesheet stylesheet = null;

            if (workbookPart.WorkbookStylesPart != null)
            {
                stylesheet = workbookPart.WorkbookStylesPart.Stylesheet;
                if (stylesheet != null)
                {
                    return stylesheet;
                }
            }
            workbookPart.AddNewPart<WorkbookStylesPart>("Style");
            workbookPart.WorkbookStylesPart.Stylesheet = new Stylesheet();
            stylesheet = workbookPart.WorkbookStylesPart.Stylesheet;

            stylesheet.Fonts = new Fonts()
            {
                Count = (UInt32Value)3U
            };

            //fontId =0,默认样式
            Font fontDefault = new Font(
                                         new FontSize() { Val = 11D },
                                         new FontName() { Val = "Calibri" },
                                         new FontFamily() { Val = 2 },
                                         new FontScheme() { Val = FontSchemeValues.Minor });

            stylesheet.Fonts.Append(fontDefault);

            //fontId =1，标题样式
            Font fontTitle = new Font(new FontSize() { Val = 15D },
                                      new Bold() { Val = true },
                                      new FontName() { Val = "Calibri" },
                                      new FontFamily() { Val = 2 },
                                      new FontScheme() { Val = FontSchemeValues.Minor });
            stylesheet.Fonts.Append(fontTitle);

            //fontId =2，列头样式
            Font fontHeader = new Font(new FontSize() { Val = 13D },
                              new Bold() { Val = true },
                              new FontName() { Val = "Calibri" },
                              new FontFamily() { Val = 2 },
                              new FontScheme() { Val = FontSchemeValues.Minor });
            stylesheet.Fonts.Append(fontHeader);

            //fillId,0总是None，1总是gray125，自定义的从fillid =2开始
            stylesheet.Fills = new Fills()
            {
                Count = (UInt32Value)3U
            };

            //fillid=0
            Fill fillDefault = new Fill(new PatternFill() { PatternType = PatternValues.None });
            stylesheet.Fills.Append(fillDefault);

            //fillid=1
            Fill fillGray = new Fill();
            PatternFill patternFillGray = new PatternFill()
            {
                PatternType = PatternValues.Gray125
            };
            fillGray.Append(patternFillGray);
            stylesheet.Fills.Append(fillGray);

            //fillid=2
            Fill fillYellow = new Fill();
            PatternFill patternFillYellow = new PatternFill(new ForegroundColor() { Rgb = new HexBinaryValue() { Value = "FFFFFF00" } })
            {
                PatternType = PatternValues.Solid
            };
            fillYellow.Append(patternFillYellow);
            stylesheet.Fills.Append(fillYellow);

            stylesheet.Borders = new Borders()
            {
                Count = (UInt32Value)2U
            };

            //borderID=0
            Border borderDefault = new Border(new LeftBorder(), new RightBorder(), new TopBorder() { }, new BottomBorder(), new DiagonalBorder());
            stylesheet.Borders.Append(borderDefault);

            //borderID=1
            Border borderContent = new Border(
                new LeftBorder(new Color() { Auto = true }) { Style = BorderStyleValues.Thin },
                new RightBorder(new Color() { Auto = true }) { Style = BorderStyleValues.Thin },
                new TopBorder(new Color() { Auto = true }) { Style = BorderStyleValues.Thin },
                new BottomBorder(new Color() { Auto = true }) { Style = BorderStyleValues.Thin },
                new DiagonalBorder()
               );
            stylesheet.Borders.Append(borderContent);

            stylesheet.CellFormats = new CellFormats();
            stylesheet.CellFormats.Count = 3;

            //styleIndex =0U
            CellFormat cfDefault = new CellFormat();
            cfDefault.Alignment = new Alignment();
            cfDefault.NumberFormatId = 0;
            cfDefault.FontId = 0;
            cfDefault.BorderId = 0;
            cfDefault.FillId = 0;
            cfDefault.ApplyAlignment = true;
            cfDefault.ApplyBorder = true;
            stylesheet.CellFormats.Append(cfDefault);

            //styleIndex =1U
            CellFormat cfTitle = new CellFormat();
            cfTitle.Alignment = new Alignment();
            cfTitle.NumberFormatId = 0;
            cfTitle.FontId = 1;
            cfTitle.BorderId = 1;
            cfTitle.FillId = 0;
            cfTitle.ApplyBorder = true;
            cfTitle.ApplyAlignment = true;
            cfTitle.Alignment.Horizontal = HorizontalAlignmentValues.Center;
            stylesheet.CellFormats.Append(cfTitle);

            //styleIndex =2U
            CellFormat cfHeader = new CellFormat();
            cfHeader.Alignment = new Alignment();
            cfHeader.NumberFormatId = 0;
            cfHeader.FontId = 2;
            cfHeader.BorderId = 1;
            cfHeader.FillId = 2;
            cfHeader.ApplyAlignment = true;
            cfHeader.ApplyBorder = true;
            cfHeader.ApplyFill = true;
            cfHeader.Alignment.Horizontal = HorizontalAlignmentValues.Center;
            stylesheet.CellFormats.Append(cfHeader);

            //styleIndex =3U
            CellFormat cfContent = new CellFormat();
            cfContent.Alignment = new Alignment();
            cfContent.NumberFormatId = 0;
            cfContent.FontId = 0;
            cfContent.BorderId = 1;
            cfContent.FillId = 0;
            cfContent.ApplyAlignment = true;
            cfContent.ApplyBorder = true;
            stylesheet.CellFormats.Append(cfContent);

            workbookPart.WorkbookStylesPart.Stylesheet.Save();
            return stylesheet;
        }

        /// <summary>
        /// 创建文本单元格
        /// </summary>
        /// <param name="columnIndex"></param>
        /// <param name="rowIndex"></param>
        /// <param name="cellValue"></param>
        /// <param name="styleIndex"></param>
        /// <returns></returns>
        private static Cell CreateTextCell(int columnIndex, int rowIndex, object cellValue, Nullable<uint> styleIndex)
        {
            Cell cell = new Cell();

            cell.DataType = CellValues.InlineString;

            cell.CellReference = GetCellReference(columnIndex) + rowIndex;

            if (styleIndex.HasValue)
            {
                cell.StyleIndex = styleIndex.Value;
            }

            InlineString inlineString = new InlineString();
            Text t = new Text();

            t.Text = cellValue.ToString();
            inlineString.AppendChild(t);
            cell.AppendChild(inlineString);

            return cell;
        }

        /// <summary>
        /// 创建值类型单元格
        /// </summary>
        /// <param name="columnIndex"></param>
        /// <param name="rowIndex"></param>
        /// <param name="cellValue"></param>
        /// <param name="styleIndex"></param>
        /// <returns></returns>
        private static Cell CreateValueCell(int columnIndex, int rowIndex, object cellValue, Nullable<uint> styleIndex)
        {
            Cell cell = new Cell();
            cell.CellReference = GetCellReference(columnIndex) + rowIndex;
            CellValue value = new CellValue();
            value.Text = cellValue.ToString();

            if (styleIndex.HasValue)
            {
                cell.StyleIndex = styleIndex.Value;
            }

            cell.AppendChild(value);
            return cell;
        }

        /// <summary>
        /// 获取单元格引用
        /// </summary>
        /// <param name="colIndex"></param>
        /// <returns></returns>
        private static string GetCellReference(int colIndex)
        {
            int dividend = colIndex;
            string columnName = String.Empty;
            int modifier;

            while (dividend > 0)
            {
                modifier = (dividend - 1) % 26;
                columnName = Convert.ToChar(65 + modifier).ToString() + columnName;
                dividend = (int)((dividend - modifier) / 26);
            }
            return columnName;
        }
    }
}
