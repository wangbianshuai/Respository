drop table t_User
go

create table t_User
(
UserId uniqueidentifier not null primary key,
UserName nvarchar(50) not null,
LoginName nvarchar(50) not null,
LoginPassword nvarchar(50) not null,
LastLoginDate datetime,
IsDelete tinyint not null default(0),                           --是否删除
CreateUser uniqueidentifier not null,
CreateDate datetime default(getdate()) not null,
UpdateUser uniqueidentifier,
UpdateDate datetime,
RowVersion timestamp not null 
)
go

drop view v_User
go

create view v_User
as
select a.*
from t_User a where IsDelete=0
go

drop table t_OperationLog 
go

--操作日志
create table t_OperationLog
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
select a.*,b.UserName, '详细' LookDetail from t_OperationLog a
left join t_User b
on a.OperationUser=convert(varchar(36),b.UserId)
go

--商品类型
drop table t_ProductType
go

create table t_ProductType
(
Id uniqueidentifier not null primary key default(newid()),      --主键
Name nvarchar(100) not null,                                    --名称 
Remark nvarchar(200),                                           --备注
IsDelete tinyint not null default(0),                           --是否删除
CreateUser uniqueidentifier not null,                           --创建人   
CreateDate datetime default(getdate()) not null,                --创建时间
UpdateUser uniqueidentifier,                                    --更新人    
UpdateDate datetime,                                            --更新时间
RowVersion timestamp not null                                   --行版本
)
go

drop view v_ProductType
go

create view v_ProductType
as
select * from t_ProductType where IsDelete=0
go

--商品品牌
drop table t_ProductBrand
go

create table t_ProductBrand
(
Id uniqueidentifier not null primary key default(newid()),      --主键
Name nvarchar(100) not null,                                    --名称 
Remark nvarchar(200),                                           --备注
IsDelete tinyint not null default(0),                           --是否删除
CreateUser uniqueidentifier not null,                           --创建人   
CreateDate datetime default(getdate()) not null,                --创建时间
UpdateUser uniqueidentifier,                                    --更新人    
UpdateDate datetime,                                            --更新时间
RowVersion timestamp not null                                   --行版本
)
go

drop view v_ProductBrand
go

create view v_ProductBrand
as
select * from t_ProductBrand where IsDelete=0
go


--商品
drop table t_Product
go

create table t_Product
(
Id uniqueidentifier not null primary key default(newid()),      --主键
Name nvarchar(100) not null,                                    --名称
ProductCode nvarchar(50) not null,                              --商品编号
ProductBarCode nvarchar(50),                                    --商品条形码  
ProductTypeId uniqueidentifier not null,                        --商品类型
ProductBrandId uniqueidentifier not null,                       --商品品牌
Model nvarchar(500),                                            --型号
Spec nvarchar(500),                                             --规格
Unit nvarchar(20),                                              --计量单位
InitStock float default(0) not null,                            --初始库存
BidPrice money not null,                                        --进价
SillingPrice money not null,                                    --售价
Remark nvarchar(4000),                                          --说明
IsDelete tinyint not null default(0),                           --是否删除
CreateUser uniqueidentifier not null,                           --创建人   
CreateDate datetime default(getdate()) not null,                --创建时间
UpdateUser uniqueidentifier,                                    --更新人    
UpdateDate datetime,                                            --更新时间
RowVersion timestamp not null                                   --行版本     
)
go

drop view v_Product
go

create view v_Product
as
with PurchaseNumber as
(
select b.ProductId,
sum(case when a.PurchaseType=1 then b.Number else 0-Number end) SumNumber from t_Purchase a, t_PurchaseDetail b
where a.IsDelete=0 and a.PurchaseStatus=1
group by b.ProductId
),
SaleNumber as
(
select b.ProductId,
sum(case when a.SaleType=1 then b.Number else 0-Number end) SumNumber from t_Sale a, t_SaleDetail b
where a.IsDelete=0 and a.SaleStatus=1
group by b.ProductId
),
StockCheckNumber as
(
select ProductId,Sum(ShouldStock- RealStock) SumNumber from t_StockCheck where IsDelete=0
group by ProductId
)
select a.*,b.Name as ProductTypeName, c.Name as ProductBrandName,
a.InitStock+ isnull(e.SumNumber,0) - isnull(f.SumNumber,0)- ISNULL(g.SumNumber,0) CurrentStock
from t_Product a 
left join t_ProductType b on a.ProductTypeId=b.Id
left join t_ProductBrand c on a.ProductBrandId=c.Id
left join PurchaseNumber e on a.Id= e.ProductId
left join SaleNumber f on a.Id=f.ProductId
left join StockCheckNumber g on a.Id=g.ProductId
where a.IsDelete=0
go



--采购
drop table t_Purchase
go

create table t_Purchase
(
Id uniqueidentifier not null primary key default(newid()),      --主键
PurchaseCode varchar(50) not null,                              --采购单号
PurchaseUser uniqueidentifier not null,                         --采购人
PurchaseDate datetime not null,                                 --采购日期
PurchaseType tinyint not null default(1),                       --采购类型，1：进货，2：退货
LogisticsFee money,                                             --物流费
OtherFee money,                                                 --其他费
DiscountFee money,                                              --折扣费
PurchaseStatus tinyint not null default(0),                     --采购状态,0:保存,1:提交         
Remark nvarchar(200),                                           --备注
IsDelete tinyint not null default(0),                           --是否删除
CreateUser uniqueidentifier not null,                           --创建人   
CreateDate datetime default(getdate()) not null,                --创建时间
UpdateUser uniqueidentifier,                                    --更新人    
UpdateDate datetime,                                            --更新时间
RowVersion timestamp not null                                   --行版本
)
go

drop view v_Purchase
go

create view v_Purchase
as
select * from t_Purchase where IsDelete=0
go

--采购明细
drop table t_PurchaseDetail
go

create table t_PurchaseDetail
(
Id uniqueidentifier not null primary key default(newid()),      --主键
PurchaseId uniqueidentifier not null,                           --采购Id
ProductId uniqueidentifier not null,                            --商品Id
Price money not null,                                           --价格
Discount money,                                                 --折扣
Number float not null,                                          --数量
SupplierId uniqueidentifier,                                    --供应商
Remark nvarchar(200)                                            --备注                                                  
)
go

--供应商
drop table t_Supplier
go

create table t_Supplier
(
Id uniqueidentifier not null primary key default(newid()),   --主键
Name nvarchar(50) not null,                                     --名称   
CompanyName nvarchar(50),                                       --公司名称
Linkman nvarchar(50),                                           --联系人   
Phone varchar(50),                                              --手机 
Telephone varchar(50),                                          --电话
Fax varchar(50),                                                --传真 
Address nvarchar(200),                                          --地址
Remark nvarchar(200),                                           --备注
IsDelete tinyint not null default(0),                           --是否删除
CreateUser uniqueidentifier not null,                           --创建人   
CreateDate datetime default(getdate()) not null,                --创建时间
UpdateUser uniqueidentifier,                                    --更新人    
UpdateDate datetime,                                            --更新时间
RowVersion timestamp not null                                   --行版本
)
go

drop view v_PurchaseDetail
go

create view v_PurchaseDetail
as
select a.*,
b.PurchaseStatus,
b.PurchaseType,
c.Model,
c.Name as ProductName,
c.ProductBarCode,
c.ProductCode,
c.Spec,
c.Unit,
d.Name ProductTypeName,
e.Name ProductBrandName
from t_PurchaseDetail a
inner join t_Purchase b on a.PurchaseId=b.Id and b.IsDelete=0
left join t_Product c on a.ProductId=c.Id
left join t_ProductType d on c.ProductTypeId=d.Id
left join t_ProductBrand e on c.ProductBrandId=e.Id
go

--销售
drop table t_Sale
go

create table t_Sale
(
Id uniqueidentifier not null primary key default(newid()),      --主键
SaleCode varchar(50) not null,                                  --销售订单
SaleUser uniqueidentifier not null,                             --销售人
SaleDate datetime not null,                                     --销售日期
SaleType tinyint not null default(1),                           --销售类型，1：出货，2：退货
LogisticsFee money,                                             --物流费
OtherFee money,                                                 --其他费
DiscountFee money,                                              --折扣费
CustomerName nvarchar(50),                                      --顾客姓名
CustomerPhone varchar(50),                                      --顾客手机
SaleStatus tinyint not null default(0),                         --销售状态,0:保存,1:提交           
Remark nvarchar(200),                                           --备注
IsDelete tinyint not null default(0),                           --是否删除
CreateUser uniqueidentifier not null,                           --创建人   
CreateDate datetime default(getdate()) not null,                --创建时间
UpdateUser uniqueidentifier,                                    --更新人    
UpdateDate datetime,                                            --更新时间
RowVersion timestamp not null                                   --行版本
)
go

drop view v_Sale
go

create view v_Sale
as
select * from t_Purchase where IsDelete=0
go

--销售明细
drop table t_SaleDetail
go

create table t_SaleDetail
(
Id uniqueidentifier not null primary key default(newid()),      --主键
SaleId uniqueidentifier not null,                               --销售Id
ProductId uniqueidentifier not null,                            --商品Id
Price money not null,                                           --价格
BidPrice money not null,                                        --进价
Discount money,                                                 --折扣
Number float not null,                                          --数量
Remark nvarchar(200)                                            --备注                                                  
)
go

drop view v_SaleDetail
go

create view v_SaleDetail
as
select a.*,
b.SaleType,
b.SaleStatus,
c.Model,
c.Name as ProductName,
c.ProductBarCode,
c.ProductCode,
c.Spec,
c.Unit,
d.Name ProductTypeName,
e.Name ProductBrandName
from t_SaleDetail a
inner join t_Sale b on a.SaleId=b.Id and b.IsDelete=0
left join t_Product c on a.ProductId=c.Id
left join t_ProductType d on c.ProductTypeId=d.Id
left join t_ProductBrand e on c.ProductBrandId=e.Id
go

--库存盘点
drop table t_StockCheck
go

create table t_StockCheck
(
Id uniqueidentifier not null primary key default(newid()),      --主键
ProductId uniqueidentifier not null,                            --商品Id
ShouldStock float not null,                                     --应有库存
RealStock float not null,                                       --实有库存
CheckDate datetime not null,                                    --盘点日期
CheckUser uniqueidentifier not null,                            --盘点人
BidPrice float not null,                                        --进价
Remark nvarchar(200),                                           --备注
IsDelete tinyint not null default(0),                           --是否删除
CreateUser uniqueidentifier not null,                           --创建人   
CreateDate datetime default(getdate()) not null,                --创建时间
UpdateUser uniqueidentifier,                                    --更新人    
UpdateDate datetime,                                            --更新时间
RowVersion timestamp not null                                   --行版本
)
go

drop view v_StockCheck
go

create view v_StockCheck
as
select a.*,
c.Model,
c.Name as ProductName,
c.ProductBarCode,
c.ProductCode,
c.Spec,
c.Unit,
d.Name ProductTypeName,
e.Name ProductBrandName
from t_StockCheck a
left join t_Product c on a.ProductId=c.Id
left join t_ProductType d on c.ProductTypeId=d.Id
left join t_ProductBrand e on c.ProductBrandId=e.Id
go

--账目类型
drop table t_BillType
go

create table t_BillType
(
Id uniqueidentifier not null primary key default(newid()),   --主键
Name nvarchar(100) not null,
IncomePayment tinyint not null, -- 1: 收入，2：支出
Remark nvarchar(200),                                           --备注
IsDelete tinyint not null default(0),                           --是否删除
CreateUser uniqueidentifier not null,                           --创建人   
CreateDate datetime default(getdate()) not null,                --创建时间
UpdateUser uniqueidentifier,                                    --更新人    
UpdateDate datetime,                                            --更新时间
RowVersion timestamp not null                                   --行版本
)
go

drop view v_BillType
go

create view v_BillType
as
select a.*,
case when a.IncomePayment = 1 then '收入'  when a.IncomePayment = 2 then '支出' else'' end IncomePaymentName
 from t_BillType a where IsDelete=0
go

--账目
drop table t_Bill
go

create table t_Bill
(
Id uniqueidentifier not null primary key default(newid()),   --主键
DataId uniqueidentifier,
Amount money,
BillTypeId uniqueidentifier not null,
IncomePayment tinyint not null, -- 1: 收入，2：支出
BillDate datetime not null default(getdate()),   
Remark nvarchar(200),                                           --备注
IsDelete tinyint not null default(0),                           --是否删除
CreateUser uniqueidentifier not null,                           --创建人   
CreateDate datetime default(getdate()) not null,                --创建时间
UpdateUser uniqueidentifier,                                    --更新人    
UpdateDate datetime,                                            --更新时间
RowVersion timestamp not null                                   --行版本
)
go

drop view v_Bill
go

create view v_Bill
as
select a.*,
case when a.IncomePayment = 1 then '收入'  when a.IncomePayment = 2 then '支出' else'' end IncomePaymentName,
case when a.IncomePayment = 2 then  0-a.Amount  else a.Amount end Amount2,
e.Name as BillTypeName
from t_Bill a
left join t_BillType e on a.BillTypeId=e.Id
where a.IsDelete=0
go


--个人账目类型
drop table t_PersonBillType
go

create table t_PersonBillType
(
Id uniqueidentifier not null primary key default(newid()),   --主键
Name nvarchar(100) not null,
IncomePayment tinyint not null, -- 1: 收入，2：支出
Remark nvarchar(200),                                           --备注
IsDelete tinyint not null default(0),                           --是否删除
CreateUser uniqueidentifier not null,                           --创建人   
CreateDate datetime default(getdate()) not null,                --创建时间
UpdateUser uniqueidentifier,                                    --更新人    
UpdateDate datetime,                                            --更新时间
RowVersion timestamp not null                                   --行版本
)
go

drop view v_PersonBillType
go

create view v_PersonBillType
as
select a.*,
case when a.IncomePayment = 1 then '收入'  when a.IncomePayment = 2 then '支出' else'' end IncomePaymentName
 from t_PersonBillType a where IsDelete=0
go

drop table t_PersonBill
go

create table t_PersonBill
(
Id uniqueidentifier not null primary key default(newid()),   --主键
Amount money,
IncomePayment tinyint not null, -- 1: 收入，2：支出
BillTypeId uniqueidentifier not null,
BillDate datetime not null default(getdate()),   
Remark nvarchar(200),                                           --备注
IsDelete tinyint not null default(0),                           --是否删除
CreateUser uniqueidentifier not null,                           --创建人   
CreateDate datetime default(getdate()) not null,                --创建时间
UpdateUser uniqueidentifier,                                    --更新人    
UpdateDate datetime,                                            --更新时间
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
from t_PersonBill a
where a.IsDelete=0
go

-- 键值配置
drop table t_Dictionary
go

create table t_Dictionary
(
Id uniqueidentifier not null primary key default(newid()),   --主键
Name nvarchar(50) not null,                                -- 名称 
Value nvarchar(2000),                                      -- 值
Remark nvarchar(200),                                           --备注
IsDelete tinyint not null default(0),                           --是否删除
CreateUser uniqueidentifier not null,                           --创建人   
CreateDate datetime default(getdate()) not null,                --创建时间
UpdateUser uniqueidentifier,                                    --更新人    
UpdateDate datetime,                                            --更新时间
RowVersion timestamp not null                                   --行版本
)
go

drop view v_Dictionary
go

create view v_Dictionary
as
select * from t_dictionary where IsDelete=0
go