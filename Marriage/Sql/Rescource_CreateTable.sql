use Resources
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


--1、文件记录表（t_FileRecord）
if exists(select * from sysobjects where name='t_FileRecord')
drop table t_FileRecord
go

create table t_FileRecord
(
FileId uniqueidentifier not null primary key,                  --主键
AppId varchar(20) not null,                                    --AppId
FilePath nvarchar(500) not null,                               --文件路径
FileName nvarchar(200) not null,                               --文件名
FileType varchar(20) not null,                                 --文件类型
FileSize bigint not null,                                      --文件大小(字节B)
IpAddress varchar(30),                                         --IP地址
CreateDate datetime default(getdate()) not null,               --创建时间
RowVersion timestamp not null                                  --行版本
)
go

exec proc_AddCellExplanation '主键','t_FileRecord','FileId'
exec proc_AddCellExplanation 'AppId','t_FileRecord','AppId'
exec proc_AddCellExplanation '文件路径','t_FileRecord','FilePath'
exec proc_AddCellExplanation '文件名','t_FileRecord','FileName'
exec proc_AddCellExplanation '文件类型','t_FileRecord','FileType'
exec proc_AddCellExplanation '文件大小(字节B)','t_FileRecord','FileSize'
exec proc_AddCellExplanation 'IP地址','t_FileRecord','IpAddress'
exec proc_AddCellExplanation '创建时间','t_FileRecord','CreateDate'
exec proc_AddCellExplanation '行版本','t_FileRecord','RowVersion'
go
