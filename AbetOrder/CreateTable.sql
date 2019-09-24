use AbetOrder
go

--用户
drop table t_d_User
go

create table t_d_User
(
UserId uniqueidentifier not null primary key default(newid()),   --主键
UserName nvarchar(50) not null,
LoginName nvarchar(50) not null,
LoginPassword nvarchar(50) not null,
LastLoginDate datetime,
DataRight int default(0), 
Phone varchar(50),
Telephone varchar(50),
Fax varchar(50),
Address nvarchar(200),
BankCardNo varchar(50),
OpenBank nvarchar(50),
IsDelete tinyint not null default(0),                           --是否删除
CreateDate datetime default(getdate()) not null,
RowVersion timestamp not null 
)
go

drop view v_User
go

create view v_User
as
select a.*,
case when DataRight = 1 then '公司' when DataRight=2 then '工厂' when DataRight=3 then '管理员' else '' end DataRightName
from t_d_User a where IsDelete=0
go

drop table t_d_OperationLog 
go

--操作日志
create table t_d_OperationLog
(
LogId uniqueidentifier not null primary key default(newid()),   --主键
LogType nvarchar(20) not null,                                  --日志类型
LogPath nvarchar(200) not null,                                 --日志路径
EntityName varchar(50) not null,                                --实体名
RequestType varchar(10) not null,                               --请求类型
MethodName varchar(50),                                         --方法名
IPAddress varchar(30),                                          --IP地址
StartTime datetime not null,                                    --开始时间
EndTime datetime not null,                                      --结束时间
ElapsedMilliseconds bigint not null,                            --运行耗时
OperationUser nvarchar(50),                                     --操作人
IsDelete tinyint not null default(0),                           --是否删除
CreateDate datetime not null default(getdate()),                --创建时间
RowVersion timestamp not null                                   --行版本
)
go

drop view v_OperationLog
go

create view v_OperationLog
as
select a.*,b.UserName, '详细' LookDetail from t_d_OperationLog a
left join t_d_User b
on a.OperationUser=convert(varchar(36),b.UserId)
go

drop table t_d_Customer
go

create table t_d_Customer
(
Id uniqueidentifier not null primary key default(newid()),   --主键
Name nvarchar(50) not null,
CompanyName nvarchar(50),
Linkman nvarchar(50),
Phone varchar(50),
Telephone varchar(50),
Fax varchar(50),
Address nvarchar(200),
Remark nvarchar(200),
DepotName nvarchar(50),
DepotAddress nvarchar(200),
Consignee nvarchar(50),          --收货人
ConsigneePhone nvarchar(50),       --收货人电话
IsDelete tinyint not null default(0),                           --是否删除
CreateDate datetime not null default(getdate()),                --创建时间
RowVersion timestamp not null                                   --行版本
)
go

drop view v_Customer
go

create view v_Customer 
as
select * from t_d_Customer where IsDelete=0
go


drop table t_d_Order
go

create table t_d_Order
(
OrderId uniqueidentifier not null primary key default(newid()),   --主键
OrderCode varchar(50) not null,
OrderIntCode int not null default(0),
OrderStatus tinyint not null default(0),
OrderDate datetime not null,
DeliveryDate datetime,
OrderName nvarchar(50) not null,
--Amount money, --明细总金额
ActualAmount money not null, --订单金额
PaidDeposit money, --已收金额
--ShouldPayBalance money, --应收余额
DiscountRate float, --折扣比
ProcessAmount money, --加工费
--CostAmount money, --成本金额
--ExtraCharge money, --附加费
--Profit money, --利润
CustomerId uniqueidentifier not null,
Remark nvarchar(200),
CreateUser uniqueidentifier,
UpdateUser uniqueidentifier,
UpdateDate datetime,
FactoryId uniqueidentifier,
--OrderPdfPath nvarchar(50),
--ProcessPdfPath nvarchar(50),
--OrderTemplateHtmlId uniqueidentifier,
--ProcessTemplateHtmlId uniqueidentifier,
IsDelete tinyint not null default(0),                           --是否删除
CreateDate datetime not null default(getdate()),                --创建时间
RowVersion timestamp not null                                   --行版本
)
go

select * from t_d_Order

drop view v_Order
go

create view v_Order
as
with DetailAmount as
(
select OrderId,DetailType,sum(Amount) Amount from t_d_OrderDetail
group by OrderId,DetailType
),
OrderBill as
(
select DataId,sum(Amount) Amount from t_d_Bill where IsDelete=0 and DataId is not null and IncomePayment=2
group by DataId
)
select a.*,
isnull(g.Amount,0) Amount,
isnull(j.Amount,0) ExtraCharge,
isnull(k.Amount,0) CostAmount,
isnull(b.DataRight,0) DataRight,
isnull(a.ActualAmount,0)-isnull(a.PaidDeposit,0) ShouldPayBalance,
isnull(a.ActualAmount,0)-isnull(k.Amount,0)-isnull(a.ProcessAmount,0) Profit,
b.UserName as CreateUserName,
c.UserName as UpdateUserName,
e.Name as CustomerName,
OrderCode+'/'+ OrderName as OrderName2,
0-isnull(k.Amount,0) CostAmount2,
0-isnull(ProcessAmount,0) ProcessAmount2,
case when a.OrderStatus = 0 then '未确认' when a.OrderStatus = 1 then '已确认' 
when a.OrderStatus = 2 then '已完成' else '' end OrderStatusName
from t_d_Order a
left join t_d_User b on a.CreateUser=b.UserId
left join t_d_User c on a.UpdateUser=c.UserId
left join t_d_Customer e on a.CustomerId=e.Id
left join DetailAmount g on a.OrderId=g.OrderId and g.DetailType=1
left join DetailAmount j on a.OrderId=j.OrderId and j.DetailType=2
left join OrderBill k on a.OrderId=k.DataId
where a.IsDelete=0 and b.DataRight=1
go

drop view v_Order2
go

create view v_Order2
as
select a.OrderId,a.OrderDate,
OrderCode+'/'+ OrderName as OrderName2
from t_d_Order a
where a.IsDelete=0
go


select * from v_Order

drop view v_ProcessOrder
go

create view v_ProcessOrder
as
select 
a.OrderId,
a.OrderIntCode,
a.OrderCode,
a.OrderName,
a.OrderDate,
a.DeliveryDate,
a.UpdateUser,
a.UpdateDate,
a.ProcessAmount,
d.UserName as CreateUserName,
c.UserName as UpdateUserName,
g.UserId CreateUser2,
isnull(e.BillStatus,0) BillStatus,
case when e.BillStatus = 1 then '已确认' else'未确认' end BillStatusName
from t_d_Order a
left join t_d_User d on a.CreateUser= d.UserId
left join t_d_User c on a.UpdateUser=c.UserId
left join t_d_DealingsBill e on a.OrderId=e.DataId and e.IsDelete=0
inner join t_d_Factory f on a.FactoryId=f.Id and f.IsDelete=0
inner join t_d_DealingsBookUser g on f.DealingsBookId=g.BookId
inner join t_d_User h on h.UserId=g.UserId and h.DataRight=2
where a.IsDelete=0 and a.OrderStatus>0 
go

select * from v_ProcessOrder

drop table t_d_OrderImage
go

create table t_d_OrderImage
(
Id uniqueidentifier not null primary key default(newid()),   --主键
Name nvarchar(50) not null,
DisplayIndex int not null default(0),
OrderId uniqueidentifier not null,
FileType tinyint not null default(1), --1:Image,2:File
ImageUrl nvarchar(200),
RowVersion timestamp not null                                   --行版本
)
go

drop table t_d_OrderDetail
go

create table t_d_OrderDetail
(
OrderDetailId uniqueidentifier not null primary key default(newid()),   --主键
OrderId uniqueidentifier not null,
DisplayIndex int not null,
Width float,
Height float,
Area float, 
Thickness float,
Price money,
Number float,
DetailType tinyint not null default(1), --1:订单明细，2：加工附加费
Amount money not null,
Remark nvarchar(200),
FontColor varchar(20),
FontSize varchar(10),
FontFamily nvarchar(50),
IsBold tinyint default(0) not null,
IsUnderline tinyint default(0) not null
)
go

drop table t_d_ProcessItem
go

create table t_d_ProcessItem
(
Id uniqueidentifier not null primary key default(newid()),   --主键
Name nvarchar(100) not null,
DisplayIndex int not null default(0),
IsDelete tinyint not null default(0),                           --是否删除
CreateDate datetime not null default(getdate()),                --创建时间
RowVersion timestamp not null                                   --行版本
)
go

drop  view v_ProcessItem
go

create view v_ProcessItem
as
select a.*
 from t_d_ProcessItem a where IsDelete=0
go


drop table t_d_RemarkItem
go

create table t_d_RemarkItem
(
Id uniqueidentifier not null primary key default(newid()),   --主键
Name nvarchar(100) not null,
DisplayIndex int not null default(0),
IsDelete tinyint not null default(0),                           --是否删除
CreateDate datetime not null default(getdate()),                --创建时间
RowVersion timestamp not null                                   --行版本
)
go

drop  view v_RemarkItem
go

create view v_RemarkItem 
as
select a.*
 from t_d_RemarkItem a where IsDelete=0
go

drop table t_d_BillType
go

create table t_d_BillType
(
Id uniqueidentifier not null primary key default(newid()),   --主键
Name nvarchar(100) not null,
IncomePayment tinyint not null, -- 1: 收入，2：支出
Remark nvarchar(200),
IsDelete tinyint not null default(0),                           --是否删除
CreateDate datetime not null default(getdate()),                --创建时间
RowVersion timestamp not null                                   --行版本
)
go

drop view v_BillType
go

create view v_BillType
as
select a.*,
case when a.IncomePayment = 1 then '收入'  when a.IncomePayment = 2 then '支出' else'' end IncomePaymentName
 from t_d_BillType a where IsDelete=0
go

drop table t_d_Bill
go

create table t_d_Bill
(
Id uniqueidentifier not null primary key default(newid()),   --主键
DataId uniqueidentifier,
Amount money,
BillTypeId uniqueidentifier not null,
IncomePayment tinyint not null, -- 1: 收入，2：支出
Remark nvarchar(200),
CreateUser uniqueidentifier,
ApproveUser uniqueidentifier,
ApproveDate datetime,
UpdateDate datetime,
DataType tinyint, -- 1:已收金额
BillStatus tinyint not null default(0), --0:未确认，1：确认
BillDate datetime not null default(getdate()),    
IsDelete tinyint not null default(0),                           --是否删除
CreateDate datetime not null default(getdate()),                --创建时间
RowVersion timestamp not null                                   --行版本
)
go

drop view v_Bill
go

create view v_Bill
as
select a.*,
b.DataRight,
case when a.IncomePayment = 1 then '收入'  when a.IncomePayment = 2 then '支出' else'' end IncomePaymentName,
case when a.IncomePayment = 2 then  0-a.Amount  else a.Amount end Amount2,
b.UserName as CreateUserName,
c.UserName as ApproveUserName,
e.Name as BillTypeName,
case when a.BillStatus = 1 then '已确认'  else'未确认' end BillStatusName,
f.OrderCode+'/'+ f.OrderName as OrderName2
from t_d_Bill a
left join t_d_User b on a.CreateUser=b.UserId
left join t_d_User c on a.ApproveUser=c.UserId
left join t_d_BillType e on a.BillTypeId=e.Id
left join t_d_Order f on a.DataId=f.OrderId
where a.IsDelete=0 and b.DataRight=1
go

select * from v_Bill


drop table t_d_TemplateHtml
go

-- 模板页面html
create table t_d_TemplateHtml
(
Id uniqueidentifier not null primary key default(newid()),   --主键
Name nvarchar(50) not null, -- 名称
Html nvarchar(max) not null, -- 内容
Css nvarchar(max), -- 内容
Remark nvarchar(200),
IsDelete tinyint not null default(0),                           --是否删除
CreateDate datetime not null default(getdate()),                --创建时间
RowVersion timestamp not null                                   --行版本
)
go

drop view v_TemplateHtml
go
create view v_TemplateHtml
as
select * from t_d_TemplateHtml where IsDelete=0
go

drop table t_d_OrderPdf
go

create table t_d_OrderPdf
(
Id uniqueidentifier not null primary key default(newid()),   --主键
CreateUser uniqueidentifier,
OrderId uniqueidentifier not null,
PdfPath nvarchar(200),
GenStatus tinyint not null default(1), -- 1：成功 2：失败
FailMessage nvarchar(2000),
PdfType tinyint not null default(1), -- 1:订单，2：加工单
CreateDate datetime not null default(getdate())                --创建时间
)
go

drop view v_OrderPdf 
go
create view v_OrderPdf 
as
select 
ROW_NUMBER() over(partition by a.OrderId order by a.CreateDate desc) FailId,
a.*,
b.UserName CreateUserName,
b.DataRight,
c.OrderCode+'/'+c.OrderName as OrderName2,
case when a.GenStatus=1 then '成功' else '失败' end GenStatusName,
case when a.PdfType = 1 then '订单'  when a.PdfType = 2 then '加工单' else'' end PdfTypeName
from t_d_OrderPdf a
left join t_d_User b on a.CreateUser=b.UserId
left join t_d_Order c on a.OrderId=c.OrderId
where b.DataRight=1
go


drop table t_d_PersonBill
go

create table t_d_PersonBill
(
Id uniqueidentifier not null primary key default(newid()),   --主键
Amount money,
IncomePayment tinyint not null, -- 1: 收入，2：支出
Remark nvarchar(200),
CreateUser uniqueidentifier,
UpdateDate datetime,
BillDate datetime not null default(getdate()),    
IsDelete tinyint not null default(0),                           --是否删除
CreateDate datetime not null default(getdate()),                --创建时间
RowVersion timestamp not null                                   --行版本
)
go

drop view v_PersonBill
go

create view v_PersonBill
as
select a.*,
case when a.IncomePayment = 1 then '收入'  when a.IncomePayment = 2 then '支出' else'' end IncomePaymentName,
case when a.IncomePayment = 2 then  0-a.Amount  else a.Amount end Amount2
from t_d_PersonBill a
where a.IsDelete=0
go

select * from v_PersonBill

drop table t_d_ContentTag;

-- 内容 标签 表 
create table t_d_ContentTag
(
Id uniqueidentifier not null primary key default(newid()),   --主键
Name nvarchar(50) not null,  -- 名称 
SqlStatement nvarchar(max), -- sql语句
WebApiUrl nvarchar(500), -- webapi 地址
ParameterNames nvarchar(2000), -- 参数名集名
Remark nvarchar(100),-- 备注
IsDelete tinyint not null default(0),                           --是否删除
CreateDate datetime not null default(getdate()),                --创建时间
RowVersion timestamp not null                                   --行版本
)
go

drop view v_ContentTag
go
create view v_ContentTag
as
select * from t_d_ContentTag where IsDelete=0
go

drop table t_d_DealingsBill
go

create table t_d_DealingsBill
(
Id uniqueidentifier not null primary key default(newid()),   --主键
DataId uniqueidentifier,
Amount money,
BillTypeId uniqueidentifier not null,
Remark nvarchar(200),
CreateUser uniqueidentifier,
ApproveDate datetime,
ApproveUser uniqueidentifier,
UpdateDate datetime,
DealingsUser uniqueidentifier not null, --业务往来人
BillStatus tinyint not null default(0), --0:未确认，1：确认
BillDate datetime not null default(getdate()),    
IsDelete tinyint not null default(0),                           --是否删除
CreateDate datetime not null default(getdate()),                --创建时间
RowVersion timestamp not null                                   --行版本
)
go

drop view v_DealingsBill
go

create view v_DealingsBill
as
select a.*,
2 IncomePayment,
'出账'as IncomePaymentName,
0-a.Amount  Amount2,
b.UserName as CreateUserName,
a.CreateUser CreateUser2,
e.Name as BillTypeName,
a.DealingsUser DealingsUser2,
f.UserName ApproveUserName,
null OrderSaleUser,
null OrderName2,
case when a.BillStatus = 1 then '已确认'  else'未确认' end BillStatusName
from t_d_DealingsBill a
left join t_d_User b on a.CreateUser=b.UserId
inner join t_d_User d on a.DealingsUser=d.UserId
left join t_d_DealingsBillType e on a.BillTypeId=e.Id
left join t_d_User f on a.ApproveUser=f.UserId
where a.IsDelete=0
union all
select a.*,
2 IncomePayment,
'出账'as IncomePaymentName,
0-a.Amount  Amount2,
b.UserName as CreateUserName,
f.UserId CreateUser2,
e.Name as BillTypeName,
a.DealingsUser DealingsUser2,
j.UserName ApproveUserName,
null OrderSaleUser,
k.OrderCode+'/'+ k.OrderName OrderName2,
case when a.BillStatus = 1 then '已确认'  else'未确认' end BillStatusName
from t_d_DealingsBill a
left join t_d_User b on a.CreateUser=b.UserId
inner join t_d_DealingsBookUser h on a.CreateUser=h.UserId and a.DealingsUser=h.BookId
inner join t_d_DealingsBookUser f on f.UserType=h.UserType and a.DealingsUser=f.BookId
inner join t_d_User d on f.UserId=d.UserId
inner join t_d_DealingsBook g on a.DealingsUser= g.BookId
left join t_d_DealingsBillType e on a.BillTypeId=e.Id
left join t_d_User j on a.ApproveUser=j.UserId
left join t_d_Order k on a.DataId=k.OrderId
where a.IsDelete=0
union all
select a.*,
1 IncomePayment,
'进账'as IncomePaymentName,
a.Amount  Amount2,
b.UserName as CreateUserName,
f.UserId as CreateUser2,
e.Name as BillTypeName,
a.DealingsUser as DealingsUser2,
j.UserName ApproveUserName,
k.CreateUser OrderSaleUser,
k.OrderCode+'/'+ k.OrderName OrderName2,
case when a.BillStatus = 1 then '已确认'  else'未确认' end BillStatusName
from t_d_DealingsBill a
left join t_d_User b on a.CreateUser=b.UserId
inner join t_d_DealingsBookUser h on a.CreateUser=h.UserId and a.DealingsUser=h.BookId
inner join t_d_DealingsBookUser f on f.UserType<>h.UserType and a.DealingsUser=f.BookId
inner join t_d_User d on f.UserId=d.UserId
inner join t_d_DealingsBook g on a.DealingsUser= g.BookId
left join t_d_DealingsBillType e on a.BillTypeId=e.Id
left join t_d_User j on a.ApproveUser=j.UserId
left join t_d_Order k on a.DataId=k.OrderId
where a.IsDelete=0
union all
select a.*,
1 IncomePayment,
'进账'as IncomePaymentName,
a.Amount  Amount2,
b.UserName as CreateUserName,
a.DealingsUser as CreateUser2,
e.Name as BillTypeName,
a.CreateUser as DealingsUser2,
j.UserName ApproveUserName,
null OrderSaleUser,
null OrderName2,
case when a.BillStatus = 1 then '已确认'  else'未确认' end BillStatusName
from t_d_DealingsBill a
left join t_d_User b on a.CreateUser=b.UserId
inner join t_d_User d on a.DealingsUser=d.UserId
left join t_d_DealingsBillType e on a.BillTypeId=e.Id
left join t_d_User j on a.ApproveUser=j.UserId
where a.IsDelete=0
go

select * from v_DealingsBill

select * from v_DealingsBill

drop view v_DealingsBillUser
go

create view v_DealingsBillUser
as
select 1 UserType, b.UserId CreateUser, a.BookId DealingsUser, a.Name DealingsUserName
from t_d_DealingsBook a,t_d_DealingsBookUser b
where a.BookId=b.BookId
and a.IsDelete=0
union 
select distinct 2 UserType, CreateUser, DealingsUser,b.UserName DealingsUserName from t_d_DealingsBill a
inner join t_d_User b on a.DealingsUser=b.UserId
where a.IsDelete=0
union  
select distinct  2 UserType, DealingsUser, CreateUser,b.UserName from t_d_DealingsBill a
inner join t_d_User b on a.CreateUser=b.UserId
where a.IsDelete=0
go

select * from v_DealingsBillUser


drop table t_d_DealingsBillType
go

create table t_d_DealingsBillType
(
Id uniqueidentifier not null primary key default(newid()),   --主键
Name nvarchar(100) not null,
Remark nvarchar(200),
IsDelete tinyint not null default(0),                           --是否删除
CreateDate datetime not null default(getdate()),                --创建时间
RowVersion timestamp not null                                   --行版本
)
go

drop view v_DealingsBillType
go

create view v_DealingsBillType
as
select a.*
 from t_d_DealingsBillType a where IsDelete=0
go

drop table t_d_DealingsBook
go
create table t_d_DealingsBook
(
BookId uniqueidentifier not null primary key default(newid()),   --主键
Name nvarchar(100) not null,
Remark nvarchar(200),
IsDelete tinyint not null default(0),                           --是否删除
CreateDate datetime not null default(getdate()),                --创建时间
RowVersion timestamp not null                                   --行版本
)
go

drop view v_DealingsBook
go
create view v_DealingsBook
as
select * from t_d_DealingsBook where IsDelete=0
go

drop table t_d_DealingsBookUser
go

create table t_d_DealingsBookUser
(
Id uniqueidentifier not null primary key default(newid()),   --主键
UserType tinyint not null,
BookId uniqueidentifier not null,
UserId uniqueidentifier not null
)
go

select a.BookId,a.Name,b.UserId from t_d_DealingsBook a,t_d_DealingsBookUser b
where a.BookId=b.BookId
and a.IsDelete=0;

drop view v_DealingsUser
go
create view v_DealingsUser
as
select 1 UserType, a.BookId UserId, a.Name UserName
from t_d_DealingsBook a
where a.IsDelete=0
union 
select 2 UserType, UserId,UserName from t_d_User 
where IsDelete=0 and DataRight<>3
go

drop table t_d_Factory
go

create table t_d_Factory
(
Id uniqueidentifier not null primary key default(newid()),   --主键
Name nvarchar(50) not null,
Remark nvarchar(200),
DealingsBookId uniqueidentifier not null,
IsDelete tinyint not null default(0),                           --是否删除
CreateDate datetime not null default(getdate()),                --创建时间
RowVersion timestamp not null                                   --行版本
)
go

drop view v_Factory
go
create view v_Factory
as
select a.*,b.Name DealingsBookName from t_d_Factory a
left join t_d_DealingsBook b on a.DealingsBookId=b.BookId
where a.IsDelete=0
go

drop view v_OrderForPdf
go
create view v_OrderForPdf 
as
with DetailAmount as
(
select OrderId,DetailType,sum(Area) Area,sum(Number) Number  from t_d_OrderDetail
group by OrderId,DetailType
)
select 
a.OrderId,
Convert(varchar(10),OrderDate,23) OrderDate,
format(DeliveryDate,'yyyy-MM-dd') DeliveryDate,
CreateUserName,
OrderCode,
b.BankCardNo,
b.OpenBank,
a.OrderName,
c.Area TotalArea,
a.ActualAmount, 
a.CustomerId,
dbo.GetCurrencyUpper(a.ActualAmount) ActualAmount2,
c.Number TotalNumber,
b.Phone,
format(a.PaidDeposit,'C') PaidDeposit,
format(a.ShouldPayBalance,'C') ShouldPayBalance
from v_Order a
left join t_d_User b on a.CreateUser=b.UserId
left join DetailAmount c on a.OrderId=c.OrderId and DetailType=1
go

drop  function GetCurrencyUpper
go

create function GetCurrencyUpper
(
@money money
)
returns nvarchar(50)
as
begin
    declare @money_num nvarchar(20)    --存储金额的字符形式

        , @money_chn nvarchar(32)    --存储金额的中文大写形式

        , @n_chn nvarchar(1), @i int    --临时变量

 

    select @money_chn=case when @money>=0 then '' else '(负)' end

        , @money=abs(@money)

        , @money_num=stuff(str(@money, 15, 2), 13, 1, '')    --加前置空格补齐到位（去掉小数点）

        , @i=patindex('%[1-9]%', @money_num)    --找到金额最高位

    while @i>=1 and @i<=14

    begin

        set @n_chn=substring(@money_num, @i, 1)   

        if @n_chn<>'0' or (substring(@money_num,@i+1,1)<>'0' and @i not in(4, 8, 12, 14))    --转换阿拉伯数字为中文大写形式   

            set @money_chn=@money_chn+substring('零壹贰叁肆伍陆柒捌玖', @n_chn+1, 1)

        if @n_chn<>'0' or @i in(4, 8, 12)    --添加中文单位

            set @money_chn=@money_chn+substring('仟佰拾亿仟佰拾万仟佰拾圆角分',@i,1)     

        set @i=@i+1

    end

    set @money_chn=replace(@money_chn, '亿万', '亿')    --当金额为x亿零万时去掉万

    if @money=0 set @money_chn='零圆整'    --当金额为零时返回'零圆整'

    if @n_chn='0' set @money_chn=@money_chn+'整'    --当金额末尾为零分时以'整'结尾

    return @money_chn    --返回大写金额

end
go

drop view v_OrderDetailForPdf 
go

create view v_OrderDetailForPdf 
as 
select OrderId,
 DisplayIndex,
 Area,
 Amount,
 Price,
 Height,
 Width,
 Thickness,
 Number,
 DetailType,
 case when DetailType =1 then dbo.Replactltrt(dbo.GetDetailRemark(ProcessItemIds)) else  Remark end Remark
 from t_d_OrderDetail
go

drop function GetDetailRemark
go

create function GetDetailRemark
(
@ProcessItemIds nvarchar(2000)
)
returns nvarchar(2000)
as
begin
 return STUFF((SELECT DISTINCT( '、' +'<img alt='''' border=\''0\'' src=''http://101.132.74.208:8066/images/Checked24.png'' width=''12'' height=''12'' />'+t.Name) FROM  (
select Top 10000 Name from t_d_ProcessItem a
where @ProcessItemIds like '%'+ convert(varchar(36),a.Id)+'%' 
order by DisplayIndex
) t
FOR XML PATH('')),1, 1, '')
end
go

drop function Replactltrt
go

create function Replactltrt
(
@Content nvarchar(4000)
)
returns nvarchar(4000)
as
begin
set @content = replace(@Content,'&lt;','<')

return replace(@Content,'&gt;','>')
end


select * from v_OrderDetailForPdf


drop view v_OrderRemarkForPdf 
go
create view v_OrderRemarkForPdf 
as
with OrderRemark as
(
select ROW_NUMBER() over(partition by a.OrderId order by b.DisplayIndex) rn,
a.OrderId,
b.Name Remark
from t_d_Order a,t_d_RemarkItem b
where a.IsDelete=0
and a.RemarkItemIds  like '%'+ convert(varchar(36),b.Id)+'%'
)
select OrderId,
case when a.rn=1 then '备注：' else '' end as Label,
LTRIM(rtrim(str(a.rn)))+'.'+ Remark Remark
from OrderRemark a
go


drop table t_d_OrderRemark
go

create table t_d_OrderRemark
(
Id uniqueidentifier not null primary key default(newid()),   --主键
Remark nvarchar(200),
OrderId uniqueidentifier not null,
FontColor varchar(20),
FontSize varchar(10),
FontFamily nvarchar(50),
IsBold tinyint default(0) not null,
IsUnderline tinyint default(0) not null,
DisplayIndex int not null
)
go