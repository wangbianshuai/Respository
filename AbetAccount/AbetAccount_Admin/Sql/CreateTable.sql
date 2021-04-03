use [AbetAccount]
go

if exists(select 1 from sys.objects where name='proc_AddCellExplanation')
DROP PROC proc_AddCellExplanation
GO
CREATE PROC proc_AddCellExplanation
  @Explanation nvarchar(100),--说明
  @TableName nvarchar(100),--表名
  @CellName nvarchar(100)--列名
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

--1、后台用户(t_AdminUser)
if exists(select * from sysobjects where name='t_AdminUser')
drop table t_AdminUser
go

create table t_AdminUser
(
UserId uniqueidentifier not null primary key,                  --主键
UserName nvarchar(50) not null,                                --用户名
LoginName nvarchar(50) not null,                               --登录名
LoginPassword nvarchar(50) not null,                           --登录密码
LastLoginDate datetime,                                        --最近登录时间 
IsDelete tinyint not null default(0),                          --是否删除
CreateUser uniqueidentifier not null,                          --创建人
CreateDate datetime default(getdate()) not null,               --创建时间
UpdateUser uniqueidentifier,                                   --更新人
UpdateDate datetime,                                           --更新时间
RowVersion timestamp not null                                  --行版本
)
go

exec proc_AddCellExplanation '主键','t_AdminUser','UserId'
exec proc_AddCellExplanation '用户名','t_AdminUser','UserName'
exec proc_AddCellExplanation '登录名','t_AdminUser','LoginName'
exec proc_AddCellExplanation '登录密码','t_AdminUser','LoginPassword'
exec proc_AddCellExplanation '最近登录时间','t_AdminUser','LastLoginDate'
exec proc_AddCellExplanation '是否删除','t_AdminUser','IsDelete'
exec proc_AddCellExplanation '创建人','t_AdminUser','CreateUser'
exec proc_AddCellExplanation '创建时间','t_AdminUser','CreateDate'
exec proc_AddCellExplanation '更新人','t_AdminUser','UpdateUser'
exec proc_AddCellExplanation '更新时间','t_AdminUser','UpdateDate'
exec proc_AddCellExplanation '行版本','t_AdminUser','RowVersion'
go

if exists(select * from sysobjects where name='v_AdminUser')
drop view v_AdminUser
go

create view v_AdminUser
as
select a.*
from t_AdminUser a where IsDelete=0
go

--16、键值配置（t_DictionaryConfig）
if exists(select * from sysobjects where name='t_DictionaryConfig')
drop table t_DictionaryConfig
go

create table t_DictionaryConfig
(
DictionaryConfigId uniqueidentifier not null primary key,                      --主键
Name nvarchar(50) not null,                                    --名称
Value nvarchar(1000),                                          --值
TypeName nvarchar(50),                                         --类型名
Remark nvarchar(200),                                          --备注 
IsDelete tinyint not null default(0),                          --是否删除
CreateUser uniqueidentifier not null,                          --创建人
CreateDate datetime default(getdate()) not null,               --创建时间
UpdateUser uniqueidentifier,                                   --更新人
UpdateDate datetime,                                           --更新时间
RowVersion timestamp not null                                  --行版本
)
go

exec proc_AddCellExplanation '主键','t_DictionaryConfig','DictionaryConfigId'
exec proc_AddCellExplanation '名称','t_DictionaryConfig','Name'
exec proc_AddCellExplanation '值','t_DictionaryConfig','Value'
exec proc_AddCellExplanation '类型名','t_DictionaryConfig','TypeName'
exec proc_AddCellExplanation '备注','t_DictionaryConfig','Remark'
exec proc_AddCellExplanation '是否删除','t_DictionaryConfig','IsDelete'
exec proc_AddCellExplanation '创建人','t_DictionaryConfig','CreateUser'
exec proc_AddCellExplanation '创建时间','t_DictionaryConfig','CreateDate'
exec proc_AddCellExplanation '更新人','t_DictionaryConfig','UpdateUser'
exec proc_AddCellExplanation '更新时间','t_DictionaryConfig','UpdateDate'
exec proc_AddCellExplanation '行版本','t_DictionaryConfig','RowVersion'
go

if exists(select * from sysobjects where name='v_DictionaryConfig')
drop view v_DictionaryConfig
go

create view v_DictionaryConfig
as
select a.*
from t_DictionaryConfig a where IsDelete=0
go

--17、操作日志
if exists(select * from sysobjects where name='t_OperationLog')
drop table t_OperationLog 
go

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
OperationUser uniqueidentifier,                                 --操作人
CreateDate datetime not null default(getdate()),                --创建时间
RowVersion timestamp not null                                   --行版本
)
go

exec proc_AddCellExplanation '主键','t_OperationLog','LogId'
exec proc_AddCellExplanation '日志类型','t_OperationLog','LogType'
exec proc_AddCellExplanation '日志路径','t_OperationLog','LogPath'
exec proc_AddCellExplanation '实体名','t_OperationLog','EntityName'
exec proc_AddCellExplanation '请求类型','t_OperationLog','RequestType'
exec proc_AddCellExplanation '方法名','t_OperationLog','MethodName'
exec proc_AddCellExplanation 'IP地址','t_OperationLog','IPAddress'
exec proc_AddCellExplanation '开始时间','t_OperationLog','StartTime'
exec proc_AddCellExplanation '结束时间','t_OperationLog','EndTime'
exec proc_AddCellExplanation '运行耗时','t_OperationLog','ElapsedMilliseconds'
exec proc_AddCellExplanation '操作人','t_OperationLog','OperationUser'
exec proc_AddCellExplanation '创建时间','t_OperationLog','CreateDate'
exec proc_AddCellExplanation '行版本','t_OperationLog','RowVersion'
go

if exists(select * from sysobjects where name='v_OperationLog')
drop view v_OperationLog
go

create view v_OperationLog
as
select a.*,b.UserName, '详细' LookDetail from t_OperationLog a
left join t_AdminUser b
on a.OperationUser=b.UserId
go
