drop table t_d_Entity;

create table t_d_Entity
(
Id varchar2(36) not  null primary key,
Name nvarchar2(50) not null,
TableName varchar2(30),
WithSql nclob,
Primary_Key varchar2(50),
NoSelectNames nvarchar2(1000),
Is_Get integer default 1,
Is_Post integer default 1,
Is_Put integer default 1,
Is_Delete integer default 1,
Is_Get_Log integer default 0,
Is_Post_Query_Log integer default 0,
Is_Post_Log integer default 1,
Is_Put_Log integer default 1,
Is_Delete_Log integer default 1,
Remark nvarchar2(200),
Create_Date DATE default (sysdate) not null,
Row_Version varchar2(36)
);

drop table t_d_Entity_Property;

create table t_d_Entity_Property
(
Id varchar2(36) not  null primary key,
Entity_Id varchar2(36) not  null,
Name nvarchar2(50) not null,
Type varchar2(20) not null
);

select * from t_d_application;

select * from t_d_user;

drop table t_d_User2;

create table t_d_User2
(
  User_Id        VARCHAR2(36) not null,
  User_Name      NVARCHAR2(50) not null,
  Login_Name     NVARCHAR2(50) not null,
  Login_Password NVARCHAR2(50) not null,
  Last_Login_Date DATE,
  Create_Date    DATE default (sysdate) not null,
  Row_Version varchar2(36)
);


drop table t_d_Application2;

create table t_d_Application2
(
Application_Id varchar2(36) not null primary key,
Name nvarchar2(50) not null,
Connection_String varchar2(1000),
Db_User varchar2(50),
Db_Password varchar2(50),
Remark nvarchar2(200),
Create_Date DATE default (sysdate) not null,
Row_Version varchar2(36)
);


