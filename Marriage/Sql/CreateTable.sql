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
OpenId varchar(50) not null,                                   --΢��OpenId
NickName nvarchar(50),                                         --΢���ǳ� 
Sex tinyint not null default(0),                               --΢���û����Ա�ֵΪ1ʱ�����ԣ�ֵΪ2ʱ��Ů�ԣ�ֵΪ0ʱ��δ֪
City nvarchar(20),                                             --΢���û����ڳ���
Province nvarchar(20),                                         --΢���û�����ʡ��
HeadImgUrl nvarchar(200),                                      --΢���û�ͷ�����һ����ֵ����������ͷ���С����0��46��64��96��132��ֵ��ѡ��0����640*640������ͷ�񣩣��û�û��ͷ��ʱ����Ϊ�ա����û�����ͷ��ԭ��ͷ��URL��ʧЧ��
IdCard varchar(20) not null,                                   --���֤����
Phone varchar(20) not null,                                    --�ֻ�����
Address nvarchar(100) not null,                                --��ַ
Features nvarchar(500),                                        --�ص�˵��
IsAppMatchmaker tinyint not null default(0),                   --�Ƿ�ƽ̨����
Status tinyint not null default(0),                            --״̬��0������ˣ�1�����ͨ����2����˲�ͨ����3���ر�
UpdateStatusDate datetime,                                     --����״̬ʱ��
NoPassReason nvarchar(500),                                    --��˲�ͨ��ԭ��
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
exec proc_AddCellExplanation '΢��OpenId','t_Matchmaker','OpenId'
exec proc_AddCellExplanation '΢���ǳ�','t_Matchmaker','NickName'
exec proc_AddCellExplanation '΢���û����Ա�ֵΪ1ʱ�����ԣ�ֵΪ2ʱ��Ů�ԣ�ֵΪ0ʱ��δ֪','t_Matchmaker','Sex'
exec proc_AddCellExplanation '΢���û����ڳ���','t_Matchmaker','City'
exec proc_AddCellExplanation '΢���û�����ʡ��','t_Matchmaker','Province'
exec proc_AddCellExplanation '΢���û�ͷ�����һ����ֵ����������ͷ���С����0��46��64��96��132��ֵ��ѡ��0����640*640������ͷ�񣩣��û�û��ͷ��ʱ����Ϊ�ա����û�����ͷ��ԭ��ͷ��URL��ʧЧ��','t_Matchmaker','HeadImgUrl'
exec proc_AddCellExplanation '��ַ','t_Matchmaker','Address'
exec proc_AddCellExplanation '���֤����','t_Matchmaker','IdCard'
exec proc_AddCellExplanation '�ֻ�','t_Matchmaker','Phone'
exec proc_AddCellExplanation '�ص�˵��','t_Matchmaker','Features'
exec proc_AddCellExplanation '�Ƿ�ƽ̨����','t_Matchmaker','IsAppMatchmaker'
exec proc_AddCellExplanation '״̬��0������ˣ�1�����ͨ����2����˲�ͨ����3���ر�','t_Matchmaker','Status'
exec proc_AddCellExplanation '����״̬ʱ��','t_Matchmaker','UpdateStatusDate'
exec proc_AddCellExplanation '�����¼ʱ��','t_Matchmaker','LastLoginDate'
exec proc_AddCellExplanation '��˲�ͨ��ԭ��','t_Matchmaker','NoPassReason'
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
case when a.Status=0 then '�����' when a.Status=1 then '���ͨ��'
when a.Status=2 then '��˲�ͨ��' when a.Status=3 then '�ر�' else 'δ֪' end StatusName,
case when a.Sex=1 then '��' when a.Sex=2 then 'Ů' else 'δ֪' end SexName,
case when a.IsAppMatchmaker=1 then '��' else '��' end IsAppMatchmakerName
from t_Matchmaker a 
where a.IsDelete=0
go

--3�������û���Ϣ��t_MarriageUser��
if exists(select * from sysobjects where name='t_MarriageUser')
drop table t_MarriageUser
go

create table t_MarriageUser
(
UserId uniqueidentifier not null primary key,                  --����
Name nvarchar(50) not null,                                    --����
OpenId varchar(50),                                            --΢��OpenId
NickName nvarchar(50),                                         --΢���ǳ� 
Sex tinyint not null default(0),                               --΢���û����Ա�ֵΪ1ʱ�����ԣ�ֵΪ2ʱ��Ů�ԣ�ֵΪ0ʱ��δ֪
City nvarchar(20),                                             --΢���û����ڳ���
Province nvarchar(20),                                         --΢���û�����ʡ��
HeadImgUrl nvarchar(200),                                      --΢���û�ͷ�����һ����ֵ����������ͷ���С����0��46��64��96��132��ֵ��ѡ��0����640*640������ͷ�񣩣��û�û��ͷ��ʱ����Ϊ�ա����û�����ͷ��ԭ��ͷ��URL��ʧЧ��
IdCard varchar(20) not null,                                   --���֤����
Phone varchar(20) not null,                                    --�ֻ�����
Address nvarchar(100) not null,                                --��ͥ��ַ
NowAddress nvarchar(100),                                      --�־�ס��
Birthday datetime,                                             --��������
BirthTime int not null,                                        --ʱ��
LunarBirthday nvarchar(30),                                    --ũ������
BirthEight nvarchar(30),                                       --��������
IsPublic tinyint not null default(0),                          --�Ƿ񹫿�
MatchmakerId uniqueidentifier not null,                        --��������
Status tinyint not null default(0),                            --״̬��0������ˣ�1�����ͨ����2����˲�ͨ����3���ر�
UpdateStatusDate datetime,                                     --����״̬ʱ��
NoPassReason nvarchar(500),                                    --��˲�ͨ��ԭ��
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

exec proc_AddCellExplanation '����','t_MarriageUser','UserId'
exec proc_AddCellExplanation '����','t_MarriageUser','Name'
exec proc_AddCellExplanation '΢��OpenId','t_MarriageUser','OpenId'
exec proc_AddCellExplanation '΢���ǳ�','t_MarriageUser','NickName'
exec proc_AddCellExplanation '΢���û����Ա�ֵΪ1ʱ�����ԣ�ֵΪ2ʱ��Ů�ԣ�ֵΪ0ʱ��δ֪','t_MarriageUser','Sex'
exec proc_AddCellExplanation '΢���û����ڳ���','t_MarriageUser','City'
exec proc_AddCellExplanation '΢���û�����ʡ��','t_MarriageUser','Province'
exec proc_AddCellExplanation '΢���û�ͷ��','t_MarriageUser','HeadImgUrl'
exec proc_AddCellExplanation '���֤����','t_MarriageUser','IdCard'
exec proc_AddCellExplanation '�ֻ�','t_MarriageUser','Phone'
exec proc_AddCellExplanation '��ͥ��ַ','t_MarriageUser','Address'
exec proc_AddCellExplanation '�־�ס��','t_MarriageUser','NowAddress'
exec proc_AddCellExplanation '��������','t_MarriageUser','Birthday'
exec proc_AddCellExplanation 'ʱ��','t_MarriageUser','BirthTime'
exec proc_AddCellExplanation 'ũ������','t_MarriageUser','LunarBirthday'
exec proc_AddCellExplanation '��������','t_MarriageUser','BirthEight'
exec proc_AddCellExplanation '�Ƿ񹫿�','t_MarriageUser','IsPublic'
exec proc_AddCellExplanation '��������','t_MarriageUser','MatchmakerId'
exec proc_AddCellExplanation '״̬��0������ˣ�1�����ͨ����2����˲�ͨ����3���ر�','t_MarriageUser','Status'
exec proc_AddCellExplanation '����״̬ʱ��','t_MarriageUser','UpdateStatusDate'
exec proc_AddCellExplanation '�����¼ʱ��','t_MarriageUser','LastLoginDate'
exec proc_AddCellExplanation '��˲�ͨ��ԭ��','t_MarriageUser','NoPassReason'
exec proc_AddCellExplanation '��¼Ip','t_MarriageUser','LoginIp'
exec proc_AddCellExplanation '��ע','t_MarriageUser','Remark'
exec proc_AddCellExplanation '�Ƿ�ɾ��','t_MarriageUser','IsDelete'
exec proc_AddCellExplanation '������','t_MarriageUser','CreateUser'
exec proc_AddCellExplanation '����ʱ��','t_MarriageUser','CreateDate'
exec proc_AddCellExplanation '������','t_MarriageUser','UpdateUser'
exec proc_AddCellExplanation '����ʱ��','t_MarriageUser','UpdateDate'
exec proc_AddCellExplanation '�а汾','t_MarriageUser','RowVersion'
go

if exists(select * from sysobjects where name='v_MarriageUser')
drop view v_MarriageUser
go

create view v_MarriageUser
as
select a.*,
case when a.Status=0 then '�����' when a.Status=1 then '���ͨ��'
when a.Status=2 then '��˲�ͨ��' when a.Status=3 then '�ر�' else 'δ֪' end StatusName,
case when a.Sex=1 then '��' when a.Sex=2 then 'Ů' else 'δ֪' end SexName,
year(GETDATE())- YEAR(Birthday) as Age,b.Name as MatchmakerName,
SUBSTRING(LunarBirthday,4,1) as Shengxiao,
Case when a.IsPublic = 1 then '����' else 'δ����' end IsPublicName,
case when a.BirthTime=0 then '�� 00:00-00:59'
when a.BirthTime=1 then '�� 01:00-01:59'
when a.BirthTime=2 then '�� 02:00-02:59'
when a.BirthTime=3 then '�� 03:00-03:59'
when a.BirthTime=4 then '�� 04:00-04:59'
when a.BirthTime=5 then 'î 05:00-05:59'
when a.BirthTime=6 then 'î 06:00-06:59'
when a.BirthTime=7 then '�� 07:00-07:59'
when a.BirthTime=8 then '�� 08:00-08:59'
when a.BirthTime=9 then '�� 09:00-09:59'
when a.BirthTime=10 then '�� 10:00-10:59'
when a.BirthTime=11 then '�� 11:00-11:59'
when a.BirthTime=12 then '�� 12:00-12:59'
when a.BirthTime=13 then 'δ 13:00-13:59'
when a.BirthTime=14 then 'δ 14:00-14:59'
when a.BirthTime=15 then '�� 15:00-15:59'
when a.BirthTime=16 then '�� 16:00-16:59'
when a.BirthTime=17 then '�� 17:00-17:59'
when a.BirthTime=18 then '�� 18:00-18:59'
when a.BirthTime=19 then '�� 19:00-19:59'
when a.BirthTime=20 then '�� 20:00-20:59'
when a.BirthTime=21 then '�� 21:00-21:59'
when a.BirthTime=22 then '�� 22:00-22:59'
when a.BirthTime=23 then '�� 23:00-23:59'
else 'δ֪'
end BirthTimeName
from t_MarriageUser a 
left join t_Matchmaker b on a.MatchmakerId=b.MatchmakerId
where a.IsDelete=0
go


if exists(select * from sysobjects where name='v_MarriageUser2')
drop view v_MarriageUser2
go

create view v_MarriageUser2
as
select a.UserId,a.Sex,
a.Name +'('+ a.Phone+')' UserName,
a.MatchmakerId,a.UpdateStatusDate
from t_MarriageUser a
where a.IsDelete=0 and a.Status=1
and not exists
(
select 1 from t_MarriageArrange b where (a.UserId = b.ManUserId or a.UserId=b.WomanUserId) 
and b.Status in (3,4,5)
)
go


--16�����װ�����Ϣ��t_ArrangeMarriage��
if exists(select * from sysobjects where name='t_MarriageArrange')
drop table t_MarriageArrange
go

create table t_MarriageArrange
(
MarriageArrangeId uniqueidentifier not null primary key,       --����
ArrangeId int not null identity(10001,1),                      --���
ManUserId uniqueidentifier not null,                           --����ID
WomanUserId uniqueidentifier not null,                         --Ů��ID
ManMatchmakerId uniqueidentifier not null,                     --��������
WomanMatchmakerId uniqueidentifier not null,                   --Ů������
AppMatchmakerId uniqueidentifier not null,                     --ƽ̨����
MarriageDate datetime not null,                                --����ʱ��
MarriageAddress nvarchar(100),                                 --���׵ص�
MarriageContent nvarchar(500),                                 --�������
SourceType tinyint not null,                                   --��Դ���ͣ�1������ƥ�䣬2�����׹㳡��3������ǣ��
Status tinyint not null default(0),                            --״̬��0�������ף�1��������2��������3��ǣ�ֳɹ���4�����飬5����飬6�����֣�7��ȡ��
IsManAgree tinyint not null default(0),                        --�����Ƿ�ͬ��
NoManAgreeRemark nvarchar(500),                                --������ͬ��ԭ��
IsWomanAgree tinyint not null default(0),                      --Ů���Ƿ�ͬ��
NoWomanAgreeRemark nvarchar(500),                              --Ů����ͬ��ԭ��
CancelReason nvarchar(500),                                    --ȡ��ԭ��
FeeDate datetime,                                              --��������
BookMarryDate datetime,                                        --��������
MarryDate datetime,                                            --�������
BreakUpDate datetime,                                          --��������
BreakUpReason nvarchar(500),                                   --����ԭ��
Amount money,                                                  --�����ܷ���
Remark nvarchar(200),                                          --��ע 
IsDelete tinyint not null default(0),                          --�Ƿ�ɾ��
CreateUser uniqueidentifier not null,                          --������
CreateDate datetime default(getdate()) not null,               --����ʱ��
UpdateUser uniqueidentifier,                                   --������
UpdateDate datetime,                                           --����ʱ��
RowVersion timestamp not null                                  --�а汾
)
go

exec proc_AddCellExplanation '����','t_MarriageArrange','MarriageArrangeId'
exec proc_AddCellExplanation '���','t_MarriageArrange','ArrangeId'
exec proc_AddCellExplanation '����ID','t_MarriageArrange','ManUserId'
exec proc_AddCellExplanation 'Ů��ID','t_MarriageArrange','WomanUserId'
exec proc_AddCellExplanation '��������','t_MarriageArrange','ManMatchmakerId'
exec proc_AddCellExplanation 'Ů������','t_MarriageArrange','WomanMatchmakerId'
exec proc_AddCellExplanation 'ƽ̨����','t_MarriageArrange','AppMatchmakerId'
exec proc_AddCellExplanation '����ʱ��','t_MarriageArrange','MarriageDate'
exec proc_AddCellExplanation '���׵ص�','t_MarriageArrange','MarriageAddress'
exec proc_AddCellExplanation '�������','t_MarriageArrange','MarriageContent'
exec proc_AddCellExplanation '��Դ���ͣ�1������ƥ�䣬2�����׹㳡��3������ǣ��','t_MarriageArrange','SourceType'
exec proc_AddCellExplanation '״̬��0�������ף�1��������2��������3��ǣ�ֳɹ���4�����飬5����飬6�����֣�7��ȡ��','t_MarriageArrange','Status'
exec proc_AddCellExplanation '�����Ƿ�ͬ��','t_MarriageArrange','IsManAgree'
exec proc_AddCellExplanation '������ͬ��ԭ��','t_MarriageArrange','NoManAgreeRemark'
exec proc_AddCellExplanation 'Ů���Ƿ�ͬ��','t_MarriageArrange','IsWomanAgree'
exec proc_AddCellExplanation 'Ů����ͬ��ԭ��','t_MarriageArrange','NoWomanAgreeRemark'
exec proc_AddCellExplanation 'ȡ��ԭ��','t_MarriageArrange','CancelReason'
exec proc_AddCellExplanation '��������','t_MarriageArrange','FeeDate'
exec proc_AddCellExplanation '��������','t_MarriageArrange','BookMarryDate'
exec proc_AddCellExplanation '�������','t_MarriageArrange','MarryDate'
exec proc_AddCellExplanation '��������','t_MarriageArrange','BreakUpDate'
exec proc_AddCellExplanation '��ע','t_MarriageArrange','Remark'
exec proc_AddCellExplanation '����ԭ��','t_MarriageArrange','BreakUpReason'
exec proc_AddCellExplanation '�����ܷ���','t_MarriageArrange','Amount'
exec proc_AddCellExplanation '��ע','t_MarriageArrange','Remark'
exec proc_AddCellExplanation '�Ƿ�ɾ��','t_MarriageArrange','IsDelete'
exec proc_AddCellExplanation '������','t_MarriageArrange','CreateUser'
exec proc_AddCellExplanation '����ʱ��','t_MarriageArrange','CreateDate'
exec proc_AddCellExplanation '������','t_MarriageArrange','UpdateUser'
exec proc_AddCellExplanation '����ʱ��','t_MarriageArrange','UpdateDate'
exec proc_AddCellExplanation '�а汾','t_MarriageArrange','RowVersion'
go

if exists(select * from sysobjects where name='v_MarriageArrange')
drop view v_MarriageArrange
go

create view v_MarriageArrange
as
select a.*,
case when a.Status=0 then '������' when a.Status=1 then '������' when a.Status=2 then '������'
when a.Status=3 then 'ǣ�ֳɹ�' when a.Status=4 then '����' when a.Status=5 then '���'
when a.Status=6 then '����' when a.Status=7 then 'ȡ��'  else 'δ֪' end StatusName,
case when a.SourceType=1 then '����ƥ��' when a.SourceType=2 then '���׹㳡'
when a.SourceType=3 then '����ǣ��' else 'δ֪' end SourceTypeName,
b.Name+'('+ b.Phone+')' AppMatchmakerName,
c.Name+'('+ c.Phone+')' ManMatchmakerName,
d.Name+'('+ d.Phone+')' WomanMatchmakerName,
e.Name+'('+ e.Phone+')' ManUserName,
f.Name+'('+ f.Phone+')' WomanUserName,
g.Name CreateUserName,
case when a.Status=2 and a.IsManAgree=1 then 'ͬ��' when a.Status=2 and a.IsManAgree=0 then '��ͬ��' else '' end IsManAgreeName,
case when a.Status=2 and a.IsWomanAgree=1 then 'ͬ��' when a.Status=2 and a.IsWomanAgree=0 then '��ͬ��' else '' end IsWomanAgreeName
from t_MarriageArrange a
left join t_Matchmaker b on a.AppMatchmakerId=b.MatchmakerId
left join t_Matchmaker c on a.ManMatchmakerId=c.MatchmakerId
left join t_Matchmaker d on a.WomanMatchmakerId=d.MatchmakerId
left join t_MarriageUser e on a.ManUserId=e.UserId
left join t_MarriageUser f on a.WomanUserId=f.UserId
left join t_AppUser g on a.CreateUser=g.CreateUser
where a.IsDelete=0
go

if exists(select * from sysobjects where name='v_MarriageArrange2')
drop view v_MarriageArrange2
go

create view v_MarriageArrange2
as
select a.*,
b.Name AppMatchmakerName,
e.Name ManUserName,
e.HeadImgUrl ManHeadImgUrl,
year(GETDATE())- YEAR(e.Birthday) as ManAge,
f.Name WomanUserName,
f.HeadImgUrl WomanHeadImgUrl,
year(GETDATE())- YEAR(f.Birthday) as WomanAge,
isNull(a.UpdateDate,a.CreateDate) UpdateDate2
from t_MarriageArrange a
left join t_Matchmaker b on a.AppMatchmakerId=b.MatchmakerId
left join t_MarriageUser e on a.ManUserId=e.UserId
left join t_MarriageUser f on a.WomanUserId=f.UserId
where a.IsDelete=0
go

if exists(select * from sysobjects where name='v_MarriageArrangeUser1')
drop view v_MarriageArrangeUser1
go

create view v_MarriageArrangeUser1
as
select a.UserId,
a.NickName,
a.HeadImgUrl,
a.Sex,
a.Remark,
year(GETDATE())- YEAR(Birthday) as Age,
isnull(b.UpdateDate,b.CreateDate) as UpdateDate,
b.ManUserId SelfUserId,
b.Status,
b.MarriageArrangeId
from t_MarriageUser a,t_MarriageArrange b 
where a.IsDelete=0 and a.Status=1 and a.UserId=b.WomanUserId
and b.IsDelete=0
go

if exists(select * from sysobjects where name='v_MarriageArrangeUser2')
drop view v_MarriageArrangeUser2
go

create view v_MarriageArrangeUser2
as
select a.UserId,
a.NickName,
a.HeadImgUrl,
a.Sex,
a.Remark,
year(GETDATE())- YEAR(Birthday) as Age,
isnull(b.UpdateDate,b.CreateDate) as UpdateDate,
b.WomanUserId SelfUserId,
b.Status,
b.MarriageArrangeId
from t_MarriageUser a,t_MarriageArrange b 
where a.IsDelete=0 and a.Status=1 and a.UserId=b.ManUserId
and b.IsDelete=0
go

--4�����׹㳡��Ϣ��t_MarriageSquare��
if exists(select * from sysobjects where name='t_MarriageSquare')
drop table t_MarriageSquare
go

create table t_MarriageSquare
(
MarriageSquareId uniqueidentifier not null primary key,        --����
UserId uniqueidentifier not null,                              --�����û�ID
OtherSideUserId uniqueidentifier not null,                     --�Է��û�Id
UpdateDate datetime not null,                                  --����ʱ��
RoseCount int not null,                                        --õ������
CreateDate datetime default(getdate()) not null,               --����ʱ��
RowVersion timestamp not null                                  --�а汾
)
go

exec proc_AddCellExplanation '����','t_MarriageSquare','MarriageSquareId'
exec proc_AddCellExplanation '�����û�ID','t_MarriageSquare','UserId'
exec proc_AddCellExplanation '�Է��û�ID','t_MarriageSquare','OtherSideUserId'
exec proc_AddCellExplanation 'õ������','t_MarriageSquare','RoseCount'
exec proc_AddCellExplanation '����ʱ��','t_MarriageSquare','UpdateDate'
exec proc_AddCellExplanation '����ʱ��','t_MarriageSquare','CreateDate'
exec proc_AddCellExplanation '�а汾','t_MarriageSquare','RowVersion'
go

if exists(select * from sysobjects where name='v_MarriageSquare')
drop view v_MarriageSquare
go

create view v_MarriageSquare
as
select a.*,b.Name+'('+ b.Phone+')' UserName, 
b.Sex UserSex,
case when b.Sex=1 then '��' when b.Sex=2 then 'Ů' else 'δ֪' end UserSexName,
c.Name+'('+ c.Phone+')' OtherSideUserName,
c.Sex OtherSideUserSex,
case when c.Sex=1 then '��' when c.Sex=2 then 'Ů' when c.Sex is null then null else 'δ֪' end OtherSideUserSexName
from t_MarriageSquare a
inner join t_MarriageUser b on a.UserId=b.UserId and b.Status=1 and b.IsDelete=0
inner join t_MarriageUser c on a.OtherSideUserId=c.UserId and c.Status=1 and c.IsDelete=0
go

if exists(select * from sysobjects where name='v_MarriageSquare2')
drop view v_MarriageSquare2
go

create view v_MarriageSquare2
as
with ManUser as
(
select a.*,b.Name+'('+ b.Phone+')' ManUserName,b.MatchmakerId as ManMatchmakerId from t_MarriageSquare a,t_MarriageUser b
where a.UserId=b.UserId and b.Status=1 and IsDelete=0 and Sex=1
),
WomanUser as
(
select a.*,b.Name+'('+ b.Phone+')' WomanUserName,b.MatchmakerId as WomanMatchmakerId from t_MarriageSquare a,t_MarriageUser b
where a.UserId=b.UserId and b.Status=1 and IsDelete=0 and Sex=2
)
select a.MarriageSquareId,a.UserId ManUserId,a.ManUserName,a.CreateDate, a.ManMatchmakerId,
a.RoseCount,
a.UpdateDate,
b.CreateDate CreateDate2,
b.RoseCount RoseCount2,
b.UpdateDate UpdateDate2,
b.UserId WomanUserId,
b.WomanMatchmakerId,
b.WomanUserName,
c.ArrangeId,
case when c.MarriageArrangeId is null then '���װ���' else '' end ArrangeLabel,
d.Name+'('+ d.Phone+')' ManMatchmakerName,
e.Name+'('+ e.Phone+')' WomanMatchmakerName,
case when a.UpdateDate>b.UpdateDate then a.UpdateDate else b.UpdateDate end UpdateDate3
from ManUser a
inner join WomanUser b on a.UserId=b.OtherSideUserId and a.OtherSideUserId=b.UserId
left join t_MarriageArrange c on a.UserId=c.ManUserId and a.OtherSideUserId=c.WomanUserId and c.IsDelete=0
left join t_Matchmaker d on a.ManMatchmakerId=d.MatchmakerId and d.IsDelete=0
left join t_Matchmaker e on b.WomanMatchmakerId=e.MatchmakerId and e.IsDelete=0
go


if exists(select * from sysobjects where name='v_MarriageSquareUser')
drop view v_MarriageSquareUser
go

create view v_MarriageSquareUser
as
select a.UserId,
a.NickName,
a.HeadImgUrl,
a.Sex,
a.Remark,
year(GETDATE())- YEAR(Birthday) as Age,
isnull(a.UpdateDate,CreateDate) as UpdateDate
from t_MarriageUser a
where a.IsDelete=0 and a.Status=1 and a.IsPublic=1
go

if exists(select * from sysobjects where name='v_MarriageSquareUser1')
drop view v_MarriageSquareUser1
go

create view v_MarriageSquareUser1
as
select a.UserId,
a.NickName,
a.HeadImgUrl,
a.Sex,
a.Remark,
year(GETDATE())- YEAR(Birthday) as Age,
b.RoseCount,
b.UpdateDate,
b.UserId SelfUserId
from  t_MarriageUser a,t_MarriageSquare b
where a.IsDelete=0 and a.Status=1
and a.UserId=b.OtherSideUserId
go

if exists(select * from sysobjects where name='v_MarriageSquareUser2')
drop view v_MarriageSquareUser2
go

create view v_MarriageSquareUser2
as
select a.UserId,
a.NickName,
a.HeadImgUrl,
a.Sex,
a.Remark,
year(GETDATE())- YEAR(Birthday) as Age,
b.RoseCount,
b.UpdateDate,
b.OtherSideUserId SelfUserId
from  t_MarriageUser a,t_MarriageSquare b
where a.IsDelete=0 and a.Status=1
and a.UserId=b.UserId
go

if exists(select * from sysobjects where name='v_MarriageSquareUser3')
drop view v_MarriageSquareUser3
go

create view v_MarriageSquareUser3
as
with ManUser as
(
select a.*
from t_MarriageSquare a,t_MarriageUser b
where a.UserId=b.UserId and b.Status=1 and IsDelete=0 and Sex=1
),
WomanUser as
(
select a.*,
b.NickName,
b.HeadImgUrl,
b.Sex,
b.Remark,
year(GETDATE())- YEAR(b.Birthday) as Age
from t_MarriageSquare a,t_MarriageUser b
where a.UserId=b.UserId and b.Status=1 and IsDelete=0 and Sex=2
)
select 
b.UserId,
b.NickName,
b.HeadImgUrl,
b.Sex,
b.Remark,
b.Age,
a.RoseCount,
b.RoseCount RoseCount2,
case when a.UpdateDate>b.UpdateDate then a.UpdateDate else b.UpdateDate end UpdateDate,
a.UserId SelfUserId
from ManUser a
inner join WomanUser b on a.UserId=b.OtherSideUserId and a.OtherSideUserId=b.UserId
go

if exists(select * from sysobjects where name='v_MarriageSquareUser4')
drop view v_MarriageSquareUser4
go

create view v_MarriageSquareUser4
as
with ManUser as
(
select a.*,
b.NickName,
b.HeadImgUrl,
b.Sex,
b.Remark,
year(GETDATE())- YEAR(b.Birthday) as Age
from t_MarriageSquare a,t_MarriageUser b
where a.UserId=b.UserId and b.Status=1 and IsDelete=0 and Sex=1
),
WomanUser as
(
select a.*
from t_MarriageSquare a,t_MarriageUser b
where a.UserId=b.UserId and b.Status=1 and IsDelete=0 and Sex=2
)
select 
a.UserId,
a.NickName,
a.HeadImgUrl,
a.Sex,
a.Remark,
a.Age,
b.RoseCount,
a.RoseCount RoseCount2,
case when a.UpdateDate>b.UpdateDate then a.UpdateDate else b.UpdateDate end UpdateDate,
b.UserId SelfUserId
from ManUser a
inner join WomanUser b on a.UserId=b.OtherSideUserId and a.OtherSideUserId=b.UserId
go

--6�������н����ϸ��
if exists(select * from sysobjects where name='t_MatchmakerFeeDetail')
drop table t_MatchmakerFeeDetail
go

create table t_MatchmakerFeeDetail
(
DetailId uniqueidentifier not null primary key,                --����
MatchmakerId uniqueidentifier not null,                        --����Id
MatchmakerType tinyint not null,                               --�������ͣ�1���з���2��Ů����3��ƽ̨
MarriageArrangeId uniqueidentifier not null,                   --���װ���Id
FeeDate datetime not null,                                     --��������
Amount money not null,                                         --���
AppAmount money not null default(0),                           --ƽ̨�н��             
Remark nvarchar(200),                                          --��ע 
IsDelete tinyint not null default(0),                          --�Ƿ�ɾ��
CreateUser uniqueidentifier not null,                          --������
CreateDate datetime default(getdate()) not null,               --����ʱ��
RowVersion timestamp not null                                  --�а汾
)
go

exec proc_AddCellExplanation '����','t_MatchmakerFeeDetail','DetailId'
exec proc_AddCellExplanation '����Id','t_MatchmakerFeeDetail','MatchmakerId'
exec proc_AddCellExplanation '�������ͣ�1���з���2��Ů����3��ƽ̨','t_MatchmakerFeeDetail','MatchmakerType'
exec proc_AddCellExplanation '���װ���Id','t_MatchmakerFeeDetail','MarriageArrangeId'
exec proc_AddCellExplanation '��������','t_MatchmakerFeeDetail','FeeDate'
exec proc_AddCellExplanation '���','t_MatchmakerFeeDetail','Amount'
exec proc_AddCellExplanation 'ƽ̨�н��','t_MatchmakerFeeDetail','AppAmount'
exec proc_AddCellExplanation '��ע','t_MatchmakerFeeDetail','Remark'
exec proc_AddCellExplanation '�Ƿ�ɾ��','t_MatchmakerFeeDetail','IsDelete'
exec proc_AddCellExplanation '������','t_MatchmakerFeeDetail','CreateUser'
exec proc_AddCellExplanation '����ʱ��','t_MatchmakerFeeDetail','CreateDate'
exec proc_AddCellExplanation '�а汾','t_MatchmakerFeeDetail','RowVersion'
go

if exists(select * from sysobjects where name='v_MatchmakerFeeDetail')
drop view v_MatchmakerFeeDetail
go

create view v_MatchmakerFeeDetail
as
select a.*,b.ArrangeId,
case when a.MatchmakerType=1 then '�з�' when a.MatchmakerType=2 then 'Ů��' when a.MatchmakerType=3 then 'ƽ̨' else 'δ֪' end MatchmakerTypeName,
c.Name ManName,
d.Name WomanName,
e.Name MatchmakerName
from t_MatchmakerFeeDetail a 
left join t_MarriageArrange b on a.MarriageArrangeId=b.MarriageArrangeId
left join t_MarriageUser c on b.ManUserId=c.UserId
left join t_MarriageUser d on b.WomanUserId=d.UserId
left join t_Matchmaker e on a.MatchmakerId=e.MatchmakerId
where a.IsDelete=0
go

--7�������û���������Ϣ��
if exists(select * from sysobjects where name='t_MarriageUserPhoto')
drop table t_MarriageUserPhoto
go

create table t_MarriageUserPhoto
(
PhotoId uniqueidentifier not null primary key,                 --����
MarriageUserId uniqueidentifier not null,                      --�����û�ID
PhotoUrl varchar(500) not null,                                --��Ƭ��ַ
IsDelete tinyint not null default(0),                          --�Ƿ�ɾ��
CreateUser uniqueidentifier not null,                          --������
CreateDate datetime default(getdate()) not null,               --����ʱ��
)
go

exec proc_AddCellExplanation '����','t_MarriageUserPhoto','PhotoId'
exec proc_AddCellExplanation '�����û�ID','t_MarriageUserPhoto','MarriageUserId'
exec proc_AddCellExplanation '��Ƭ��ַ','t_MarriageUserPhoto','PhotoUrl'
exec proc_AddCellExplanation '�Ƿ�ɾ��','t_MarriageUserPhoto','IsDelete'
exec proc_AddCellExplanation '������','t_MarriageUserPhoto','CreateUser'
exec proc_AddCellExplanation '����ʱ��','t_MarriageUserPhoto','CreateDate'
go

if exists(select * from sysobjects where name='v_MarriageUserPhoto')
drop view v_MarriageUserPhoto
go

create view v_MarriageUserPhoto
as
select a.*
from t_MarriageUserPhoto a 
where a.IsDelete=0
go


--8������Դ��t_DataSource��
if exists(select * from sysobjects where name='t_DataSource')
drop table t_DataSource
go

create table t_DataSource
(
DataSourceId uniqueidentifier not null primary key,            --����
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

exec proc_AddCellExplanation '����','t_DataSource','DataSourceId'
exec proc_AddCellExplanation '����','t_DataSource','Name'
exec proc_AddCellExplanation '��ע','t_DataSource','Remark'
exec proc_AddCellExplanation '�Ƿ�ɾ��','t_DataSource','IsDelete'
exec proc_AddCellExplanation '������','t_DataSource','CreateUser'
exec proc_AddCellExplanation '����ʱ��','t_DataSource','CreateDate'
exec proc_AddCellExplanation '������','t_DataSource','UpdateUser'
exec proc_AddCellExplanation '����ʱ��','t_DataSource','UpdateDate'
exec proc_AddCellExplanation '�а汾','t_DataSource','RowVersion'
go

if exists(select * from sysobjects where name='v_DataSource')
drop view v_DataSource
go

create view v_DataSource
as
select a.*
from t_DataSource a where IsDelete=0
go

--9������Դѡ����Ϣ��
if exists(select * from sysobjects where name='t_DataSourceItem')
drop table t_DataSourceItem
go

create table t_DataSourceItem
(
ItemId uniqueidentifier not null primary key,                  --����
DataSourceId uniqueidentifier not null,                        --����ԴId
Name nvarchar(100) not null,                                   --����
Value nvarchar(100) not null,                                  --ֵ
)
go

exec proc_AddCellExplanation '����','t_DataSourceItem','ItemId'
exec proc_AddCellExplanation '����ԴID','t_DataSourceItem','DataSourceId'
exec proc_AddCellExplanation '����','t_DataSourceItem','Name'
exec proc_AddCellExplanation 'ֵ','t_DataSourceItem','Value'
go


if exists(select * from sysobjects where name='v_DataSourceItem')
drop view v_DataSourceItem
go

create view v_DataSourceItem
as
select a.*
from t_DataSourceItem a, t_DataSource b where a.DataSourceId=b.DataSourceId and  b.IsDelete=0
go


--10������������Ϣ��t_ConditionType��
if exists(select * from sysobjects where name='t_ConditionType')
drop table t_ConditionType
go

create table t_ConditionType
(
ConditionTypeId uniqueidentifier not null primary key,         --����
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

exec proc_AddCellExplanation '����','t_ConditionType','ConditionTypeId'
exec proc_AddCellExplanation '����','t_ConditionType','Name'
exec proc_AddCellExplanation '��ע','t_ConditionType','Remark'
exec proc_AddCellExplanation '�Ƿ�ɾ��','t_ConditionType','IsDelete'
exec proc_AddCellExplanation '������','t_ConditionType','CreateUser'
exec proc_AddCellExplanation '����ʱ��','t_ConditionType','CreateDate'
exec proc_AddCellExplanation '������','t_ConditionType','UpdateUser'
exec proc_AddCellExplanation '����ʱ��','t_ConditionType','UpdateDate'
exec proc_AddCellExplanation '�а汾','t_ConditionType','RowVersion'
go

--11������ѡ����Ϣ��
if exists(select * from sysobjects where name='t_ConditionItem')
drop table t_ConditionItem
go

create table t_ConditionItem
(
ItemId uniqueidentifier not null primary key,                  --����
ConditionTypeId uniqueidentifier not null,                     --��������Id
Title nvarchar(100) not null,                                  --����
Sex tinyint not null default(0),                               --�Ա�1��������2��Ů��
DataType varchar(10) not null,                                 --��������
DataSourceId uniqueidentifier,                                 --����ԴId
IsSingle tinyint not null default(0),                          --�Ƿ�ѡ��1����
IsInterval tinyint not null default(0),                        --�Ƿ����䣬1���ǣ�һ����������Ϊ��ֵ
DisplayIndex int not null default(0),                          --��ʾ˳��
)
go

exec proc_AddCellExplanation '����','t_ConditionItem','ItemId'
exec proc_AddCellExplanation '��������Id','t_ConditionItem','ConditionTypeId'
exec proc_AddCellExplanation '����','t_ConditionItem','Title'
exec proc_AddCellExplanation '�Ա�1��������2��Ů��','t_ConditionItem','Sex'
exec proc_AddCellExplanation '��������','t_ConditionItem','DataType'
exec proc_AddCellExplanation '����ԴID','t_ConditionItem','DataSourceId'
exec proc_AddCellExplanation '�Ƿ�ѡ��1����','t_ConditionItem','IsSingle'
exec proc_AddCellExplanation '�Ƿ����䣬1���ǣ�һ����������Ϊ��ֵ','t_ConditionItem','IsInterval'
exec proc_AddCellExplanation '��ʾ˳��','t_ConditionItem','DisplayIndex'
go

if exists(select * from sysobjects where name='v_ConditionType')
drop view v_ConditionType
go

create view v_ConditionType
as
with ConditionItemCount as
(
select ConditionTypeId,sum(case when Sex in (0,1) then 1 else 0 end) ManItemCount,
sum(case when Sex in (0,2) then 1 else 0 end) WomanItemCount
from t_ConditionItem
group by ConditionTypeId
)
select a.*,b.ManItemCount,b.WomanItemCount
from t_ConditionType a, ConditionItemCount b
where IsDelete=0 and a.ConditionTypeId=b.ConditionTypeId
go

--12�������û�����������Ϣ��
if exists(select * from sysobjects where name='t_UserConditionType')
drop table t_UserConditionType
go

create table t_UserConditionType
(
UserConditionTypeId uniqueidentifier not null primary key,     --����
UserId uniqueidentifier not null,                              --�����û�Id
SelectType tinyint not null,                                   --ѡ�����ͣ�1��������2����ż��׼
ConditionTypeId uniqueidentifier not null,                     --��������Id
IsPublic tinyint not null default(0),                          --�Ƿ񹫿�
CreateUser uniqueidentifier not null,                          --������
CreateDate datetime default(getdate()) not null,               --����ʱ��
UpdateUser uniqueidentifier,                                   --������
UpdateDate datetime,                                           --����ʱ��
RowVersion timestamp not null                                  --�а汾
)
go

exec proc_AddCellExplanation '����','t_UserConditionType','UserConditionTypeId'
exec proc_AddCellExplanation '�����û�Id','t_UserConditionType','UserId'
exec proc_AddCellExplanation 'ѡ�����ͣ�1������ֵ��2����ż��׼ֵ','t_UserConditionType','SelectType'
exec proc_AddCellExplanation '��������Id','t_UserConditionType','ConditionTypeId'
exec proc_AddCellExplanation '�Ƿ񹫿�','t_UserConditionType','IsPublic'
exec proc_AddCellExplanation '������','t_UserConditionType','CreateUser'
exec proc_AddCellExplanation '����ʱ��','t_UserConditionType','CreateDate'
exec proc_AddCellExplanation '������','t_UserConditionType','UpdateUser'
exec proc_AddCellExplanation '����ʱ��','t_UserConditionType','UpdateDate'
exec proc_AddCellExplanation '�а汾','t_UserConditionType','RowVersion'
go

--12�������û�����ѡ��ֵ��Ϣ��
if exists(select * from sysobjects where name='t_UserConditionSelectValue')
drop table t_UserConditionSelectValue
go

create table t_UserConditionSelectValue
(
ItemId uniqueidentifier not null primary key,                  --����
UserConditionTypeId uniqueidentifier not null,                 --�����û���������Id
ConditionItemId uniqueidentifier not null,                     --������Id
Value nvarchar(2000),                                          --ֵ
)
go

exec proc_AddCellExplanation '����','t_UserConditionSelectValue','ItemId'
exec proc_AddCellExplanation '�����û���������Id','t_UserConditionSelectValue','UserConditionTypeId'
exec proc_AddCellExplanation '������Id','t_UserConditionSelectValue','ConditionItemId'
exec proc_AddCellExplanation 'ֵ','t_UserConditionSelectValue','Value'
go

if exists(select * from sysobjects where name='v_UserConditionType')
drop view v_UserConditionType
go

create view v_UserConditionType
as
with UserConditionItemCount as
(
select UserConditionTypeId,
sum(case when b.Sex in (0,1) then 1 else 0 end) ManUserItemCount,
sum(case when b.Sex in (0,2) then 1 else 0 end) WomanUserItemCount
from t_UserConditionSelectValue a,t_ConditionItem b
where a.ConditionItemId= b.ItemId
group by UserConditionTypeId
),
ConditionItemCount as
(
select ConditionTypeId,sum(case when Sex in (0,1) then 1 else 0 end) ManItemCount,
sum(case when Sex in (0,2) then 1 else 0 end) WomanItemCount
from t_ConditionItem
group by ConditionTypeId
)
select a.UserConditionTypeId,
a.ConditionTypeId,
a.SelectType,
a.UserId,
a.IsPublic,
d.Name as ConditionTypeName,
b.ManUserItemCount,
b.WomanUserItemCount,
c.ManItemCount,
c.WomanItemCount,
case when c.ManItemCount=0 then 0 else convert(int,(b.ManUserItemCount*100)/c.ManItemCount) end ManPercentage, 
case when c.WomanItemCount=0 then 0 else convert(int,(b.WomanUserItemCount*100)/c.WomanItemCount) end WomanPercentage 
from t_UserConditionType a, UserConditionItemCount b,ConditionItemCount c,t_ConditionType d
where a.UserConditionTypeId=b.UserConditionTypeId
and a.ConditionTypeId= c.ConditionTypeId
and a.ConditionTypeId= d.ConditionTypeId
and d.IsDelete=0
go

if exists(select * from sysobjects where name='v_UserConditionType2')
drop view v_UserConditionType2
go

create view v_UserConditionType2
as
select a.*,b.Name ConditionTypeName,b.CreateDate CreateDate2 from t_UserConditionType a,t_ConditionType b
where a.ConditionTypeId=b.ConditionTypeId
and b.IsDelete=0
go

if exists(select * from sysobjects where name='v_UserConditionSelectValue')
drop view v_UserConditionSelectValue
go

create view v_UserConditionSelectValue
as
select a.*,b.UserId,b.SelectType,c.DataSourceId,c.DataType,c.DisplayIndex,c.IsInterval,c.IsSingle,c.Sex,c.Title from t_UserConditionSelectValue a, t_UserConditionType b,
t_ConditionItem c 
where a.UserConditionTypeId=b.UserConditionTypeId
and a.ConditionItemId= c.ItemId
go


--13��������Լ�����Ϣ��
if exists(select * from sysobjects where name='t_MarriageMakePair')
drop table t_MarriageMakePair
go

create table t_MarriageMakePair
(
MakePairId uniqueidentifier not null primary key,              --����
UserId uniqueidentifier not null,                              --�����û�ID
OtherSideUserId uniqueidentifier not null,                     --�Է��û�Id
PercentValue decimal(8,2) not null,                            --ƥ��ȣ�%��
CreateDate datetime default(getdate()) not null,               --����ʱ��
RowVersion timestamp not null                                  --�а汾
)
go

exec proc_AddCellExplanation '����','t_MarriageMakePair','MakePairId'
exec proc_AddCellExplanation '�Է��û�Id','t_MarriageMakePair','OtherSideUserId'
exec proc_AddCellExplanation '�����û�Id','t_MarriageMakePair','UserId'
exec proc_AddCellExplanation 'ƥ��ȣ�%��','t_MarriageMakePair','PercentValue'
exec proc_AddCellExplanation '����ʱ��','t_MarriageMakePair','CreateDate'
exec proc_AddCellExplanation '�а汾','t_MarriageMakePair','RowVersion'
go

if exists(select * from sysobjects where name='v_MarriageMakePair')
drop view v_MarriageMakePair
go

create view v_MarriageMakePair
as
select a.MakePairId,a.UserId,
a.OtherSideUserId,convert(varchar(10),a.PercentValue)+'%' PercentValue,
a.CreateDate,
b.Name+'('+ b.Phone+')' UserName, 
b.Sex UserSex,
case when b.Sex=1 then '��' when b.Sex=2 then 'Ů' else 'δ֪' end UserSexName,
c.Name+'('+ c.Phone+')' OtherSideUserName,
c.Sex OtherSideUserSex,
case when c.Sex=1 then '��' when c.Sex=2 then 'Ů' when c.Sex is null then null else 'δ֪' end OtherSideUserSexName
from t_MarriageMakePair a
inner join t_MarriageUser b on a.UserId=b.UserId and b.Status=1 and b.IsDelete=0
inner join t_MarriageUser c on a.OtherSideUserId=c.UserId and c.Status=1 and c.IsDelete=0
go

if exists(select * from sysobjects where name='v_MarriageMakePair2')
drop view v_MarriageMakePair2
go

create view v_MarriageMakePair2
as
with ManUser as
(
select a.*,b.Name+'('+ b.Phone+')' ManUserName,b.MatchmakerId as ManMatchmakerId from t_MarriageMakePair a,t_MarriageUser b
where a.UserId=b.UserId and b.Status=1 and IsDelete=0 and Sex=1
),
WomanUser as
(
select a.*,b.Name+'('+ b.Phone+')' WomanUserName,b.MatchmakerId as WomanMatchmakerId from t_MarriageMakePair a,t_MarriageUser b
where a.UserId=b.UserId and b.Status=1 and IsDelete=0 and Sex=2
)
select a.MakePairId,a.UserId ManUserId,a.ManUserName,a.CreateDate, a.ManMatchmakerId,
convert(varchar(10),a.PercentValue)+'%' PercentValue,
b.CreateDate CreateDate2,
convert(varchar(10),b.PercentValue)+'%' PercentValue2,
b.UserId WomanUserId,
b.WomanMatchmakerId,
b.WomanUserName,
b.MakePairId MakePairId2,
c.ArrangeId,
case when c.MarriageArrangeId is null then '���װ���' else '' end ArrangeLabel,
d.Name+'('+ d.Phone+')' ManMatchmakerName,
e.Name+'('+ e.Phone+')' WomanMatchmakerName,
case when a.CreateDate>b.CreateDate then a.CreateDate else b.CreateDate end CreateDate3,
convert(varchar(10), convert(decimal(10,2),(a.PercentValue+b.PercentValue)/2)) +'%' PercentValue3
from ManUser a
inner join WomanUser b on a.UserId=b.OtherSideUserId and a.OtherSideUserId=b.UserId
left join t_MarriageArrange c on a.UserId=c.ManUserId and a.OtherSideUserId=c.WomanUserId and c.IsDelete=0
left join t_Matchmaker d on a.ManMatchmakerId=d.MatchmakerId and d.IsDelete=0
left join t_Matchmaker e on b.WomanMatchmakerId=e.MatchmakerId and e.IsDelete=0
go

--14��������Լ�����ϸ��
if exists(select * from sysobjects where name='t_MarriageMakePairDetail')
drop table t_MarriageMakePairDetail
go

create table t_MarriageMakePairDetail
(
DetailId uniqueidentifier not null primary key,                --����
MakePairId uniqueidentifier not null,                          --���Id
ConditionTypeId uniqueidentifier not null,                     --��������Id
ConditionTypeName nvarchar(50) not null,                       --��������
ConditionItemId uniqueidentifier not null,                     --����ѡ��Id
ConditionItemTitle nvarchar(100) not null,                     --��������
SelfSelectValue nvarchar(2000) not null,                       --�Լ�ѡ��ֵ
OtherSideSelectValue nvarchar(2000) not null,                  --�Է�ѡ��ֵ
PercentValue decimal(8,2) not null                             --ƥ��ȣ�%��
)
go

exec proc_AddCellExplanation '����','t_MarriageMakePairDetail','DetailId'
exec proc_AddCellExplanation '�����ϸId','t_MarriageMakePairDetail','MakePairId'
exec proc_AddCellExplanation '��������Id','t_MarriageMakePairDetail','ConditionTypeId'
exec proc_AddCellExplanation '��������','t_MarriageMakePairDetail','ConditionTypeName'
exec proc_AddCellExplanation '����ѡ��Id','t_MarriageMakePairDetail','ConditionItemId'
exec proc_AddCellExplanation '��������','t_MarriageMakePairDetail','ConditionItemTitle'
exec proc_AddCellExplanation '�Լ�ѡ��ֵ','t_MarriageMakePairDetail','SelfSelectValue'
exec proc_AddCellExplanation '�Է�ѡ��ֵ','t_MarriageMakePairDetail','OtherSideSelectValue'
exec proc_AddCellExplanation 'ƥ��ȣ�%��','t_MarriageMakePairDetail','PercentValue'
go

if exists(select * from sysobjects where name='v_MarriageMakePairDetail')
drop view v_MarriageMakePairDetail
go

create view v_MarriageMakePairDetail
as
select a.*,
convert(varchar(10),a.PercentValue)+'%' PercentValueName
from t_MarriageMakePairDetail a
go

--18����������ƥ������t_BirthEightResult��
if exists(select * from sysobjects where name='t_BirthEightResult')
drop table t_BirthEightResult
go

create table t_BirthEightResult
(
ResultId uniqueidentifier not null primary key,                --����
ManUserId uniqueidentifier not null,                           --����ID
WomanUserId uniqueidentifier not null,                         --Ů��ID
Content nvarchar(max),                                         --ƥ����
Remark nvarchar(200),                                          --��ע 
IsDelete tinyint not null default(0),                          --�Ƿ�ɾ��
CreateUser uniqueidentifier not null,                          --������
CreateDate datetime default(getdate()) not null,               --����ʱ��
UpdateUser uniqueidentifier,                                   --������
UpdateDate datetime,                                           --����ʱ��
RowVersion timestamp not null                                  --�а汾
)
go

exec proc_AddCellExplanation '����','t_BirthEightResult','ResultId'
exec proc_AddCellExplanation '����ID','t_BirthEightResult','ManUserId'
exec proc_AddCellExplanation 'Ů��ID','t_BirthEightResult','WomanUserId'
exec proc_AddCellExplanation 'ƥ����','t_BirthEightResult','Content'
exec proc_AddCellExplanation '��ע','t_BirthEightResult','Remark'
exec proc_AddCellExplanation '�Ƿ�ɾ��','t_BirthEightResult','IsDelete'
exec proc_AddCellExplanation '������','t_BirthEightResult','CreateUser'
exec proc_AddCellExplanation '����ʱ��','t_BirthEightResult','CreateDate'
exec proc_AddCellExplanation '������','t_BirthEightResult','UpdateUser'
exec proc_AddCellExplanation '����ʱ��','t_BirthEightResult','UpdateDate'
exec proc_AddCellExplanation '�а汾','t_BirthEightResult','RowVersion'
go

if exists(select * from sysobjects where name='v_BirthEightResult')
drop view v_BirthEightResult
go

create view v_BirthEightResult
as
select a.*
from t_BirthEightResult a where IsDelete=0
go


--18����ֵ���ã�t_DictionaryConfig��
if exists(select * from sysobjects where name='t_DictionaryConfig')
drop table t_DictionaryConfig
go

create table t_DictionaryConfig
(
DictionaryConfigId uniqueidentifier not null primary key,      --����
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

--19��������־
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
select a.*,b.Name, '��ϸ' LookDetail from t_OperationLog a
left join t_AppUser b
on a.OperationUser=b.UserId
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
 WHERE o.name = 't_Matchmaker'
 ORDER BY c.column_id
 go
