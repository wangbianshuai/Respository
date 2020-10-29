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
case when a.Status=0 then '�����' when a.Status=1 then '���ͨ��'
when a.Status=2 then '��˲�ͨ��' when a.Status=3 then '�ر�' else 'δ֪' end StatusName,
case when a.Sex=1 then '��' when a.Sex=2 then 'Ů' else 'δ֪' end SexName
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
Address nvarchar(100) not null,                                --��ַ
BirthEight nvarchar(50),                                       --��������
BirthAnimal nvarchar(2),                                       --��Ф
Educational tinyint,                                           --ѧ��
JobName nvarchar(50),                                          --ְҵ
YearIncome money,                                              --��������
MonthIncome money,                                             --��ǰ������
FamilyRemark nvarchar(500),                                    --��ͥ���
NowAddress nvarchar(100),                                      --�־�ס��
MatchmakerId uniqueidentifier not null,                        --��������
Status tinyint not null default(0),                            --״̬��0������ˣ�1�����ͨ����2����˲�ͨ����3���ر�
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
exec proc_AddCellExplanation '΢���û�ͷ�����һ����ֵ����������ͷ���С����0��46��64��96��132��ֵ��ѡ��0����640*640������ͷ�񣩣��û�û��ͷ��ʱ����Ϊ�ա����û�����ͷ��ԭ��ͷ��URL��ʧЧ��','t_MarriageUser','HeadImgUrl'
exec proc_AddCellExplanation '��ַ','t_MarriageUser','Address'
exec proc_AddCellExplanation '���֤����','t_MarriageUser','IdCard'
exec proc_AddCellExplanation '�ֻ�','t_MarriageUser','Phone'
exec proc_AddCellExplanation '��������','t_MarriageUser','BirthEight'
exec proc_AddCellExplanation '��Ф','t_MarriageUser','BirthAnimal'
exec proc_AddCellExplanation 'ѧ��','t_MarriageUser','Educational'
exec proc_AddCellExplanation 'ְҵ','t_MarriageUser','JobName'
exec proc_AddCellExplanation '��������','t_MarriageUser','YearIncome'
exec proc_AddCellExplanation '��ǰ������','t_MarriageUser','MonthIncome'
exec proc_AddCellExplanation '��ͥ���','t_MarriageUser','FamilyRemark'
exec proc_AddCellExplanation '�־�ס��','t_MarriageUser','NowAddress'
exec proc_AddCellExplanation '��������','t_MarriageUser','MatchmakerId'
exec proc_AddCellExplanation '״̬��0������ˣ�1�����ͨ����2����˲�ͨ����3���ر�','t_MarriageUser','Status'
exec proc_AddCellExplanation '�����¼ʱ��','t_MarriageUser','LastLoginDate'
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
case when a.Sex=1 then '��' when a.Sex=2 then 'Ů' else 'δ֪' end SexName
from t_MarriageUser a 
where a.IsDelete=0
go

--4�����׼�¼��Ϣ��t_MarriageRecord��
if exists(select * from sysobjects where name='t_MarriageRecord')
drop table t_MarriageRecord
go

create table t_MarriageRecord
(
RecordId uniqueidentifier not null primary key,                --����
ManUserId uniqueidentifier not null,                           --����ID
WomanUserId uniqueidentifier not null,                         --Ů��ID
ManMatchmakerId uniqueidentifier not null,                     --��������
WomanMatchmakerId uniqueidentifier not null,                   --Ů������
AppMatchmakerId uniqueidentifier not null,                     --ƽ̨����
MarriageDate datetime not null,                                --����ʱ��
MarriageContent nvarchar(2000) not null,                       --�������
ManScore int not null,                                         --�����÷�
ManScoreRemark nvarchar(2000),                                 --�����÷ֵ�˵��
ManNoScoreRemark nvarchar(2000),                               --����ʧ�ֵ�˵��
WomanScore int not null,                                       --Ů���÷�
WomanScoreRemark nvarchar(2000),                               --Ů���÷ֵ�˵��
WomanNoScoreRemark nvarchar(2000),                             --Ů��ʧ�ֵ�˵��
Status tinyint not null,                                       --״̬��1��������2��������3�����˽�
Remark nvarchar(200),                                          --��ע 
IsDelete tinyint not null default(0),                          --�Ƿ�ɾ��
CreateUser uniqueidentifier not null,                          --������
CreateDate datetime default(getdate()) not null,               --����ʱ��
UpdateUser uniqueidentifier,                                   --������
UpdateDate datetime,                                           --����ʱ��
RowVersion timestamp not null                                  --�а汾
)
go

exec proc_AddCellExplanation '����','t_MarriageRecord','RecordId'
exec proc_AddCellExplanation '����ID','t_MarriageRecord','ManUserId'
exec proc_AddCellExplanation 'Ů��ID','t_MarriageRecord','WomanUserId'
exec proc_AddCellExplanation '��������','t_MarriageRecord','ManMatchmakerId'
exec proc_AddCellExplanation 'Ů������','t_MarriageRecord','WomanMatchmakerId'
exec proc_AddCellExplanation 'ƽ̨����','t_MarriageRecord','AppMatchmakerId'
exec proc_AddCellExplanation '����ʱ��','t_MarriageRecord','MarriageDate'
exec proc_AddCellExplanation '�������','t_MarriageRecord','MarriageContent'
exec proc_AddCellExplanation '�����÷�','t_MarriageRecord','ManScore'
exec proc_AddCellExplanation '�����÷ֵ�˵��','t_MarriageRecord','ManScoreRemark'
exec proc_AddCellExplanation '����ʧ�ֵ�˵��','t_MarriageRecord','ManNoScoreRemark'
exec proc_AddCellExplanation 'Ů���÷�','t_MarriageRecord','WomanScore'
exec proc_AddCellExplanation 'Ů���÷ֵ�˵��','t_MarriageRecord','WomanScoreRemark'
exec proc_AddCellExplanation 'Ů��ʧ�ֵ�˵��','t_MarriageRecord','WomanNoScoreRemark'
exec proc_AddCellExplanation '״̬��1��������2��������3�����˽�','t_MarriageRecord','Status'
exec proc_AddCellExplanation '��ע','t_MarriageRecord','Remark'
exec proc_AddCellExplanation '�Ƿ�ɾ��','t_MarriageRecord','IsDelete'
exec proc_AddCellExplanation '������','t_MarriageRecord','CreateUser'
exec proc_AddCellExplanation '����ʱ��','t_MarriageRecord','CreateDate'
exec proc_AddCellExplanation '������','t_MarriageRecord','UpdateUser'
exec proc_AddCellExplanation '����ʱ��','t_MarriageRecord','UpdateDate'
exec proc_AddCellExplanation '�а汾','t_MarriageRecord','RowVersion'
go

if exists(select * from sysobjects where name='v_MarriageRecord')
drop view v_MarriageRecord
go

create view v_MarriageRecord
as
select a.*,
case when a.Status=1 then '������'
when a.Status=2 then '������' when a.Status=3 then '���˽�' else 'δ֪' end StatusName
from t_MarriageRecord a 
where a.IsDelete=0
go


--5�����׳ɹ���Ϣ��t_MarriageSccuess��
if exists(select * from sysobjects where name='t_MarriageSccuess')
drop table t_MarriageSccuess
go

create table t_MarriageSccuess
(
SccuessId uniqueidentifier not null primary key,               --����
ManUserId uniqueidentifier not null,                           --����ID
WomanUserId uniqueidentifier not null,                         --Ů��ID
ManMatchmakerId uniqueidentifier not null,                     --��������
WomanMatchmakerId uniqueidentifier not null,                   --Ů������
AppMatchmakerId uniqueidentifier not null,                     --ƽ̨����
MarriageRecordId uniqueidentifier not null,                    --��ؼ�¼Id,���׳ɹ����Ǵμ�¼
FeeDate datetime,                                              --��������
SuccessDate datetime,                                          --���׳ɹ�����
BookMarryDate datetime,                                        --��������
MarryDate datetime,                                            --�������
BreakUpDate datetime,                                          --��������
Status tinyint not null,                                       --״̬��1�����׳ɹ���2�����飬3�����,4:����
BreakUpReason nvarchar(2000),                                  --����ԭ��
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

exec proc_AddCellExplanation '����','t_MarriageSccuess','SccuessId'
exec proc_AddCellExplanation '����ID','t_MarriageSccuess','ManUserId'
exec proc_AddCellExplanation 'Ů��ID','t_MarriageRecord','WomanUserId'
exec proc_AddCellExplanation '��������','t_MarriageSccuess','ManMatchmakerId'
exec proc_AddCellExplanation 'Ů������','t_MarriageSccuess','WomanMatchmakerId'
exec proc_AddCellExplanation 'ƽ̨����','t_MarriageSccuess','AppMatchmakerId'
exec proc_AddCellExplanation '��ؼ�¼Id,���׳ɹ����Ǵμ�¼','t_MarriageSccuess','MarriageRecordId'
exec proc_AddCellExplanation '��������','t_MarriageSccuess','FeeDate'
exec proc_AddCellExplanation '���׳ɹ�����','t_MarriageSccuess','SuccessDate'
exec proc_AddCellExplanation '��������','t_MarriageSccuess','BookMarryDate'
exec proc_AddCellExplanation '�������','t_MarriageSccuess','MarryDate'
exec proc_AddCellExplanation '��������','t_MarriageSccuess','BreakUpDate'
exec proc_AddCellExplanation '״̬��1�����׳ɹ���2�����飬3����飬4������','t_MarriageSccuess','Status'
exec proc_AddCellExplanation '��ע','t_MarriageSccuess','Remark'
exec proc_AddCellExplanation '����ԭ��','t_MarriageSccuess','BreakUpReason'
exec proc_AddCellExplanation '�����ܷ���','t_MarriageSccuess','Amount'
exec proc_AddCellExplanation '�Ƿ�ɾ��','t_MarriageSccuess','IsDelete'
exec proc_AddCellExplanation '������','t_MarriageSccuess','CreateUser'
exec proc_AddCellExplanation '����ʱ��','t_MarriageSccuess','CreateDate'
exec proc_AddCellExplanation '������','t_MarriageSccuess','UpdateUser'
exec proc_AddCellExplanation '����ʱ��','t_MarriageSccuess','UpdateDate'
exec proc_AddCellExplanation '�а汾','t_MarriageSccuess','RowVersion'
go

if exists(select * from sysobjects where name='v_MarriageSccuess')
drop view v_MarriageSccuess
go

create view v_MarriageSccuess
as
select a.*,
case when a.Status=1 then '���׳ɹ�'
when a.Status=2 then '����' when a.Status=3 then '���' 
when a.Status=4 then '����' else 'δ֪' end StatusName
from t_MarriageSccuess a 
where a.IsDelete=0
go

--6�������н����ϸ��
if exists(select * from sysobjects where name='t_MatchmakerFeeDetail')
drop table t_MatchmakerFeeDetail
go

create table t_MatchmakerFeeDetail
(
DetailId uniqueidentifier not null primary key,                --����
MatchmakerId uniqueidentifier not null,                        --����Id
MarriageSccuessId uniqueidentifier not null,                   --���׳ɹ�Id
FeeDate datetime not null,                                     --��������
Amount money not null,                                         --���
AppAmount money not null default(0),                           --ƽ̨�н��             
Remark nvarchar(200),                                          --��ע 
IsDelete tinyint not null default(0),                          --�Ƿ�ɾ��
CreateUser uniqueidentifier not null,                          --������
CreateDate datetime default(getdate()) not null,               --����ʱ��
UpdateUser uniqueidentifier,                                   --������
UpdateDate datetime,                                           --����ʱ��
RowVersion timestamp not null                                  --�а汾
)
go

exec proc_AddCellExplanation '����','t_MatchmakerFeeDetail','DetailId'
exec proc_AddCellExplanation '����Id','t_MatchmakerFeeDetail','MatchmakerId'
exec proc_AddCellExplanation '���׳ɹ�Id','t_MatchmakerFeeDetail','MarriageSccuessId'
exec proc_AddCellExplanation '��������','t_MatchmakerFeeDetail','FeeDate'
exec proc_AddCellExplanation '���','t_MatchmakerFeeDetail','Amount'
exec proc_AddCellExplanation 'ƽ̨�н��','t_MatchmakerFeeDetail','AppAmount'
exec proc_AddCellExplanation '��ע','t_MatchmakerFeeDetail','Remark'
exec proc_AddCellExplanation '�Ƿ�ɾ��','t_MatchmakerFeeDetail','IsDelete'
exec proc_AddCellExplanation '������','t_MatchmakerFeeDetail','CreateUser'
exec proc_AddCellExplanation '����ʱ��','t_MatchmakerFeeDetail','CreateDate'
exec proc_AddCellExplanation '������','t_MatchmakerFeeDetail','UpdateUser'
exec proc_AddCellExplanation '����ʱ��','t_MatchmakerFeeDetail','UpdateDate'
exec proc_AddCellExplanation '�а汾','t_MatchmakerFeeDetail','RowVersion'
go

if exists(select * from sysobjects where name='v_MatchmakerFeeDetail')
drop view v_MatchmakerFeeDetail
go

create view v_MatchmakerFeeDetail
as
select a.*
from t_MatchmakerFeeDetail a 
where a.IsDelete=0
go

--7�������û���������Ϣ��
if exists(select * from sysobjects where name='t_MarriagePhoto')
drop table t_MarriagePhoto
go

create table t_MarriagePhoto
(
PhotoId uniqueidentifier not null primary key,                 --����
MarriageUserId uniqueidentifier not null,                      --�����û�ID
PhoteUrl varchar(500) not null,                                --��Ƭ��ַ
IsDelete tinyint not null default(0),                          --�Ƿ�ɾ��
CreateUser uniqueidentifier not null,                          --������
CreateDate datetime default(getdate()) not null,               --����ʱ��
)
go

exec proc_AddCellExplanation '����','t_MarriagePhoto','PhotoId'
exec proc_AddCellExplanation '�����û�ID','t_MarriagePhoto','MarriageUserId'
exec proc_AddCellExplanation '��Ƭ��ַ','t_MarriagePhoto','PhoteUrl'
exec proc_AddCellExplanation '�Ƿ�ɾ��','t_MarriagePhoto','IsDelete'
exec proc_AddCellExplanation '������','t_MarriagePhoto','CreateUser'
exec proc_AddCellExplanation '����ʱ��','t_MarriagePhoto','CreateDate'
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
Name nvarchar(50) not null,                                    --����
Value nvarchar(1000) not null,                                 --ֵ
)
go

exec proc_AddCellExplanation '����','t_DataSourceItem','ItemId'
exec proc_AddCellExplanation '����ԴID','t_DataSourceItem','DataSourceId'
exec proc_AddCellExplanation '����','t_DataSourceItem','Name'
exec proc_AddCellExplanation 'ֵ','t_DataSourceItem','Value'
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

if exists(select * from sysobjects where name='v_ConditionType')
drop view v_ConditionType
go

create view v_ConditionType
as
select a.*
from t_ConditionType a where IsDelete=0
go

--11������ѡ����Ϣ��
if exists(select * from sysobjects where name='t_ConditionItem')
drop table t_ConditionItem
go

create table t_ConditionItem
(
ItemId uniqueidentifier not null primary key,                  --����
Title nvarchar(100) not null,                                  --����
Sex tinyint not null,                                          --�Ա�1��������2��Ů��
DataType varchar(10) not null,                                 --��������
DataSourceId uniqueidentifier,                                 --����ԴId
IsSingle tinyint not null default(0),                          --�Ƿ�ѡ��1����
IsInterval tinyint not null default(0),                        --�Ƿ����䣬1���ǣ�һ����������Ϊ��ֵ
DisplayIndex int not null default(0),                          --��ʾ˳��
)
go

exec proc_AddCellExplanation '����','t_ConditionItem','ItemId'
exec proc_AddCellExplanation '����','t_ConditionItem','Title'
exec proc_AddCellExplanation '�Ա�1��������2��Ů��','t_ConditionItem','Sex'
exec proc_AddCellExplanation '��������','t_ConditionItem','DataType'
exec proc_AddCellExplanation '����ԴID','t_ConditionItem','DataSourceId'
exec proc_AddCellExplanation '�Ƿ�ѡ��1����','t_ConditionItem','IsSingle'
exec proc_AddCellExplanation '�Ƿ����䣬1���ǣ�һ����������Ϊ��ֵ','t_ConditionItem','IsInterval'
exec proc_AddCellExplanation '��ʾ˳��','t_ConditionItem','DisplayIndex'
go

--12�������û�����ѡ��ֵ��Ϣ��
if exists(select * from sysobjects where name='t_UserConditionSelectValue')
drop table t_UserConditionSelectValue
go

create table t_UserConditionSelectValue
(
ItemId uniqueidentifier not null primary key,                  --����
UserId uniqueidentifier,                                       --�����û�Id
SelectType tinyint not null,                                   --ѡ�����ͣ�1������ֵ��2����ż��׼ֵ
ConditionTypeId uniqueidentifier,                              --��������Id
ConditionItemId uniqueidentifier,                              --������Id
Value nvarchar(2000),                                          --ֵ   
CreateUser uniqueidentifier not null,                          --������
CreateDate datetime default(getdate()) not null,               --����ʱ��
UpdateUser uniqueidentifier,                                   --������
UpdateDate datetime,                                           --����ʱ��
RowVersion timestamp not null                                  --�а汾
)
go

exec proc_AddCellExplanation '����','t_UserConditionSelectValue','ItemId'
exec proc_AddCellExplanation '�����û�Id','t_UserConditionSelectValue','UserId'
exec proc_AddCellExplanation 'ѡ�����ͣ�1������ֵ��2����ż��׼ֵ','t_UserConditionSelectValue','SelectType'
exec proc_AddCellExplanation '��������Id','t_UserConditionSelectValue','ConditionTypeId'
exec proc_AddCellExplanation '������Id','t_UserConditionSelectValue','ConditionItemId'
exec proc_AddCellExplanation 'ֵ','t_UserConditionSelectValue','Value'
exec proc_AddCellExplanation '������','t_UserConditionSelectValue','CreateUser'
exec proc_AddCellExplanation '����ʱ��','t_UserConditionSelectValue','CreateDate'
exec proc_AddCellExplanation '������','t_UserConditionSelectValue','UpdateUser'
exec proc_AddCellExplanation '����ʱ��','t_UserConditionSelectValue','UpdateDate'
exec proc_AddCellExplanation '�а汾','t_UserConditionSelectValue','RowVersion'
go

--13��������Լ�����Ϣ��
if exists(select * from sysobjects where name='t_MarriageMakePair')
drop table t_MarriageMakePair
go

create table t_MarriageMakePair
(
MarkPairId uniqueidentifier not null primary key,              --����
UserId uniqueidentifier not null,                              --�û�Id
UserCount int not null,                                        --��Է�����������������30%������,���ֵΪ100
CreateUser uniqueidentifier not null,                          --������
CreateDate datetime default(getdate()) not null,               --����ʱ��
RowVersion timestamp not null                                  --�а汾
)
go

exec proc_AddCellExplanation '����','t_MarriageMakePair','MarkPairId'
exec proc_AddCellExplanation '�û�','t_MarriageMakePair','UserId'
exec proc_AddCellExplanation '��Է�����������������30%������','t_MarriageMakePair','UserCount'
exec proc_AddCellExplanation '������','t_MarriageMakePair','CreateUser'
exec proc_AddCellExplanation '����ʱ��','t_MarriageMakePair','CreateDate'
exec proc_AddCellExplanation '������','t_MarriageMakePair','CreateUser'
exec proc_AddCellExplanation '����ʱ��','t_MarriageMakePair','CreateDate'
exec proc_AddCellExplanation '�а汾','t_MarriageMakePair','RowVersion'
go


--14��������Լ�����ϸ��
if exists(select * from sysobjects where name='t_MarriageMakePairDetail')
drop table t_MarriageMakePairDetail
go

create table t_MarriageMakePairDetail
(
DetailId uniqueidentifier not null primary key,                --����
MarkPairId uniqueidentifier not null,                          --���Id
UserId uniqueidentifier not null,                              --�û�Id
PercentValue decimal(8,2) not null                             --ƥ��ȣ�%��
)
go

exec proc_AddCellExplanation '����','t_MarriageMakePairDetail','DetailId'
exec proc_AddCellExplanation '���Id','t_MarriageMakePairDetail','MarkPairId'
exec proc_AddCellExplanation '�û�Id','t_MarriageMakePairDetail','UserId'
exec proc_AddCellExplanation 'ƥ��ȣ�%��','t_MarriageMakePairDetail','PercentValue'
go

--15��������Լ����¼��
if exists(select * from sysobjects where name='t_MarriageMakePairRecord')
drop table t_MarriageMakePairRecord
go

create table t_MarriageMakePairRecord
(
DetailId uniqueidentifier not null primary key,                --����
MakePairDetailId uniqueidentifier not null,                    --�����ϸId
ConditionTypeId uniqueidentifier not null,                     --��������Id
ConditionTypeNmae nvarchar(50) not null,                       --��������
ConditionItemId uniqueidentifier not null,                     --����ѡ��Id
ConditionItemTile nvarchar(100) not null,                      --��������
SelfSelectValue nvarchar(500) not null,                        --�Լ�ѡ��ֵ
OtherSideSelectValue nvarchar(500) not null,                   --�Է�ѡ��ֵ
PercentValue decimal(8,2) not null                             --ƥ��ȣ�%��
)
go

exec proc_AddCellExplanation '����','t_MarriageMakePairRecord','DetailId'
exec proc_AddCellExplanation '�����ϸId','t_MarriageMakePairRecord','MakePairDetailId'
exec proc_AddCellExplanation '��������Id','t_MarriageMakePairRecord','ConditionTypeId'
exec proc_AddCellExplanation '��������','t_MarriageMakePairRecord','ConditionTypeNmae'
exec proc_AddCellExplanation '����ѡ��Id','t_MarriageMakePairRecord','ConditionItemId'
exec proc_AddCellExplanation '��������','t_MarriageMakePairRecord','ConditionItemTile'
exec proc_AddCellExplanation '�Լ�ѡ��ֵ','t_MarriageMakePairRecord','SelfSelectValue'
exec proc_AddCellExplanation '�Է�ѡ��ֵ','t_MarriageMakePairRecord','OtherSideSelectValue'
exec proc_AddCellExplanation 'ƥ��ȣ�%��','t_MarriageMakePairRecord','PercentValue'
go


--16����ֵ���ã�t_DictionaryConfig��
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
