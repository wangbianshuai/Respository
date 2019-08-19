drop table t_d_Entity;

create table t_d_Entity
(
Id varchar(36) not  null primary key,
Entity_Name varchar(36) not null,
Application_Id varchar(36) not null, 
Name varchar(50) not null,
Table_Name varchar(30),
With_Sql text,
Primary_Key varchar(50),
No_Select_Names varchar(1000),
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
  Create_Date    datetime default now() not null,
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
Create_Date datetime default now() not null,
Row_Version varchar(36)
);

drop table t_d_Regexp2;

create table t_d_Regexp2
(
Id varchar(36) not null primary key,
Name varchar(50) not null,
Expression varchar(1000),
Remark varchar(200),
Create_Date datetime default now() not null,
Row_Version varchar(36)
);

drop table t_d_Data_Source;

create table t_d_Data_Source
(
Id varchar(36) not null primary key,
Name varchar(50) not null,
Entity_Name varchar(50) not null,
Value_Name varchar(50) not null,
Text_Name varchar(50) not null,
Parent_Name varchar(50),
Action_Id  varchar(36),
Remark varchar(200),
Create_Date datetime default now() not null,
Row_Version varchar(36)
);

drop table t_d_Item_Option;

create table t_d_Item_Option
(
Id varchar(36) not null primary key,
Data_Source_Id varchar(36) not null,
Value varchar(50) not null,
Text varchar(50) not null,
ParentValue varchar(50)
);

drop table t_d_Dva_Model;

create table t_d_Dva_Model
(
Id varchar(36) not null primary key,
Name varchar(50) not null,
Service_Name varchar(50) not null,
Remark varchar(200),
Create_Date datetime default now() not null,
Row_Version varchar(36)
);

drop table t_d_Action;

create table t_d_Action
(
Id varchar(36) not null primary key,
Dva_Model_Id varchar(36) not null,
Action_Name varchar(50) not null,
Url varchar(50),
State_Name varchar(50) not null,
Method varchar(10),
Data_Key varchar(50),
Is_Token integer default 0,
Is_Operation integer default 0,
Has_Token integer default 0
);

drop table t_d_Key_Value;

create table t_d_Key_Value
(
Id varchar(36) not null primary key,
Data_Id varchar(36) not null,
Value varchar(500) not null,
Name varchar(50) not null
);


