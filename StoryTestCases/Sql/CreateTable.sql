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

--story test cases
drop table t_StoryTestCases
go

create table t_StoryTestCases
(
Id uniqueidentifier not null primary key default(newid()),      --����
StoryId int not null,                                           --Story Id
StoryTitle varchar(1000) not null,                              --Story Title
StoryUrl varchar(200) not null,                                 --Story Url
PullRequestId int not null,                                     --Pull Request Id
PullRequestTitle varchar(500) not null,                         --Pull Request Title
PullRequestUrl varchar(200) not null,                           --Pull Request Url    
TestCases int not null,                                         --Test Cases
Comments int not null,                                          --Commencts
StartDate date not null,                                        --Start Date
EndDate date not null,                                          --End Date   
Remark nvarchar(200),                                           --��ע
IsDelete tinyint not null default(0),                           --�Ƿ�ɾ��
CreateUser uniqueidentifier not null,                           --������   
CreateDate datetime default(getdate()) not null,                --����ʱ��
UpdateDate datetime,                                            --����ʱ��
RowVersion timestamp not null                                   --�а汾
)
go

drop view v_StoryTestCases
go

create view v_StoryTestCases
as
select a.*,b.UserName as CreateUserName from t_StoryTestCases a
left join t_User b on a.CreateUser=b.UserId
where a.IsDelete=0
go