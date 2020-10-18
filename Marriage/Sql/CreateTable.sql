use Marriage
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

--1��ƽ̨�û���t_AppUser��
if exists(select * from sysobjects where name='t_AppUser')
drop table t_AppUser
go

create table t_AppUser
(
UserId uniqueidentifier not null primary key,                  --����
Name nvarchar(50) not null,                                    --����
LoginName nvarchar(50) not null,                               --��¼��
LoginPassword varchar(50) not null,                            --��¼����
Status tinyint not null default(1),                            --״̬��1��������2���ر�
LastLoginDate datetime,                                        --�����¼ʱ��
LoginIp varchar(30),                                           --��¼Ip
Remark nvarchar(200),                                          --��ע 
IsDelete tinyint not null default(0),                          --�Ƿ�ɾ��
CreateUser uniqueidentifier not null,                          --������
CreateDate datetime default(getdate()) not null,               --����ʱ��
UpdateUser uniqueidentifier,                                   --������
UpdateDate datetime,                                           --����ʱ��
RowVersion timestamp not null                                  --�а汾
)
go

exec proc_AddCellExplanation '����','t_AppUser','UserId'
exec proc_AddCellExplanation '����','t_AppUser','Name'
exec proc_AddCellExplanation '��¼��','t_AppUser','LoginName'
exec proc_AddCellExplanation '��¼����','t_AppUser','LoginPassword'
exec proc_AddCellExplanation '״̬��1��������2���ر�','t_AppUser','Status'
exec proc_AddCellExplanation '�����¼ʱ��','t_AppUser','LastLoginDate'
exec proc_AddCellExplanation '��¼Ip','t_AppUser','LoginIp'
exec proc_AddCellExplanation '��ע','t_AppUser','Remark'
exec proc_AddCellExplanation '�Ƿ�ɾ��','t_AppUser','IsDelete'
exec proc_AddCellExplanation '������','t_AppUser','CreateUser'
exec proc_AddCellExplanation '����ʱ��','t_AppUser','CreateDate'
exec proc_AddCellExplanation '������','t_AppUser','UpdateUser'
exec proc_AddCellExplanation '����ʱ��','t_AppUser','UpdateDate'
exec proc_AddCellExplanation '�а汾','t_AppUser','RowVersion'
go

if exists(select * from sysobjects where name='v_AppUser')
drop view v_AppUser
go

create view v_AppUser
as
select a.*,
case when a.Status=1 then '����' when a.Status=2 then '�ر�' else 'δ֪' end StatusName
from t_AppUser a 
where a.IsDelete=0
go

--2��������Ϣ��t_Matchmaker��
if exists(select * from sysobjects where name='t_Matchmaker')
drop table t_Matchmaker
go

create table t_Matchmaker
(
MatchmakerId uniqueidentifier not null primary key,            --����
Name nvarchar(50) not null,                                    --����
LoginName nvarchar(50) not null,                               --��¼��
LoginPassword varchar(50) not null,                            --��¼����
HeadImageUrl nvarchar(200),                                    --ͷ��ͼƬ��ַ
Sex tinyint not null,                                          --�Ա�1���У�2��Ů
IdCard varchar(20) not null,                                   --���֤����
Phone varchar(20) not null,                                    --�ֻ�����
Address nvarchar(100) not null,                                --��ַ
Features nvarchar(500)��                                       --�ص�˵��
Status tinyint not null default(1),                            --״̬��1��������2���ر�
LastLoginDate datetime,                                        --�����¼ʱ��
LoginIp varchar(30),                                           --��¼Ip
Remark nvarchar(200),                                          --��ע 
IsDelete tinyint not null default(0),                          --�Ƿ�ɾ��
CreateUser uniqueidentifier not null,                          --������
CreateDate datetime default(getdate()) not null,               --����ʱ��
UpdateUser uniqueidentifier,                                   --������
UpdateDate datetime,                                           --����ʱ��
RowVersion timestamp not null                                  --�а汾
)
go

exec proc_AddCellExplanation '����','t_Matchmaker','MatchmakerId'
exec proc_AddCellExplanation '����','t_Matchmaker','Name'
exec proc_AddCellExplanation '��¼��','t_Matchmaker','LoginName'
exec proc_AddCellExplanation '��¼����','t_Matchmaker','LoginPassword'
exec proc_AddCellExplanation 'ͷ��ͼƬ��ַ','t_Matchmaker','HeadImageUrl'
exec proc_AddCellExplanation '�Ա�1���У�2��Ů','t_Matchmaker','Sex'
exec proc_AddCellExplanation '��ַ','t_Matchmaker','Address'
exec proc_AddCellExplanation '���֤����','t_Matchmaker','IdCard'
exec proc_AddCellExplanation '�ֻ�','t_Matchmaker','Phone'
exec proc_AddCellExplanation '�ص�˵��','t_Matchmaker','Features'
exec proc_AddCellExplanation '״̬��1��������2���ر�','t_Matchmaker','Status'
exec proc_AddCellExplanation '�����¼ʱ��','t_Matchmaker','LastLoginDate'
exec proc_AddCellExplanation '��¼Ip','t_Matchmaker','LoginIp'
exec proc_AddCellExplanation '��ע','t_Matchmaker','Remark'
exec proc_AddCellExplanation '�Ƿ�ɾ��','t_Matchmaker','IsDelete'
exec proc_AddCellExplanation '������','t_Matchmaker','CreateUser'
exec proc_AddCellExplanation '����ʱ��','t_Matchmaker','CreateDate'
exec proc_AddCellExplanation '������','t_Matchmaker','UpdateUser'
exec proc_AddCellExplanation '����ʱ��','t_Matchmaker','UpdateDate'
exec proc_AddCellExplanation '�а汾','t_Matchmaker','RowVersion'
go

if exists(select * from sysobjects where name='v_Matchmaker')
drop view v_Matchmaker
go

create view v_Matchmaker
as
select a.*,
case when a.Status=1 then '����' when a.Status=2 then '�ر�' else 'δ֪' end StatusName
from t_Matchmaker a 
where a.IsDelete=0
go

--2��App�˻�����Token��t_AppAccountToken��
if exists(select * from sysobjects where name='t_AppAccountToken')
drop table t_AppAccountToken
go
create table t_AppAccountToken
(
TokenId uniqueidentifier not null primary key,                 --����
AppAccountId uniqueidentifier not null,                        --App�˻�ID
AccessToken varchar(1000),                                     --΢��access token
ExpiresIn int,                                                 --΢��token��Чʱ�䣨�룩
UpdateDate datetime not null,                                      --����ʱ��
RowVersion timestamp not null                                  --�а汾
)
go

exec proc_AddCellExplanation '����','t_AppAccountToken','TokenId'
exec proc_AddCellExplanation 'App�˻�ID','t_AppAccountToken','AppAccountId'
exec proc_AddCellExplanation '΢��access token','t_AppAccountToken','AccessToken'
exec proc_AddCellExplanation '΢��token��Чʱ�䣨�룩','t_AppAccountToken','ExpiresIn'
exec proc_AddCellExplanation '����ʱ��','t_AppAccountToken','UpdateDate'
exec proc_AddCellExplanation '�а汾','t_AppAccountToken','RowVersion'
go

create index t_AppAccountToken_AppAccountId on t_AppAccountToken(AppAccountId)
go

--3����Ϊ���ͣ�t_ActionType��
if exists(select * from sysobjects where name='t_ActionType')
drop table t_ActionType
go

create table t_ActionType
(
ActionTypeId uniqueidentifier not null primary key,            --����
Name nvarchar(50) not null,                                    --����
ActionKey nvarchar(50),                                        --��ΪKEYֵ
Remark nvarchar(200),                                          --��ע 
IsDelete tinyint not null default(0),                          --�Ƿ�ɾ��
CreateUser uniqueidentifier not null,                          --������
CreateDate datetime default(getdate()) not null,               --����ʱ��
UpdateUser uniqueidentifier,                                   --������
UpdateDate datetime,                                           --����ʱ��
RowVersion timestamp not null                                  --�а汾
)
go

exec proc_AddCellExplanation '����','t_ActionType','ActionTypeId'
exec proc_AddCellExplanation '����','t_ActionType','Name'
exec proc_AddCellExplanation '��ΪKEYֵ','t_ActionType','ActionKey'
exec proc_AddCellExplanation '��ע','t_ActionType','Remark'
exec proc_AddCellExplanation '�Ƿ�ɾ��','t_ActionType','IsDelete'
exec proc_AddCellExplanation '������','t_ActionType','CreateUser'
exec proc_AddCellExplanation '����ʱ��','t_ActionType','CreateDate'
exec proc_AddCellExplanation '������','t_ActionType','UpdateUser'
exec proc_AddCellExplanation '����ʱ��','t_ActionType','UpdateDate'
exec proc_AddCellExplanation '�а汾','t_ActionType','RowVersion'
go

if exists(select * from sysobjects where name='v_ActionType')
drop view v_ActionType
go

create view v_ActionType
as
select a.*
from t_ActionType a where IsDelete=0
go

--4������΢����Ϣ��t_ReceiveWeChatMessage��
if exists(select * from sysobjects where name='t_ReceiveWeChatMessage')
drop table t_ReceiveWeChatMessage
go

create table t_ReceiveWeChatMessage
(
MessageId uniqueidentifier not null primary key,               --����
ToUserName varchar(50) not null,                               --������΢�ź�
FromUserName varchar(50) not null,                             --���ͷ��ʺţ�һ��OpenID��
CreateTime datetime not null,                                  --��Ϣ����ʱ�� �����ͣ�
MsgType varchar(30) not null,                                  --��Ϣ����
Content nvarchar(max),                                         --�ı���Ϣ����
MsgId bigint,                                                  --��Ϣid��64λ����
PicUrl nvarchar(500),                                          --ͼƬ���ӣ���ϵͳ���ɣ�
MediaId varchar(50),                                           --ͼƬ��Ϣý��id�����Ե��û�ȡ��ʱ�زĽӿ���ȡ���ݡ�             
Format varchar(30),                                            --������ʽ����amr��speex��
Recognition nvarchar(500),                                     --����ʶ������UTF8����
ThumbMediaId varchar(50),                                      --��Ƶ��Ϣ����ͼ��ý��id�����Ե��ö�ý���ļ����ؽӿ���ȡ���ݡ�
Location_X float,                                              --����λ��ά��
Location_Y float,                                              --����λ�þ���
Scale float,                                                   --��ͼ���Ŵ�С
Label nvarchar(200),                                           --����λ����Ϣ
Title nvarchar(100),                                           --��Ϣ����
Description nvarchar(500),                                     --��Ϣ����
Url nvarchar(200),                                             --��Ϣ����
Event varchar(30),                                             --�¼����ͣ�subscribe(����)��unsubscribe(ȡ������)
EventKey varchar(50),                                          --�¼�KEYֵ��qrscene_Ϊǰ׺������Ϊ��ά��Ĳ���ֵ
Ticket varchar(200),                                           --��ά���ticket����������ȡ��ά��ͼƬ
Latitude float,                                                --����λ��γ��
Longitude float,                                               --����λ�þ���
Precision float,                                               --����λ�þ���
CreateDate datetime default(getdate()) not null,               --����ʱ��
RowVersion timestamp not null                                  --�а汾
)
go

exec proc_AddCellExplanation '����','t_ReceiveWeChatMessage','MessageId'
exec proc_AddCellExplanation '������΢�ź�','t_ReceiveWeChatMessage','ToUserName'
exec proc_AddCellExplanation '���ͷ��ʺţ�һ��OpenID��','t_ReceiveWeChatMessage','FromUserName'
exec proc_AddCellExplanation '��Ϣ����ʱ��','t_ReceiveWeChatMessage','CreateTime'
exec proc_AddCellExplanation '��Ϣ����','t_ReceiveWeChatMessage','MsgType'
exec proc_AddCellExplanation '�ı���Ϣ����','t_ReceiveWeChatMessage','Content'
exec proc_AddCellExplanation '��Ϣid��64λ����','t_ReceiveWeChatMessage','MsgId'
exec proc_AddCellExplanation 'ͼƬ���ӣ���ϵͳ���ɣ�','t_ReceiveWeChatMessage','PicUrl'
exec proc_AddCellExplanation 'ͼƬ��Ϣý��id�����Ե��û�ȡ��ʱ�زĽӿ���ȡ���ݡ� ','t_ReceiveWeChatMessage','MediaId'
exec proc_AddCellExplanation '������ʽ����amr��speex��','t_ReceiveWeChatMessage','Format'
exec proc_AddCellExplanation '����ʶ������UTF8����','t_ReceiveWeChatMessage','Recognition'
exec proc_AddCellExplanation '��Ƶ��Ϣ����ͼ��ý��id�����Ե��ö�ý���ļ����ؽӿ���ȡ���ݡ�','t_ReceiveWeChatMessage','ThumbMediaId'
exec proc_AddCellExplanation '����λ��ά��','t_ReceiveWeChatMessage','Location_X'
exec proc_AddCellExplanation '����λ�þ���','t_ReceiveWeChatMessage','Location_Y'
exec proc_AddCellExplanation '��ͼ���Ŵ�С','t_ReceiveWeChatMessage','Scale'
exec proc_AddCellExplanation '����λ����Ϣ','t_ReceiveWeChatMessage','Label'
exec proc_AddCellExplanation '��Ϣ����','t_ReceiveWeChatMessage','Title'
exec proc_AddCellExplanation '��Ϣ����','t_ReceiveWeChatMessage','Description'
exec proc_AddCellExplanation '��Ϣ����','t_ReceiveWeChatMessage','Url'
exec proc_AddCellExplanation '�¼����ͣ�subscribe(����)��unsubscribe(ȡ������)','t_ReceiveWeChatMessage','Event'
exec proc_AddCellExplanation '�¼�KEYֵ��qrscene_Ϊǰ׺������Ϊ��ά��Ĳ���ֵ','t_ReceiveWeChatMessage','EventKey'
exec proc_AddCellExplanation '��ά���ticket����������ȡ��ά��ͼƬ','t_ReceiveWeChatMessage','Ticket'
exec proc_AddCellExplanation '����λ��γ��','t_ReceiveWeChatMessage','Latitude'
exec proc_AddCellExplanation '����λ�þ���','t_ReceiveWeChatMessage','Longitude'
exec proc_AddCellExplanation '����λ�þ���','t_ReceiveWeChatMessage','Precision'
exec proc_AddCellExplanation '����ʱ��','t_ReceiveWeChatMessage','CreateDate'
exec proc_AddCellExplanation '�а汾','t_ReceiveWeChatMessage','RowVersion'
go


--5����˿��Ϊ��¼��t_UserActionRecord��
if exists(select * from sysobjects where name='t_UserActionRecord')
drop table t_UserActionRecord
go

create table t_UserActionRecord
(
RecordId uniqueidentifier not null primary key,                --����
AppAccountId uniqueidentifier not null,                        --App�˺�ID
OpenId varchar(50) not null,                                   --�û�OpenID
RecordType tinyint not null,                                   --��¼���ͣ�1��΢����Ϣ���ͼ�¼��2��ҳ���Զ�������¼
MessageId uniqueidentifier,                                    --����΢����ϢID
ActionTypeId uniqueidentifier not null,                        --��Ϊ����ID
ActionName nvarchar(200) not null,                             --��Ϊ����
UserTagIds nvarchar(500),                                      --�û���ǩIds,�Զ��Ÿ���
Remark nvarchar(200),                                          --��ע
CreateDate datetime default(getdate()) not null,               --����ʱ��
RowVersion timestamp not null                                  --�а汾
)
go

exec proc_AddCellExplanation '����','t_UserActionRecord','RecordId'
exec proc_AddCellExplanation 'App�˺�ID','t_UserActionRecord','AppAccountId'
exec proc_AddCellExplanation '�û�OpenID','t_UserActionRecord','OpenID'
exec proc_AddCellExplanation '��¼���ͣ�1��΢����Ϣ���ͼ�¼��2��ҳ���Զ�������¼','t_UserActionRecord','RecordType'
exec proc_AddCellExplanation '����΢����ϢID','t_UserActionRecord','MessageId'
exec proc_AddCellExplanation '��Ϊ����ID','t_UserActionRecord','ActionTypeId'
exec proc_AddCellExplanation '��Ϊ����','t_UserActionRecord','ActionName'
exec proc_AddCellExplanation '�û���ǩIds,�Զ��Ÿ���','t_UserActionRecord','UserTagIds'
exec proc_AddCellExplanation '��ע','t_UserActionRecord','Remark'
exec proc_AddCellExplanation '����ʱ��','t_UserActionRecord','CreateDate'
exec proc_AddCellExplanation '�а汾','t_UserActionRecord','RowVersion'
go

create index t_UserActionRecord_AppAccountId on t_UserActionRecord(AppAccountId)
go

--6����˿��ǩ��t_UserTag��
if exists(select * from sysobjects where name='t_UserTag')
drop table t_UserTag
go

create table t_UserTag
(
UserTagId uniqueidentifier not null primary key,               --����
AppAccountId uniqueidentifier not null,                        --App�˺�ID
Name nvarchar(50) not null,                                    --����
Remark nvarchar(200),                                          --��ע 
IsDelete tinyint not null default(0),                          --�Ƿ�ɾ��
CreateUser uniqueidentifier not null,                          --������
CreateDate datetime default(getdate()) not null,               --����ʱ��
UpdateUser uniqueidentifier,                                   --������
UpdateDate datetime,                                           --����ʱ��
RowVersion timestamp not null                                  --�а汾
)
go

exec proc_AddCellExplanation '����','t_UserTag','UserTagId'
exec proc_AddCellExplanation 'App�˺�ID','t_UserTag','AppAccountId'
exec proc_AddCellExplanation '����','t_UserTag','Name'
exec proc_AddCellExplanation '��ע','t_UserTag','Remark'
exec proc_AddCellExplanation '�Ƿ�ɾ��','t_UserTag','IsDelete'
exec proc_AddCellExplanation '������','t_UserTag','CreateUser'
exec proc_AddCellExplanation '����ʱ��','t_UserTag','CreateDate'
exec proc_AddCellExplanation '������','t_UserTag','UpdateUser'
exec proc_AddCellExplanation '����ʱ��','t_UserTag','UpdateDate'
exec proc_AddCellExplanation '�а汾','t_UserTag','RowVersion'
go

create index t_UserTag_AppAccountId on t_UserTag(AppAccountId)
go

if exists(select * from sysobjects where name='v_UserTag')
drop view v_UserTag
go

create view v_UserTag
as
select a.*
from t_UserTag a where IsDelete=0
go

--7���˵���t_Menu��
if exists(select * from sysobjects where name='t_Menu')
drop table t_Menu
go

create table t_Menu
(
MenuId uniqueidentifier not null primary key,                  --����
AppAccountId uniqueidentifier not null,                        --App�˺�ID
Name nvarchar(50) not null,                                    --����
Content nvarchar(max) not null,                                --�˵��ṹjson
Remark nvarchar(200),                                          --��ע 
CreateUser uniqueidentifier not null,                          --������
CreateDate datetime default(getdate()) not null,               --����ʱ��
UpdateUser uniqueidentifier,                                   --������
UpdateDate datetime,                                           --����ʱ��
RowVersion timestamp not null                                  --�а汾
)
go

exec proc_AddCellExplanation '����','t_Menu','MenuId'
exec proc_AddCellExplanation 'App�˺�ID','t_Menu','AppAccountId'
exec proc_AddCellExplanation '����','t_Menu','Name'
exec proc_AddCellExplanation '�˵��ṹjson','t_Menu','Content'
exec proc_AddCellExplanation '��ע','t_Menu','Remark'
exec proc_AddCellExplanation '������','t_Menu','CreateUser'
exec proc_AddCellExplanation '����ʱ��','t_Menu','CreateDate'
exec proc_AddCellExplanation '������','t_Menu','UpdateUser'
exec proc_AddCellExplanation '����ʱ��','t_Menu','UpdateDate'
exec proc_AddCellExplanation '�а汾','t_Menu','RowVersion'
go

create index t_Menu_AppAccountId on t_Menu(AppAccountId)
go

--8��΢��ģ�壨t_WeChatTemplate��
if exists(select * from sysobjects where name='t_WeChatTemplate')
drop table t_WeChatTemplate
go

create table t_WeChatTemplate
(
TemplateId  nvarchar(100) not null primary key,                --����
AppAccountId uniqueidentifier not null,                        --App�˺�ID
Title nvarchar(100) not null,                                  --΢��ģ�����
PrimaryIndustry nvarchar(100),                                 --ģ��������ҵ��һ����ҵ 
DeputyIndustry nvarchar(100),                                  --ģ��������ҵ�Ķ�����ҵ 
Content nvarchar(max),                                         --ģ������
Example nvarchar(max),                                         --ģ��ʾ��
UpdateUser uniqueidentifier,                                   --������
UpdateDate datetime,                                           --����ʱ��
RowVersion timestamp not null                                  --�а汾
)
go

exec proc_AddCellExplanation '΢��ģ��Id','t_WeChatTemplate','TemplateId'
exec proc_AddCellExplanation 'App�˺�ID','t_WeChatTemplate','AppAccountId'
exec proc_AddCellExplanation '΢��ģ�����','t_WeChatTemplate','Title'
exec proc_AddCellExplanation 'ģ��������ҵ��һ����ҵ','t_WeChatTemplate','PrimaryIndustry'
exec proc_AddCellExplanation 'ģ��������ҵ�Ķ�����ҵ','t_WeChatTemplate','DeputyIndustry'
exec proc_AddCellExplanation 'ģ������','t_WeChatTemplate','Content'
exec proc_AddCellExplanation 'ģ��ʾ��','t_WeChatTemplate','Example'
exec proc_AddCellExplanation '������','t_WeChatTemplate','UpdateUser'
exec proc_AddCellExplanation '����ʱ��','t_WeChatTemplate','UpdateDate'
exec proc_AddCellExplanation '�а汾','t_WeChatTemplate','RowVersion'
go

create index t_WeChatTemplate_AppAccountId on t_WeChatTemplate(AppAccountId)
go

--10������ģ����Ϣ��t_SendTemplateMessage��
if exists(select * from sysobjects where name='t_SendTemplateMessage')
drop table t_SendTemplateMessage
go

create table t_SendTemplateMessage
(
SendTemplateMessageId uniqueidentifier not null primary key,   --����
AppAccountId uniqueidentifier not null,                        --App�˺�ID
TemplateId varchar(100) not null,                              --΢��ģ��ID
ResultResponse nvarchar(1000),                                 --�����Ӧ
Status tinyint not null default(0),                            --״̬��0��δ����,1���ѷ���
UserTagIds nvarchar(500) not null,                             --�û���ǩIds,�Զ��Ÿ���
Color nvarchar(20),                                            --ģ������������ɫ������Ĭ��Ϊ��ɫ
Remark nvarchar(200),                                          --��ע 
IsDelete tinyint not null default(0),                          --�Ƿ�ɾ��
CreateUser uniqueidentifier not null,                          --������
CreateDate datetime default(getdate()) not null,               --����ʱ��
UpdateUser uniqueidentifier,                                   --������
UpdateDate datetime,                                           --����ʱ��
RowVersion timestamp not null                                  --�а汾
)
go

exec proc_AddCellExplanation '����','t_SendTemplateMessage','SendTemplateMessageId'
exec proc_AddCellExplanation 'App�˺�ID','t_SendTemplateMessage','AppAccountId'
exec proc_AddCellExplanation 'ģ����ϢID','t_SendTemplateMessage','TemplateId'
exec proc_AddCellExplanation '�����Ӧ','t_SendTemplateMessage','ResultResponse'
exec proc_AddCellExplanation '״̬��0��δ����,1���ѷ���','t_SendTemplateMessage','Status'
exec proc_AddCellExplanation '�û���ǩIds,�Զ��Ÿ���','t_SendTemplateMessage','UserTagIds'
exec proc_AddCellExplanation 'ģ������������ɫ������Ĭ��Ϊ��ɫ','t_SendTemplateMessage','Color'
exec proc_AddCellExplanation '��ע','t_SendTemplateMessage','Remark'
exec proc_AddCellExplanation '�Ƿ�ɾ��','t_SendTemplateMessage','IsDelete'
exec proc_AddCellExplanation '������','t_SendTemplateMessage','CreateUser'
exec proc_AddCellExplanation '����ʱ��','t_SendTemplateMessage','CreateDate'
exec proc_AddCellExplanation '������','t_SendTemplateMessage','UpdateUser'
exec proc_AddCellExplanation '����ʱ��','t_SendTemplateMessage','UpdateDate'
exec proc_AddCellExplanation '�а汾','t_SendTemplateMessage','RowVersion'
go

create index t_SendTemplateMessage_AppAccountId on t_SendTemplateMessage(AppAccountId)
go

if exists(select * from sysobjects where name='v_SendTemplateMessage')
drop view v_SendTemplateMessage
go

create view v_SendTemplateMessage
as
select a.*,b.Title as WeChatTemplateName,
case when a.Status=1 then '�ѷ���' else 'δ����' end StatusName,
STUFF((SELECT ',' + Name FROM t_UserTag 
where a.UserTagIds like '%'+convert(varchar(36),UserTagId)+'%'
FOR xml path('')), 1, 1 ,'') as UserTagNames
from t_SendTemplateMessage a 
left join t_WeChatTemplate b on a.TemplateId=b.TemplateId
where IsDelete=0 
go

--11������ģ����Ϣ���ԣ�t_SendTemplateMessageProperty��
if exists(select * from sysobjects where name='t_SendTemplateMessageProperty')
drop table t_SendTemplateMessageProperty
go

create table t_SendTemplateMessageProperty
(
Id uniqueidentifier not null primary key,                      --����
SendTemplateMessageId uniqueidentifier not null,                              --����ģ����ϢID
PropertyName nvarchar(50) not null,                            --������
Value varchar(1000),                                           --ֵ
Color nvarchar(20),                                            --ģ������������ɫ������Ĭ��Ϊ��ɫ
)
go

exec proc_AddCellExplanation '����','t_SendTemplateMessageProperty','Id'
exec proc_AddCellExplanation '����ģ����ϢID','t_SendTemplateMessageProperty','SendTemplateMessageId'
exec proc_AddCellExplanation '������','t_SendTemplateMessageProperty','PropertyName'
exec proc_AddCellExplanation 'ֵ','t_SendTemplateMessageProperty','Value'
exec proc_AddCellExplanation 'ģ������������ɫ������Ĭ��Ϊ��ɫ','t_SendTemplateMessageProperty','Color'
go

--12���ؼ������ã�t_KeywordConfig��
if exists(select * from sysobjects where name='t_KeywordConfig')
drop table t_KeywordConfig
go

create table t_KeywordConfig
(
KeywordConfigId uniqueidentifier not null primary key,         --����
AppAccountId uniqueidentifier not null,                        --App�˺�ID
Keyword nvarchar(50) not null,                                 --�ؼ���
ReplyContent nvarchar(4000),                                   --�ظ�����
Remark nvarchar(200),                                          --��ע 
IsDelete tinyint not null default(0),                          --�Ƿ�ɾ��
CreateUser uniqueidentifier not null,                          --������
CreateDate datetime default(getdate()) not null,               --����ʱ��
UpdateUser uniqueidentifier,                                   --������
UpdateDate datetime,                                           --����ʱ��
RowVersion timestamp not null                                  --�а汾
)
go

exec proc_AddCellExplanation '����','t_KeywordConfig','KeywordConfigId'
exec proc_AddCellExplanation 'App�˺�ID','t_KeywordConfig','AppAccountId'
exec proc_AddCellExplanation '�ؼ���','t_KeywordConfig','Keyword'
exec proc_AddCellExplanation '�ظ�����','t_KeywordConfig','ReplyContent'
exec proc_AddCellExplanation '��ע','t_KeywordConfig','Remark'
exec proc_AddCellExplanation '�Ƿ�ɾ��','t_KeywordConfig','IsDelete'
exec proc_AddCellExplanation '������','t_KeywordConfig','CreateUser'
exec proc_AddCellExplanation '����ʱ��','t_KeywordConfig','CreateDate'
exec proc_AddCellExplanation '������','t_KeywordConfig','UpdateUser'
exec proc_AddCellExplanation '����ʱ��','t_KeywordConfig','UpdateDate'
exec proc_AddCellExplanation '�а汾','t_KeywordConfig','RowVersion'
go

create index t_KeywordConfig_AppAccountId on t_KeywordConfig(AppAccountId)
go

if exists(select * from sysobjects where name='v_KeywordConfig')
drop view v_KeywordConfig
go

create view v_KeywordConfig
as
select a.*
from t_KeywordConfig a where IsDelete=0
go

--13����˿�û���t_User��
if exists(select * from sysobjects where name='t_User')
drop table t_User
go

create table t_User
(
OpenId varchar(50) not null primary key,                       --΢��OpenId
AppAccountId uniqueidentifier not null,                        --App�˺�ID
UnionId varchar(50),                                           --΢��UnionId
NickName nvarchar(50),                                         --΢���ǳ� 
Sex tinyint not null default(0),                               --΢���û����Ա�ֵΪ1ʱ�����ԣ�ֵΪ2ʱ��Ů�ԣ�ֵΪ0ʱ��δ֪
City nvarchar(20),                                             --΢���û����ڳ���
Province nvarchar(20),                                         --΢���û�����ʡ��
HeadImgUrl nvarchar(200),                                      --΢���û�ͷ�����һ����ֵ����������ͷ���С����0��46��64��96��132��ֵ��ѡ��0����640*640������ͷ�񣩣��û�û��ͷ��ʱ����Ϊ�ա����û�����ͷ��ԭ��ͷ��URL��ʧЧ��
Remark nvarchar(200),                                          --��ע
UpdateUser uniqueidentifier,                                   --������
UpdateDate datetime,                                           --����ʱ��
RowVersion timestamp not null                                  --�а汾
)
go

exec proc_AddCellExplanation '΢��OpenId','t_User','OpenId'
exec proc_AddCellExplanation 'App�˺�ID','t_User','AppAccountId'
exec proc_AddCellExplanation '΢��UnionId','t_User','UnionId'
exec proc_AddCellExplanation '΢���ǳ�','t_User','NickName'
exec proc_AddCellExplanation '΢���û����Ա�ֵΪ1ʱ�����ԣ�ֵΪ2ʱ��Ů�ԣ�ֵΪ0ʱ��δ֪','t_User','Sex'
exec proc_AddCellExplanation '΢���û����ڳ���','t_User','City'
exec proc_AddCellExplanation '΢���û�����ʡ��','t_User','Province'
exec proc_AddCellExplanation '΢���û�ͷ�����һ����ֵ����������ͷ���С����0��46��64��96��132��ֵ��ѡ��0����640*640������ͷ�񣩣��û�û��ͷ��ʱ����Ϊ�ա����û�����ͷ��ԭ��ͷ��URL��ʧЧ��','t_User','HeadImgUrl'
exec proc_AddCellExplanation '��ע','t_User','Remark'
exec proc_AddCellExplanation '������','t_User','UpdateUser'
exec proc_AddCellExplanation '����ʱ��','t_User','UpdateDate'
exec proc_AddCellExplanation '�а汾','t_User','RowVersion'
go

create index t_User_AppAccountId on t_User(AppAccountId)
go

if exists(select * from sysobjects where name='v_User')
drop view v_User
go

create view v_User
as
select a.*,
case when a.Sex=1 then '��' when a.Sex=2 then 'Ů' else 'δ֪' end SexName
from t_User a
go

if exists(select * from sysobjects where name='v_User2')
drop view v_User2
go

create view v_User2
as
select a.*,
case when a.Sex=1 then '��' when a.Sex=2 then 'Ů' else 'δ֪' end SexName,
STUFF((SELECT ',' + Name FROM t_UserTag c,t_User_UserTag b 
where c.IsDelete=0 and  c.UserTagId=b.UserTagId and b.OpenId=a.OpenId
FOR xml path('')), 1, 1 ,'') as UserTagNames
from t_User a
go

if exists(select * from sysobjects where name='v_User_UserTag')
drop view v_User_UserTag
go

create view v_User_UserTag
as
select a.*,b.UserTagId,
case when a.Sex=1 then '��' when a.Sex=2 then 'Ů' else 'δ֪' end SexName
from t_User a, t_User_UserTag b,t_UserTag c
where a.OpenId=b.OpenId and b.UserTagId=c.UserTagId
and c.IsDelete=0
go

if exists(select * from sysobjects where name='v_User_UserTag2')
drop view v_User_UserTag2
go

create view v_User_UserTag2
as
select a.*,b.UserTagId,
case when a.Sex=1 then '��' when a.Sex=2 then 'Ů' else 'δ֪' end SexName,
STUFF((SELECT ',' + Name FROM t_UserTag e,t_User_UserTag d 
where e.IsDelete=0 and e.UserTagId=d.UserTagId and d.OpenId=a.OpenId
FOR xml path('')), 1, 1 ,'') as UserTagNames
from t_User a, t_User_UserTag b,t_UserTag c
where a.OpenId=b.OpenId and b.UserTagId=c.UserTagId
and c.IsDelete=0
go


--14����˿�û���ǩ
if exists(select * from sysobjects where name='t_User_UserTag')
drop table t_User_UserTag
go

create table t_User_UserTag
(
Id uniqueidentifier not null primary key,                      --����
OpenId varchar(50) not null,                                   --�û�OpenID
UserTagId uniqueidentifier not null                            --��ǩID
)
go

exec proc_AddCellExplanation '����','t_User_UserTag','Id'
exec proc_AddCellExplanation '�û�OpenID','t_User_UserTag','OpenId'
exec proc_AddCellExplanation '��ǩID','t_User_UserTag','UserTagId'
go

create index t_User_UserTag_UserTagId on t_User_UserTag(UserTagId);
go

--14������ӿڣ�t_ServiceInterface��
if exists(select * from sysobjects where name='t_ServiceInterface')
drop table t_ServiceInterface
go

create table t_ServiceInterface
(
ServiceInterfaceId uniqueidentifier not null primary key,      --����
Name nvarchar(50) not null,                                    --����
InterfaceName varchar(50) not null,                            --�ӿ���
MethodName varchar(50) not null,                               --������
Url nvarchar(200),                                             --URL
Remark nvarchar(200),                                          --��ע 
IsDelete tinyint not null default(0),                          --�Ƿ�ɾ��
CreateUser uniqueidentifier not null,                          --������
CreateDate datetime default(getdate()) not null,               --����ʱ��
UpdateUser uniqueidentifier,                                   --������
UpdateDate datetime,                                           --����ʱ��
RowVersion timestamp not null                                  --�а汾
)
go

exec proc_AddCellExplanation '����','t_ServiceInterface','ServiceInterfaceId'
exec proc_AddCellExplanation '����','t_ServiceInterface','Name'
exec proc_AddCellExplanation '�ӿ���','t_ServiceInterface','InterfaceName'
exec proc_AddCellExplanation '������','t_ServiceInterface','MethodName'
exec proc_AddCellExplanation 'URL','t_ServiceInterface','Url'
exec proc_AddCellExplanation '��ע','t_ServiceInterface','Remark'
exec proc_AddCellExplanation '�Ƿ�ɾ��','t_ServiceInterface','IsDelete'
exec proc_AddCellExplanation '������','t_ServiceInterface','CreateUser'
exec proc_AddCellExplanation '����ʱ��','t_ServiceInterface','CreateDate'
exec proc_AddCellExplanation '������','t_ServiceInterface','UpdateUser'
exec proc_AddCellExplanation '����ʱ��','t_ServiceInterface','UpdateDate'
exec proc_AddCellExplanation '�а汾','t_ServiceInterface','RowVersion'
go

if exists(select * from sysobjects where name='v_ServiceInterface')
drop view v_ServiceInterface
go

create view v_ServiceInterface
as
select a.*
from t_ServiceInterface a where IsDelete=0
go

--15����̨�û�(t_AdminUser)
if exists(select * from sysobjects where name='t_AdminUser')
drop table t_AdminUser
go

create table t_AdminUser
(
AdminUserId uniqueidentifier not null primary key,             --����
AppAccountId uniqueidentifier not null,                        --App�˺�ID
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

exec proc_AddCellExplanation '����','t_AdminUser','AdminUserId'
exec proc_AddCellExplanation 'App�˺�ID','t_AdminUser','AppAccountId'
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
AppAccountId uniqueidentifier not null,                         --App�˺�ID
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
exec proc_AddCellExplanation 'App�˺�ID','t_OperationLog','AppAccountId'
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

create index t_OperationLog_AppAccountId on t_OperationLog(AppAccountId)
go

if exists(select * from sysobjects where name='v_OperationLog')
drop view v_OperationLog
go

create view v_OperationLog
as
select a.*,b.UserName, '��ϸ' LookDetail from t_OperationLog a
left join t_AdminUser b
on a.OperationUser=b.AdminUserId
go

--18���ӿ���־
if exists(select * from sysobjects where name='t_ApiLog')
drop table t_ApiLog 
go

create table t_ApiLog
(
LogId uniqueidentifier not null primary key default(newid()),   --����
AppAccountId uniqueidentifier not null,                         --App�˺�ID
LogType nvarchar(20) not null,                                  --��־����
LogPath nvarchar(200) not null,                                 --��־·��
EntityName varchar(50) not null,                                --ʵ����
MethodName varchar(50) not null,                                 --������
IPAddress varchar(30),                                          --IP��ַ
StartTime datetime not null,                                    --��ʼʱ��
EndTime datetime not null,                                      --����ʱ��
ElapsedMilliseconds bigint not null,                            --���к�ʱ
CreateDate datetime not null default(getdate()),                --����ʱ��
RowVersion timestamp not null                                   --�а汾
)
go

exec proc_AddCellExplanation '����','t_ApiLog','LogId'
exec proc_AddCellExplanation 'App�˺�ID','t_ApiLog','AppAccountId'
exec proc_AddCellExplanation '��־����','t_ApiLog','LogType'
exec proc_AddCellExplanation '��־·��','t_ApiLog','LogPath'
exec proc_AddCellExplanation 'ʵ����','t_ApiLog','EntityName'
exec proc_AddCellExplanation '������','t_ApiLog','MethodName'
exec proc_AddCellExplanation 'IP��ַ','t_ApiLog','IPAddress'
exec proc_AddCellExplanation '��ʼʱ��','t_ApiLog','StartTime'
exec proc_AddCellExplanation '����ʱ��','t_ApiLog','EndTime'
exec proc_AddCellExplanation '���к�ʱ','t_ApiLog','ElapsedMilliseconds'
exec proc_AddCellExplanation '����ʱ��','t_ApiLog','CreateDate'
exec proc_AddCellExplanation '�а汾','t_ApiLog','RowVersion'
go

create index t_ApiLog_AppAccountId on t_ApiLog(AppAccountId)
go

if exists(select * from sysobjects where name='v_ApiLog')
drop view v_ApiLog
go

create view v_ApiLog
as
select a.*, '��ϸ' LookDetail from t_ApiLog a
go

--19�����������־��t_RequestServiceLog��
if exists(select * from sysobjects where name='t_RequestServiceLog')
drop table t_RequestServiceLog 
go

create table t_RequestServiceLog
(
LogId uniqueidentifier not null primary key default(newid()),   --����
AppAccountId uniqueidentifier not null,                         --App�˺�ID
LogType tinyint not null,                                       --��־���ͣ�1:�ɹ���2:ʧ��
ServiceInterfaceId  uniqueidentifier not null,                  --����ӿ�ID
RequestServiceLogId uniqueidentifier,                           --���������־ID,�ط������¼ʧ��������־ID
RequestContent  nvarchar(max),                                  --������
ResponseContent nvarchar(max),                                  --��Ӧ����
StartTime datetime not null,                                    --��ʼʱ��
EndTime datetime not null,                                      --����ʱ��
ElapsedMilliseconds bigint not null,                            --���к�ʱ
DataId uniqueidentifier,                                        --����Id,���緢��ģ����ϢID
CreateDate datetime not null default(getdate()),                --����ʱ��
RowVersion timestamp not null                                   --�а汾
)
go

exec proc_AddCellExplanation '����','t_RequestServiceLog','Id'
exec proc_AddCellExplanation 'App�˺�ID','t_RequestServiceLog','AppAccountId'
exec proc_AddCellExplanation '��־���ͣ�1:�ɹ���2:ʧ��','t_RequestServiceLog','LogType'
exec proc_AddCellExplanation '����ӿ�ID','t_RequestServiceLog','ServiceInterfaceId'
exec proc_AddCellExplanation '���������־ID,�ط������¼ʧ��������־ID','t_RequestServiceLog','RequestServiceLogId'
exec proc_AddCellExplanation '������','t_RequestServiceLog','RequestContent'
exec proc_AddCellExplanation '��Ӧ����','t_RequestServiceLog','ResponseContent'
exec proc_AddCellExplanation '��ʼʱ��','t_RequestServiceLog','StartTime'
exec proc_AddCellExplanation '����ʱ��','t_RequestServiceLog','EndTime'
exec proc_AddCellExplanation '���к�ʱ','t_RequestServiceLog','ElapsedMilliseconds'
exec proc_AddCellExplanation '����Id,���緢��ģ����ϢID','t_RequestServiceLog','DataId'
exec proc_AddCellExplanation '����ʱ��','t_RequestServiceLog','CreateDate'
exec proc_AddCellExplanation '�а汾','t_RequestServiceLog','RowVersion'
go

create index t_RequestServiceLog_AppAccountId on t_RequestServiceLog(AppAccountId)
go

if exists(select * from sysobjects where name='v_RequestServiceLog')
drop view v_RequestServiceLog
go

create view v_RequestServiceLog
as
with LogCount as
(
select RequestServiceLogId,COUNT(*) ReSendCount from t_RequestServiceLog
group by RequestServiceLogId
)
select a.*,b.Name ServiceInterfaceName,isNull(c.ReSendCount,0) ReSendCount,
case when a.LogType=1 then '�ɹ�' else 'ʧ��' end as LogTypeName,
case when a.RequestServiceLogId!=null then '��' else '��' end as IsReSendName
from t_RequestServiceLog a
left join t_ServiceInterface b on a.ServiceInterfaceId=b.ServiceInterfaceId
left join LogCount c on a.LogId=c.RequestServiceLogId
go


--20��ֱ����Ϣ��t_Live��
if exists(select * from sysobjects where name='t_Live')
drop table t_Live
go

create table t_Live
(
LiveId uniqueidentifier not null primary key,                  --����
Name nvarchar(50) not null,                                    --����
LiveCode varchar(50) not null,                                 --ֱ��������
CustomerId varchar(50) not null,                               --�ͻ�ID
PushDomainName varchar(50) not null,                           --��������
PlayDomainName varchar(50) not null,                           --��������
AppName  varchar(50) not null,                                 --App����
StreamName varchar(50) not null,                               --������
StartDate datetime not null,                                   --��ʼʱ��
EndDate datetime,                                              --����ʱ��
ChatRoomId varchar(50) not null,                               --������ID
LogoImageUrl varchar(300) not null,                            --LogoͼƬ��ַ
Sponsor varchar(50) not null,                                  --���췽
Summary nvarchar(max),                                         --���
AassistantPassword varchar(50) not null,                       --�����¼����
SpeakerPassword varchar(50) not null,                          --������¼����
GuestPassword varchar(50) not null,                            --�α���¼����
LiveStatus tinyint not null default(0),                        --ֱ��״̬��0��δ��ʼ��1��ֱ���У�2���ѽ���
SpeakerUserId varchar(30) not null,                            --�����û�Id
SpeakerRoomId varchar(30) not null,                            --��������Id
IsRecord  tinyint not null default(0),                         --�Ƿ�¼��
EditMediaTaskId varchar(100),                                  --�༭��Ƶ����Id
EditMediaFileId varchar(50),                                   --�༭��Ƶ����ļ�ID
EditMediaFileUrl varchar(200),                                 --�༭��Ƶ����ļ�URL
IsFiltering tinyint not null default(0),                       --�Ƿ����
IsAllBanned tinyint not null default(0),                       --�Ƿ�ȫ�����
ActivityImageUrl varchar(300),                                 --�ͼƬ��ַ
AllowPcBrowser int not null default(0),                        --�Ƿ�������PC�ϴ�, 1:����ȫ��ƽ̨�򿪣�2��ֻ������΢���д�
WxIdentificationType int not null default(0),                  --΢�ŷ�˿��������ã�1�������ע���ںţ�2����Ĭ��Ȩ��3����ʽ��Ȩ
FormUID varchar(50),                                           --��UID
FormTitle nvarchar(50),                                        --������
LabelList varchar(2000),                                       --��ǩUID����
ActivityUID varchar(50),                                       --�UID
Remark nvarchar(200),                                          --��ע 
IsDelete tinyint not null default(0),                          --�Ƿ�ɾ��
CreateUser varchar(50) not null,                               --������
CreateDate datetime default(getdate()) not null,               --����ʱ��
UpdateUser varchar(50),                                        --������
UpdateDate datetime,                                           --����ʱ��
RowVersion timestamp not null                                  --�а汾
)
go

exec proc_AddCellExplanation '����','t_Live','LiveId'
exec proc_AddCellExplanation '����','t_Live','Name'
exec proc_AddCellExplanation 'ֱ��������','t_Live','LiveCode'
exec proc_AddCellExplanation '�ͻ�ID','t_Live','CustomerId'
exec proc_AddCellExplanation '��������','t_Live','PushDomainName'
exec proc_AddCellExplanation '��������','t_Live','PlayDomainName'
exec proc_AddCellExplanation 'App����','t_Live','AppName'
exec proc_AddCellExplanation '������','t_Live','StreamName'
exec proc_AddCellExplanation '��ʼʱ��','t_Live','StartDate'
exec proc_AddCellExplanation '����ʱ��','t_Live','EndDate'
exec proc_AddCellExplanation '������ID','t_Live','ChatRoomId'
exec proc_AddCellExplanation 'LogoͼƬ��ַ','t_Live','LogoImageUrl'
exec proc_AddCellExplanation '���췽','t_Live','Sponsor'
exec proc_AddCellExplanation '���','t_Live','Summary'
exec proc_AddCellExplanation '�����¼����','t_Live','AassistantPassword'
exec proc_AddCellExplanation '������¼����','t_Live','SpeakerPassword'
exec proc_AddCellExplanation '�α���¼����','t_Live','GuestPassword'
exec proc_AddCellExplanation 'ֱ��״̬��0��δ��ʼ��1��ֱ���У�2���ѽ���','t_Live','LiveStatus'
exec proc_AddCellExplanation '�����û�Id','t_Live','SpeakerUserId'
exec proc_AddCellExplanation '��������Id','t_Live','SpeakerRoomId'
exec proc_AddCellExplanation '�Ƿ�¼��','t_Live','IsRecord'
exec proc_AddCellExplanation '�༭��Ƶ����Id','t_Live','EditMediaTaskId'
exec proc_AddCellExplanation '�༭��Ƶ����ļ�ID','t_Live','EditMediaFileId'
exec proc_AddCellExplanation '�༭��Ƶ����ļ�URL','t_Live','EditMediaFileUrl'
exec proc_AddCellExplanation '�Ƿ����','t_Live','IsFiltering'
exec proc_AddCellExplanation '�Ƿ�ȫ�����','t_Live','IsAllBanned'
exec proc_AddCellExplanation '�ͼƬ��ַ','t_Live','ActivityImageUrl'
exec proc_AddCellExplanation '�Ƿ�������PC�ϴ�, 1:����ȫ��ƽ̨�򿪣�2��ֻ������΢���д�','t_Live','AllowPcBrowser'
exec proc_AddCellExplanation '΢�ŷ�˿��������ã�1�������ע���ںţ�2����Ĭ��Ȩ��3����ʽ��Ȩ','t_Live','WxIdentificationType'
exec proc_AddCellExplanation '��UID','t_Live','FormUID'
exec proc_AddCellExplanation '������','t_Live','FormTitle'
exec proc_AddCellExplanation '��ǩUID����','t_Live','LabelList'
exec proc_AddCellExplanation '�UID','t_Live','ActivityUID'
exec proc_AddCellExplanation '��ע','t_Live','Remark'
exec proc_AddCellExplanation '�Ƿ�ɾ��','t_Live','IsDelete'
exec proc_AddCellExplanation '������','t_Live','CreateUser'
exec proc_AddCellExplanation '����ʱ��','t_Live','CreateDate'
exec proc_AddCellExplanation '������','t_Live','UpdateUser'
exec proc_AddCellExplanation '����ʱ��','t_Live','UpdateDate'
exec proc_AddCellExplanation '�а汾','t_Live','RowVersion'
go

create index t_Live_CustomerId_Idx on t_Live(CustomerId)
go

if exists(select * from sysobjects where name='v_Live')
drop view v_Live
go

create view v_Live
as
select a.*
from t_Live a where IsDelete=0
go

 
--20��ֱ���û�״̬��t_Live��
if exists(select * from sysobjects where name='t_LiveUserStatus')
drop table t_LiveUserStatus
go

create table t_LiveUserStatus
(
UserStatusId uniqueidentifier not null primary key,            --����
LiveId uniqueidentifier not null,                              --ֱ��ID
UserId varchar(50) not null,                                   --�û�ID
IsBanned tinyint not null default(0),                          --�Ƿ����
IsRemove tinyint not null default(0),                          --�Ƿ��߳�
RowVersion timestamp not null                                  --�а汾
)
go

exec proc_AddCellExplanation '����','t_LiveUserStatus','UserStatusId'
exec proc_AddCellExplanation 'ֱ��ID','t_LiveUserStatus','LiveId'
exec proc_AddCellExplanation '�û�ID','t_LiveUserStatus','UserId'
exec proc_AddCellExplanation '�Ƿ����','t_LiveUserStatus','IsBanned'
exec proc_AddCellExplanation '�Ƿ��߳�','t_LiveUserStatus','IsRemove'
exec proc_AddCellExplanation '�а汾','t_LiveUserStatus','RowVersion'
go


--22��ֱ�����ü۸���Ϣ��t_LiveFeePrice��
if exists(select * from sysobjects where name='t_LiveFeePrice')
drop table t_LiveFeePrice
go

create table t_LiveFeePrice
(
FeeId uniqueidentifier not null primary key,                    --����
LiveId uniqueidentifier not null,                              --ֱ��ID
FeeType tinyint not null,                                      --�������ͣ�1��ֱ��������2���㲥������3��ʵʱ����Ƶʱ��
Price money not null                                           --����(Ԫ/GB �� Ԫ/����)
)
go

exec proc_AddCellExplanation '����','t_LiveFeePrice','FeeId'
exec proc_AddCellExplanation 'ֱ��ID','t_LiveFeePrice','LiveId'
exec proc_AddCellExplanation '�������ͣ�1��ֱ��������2���㲥������3��ʵʱ����Ƶʱ��','t_LiveFeePrice','FeeType'
exec proc_AddCellExplanation '����(Ԫ/MB �� Ԫ/����)','t_LiveFeePrice','Price'
go


--23��ֱ������������Ϣ��t_LiveStreamPlayInfo��
if exists(select * from sysobjects where name='t_LiveStreamPlayInfo')
drop table t_LiveStreamPlayInfo
go

create table t_LiveStreamPlayInfo
(
InfoId uniqueidentifier not null primary key,                  --����
DayTime varchar(10) not null,                                  --���ڣ���ʽ��YYYY-mm-dd
PageNum int not null,                                          --ҳ��
StreamName varchar(50) not null,                               --������
TotalFlux float not null,	                                   --����������λ: MB
CreateDate datetime default(getdate()) not null,               --����ʱ��
)
go

exec proc_AddCellExplanation '����','t_LiveStreamPlayInfo','InfoId'
exec proc_AddCellExplanation '���ڣ���ʽ��YYYY-mm-dd','t_LiveStreamPlayInfo','DayTime'
exec proc_AddCellExplanation 'ҳ��','t_LiveStreamPlayInfo','PageNum'
exec proc_AddCellExplanation '������','t_LiveStreamPlayInfo','StreamName'
exec proc_AddCellExplanation '����������λ: MB','t_LiveStreamPlayInfo','TotalFlux'
exec proc_AddCellExplanation '����ʱ��','t_LiveStreamPlayInfo','CreateDate'
go

--24��ֱ��ʵʱ����Ƶͨ��ʱ����Ϣ��
if exists(select * from sysobjects where name='t_LiveRoomCallTimeInfo')
drop table t_LiveRoomCallTimeInfo
go

create table t_LiveRoomCallTimeInfo
(
InfoId uniqueidentifier not null primary key,                  --����
LiveId uniqueidentifier not null,                              --ֱ��ID
TotalMinutes int not null,                                     --��ͨ��ʱ��
CreateDate datetime default(getdate()) not null,               --����ʱ��
)
go

exec proc_AddCellExplanation '����','t_LiveRoomCallTimeInfo','InfoId'
exec proc_AddCellExplanation 'ֱ��ID����ʽ��YYYY-mm-dd','t_LiveRoomCallTimeInfo','LiveId'
exec proc_AddCellExplanation '��ͨ��ʱ��','t_LiveRoomCallTimeInfo','TotalMinutes'
exec proc_AddCellExplanation '����ʱ��','t_LiveRoomCallTimeInfo','CreateDate'
go

--24��ֱ���Ƶ㲥������Ϣ��
if exists(select * from sysobjects where name='t_LiveVodPlayInfo')
drop table t_LiveVodPlayInfo
go

create table t_LiveVodPlayInfo
(
InfoId uniqueidentifier not null primary key,                  --����
FileId varchar(50) not null,                                   --�ļ�ID
DayTime datetime not null,                                     --���ڣ���ʽ��YYYY-mm-dd
TotalFlux float not null,	                                   --����������λ: MB
SyncCode varchar(20) not null,                                 --ͬ�����
ResponseStatus tinyint not null,                               --��Ӧ״̬��1���ɹ���2��ʧ��
ResponseContent nvarchar(4000),                                --��Ӧ����
CreateDate datetime default(getdate()) not null,               --����ʱ��
)
go

exec proc_AddCellExplanation '����','t_LiveVodPlayInfo','InfoId'
exec proc_AddCellExplanation '�ļ�ID����ʽ��YYYY-mm-dd','t_LiveVodPlayInfo','FileId'
exec proc_AddCellExplanation '���ڣ���ʽ��YYYY-mm-dd','t_LiveVodPlayInfo','DayTime'
exec proc_AddCellExplanation '����������λ: MB','t_LiveVodPlayInfo','TotalFlux'
exec proc_AddCellExplanation 'ͬ�����','t_LiveVodPlayInfo','SyncCode'
exec proc_AddCellExplanation '��Ӧ״̬��1���ɹ���2��ʧ��','t_LiveVodPlayInfo','ResponseStatus'
exec proc_AddCellExplanation '��Ӧ����','t_LiveVodPlayInfo','ResponseContent'
exec proc_AddCellExplanation '����ʱ��','t_LiveVodPlayInfo','CreateDate'
go

if exists(select * from sysobjects where name='v_LiveVodPlayInfo')
drop view v_LiveVodPlayInfo
go

create view v_LiveVodPlayInfo
as
select a.*,b.Name,b.LiveCode,
case when a.ResponseStatus = 1 then '�ɹ�' when a.ResponseStatus=2 then 'ʧ��' else '' end ResponseStatusName
from t_LiveVodPlayInfo a, t_Live b 
where a.FileId= b.EditMediaFileId and a.ResponseStatus>0
go

if exists(select * from sysobjects where name='v_LiveVodPlaySyncRecord')
drop view v_LiveVodPlaySyncRecord
go

create view v_LiveVodPlaySyncRecord
as
select DayTime,SyncCode,SUM(case when responsestatus in(1,2) then 1 else 0 end) RecordCount, SUM(case when responsestatus=1 then 1 else 0 end) SucceedCount,
SUM(case when responsestatus=2 then 1 else 0 end) FailedCount
from t_LiveVodPlayInfo a
group by DayTime,SyncCode
go



--ֱ������
if exists(select * from sysobjects where name='v_LiveFee')
drop view v_LiveFee
go

create view v_LiveFee
as
with sumStreamFlux as 
(
select StreamName, sum(TotalFlux)/1024 TotalFlux from t_LiveStreamPlayInfo
group by StreamName
),
 sumVodFlux as 
(
select FileId, sum(TotalFlux)/1024 TotalFlux from t_LiveVodPlayInfo
group by FileId
)
select a.LiveId,a.LiveCode,a.Name,a.StreamName,a.SpeakerRoomId,isNull(b.Price,0) as FluxPirce,isnull(c.TotalFlux,0) as TotalFlux, 
ROUND(isnull(b.Price,0)* isnull(c.TotalFlux,0),2) as TotalStreamAmount,
isNull(f.Price,0) VodPrice,
isnull(g.TotalFlux,0) TotalVodFlux,
ROUND(isnull(f.Price,0)* isnull(g.TotalFlux,0),2) as TotalVodAmount,
ISNULL(d.Price,0) CallPrice,
ISNULL(e.TotalMinutes,0) TotalMinutes,
ROUND(isnull(d.Price,0)* isnull(e.TotalMinutes,0),2) as TotalCallAmount
from t_Live a
left join t_LiveFeePrice b on a.LiveId= b.LiveId and b.FeeType=1
left join sumStreamFlux c  on a.StreamName=c.StreamName
left join t_LiveFeePrice f on a.LiveId= f.LiveId and f.FeeType=2
left join sumVodFlux g  on a.EditMediaFileId=g.FileId
left join t_LiveFeePrice d on a.LiveId=d.LiveId and d.FeeType=3
left join t_LiveRoomCallTimeInfo e on e.LiveId=e.LiveId
go


--21�������¼��EventsFormRecord��
if exists(select * from sysobjects where name='EventsFormRecord')
drop table EventsFormRecord
go

create table EventsFormRecord
(
UID uniqueidentifier not null primary key,                     --����
CompanyID int not null,                                        --��˾ID
EventUID uniqueidentifier not null,                            --�ID  
EventFormUID uniqueidentifier not null,                         --���ID
OpenId varchar(50),                                            --�û�OpenId
CreatedDate datetime default(getdate()) not null,              --����ʱ��
Field0 nvarchar(2000),
Field1 nvarchar(2000),
Field2 nvarchar(2000),
Field3 nvarchar(2000),
Field4 nvarchar(2000),
Field5 nvarchar(2000),
Field6 nvarchar(2000),
Field7 nvarchar(2000),
Field8 nvarchar(2000),
Field9 nvarchar(2000),
Field10 nvarchar(2000),
Field11 nvarchar(2000),
Field12 nvarchar(2000),
Field13 nvarchar(2000),
Field14 nvarchar(2000),
Field15 nvarchar(2000),
Field16 nvarchar(2000),
Field17 nvarchar(2000),
Field18 nvarchar(2000),
Field19 nvarchar(2000),
Field20 nvarchar(2000),
Field21 nvarchar(2000),
Field22 nvarchar(2000),
Field23 nvarchar(2000),
Field24 nvarchar(2000),
Field25 nvarchar(2000),
Field26 nvarchar(2000),
Field28 nvarchar(2000),
Field29 nvarchar(2000),
Field30 nvarchar(2000),
Field31 nvarchar(2000),
Field32 nvarchar(2000),
Field33 nvarchar(2000),
Field34 nvarchar(2000),
Field35 nvarchar(2000),
Field36 nvarchar(2000),
Field38 nvarchar(2000),
Field39 nvarchar(2000),
Field40 nvarchar(2000),
Field41 nvarchar(2000),
Field42 nvarchar(2000),
Field43 nvarchar(2000),
Field44 nvarchar(2000),
Field45 nvarchar(2000),
Field46 nvarchar(2000),
Field48 nvarchar(2000),
Field49 nvarchar(2000),
Field50 nvarchar(2000)
)
go

exec proc_AddCellExplanation '����','EventsFormRecord','UID'
exec proc_AddCellExplanation '��˾ID','EventsFormRecord','CompanyID'
exec proc_AddCellExplanation '�ID','EventsFormRecord','EventUID'
exec proc_AddCellExplanation '���ID','EventsFormRecord','EventFormUID'
exec proc_AddCellExplanation '�û�OpenId','EventsFormRecord','OpenId'
exec proc_AddCellExplanation '����ʱ��','EventsFormRecord','CreatedDate'
go


SELECT o.name as TableName,
       c.name AS �ֶ���,
       TYPE_NAME(c.user_type_id) AS ����,
       max_length as ����,
	   case when is_Nullable=0 then 'not null' else 'null' end  as �Ƿ�ɿ�,
       isnull(ep.value, '') AS ˵��,
       ISNULL(d.is_primary_key, 0) as �Ƿ�����
  FROM sys.objects AS o
  JOIN sys.columns AS c
    ON o.object_id = c.object_id
  LEFT JOIN sys.extended_properties ep
    ON c.object_id = ep.major_id
   and c.column_id = ep.minor_id
  left join (select a.object_id, b.column_id, a.is_primary_key
               from sys.indexes         a,
                    sys.index_columns   b,
                    sys.key_constraints c
              where a.index_id = b.index_id
                and a.object_id = b.object_id
                and a.object_id = c.parent_object_id
                and a.is_primary_key = 1) d
    on c.object_id = d.object_id
   and c.column_id = d.column_id
 WHERE o.name = 't_RequestServiceLog'
 ORDER BY c.column_id
 go