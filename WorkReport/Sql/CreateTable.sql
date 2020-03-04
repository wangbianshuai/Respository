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

drop table t_Story
go

create table t_Story
(
Id uniqueidentifier not null primary key default(newid()),      --����
StoryId int not null,                                           --Story Id
StoryTitle varchar(1000) not null,                              --Story Title
StoryUrl varchar(200) not null,                                 --Story Url
StartDate datetime,
EndDate datetime,
Remark nvarchar(200),                                           --��ע
IsDelete tinyint not null default(0),                           --�Ƿ�ɾ��
CreateUser uniqueidentifier not null,                           --������   
CreateDate datetime default(getdate()) not null,                --����ʱ��
UpdateUser uniqueidentifier,
UpdateDate datetime,                                            --����ʱ��
RowVersion timestamp not null                                   --�а汾
)
go

drop view v_Story
go

create view v_Story
as
select a.*,'ch'+ ltrim(rtrim(str(a.StoryId)))+' '+ a.StoryTitle as StoryName,b.UserName as CreateUserName,
 DATENAME(YEAR,a.StartDate)+DATENAME(MONTH,a.StartDate) as StartMonth,
 DATENAME(YEAR,a.EndDate)+DATENAME(MONTH,a.EndDate) as EndMonth
from t_Story a 
left join t_User b on a.CreateUser=b.UserId
where a.IsDelete=0
go


drop table t_PullRequest
go

create table t_PullRequest
(
Id uniqueidentifier not null primary key default(newid()),      --����
StoryId uniqueidentifier not null,                              --Story Id
PullRequestTitle varchar(500) not null,                         --Pull Request Title
PullRequestUrl varchar(200) not null,                           --Pull Request Url    
TestCases int not null,                                         --Test Cases
Comments int not null,                                          --Commencts
StartDate datetime,
EndDate datetime, 
Remark nvarchar(200),                                           --��ע
IsDelete tinyint not null default(0),                           --�Ƿ�ɾ��
CreateUser uniqueidentifier not null,                           --������   
CreateDate datetime default(getdate()) not null,                --����ʱ��
UpdateUser uniqueidentifier,
UpdateDate datetime,                                            --����ʱ��
RowVersion timestamp not null                                   --�а汾
)
go

drop view v_PullRequest
go

create view v_PullRequest
as
select a.*,b.UserName as CreateUserName,
 DATENAME(YEAR,a.StartDate)+DATENAME(MONTH,a.StartDate) as StartMonth,
 DATENAME(YEAR,a.EndDate)+DATENAME(MONTH,a.EndDate) as EndMonth,
case when c.StoryId is not null then 'ch'+ ltrim(rtrim(str(c.StoryId)))+' '+ c.StoryTitle else '' end as StoryName,c.StoryUrl
from t_PullRequest a
left join t_User b on a.CreateUser=b.UserId
left join t_Story c on a.StoryId=c.Id 
where a.IsDelete=0
go

drop table t_Week
go

create table t_Week
(
Id uniqueidentifier not null primary key default(newid()),      --����
StartDate datetime not null,
EndDate datetime not null,
WorkingHours int not null,
Remark nvarchar(200),                                           --��ע
IsDelete tinyint not null default(0),                           --�Ƿ�ɾ��
CreateUser uniqueidentifier not null,                           --������   
CreateDate datetime default(getdate()) not null,                --����ʱ��
UpdateUser uniqueidentifier,
UpdateDate datetime,                                            --����ʱ��
RowVersion timestamp not null                                   --�а汾
)
go

drop view v_Week
go

create view v_Week
as
select a.*,
convert(varchar(10),a.StartDate,111)+' - '+convert(varchar(10),a.EndDate,111) as WeekName
from t_Week a
where a.IsDelete=0
go

drop table t_WorkingHours
go

create table t_WorkingHours
(
Id uniqueidentifier not null primary key default(newid()),      --����
StoryId uniqueidentifier,                                       --Story Id
WeekId uniqueidentifier not null,                               --Week Id
Content varchar(500) null,                                    --Pull Request Title
HourCount int not null,
Remark nvarchar(200),                                           --��ע
IsDelete tinyint not null default(0),                           --�Ƿ�ɾ��
CreateUser uniqueidentifier not null,                           --������   
CreateDate datetime default(getdate()) not null,                --����ʱ��
UpdateUser uniqueidentifier,
UpdateDate datetime,                                            --����ʱ��
RowVersion timestamp not null                                   --�а汾
)
go

drop view v_WorkingHours
go

create view v_WorkingHours
as
select a.*,b.UserName as CreateUserName,
case when c.StoryId is not null then 'ch'+ ltrim(rtrim(str(c.StoryId)))+' '+ c.StoryTitle else '' end as StoryName,c.StoryUrl,
d.StartDate,d.EndDate, DATENAME(YEAR,d.StartDate)+DATENAME(MONTH,d.StartDate) as StartMonth,
 DATENAME(YEAR,d.EndDate)+DATENAME(MONTH,d.EndDate) as EndMonth,
convert(varchar(10),d.StartDate,111)+' - '+convert(varchar(10),d.EndDate,111) as WeekName,d.WorkingHours as WeekWorkingHours from t_WorkingHours a
left join t_User b on a.CreateUser=b.UserId
left join t_Story c on a.StoryId=c.Id 
left join t_Week d on a.WeekId=d.Id 
where a.IsDelete=0
go

drop table t_Daily
go

create table t_Daily
(
Id uniqueidentifier not null primary key default(newid()),      --����
StoryId uniqueidentifier,                                       --Story Id
Content varchar(500) not null,                                  --Conent
WorkingDate datetime not null,
Remark nvarchar(200),                                           --��ע
IsDelete tinyint not null default(0),                           --�Ƿ�ɾ��
CreateUser uniqueidentifier not null,                           --������   
CreateDate datetime default(getdate()) not null,                --����ʱ��
UpdateUser uniqueidentifier,
UpdateDate datetime,                                            --����ʱ��
RowVersion timestamp not null                                   --�а汾
)
go

drop view v_Daily
go

create view v_Daily
as
select a.*,b.UserName as CreateUserName,'ch'+ ltrim(rtrim(str(c.StoryId)))+' '+ c.StoryTitle as StoryName,
c.StoryTitle,c.StoryUrl from t_Daily a
left join t_User b on a.CreateUser=b.UserId
left join t_Story c on a.StoryId=c.Id 
where a.IsDelete=0
go
