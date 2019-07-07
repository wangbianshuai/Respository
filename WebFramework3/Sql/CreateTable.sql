drop table t_d_d_User;

create table t_d_User
(
User_Id varchar2(36) not null primary key,
User_Name nvarchar2(50) not null,
Login_Name nvarchar2(50) not null,
Login_Password nvarchar2(50) not null,
Login_Date date null,
Row_Id timestamp default(sysdate) not null
);

select rowid,t.* from t_d_user t;
