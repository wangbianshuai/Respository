drop table t_User
go

create table t_User
(
UserId uniqueidentifier not null primary key,
UserName nvarchar(50) not null,
LoginName nvarchar(50) not null,
LoginPassword nvarchar(50) not null,
LastLoginDate datetime,
IsDelete tinyint not null default(0),                           --�Ƿ�ɾ��
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

--������־
create table t_OperationLog
(
LogId uniqueidentifier not null primary key default(newid()),   --����
LogType nvarchar(20) not null,                                  --��־����
LogPath nvarchar(200) not null,                                 --��־·��
EntityName varchar(50) not null,                                --ʵ����
RequestType varchar(10) not null,                               --��������
MethodName varchar(50),                                         --������
IPAddress varchar(30),                                          --IP��ַ
StartTime datetime not null,                                    --��ʼʱ��
EndTime datetime not null,                                      --����ʱ��
ElapsedMilliseconds bigint not null,                            --���к�ʱ
OperationUser nvarchar(50),                                     --������
IsDelete tinyint not null default(0),                           --�Ƿ�ɾ��
CreateDate datetime not null default(getdate()),                --����ʱ��
RowVersion timestamp not null                                   --�а汾
)
go

drop view v_OperationLog
go

create view v_OperationLog
as
select a.*,b.UserName, '��ϸ' LookDetail from t_OperationLog a
left join t_User b
on a.OperationUser=convert(varchar(36),b.UserId)
go

--��Ʒ����
drop table t_ProductType
go

create table t_ProductType
(
Id uniqueidentifier not null primary key default(newid()),      --����
Name nvarchar(100) not null,                                    --���� 
Remark nvarchar(200),                                           --��ע
IsDelete tinyint not null default(0),                           --�Ƿ�ɾ��
CreateUser uniqueidentifier not null,                           --������   
CreateDate datetime default(getdate()) not null,                --����ʱ��
UpdateUser uniqueidentifier,                                    --������    
UpdateDate datetime,                                            --����ʱ��
RowVersion timestamp not null                                   --�а汾
)
go

drop view v_ProductType
go

create view v_ProductType
as
select * from t_ProductType where IsDelete=0
go

--��ƷƷ��
drop table t_ProductBrand
go

create table t_ProductBrand
(
Id uniqueidentifier not null primary key default(newid()),      --����
Name nvarchar(100) not null,                                    --���� 
Remark nvarchar(200),                                           --��ע
IsDelete tinyint not null default(0),                           --�Ƿ�ɾ��
CreateUser uniqueidentifier not null,                           --������   
CreateDate datetime default(getdate()) not null,                --����ʱ��
UpdateUser uniqueidentifier,                                    --������    
UpdateDate datetime,                                            --����ʱ��
RowVersion timestamp not null                                   --�а汾
)
go

drop view v_ProductBrand
go

create view v_ProductBrand
as
select * from t_ProductBrand where IsDelete=0
go


--��Ʒ
drop table t_Product
go

create table t_Product
(
Id uniqueidentifier not null primary key default(newid()),      --����
Name nvarchar(100) not null,                                    --����
ProductCode nvarchar(50) not null,                              --��Ʒ���
ProductBarCode nvarchar(50),                                    --��Ʒ������  
ProductTypeId uniqueidentifier not null,                        --��Ʒ����
ProductBrandId uniqueidentifier not null,                       --��ƷƷ��
Model nvarchar(500),                                            --�ͺ�
Spec nvarchar(500),                                             --���
Unit nvarchar(20),                                              --������λ
InitStock float default(0) not null,                            --��ʼ���
BidPrice money not null,                                        --����
SillingPrice money not null,                                    --�ۼ�
Remark nvarchar(4000),                                          --˵��
IsDelete tinyint not null default(0),                           --�Ƿ�ɾ��
CreateUser uniqueidentifier not null,                           --������   
CreateDate datetime default(getdate()) not null,                --����ʱ��
UpdateUser uniqueidentifier,                                    --������    
UpdateDate datetime,                                            --����ʱ��
RowVersion timestamp not null                                   --�а汾     
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
where a.IsDelete=0 and a.PurchaseStatus in (1,2)
group by b.ProductId
),
SaleNumber as
(
select b.ProductId,
sum(case when a.SaleType=1 then b.Number else 0-Number end) SumNumber from t_Sale a, t_SaleDetail b
where a.IsDelete=0 and a.SaleStatus in (1,2)
group by b.ProductId
),
StockCheckNumber as
(
select ProductId,Sum(CurrentStock- RealStock) SumNumber from t_StockCheck where IsDelete=0
group by ProductId
)
select a.*,b.Name as ProductTypeName, c.Name as ProductBrandName,'('+ a.ProductCode+')'+ a.Name ProductName,
a.InitStock+ isnull(e.SumNumber,0) - isnull(f.SumNumber,0)- ISNULL(g.SumNumber,0) CurrentStock
from t_Product a 
left join t_ProductType b on a.ProductTypeId=b.Id
left join t_ProductBrand c on a.ProductBrandId=c.Id
left join PurchaseNumber e on a.Id= e.ProductId
left join SaleNumber f on a.Id=f.ProductId
left join StockCheckNumber g on a.Id=g.ProductId
where a.IsDelete=0
go

drop view v_Product2
go

create view v_Product2
as
select *,'('+ a.ProductCode+')'+ a.Name ProductName
from t_Product a 
where a.IsDelete=0
go


--�ɹ�
drop table t_Purchase
go

create table t_Purchase
(
PurchaseId uniqueidentifier not null primary key default(newid()),      --����
PurchaseCode varchar(50) not null,                              --�ɹ�����
PurchaseUser uniqueidentifier not null,                         --�ɹ���
PurchaseDate datetime not null,                                 --�ɹ�����
PurchaseType tinyint not null default(1),                       --�ɹ����ͣ�1��������2���˻�
LogisticsFee money,                                             --������
OtherFee money,                                                 --������
DiscountFee money,                                              --�ۿ۷�
SupplierId uniqueidentifier,                                    --��Ӧ��
PurchaseStatus tinyint not null default(0),                     --�ɹ�״̬,0:����,1:�ύ,2:�浵��3������         
Remark nvarchar(200),                                           --��ע
IsDelete tinyint not null default(0),                           --�Ƿ�ɾ��
CreateUser uniqueidentifier not null,                           --������   
CreateDate datetime default(getdate()) not null,                --����ʱ��
UpdateUser uniqueidentifier,                                    --������    
UpdateDate datetime,                                            --����ʱ��
RowVersion timestamp not null                                   --�а汾
)
go

drop view v_Purchase
go

create view v_Purchase
as
select a.*,b.UserName PurchaseUserName,c.Name SupplierName,
case when a.PurchaseType = 1 then '����' when a.PurchaseType=2 then '�˻�' else '' end PurchaseTypeName,
case when a.PurchaseStatus=1 then '�ύ' when a.PurchaseStatus=2 then '�浵' when a.PurchaseStatus=3 then '����' else '���ύ' end PurchaseStatusName
from t_Purchase a
left join t_User b on a.PurchaseUser=b.UserId
left join t_Supplier c on a.SupplierId=c.Id
where a.IsDelete=0
go

--�ɹ���ϸ
drop table t_PurchaseDetail
go

create table t_PurchaseDetail
(
Id uniqueidentifier not null primary key default(newid()),      --����
PurchaseId uniqueidentifier not null,                           --�ɹ�Id
ProductId uniqueidentifier not null,                            --��ƷId
Price money not null,                                           --�۸�
Number float not null,                                          --����
Remark nvarchar(200)                                            --��ע                                                  
)
go

--��Ӧ��
drop table t_Supplier
go

create table t_Supplier
(
Id uniqueidentifier not null primary key default(newid()),   --����
Name nvarchar(50) not null,                                     --����   
CompanyName nvarchar(50),                                       --��˾����
Linkman nvarchar(50),                                           --��ϵ��   
Phone varchar(50),                                              --�ֻ� 
Telephone varchar(50),                                          --�绰
Fax varchar(50),                                                --���� 
Address nvarchar(200),                                          --��ַ
Remark nvarchar(200),                                           --��ע
IsDelete tinyint not null default(0),                           --�Ƿ�ɾ��
CreateUser uniqueidentifier not null,                           --������   
CreateDate datetime default(getdate()) not null,                --����ʱ��
UpdateUser uniqueidentifier,                                    --������    
UpdateDate datetime,                                            --����ʱ��
RowVersion timestamp not null                                   --�а汾
)
go

drop view v_Supplier
go

create view v_Supplier
as
select * from t_Supplier where IsDelete=0
go

drop view v_PurchaseDetail
go

create view v_PurchaseDetail
as
select a.*,
b.PurchaseStatus,
b.PurchaseType,
case when b.PurchaseType = 1 then '����' when b.PurchaseType=2 then '�˻�' else '' end PurchaseTypeName,
case when b.PurchaseStatus=1 then '�ύ' when b.PurchaseStatus=2 then '�浵' when b.PurchaseStatus=3 then '����' else '���ύ' end PurchaseStatusName,
c.Model,
c.Name as ProductName,
c.ProductBarCode,
c.ProductCode,
c.Spec,
c.Unit,
d.Name ProductTypeName,
e.Name ProductBrandName
from t_PurchaseDetail a
inner join t_Purchase b on a.PurchaseId=b.PurchaseId and b.IsDelete=0
left join t_Product c on a.ProductId=c.Id
left join t_ProductType d on c.ProductTypeId=d.Id
left join t_ProductBrand e on c.ProductBrandId=e.Id
go

--����
drop table t_Sale
go

create table t_Sale
(
SaleId uniqueidentifier not null primary key default(newid()),      --����
SaleCode varchar(50) not null,                                  --���۶���
SaleUser uniqueidentifier not null,                             --������
SaleDate datetime not null,                                     --��������
SaleType tinyint not null default(1),                           --�������ͣ�1��������2���˻�
LogisticsFee money,                                             --������
OtherFee money,                                                 --������
DiscountFee money,                                              --�ۿ۷�
CustomerName nvarchar(50),                                      --�˿�����
CustomerPhone varchar(50),                                      --�˿��ֻ�
SaleStatus tinyint not null default(0),                         --����״̬,0:����,1:�ύ,2:�浵��3������                
Remark nvarchar(200),                                           --��ע
IsDelete tinyint not null default(0),                           --�Ƿ�ɾ��
CreateUser uniqueidentifier not null,                           --������   
CreateDate datetime default(getdate()) not null,                --����ʱ��
UpdateUser uniqueidentifier,                                    --������    
UpdateDate datetime,                                            --����ʱ��
RowVersion timestamp not null                                   --�а汾
)
go

drop view v_Sale
go

create view v_Sale
as
select a.*, b.UserName SaleUserName,
case when a.SaleType = 1 then '����' when a.SaleType=2 then '�˻�' else '' end SaleTypeName,
case when a.SaleStatus=1 then '�ύ' when a.SaleStatus=2 then '�浵' when a.SaleStatus=3 then '����' else '���ύ' end SaleStatusName
from t_Sale a
left join t_User b on a.SaleUser=b.UserId
where a.IsDelete=0
go

--������ϸ
drop table t_SaleDetail
go

create table t_SaleDetail
(
Id uniqueidentifier not null primary key default(newid()),      --����
SaleId uniqueidentifier not null,                               --����Id
ProductId uniqueidentifier not null,                            --��ƷId
Price money not null,                                           --�۸�
BidPrice money not null,                                        --����
Discount money,                                                 --�ۿ�
Number float not null,                                          --����
Remark nvarchar(200)                                            --��ע                                                  
)
go

drop view v_SaleDetail
go

create view v_SaleDetail
as
select a.*,
b.SaleType,
b.SaleStatus,
case when b.SaleType = 1 then '����' when b.SaleType=2 then '�˻�' else '' end SaleTypeName,
case when b.SaleStatus=1 then '�ύ' when b.SaleStatus=2 then '�浵' when b.SaleStatus=3 then '����' else '���ύ' end SaleStatusName,
c.Model,
c.Name as ProductName,
c.ProductBarCode,
c.ProductCode,
c.Spec,
c.Unit,
d.Name ProductTypeName,
e.Name ProductBrandName
from t_SaleDetail a
inner join t_Sale b on a.SaleId=b.SaleId and b.IsDelete=0
left join t_Product c on a.ProductId=c.Id
left join t_ProductType d on c.ProductTypeId=d.Id
left join t_ProductBrand e on c.ProductBrandId=e.Id
go

--����̵�
drop table t_StockCheck
go

create table t_StockCheck
(
Id uniqueidentifier not null primary key default(newid()),      --����
ProductId uniqueidentifier not null,                            --��ƷId
CurrentStock float not null,                                    --Ӧ�п��
RealStock float not null,                                       --ʵ�п��
CheckDate datetime not null,                                    --�̵�����
CheckUser uniqueidentifier not null,                            --�̵���
BidPrice float not null,                                        --����
Remark nvarchar(200),                                           --��ע
IsDelete tinyint not null default(0),                           --�Ƿ�ɾ��
CreateUser uniqueidentifier not null,                           --������   
CreateDate datetime default(getdate()) not null,                --����ʱ��
UpdateUser uniqueidentifier,                                    --������    
UpdateDate datetime,                                            --����ʱ��
RowVersion timestamp not null                                   --�а汾
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
c.ProductTypeId,
c.ProductBrandId,
d.Name ProductTypeName,
e.Name ProductBrandName,
f.UserName CheckUserName,
(a.CurrentStock-a.RealStock)*a.BidPrice LossAmount
from t_StockCheck a
left join t_Product c on a.ProductId=c.Id
left join t_ProductType d on c.ProductTypeId=d.Id
left join t_ProductBrand e on c.ProductBrandId=e.Id
left join t_User f on a.CheckUser=f.UserId
where a.IsDelete=0;
go

--��Ŀ����
drop table t_BillType
go

create table t_BillType
(
Id uniqueidentifier not null primary key default(newid()),   --����
Name nvarchar(100) not null,
IncomePayment tinyint not null, -- 1: ���룬2��֧��
Remark nvarchar(200),                                           --��ע
IsDelete tinyint not null default(0),                           --�Ƿ�ɾ��
CreateUser uniqueidentifier not null,                           --������   
CreateDate datetime default(getdate()) not null,                --����ʱ��
UpdateUser uniqueidentifier,                                    --������    
UpdateDate datetime,                                            --����ʱ��
RowVersion timestamp not null                                   --�а汾
)
go

drop view v_BillType
go

create view v_BillType
as
select a.*,
case when a.IncomePayment = 1 then '����'  when a.IncomePayment = 2 then '֧��' else'' end IncomePaymentName
 from t_BillType a where IsDelete=0
go

--��Ŀ
drop table t_Bill
go

create table t_Bill
(
Id uniqueidentifier not null primary key default(newid()),   --����
DataId uniqueidentifier,
Amount money,
BillTypeId uniqueidentifier not null,
IncomePayment tinyint not null, -- 1: ���룬2��֧��
BillDate datetime not null default(getdate()),   
Remark nvarchar(200),                                           --��ע
IsDelete tinyint not null default(0),                           --�Ƿ�ɾ��
CreateUser uniqueidentifier not null,                           --������   
CreateDate datetime default(getdate()) not null,                --����ʱ��
UpdateUser uniqueidentifier,                                    --������    
UpdateDate datetime,                                            --����ʱ��
RowVersion timestamp not null                                   --�а汾
)
go

drop view v_Bill
go

create view v_Bill
as
select a.*,case when b.PurchaseCode is not null then b.PurchaseCode else c.SaleCode end DataCode,
case when b.PurchaseCode is not null then 'PurchaseList?PurchaseId='+ convert(varchar(36),a.DataId) 
 when c.SaleCode is not null then 'SaleList?SaleId='+ convert(varchar(36),a.DataId) else '' end DataPageUrl,
case when a.IncomePayment = 1 then '����'  when a.IncomePayment = 2 then '֧��' else'' end IncomePaymentName,
case when a.IncomePayment = 2 then  0-a.Amount  else a.Amount end Amount2,
e.Name as BillTypeName,d.UserName CreateUserName
from t_Bill a
left join t_BillType e on a.BillTypeId=e.Id
left join t_Purchase b on a.DataId=b.PurchaseId
left join t_Sale c on a.DataId=c.SaleId
left join t_User d on a.CreateUser=d.UserId
where a.IsDelete=0
go


--������Ŀ����
drop table t_PersonBillType
go

create table t_PersonBillType
(
Id uniqueidentifier not null primary key default(newid()),   --����
Name nvarchar(100) not null,
IncomePayment tinyint not null, -- 1: ���룬2��֧��
Remark nvarchar(200),                                           --��ע
IsDelete tinyint not null default(0),                           --�Ƿ�ɾ��
CreateUser uniqueidentifier not null,                           --������   
CreateDate datetime default(getdate()) not null,                --����ʱ��
UpdateUser uniqueidentifier,                                    --������    
UpdateDate datetime,                                            --����ʱ��
RowVersion timestamp not null                                   --�а汾
)
go

drop view v_PersonBillType
go

create view v_PersonBillType
as
select a.*,
case when a.IncomePayment = 1 then '����'  when a.IncomePayment = 2 then '֧��' else'' end IncomePaymentName
 from t_PersonBillType a where IsDelete=0
go

drop table t_PersonBill
go

create table t_PersonBill
(
Id uniqueidentifier not null primary key default(newid()),   --����
Amount money,
IncomePayment tinyint not null, -- 1: ���룬2��֧��
BillTypeId uniqueidentifier not null,
BillDate datetime not null default(getdate()),   
Remark nvarchar(200),                                           --��ע
IsDelete tinyint not null default(0),                           --�Ƿ�ɾ��
CreateUser uniqueidentifier not null,                           --������   
CreateDate datetime default(getdate()) not null,                --����ʱ��
UpdateUser uniqueidentifier,                                    --������    
UpdateDate datetime,                                            --����ʱ��
RowVersion timestamp not null                                   --�а汾
)
go

drop view v_PersonBill
go

create view v_PersonBill
as
select a.*,b.Name PersonBillTypeName,
case when a.IncomePayment = 1 then '����'  when a.IncomePayment = 2 then '֧��' else'' end IncomePaymentName,
case when a.IncomePayment = 2 then  0-a.Amount  else a.Amount end Amount2
from t_PersonBill a
left join t_PersonBillType b on a.BillTypeId=b.Id
where a.IsDelete=0
go

-- ��ֵ����
drop table t_Dictionary
go

create table t_Dictionary
(
Id uniqueidentifier not null primary key default(newid()),   --����
Name nvarchar(50) not null,                                -- ���� 
Value nvarchar(2000),                                      -- ֵ
Remark nvarchar(200),                                           --��ע
IsDelete tinyint not null default(0),                           --�Ƿ�ɾ��
CreateUser uniqueidentifier not null,                           --������   
CreateDate datetime default(getdate()) not null,                --����ʱ��
UpdateUser uniqueidentifier,                                    --������    
UpdateDate datetime,                                            --����ʱ��
RowVersion timestamp not null                                   --�а汾
)
go

drop view v_Dictionary
go

create view v_Dictionary
as
select * from t_dictionary where IsDelete=0
go