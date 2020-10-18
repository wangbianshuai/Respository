use Resources
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


--1���ļ���¼��t_FileRecord��
if exists(select * from sysobjects where name='t_FileRecord')
drop table t_FileRecord
go

create table t_FileRecord
(
FileId uniqueidentifier not null primary key,                  --����
AppId varchar(20) not null,                                    --AppId
FilePath nvarchar(500) not null,                               --�ļ�·��
FileName nvarchar(200) not null,                               --�ļ���
FileType varchar(20) not null,                                 --�ļ�����
FileSize bigint not null,                                      --�ļ���С(�ֽ�B)
IpAddress varchar(30),                                         --IP��ַ
CreateDate datetime default(getdate()) not null,               --����ʱ��
RowVersion timestamp not null                                  --�а汾
)
go

exec proc_AddCellExplanation '����','t_FileRecord','FileId'
exec proc_AddCellExplanation 'AppId','t_FileRecord','AppId'
exec proc_AddCellExplanation '�ļ�·��','t_FileRecord','FilePath'
exec proc_AddCellExplanation '�ļ���','t_FileRecord','FileName'
exec proc_AddCellExplanation '�ļ�����','t_FileRecord','FileType'
exec proc_AddCellExplanation '�ļ���С(�ֽ�B)','t_FileRecord','FileSize'
exec proc_AddCellExplanation 'IP��ַ','t_FileRecord','IpAddress'
exec proc_AddCellExplanation '����ʱ��','t_FileRecord','CreateDate'
exec proc_AddCellExplanation '�а汾','t_FileRecord','RowVersion'
go
