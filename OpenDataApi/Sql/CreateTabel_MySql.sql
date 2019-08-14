drop table t_d_Entity;

create table t_d_Entity
(
Id varchar(36) not  null primary key,
Name varchar(50) not null,
TableName varchar(30),
WithSql text,
Primary_Key varchar(50),
NoSelectNames varchar(1000),
Is_Get integer default 1,
Is_Post integer default 1,
Is_Put integer default 1,
Is_Delete integer default 1,
Is_Get_Log integer default 0,
Is_Post_Query_Log integer default 0,
Is_Post_Log integer default 1,
Is_Put_Log integer default 1,
Is_Delete_Log integer default 1,
Remark varchar(200),
Create_Date datetime default (now()) not null,
Row_Version varchar(36)
);

drop table t_d_Entity_Property;

create table t_d_Entity_Property
(
Id varchar(36) not  null primary key,
Entity_Id varchar(36) not  null,
Name varchar(50) not null,
Type varchar(20) not null
);

select * from t_d_application;

select * from t_d_user;

drop table t_d_User2;

create table t_d_User2
(
  User_Id        varchar(36) not null,
  User_Name      varchar(50) not null,
  Login_Name     varchar(50) not null,
  Login_Password varchar(50) not null,
  Last_Login_Date datetime,
  Create_Date    datetime default (now()) not null,
  Row_Version varchar(36)
);


drop table t_d_Application2;

create table t_d_Application2
(
Application_Id varchar(36) not null primary key,
Name varchar(50) not null,
Connection_String varchar(1000),
Db_User varchar(50),
Db_Password varchar(50),
Remark varchar(200),
Create_Date datetime default (now()) not null,
Row_Version varchar(36)
);


