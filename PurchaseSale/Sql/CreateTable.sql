drop table t_User
go

create table t_User
(
Id uniqueidentifier not null primary key,
UserName nvarchar(50) not null,
LoginName nvarchar(50) not null,
LoginPassword nvarchar(50) not null,
LoginDate datetime,
RowVersion timestamp default(getdate()) not null
)
go