use [AbetAccount.cn]
go

if exists(select 1 from sys.objects where name='proc_AddCellExplanation')
DROP PROC proc_AddCellExplanation
GO
CREATE PROC proc_AddCellExplanation
  @Explanation nvarchar(100),--˵��
  @TableName nvarchar(100),--����
  @CellName nvarchar(100)--����
  as
  declare @sum int
  select @sum=count(*)
from sys.extended_properties A inner join sys.columns B 
    on A.major_id=B.object_id 
    and A.minor_id=B.Column_id 
inner join sys.types c on B.user_type_id=C.user_type_id
where A.major_ID=object_id(@tablename) and b.name 

=@CellName
  if(@sum>0)
begin
	EXEC sys.sp_updateextendedproperty @name=N'MS_Description', @value=@Explanation , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=@tablename, @level2type=N'COLUMN',@level2name=@CellName
end
else
begin 
	EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=@Explanation , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=@tablename, @level2type=N'COLUMN',@level2name=@CellName
end
go

--1����̨�û�(t_AdminUser)
if exists(select * from sysobjects where name='t_AdminUser')
drop table t_AdminUser
go

create table t_AdminUser
(
UserId uniqueidentifier not null primary key,                  --����
UserName nvarchar(50) not null,                                --�û���
LoginName nvarchar(50) not null,                               --��¼��
LoginPassword nvarchar(50) not null,                           --��¼����
LastLoginDate datetime,                                        --�����¼ʱ�� 
IsDelete tinyint not null default(0),                          --�Ƿ�ɾ��
CreateUser uniqueidentifier not null,                          --������
CreateDate datetime default(getdate()) not null,               --����ʱ��
UpdateUser uniqueidentifier,                                   --������
UpdateDate datetime,                                           --����ʱ��
RowVersion timestamp not null                                  --�а汾
)
go

exec proc_AddCellExplanation '����','t_AdminUser','UserId'
exec proc_AddCellExplanation '�û���','t_AdminUser','UserName'
exec proc_AddCellExplanation '��¼��','t_AdminUser','LoginName'
exec proc_AddCellExplanation '��¼����','t_AdminUser','LoginPassword'
exec proc_AddCellExplanation '�����¼ʱ��','t_AdminUser','LastLoginDate'
exec proc_AddCellExplanation '�Ƿ�ɾ��','t_AdminUser','IsDelete'
exec proc_AddCellExplanation '������','t_AdminUser','CreateUser'
exec proc_AddCellExplanation '����ʱ��','t_AdminUser','CreateDate'
exec proc_AddCellExplanation '������','t_AdminUser','UpdateUser'
exec proc_AddCellExplanation '����ʱ��','t_AdminUser','UpdateDate'
exec proc_AddCellExplanation '�а汾','t_AdminUser','RowVersion'
go

if exists(select * from sysobjects where name='v_AdminUser')
drop view v_AdminUser
go

create view v_AdminUser
as
select a.*
from t_AdminUser a where IsDelete=0
go

--16����ֵ���ã�t_DictionaryConfig��
if exists(select * from sysobjects where name='t_DictionaryConfig')
drop table t_DictionaryConfig
go

create table t_DictionaryConfig
(
DictionaryConfigId uniqueidentifier not null primary key,                      --����
Name nvarchar(50) not null,                                    --����
Value nvarchar(1000),                                          --ֵ
TypeName nvarchar(50),                                         --������
Remark nvarchar(200),                                          --��ע 
IsDelete tinyint not null default(0),                          --�Ƿ�ɾ��
CreateUser uniqueidentifier not null,                          --������
CreateDate datetime default(getdate()) not null,               --����ʱ��
UpdateUser uniqueidentifier,                                   --������
UpdateDate datetime,                                           --����ʱ��
RowVersion timestamp not null                                  --�а汾
)
go

exec proc_AddCellExplanation '����','t_DictionaryConfig','DictionaryConfigId'
exec proc_AddCellExplanation '����','t_DictionaryConfig','Name'
exec proc_AddCellExplanation 'ֵ','t_DictionaryConfig','Value'
exec proc_AddCellExplanation '������','t_DictionaryConfig','TypeName'
exec proc_AddCellExplanation '��ע','t_DictionaryConfig','Remark'
exec proc_AddCellExplanation '�Ƿ�ɾ��','t_DictionaryConfig','IsDelete'
exec proc_AddCellExplanation '������','t_DictionaryConfig','CreateUser'
exec proc_AddCellExplanation '����ʱ��','t_DictionaryConfig','CreateDate'
exec proc_AddCellExplanation '������','t_DictionaryConfig','UpdateUser'
exec proc_AddCellExplanation '����ʱ��','t_DictionaryConfig','UpdateDate'
exec proc_AddCellExplanation '�а汾','t_DictionaryConfig','RowVersion'
go

if exists(select * from sysobjects where name='v_DictionaryConfig')
drop view v_DictionaryConfig
go

create view v_DictionaryConfig
as
select a.*
from t_DictionaryConfig a where IsDelete=0
go

--17��������־
if exists(select * from sysobjects where name='t_OperationLog')
drop table t_OperationLog 
go

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
OperationUser uniqueidentifier,                                 --������
CreateDate datetime not null default(getdate()),                --����ʱ��
RowVersion timestamp not null                                   --�а汾
)
go

exec proc_AddCellExplanation '����','t_OperationLog','LogId'
exec proc_AddCellExplanation '��־����','t_OperationLog','LogType'
exec proc_AddCellExplanation '��־·��','t_OperationLog','LogPath'
exec proc_AddCellExplanation 'ʵ����','t_OperationLog','EntityName'
exec proc_AddCellExplanation '��������','t_OperationLog','RequestType'
exec proc_AddCellExplanation '������','t_OperationLog','MethodName'
exec proc_AddCellExplanation 'IP��ַ','t_OperationLog','IPAddress'
exec proc_AddCellExplanation '��ʼʱ��','t_OperationLog','StartTime'
exec proc_AddCellExplanation '����ʱ��','t_OperationLog','EndTime'
exec proc_AddCellExplanation '���к�ʱ','t_OperationLog','ElapsedMilliseconds'
exec proc_AddCellExplanation '������','t_OperationLog','OperationUser'
exec proc_AddCellExplanation '����ʱ��','t_OperationLog','CreateDate'
exec proc_AddCellExplanation '�а汾','t_OperationLog','RowVersion'
go

if exists(select * from sysobjects where name='v_OperationLog')
drop view v_OperationLog
go

create view v_OperationLog
as
select a.*,b.UserName, '��ϸ' LookDetail from t_OperationLog a
left join t_AdminUser b
on a.OperationUser=b.UserId
go
