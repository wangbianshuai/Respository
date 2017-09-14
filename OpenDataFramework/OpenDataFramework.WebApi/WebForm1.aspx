<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="OpenDataFramework.WebApi.WebForm1" ValidateRequest="false" EnableEventValidation="false" EnableViewState="false" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <div>
            <asp:Button ID="Button1" runat="server" OnClick="Button1_Click" Text="生成OpenDataFramework.js文件" />
            <br />
            <br />
            <asp:Button ID="Button2" runat="server" Text="生成WebOpen.css" OnClick="Button2_Click" /><br />
            <br />
            <textarea style="height: 404px; width: 783px" id="textarea1" runat="server"></textarea>
        </div>
    </form>
</body>
</html>
