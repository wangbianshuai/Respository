drop table t_User
go

create table t_User
(
UserId uniqueidentifier not null primary key,
UserName nvarchar(50) not null,
LoginName nvarchar(50) not null,
LoginPassword nvarchar(50) not null,
LastLoginDate datetime,
IsDelete tinyint not null default(0),                           --是否删除
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

--操作日志
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
OperationUser nvarchar(50),                                     --操作人
IsDelete tinyint not null default(0),                           --是否删除
CreateDate datetime not null default(getdate()),                --创建时间
RowVersion timestamp not null                                   --行版本
)
go

drop view v_OperationLog
go

create view v_OperationLog
as
select a.*,b.UserName, '详细' LookDetail from t_OperationLog a
left join t_User b
on a.OperationUser=convert(varchar(36),b.UserId)
go

--story test cases
drop table t_StoryTestCases
go

create table t_StoryTestCases
(
Id uniqueidentifier not null primary key default(newid()),      --主键
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
Remark nvarchar(200),                                           --备注
IsDelete tinyint not null default(0),                           --是否删除
CreateUser uniqueidentifier not null,                           --创建人   
CreateDate datetime default(getdate()) not null,                --创建时间
UpdateDate datetime,                                            --更新时间
RowVersion timestamp not null                                   --行版本
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