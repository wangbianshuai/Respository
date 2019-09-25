--服务分类
drop table acf_service_category;

create table acf_service_category
(
Id varchar2(36) not null primary key,        --主健
Name1 nvarchar2(50) not null,                --I类名称
Name2 nvarchar2(50) not null,                --II类名称
Status number(4) default (1) not null,       --服务状态，1：使用中，0：已关闭
Create_User varchar2(36) not null,           --创建人
Create_Date date default (sysdate) not null, --创建时间
Update_User varchar2(36),                    --更新人
Udpate_Date date,                            --更新时间
Row_Version varchar2(36) not null            --行版本
);

comment on table acf_service_category is '服务分类';
comment on column acf_service_category.Id is '主健';
comment on column acf_service_category.Name1 is 'I类名称';
comment on column acf_service_category.Name2 is 'II类名称';
comment on column acf_service_category.Status is '服务状态，1：使用中，0：已关闭';
comment on column acf_service_category.Create_User is '创建人';
comment on column acf_service_category.Create_Date is '创建时间';
comment on column acf_service_category.Update_User is '更新人';
comment on column acf_service_category.Udpate_Date is '更新时间';
comment on column acf_service_category.Row_Version is '行版本';

--门店信息
drop table acf_store;

create table acf_store
(
Id varchar2(36) not null primary key,        --主键
Name nvarchar2(50) not null,                 --门店名称
Store_Code varchar2(50) not null,            --门店编号
Status number(4) default (1) not null,       --营业状态，1：营业中，2：放假中，0：已关闭
Business_Start_Time varchar2(20) not null,   --营业开始时间
Business_End_Time varchar2(20) not null,     --营业结束时间
Province_Code varchar2(20) not null,         --省  
City_Code varchar2(20) not null,             --市
Address nvarchar2(100) not null,             --详细地址
Telephone varchar2(50) not null,             --电话
List_Image_Url varchar2(200) not null,       --门店列表图地址
Detail_Image_Url varchar2(200) not null,     --门店详情图地址
Create_User varchar2(36) not null,           --创建人
Create_Date date default (sysdate) not null, --创建时间
Update_User varchar2(36),                    --更新人
Udpate_Date date,                            --更新时间
Row_Version varchar2(36) not null            --行版本
);

comment on table acf_store is '门店信息';
comment on column acf_store.Id is '主健';
comment on column acf_store.Name is '门店名称';
comment on column acf_store.Store_Code is '门店编号';
comment on column acf_store.Status is '营业状态，1：营业中，2：放假中，0：已关闭';
comment on column acf_store.Business_Start_Time is '营业开始时间';
comment on column acf_store.Business_End_Time is '营业结束时间';
comment on column acf_store.Province_Code is '省';
comment on column acf_store.City_Code is '市';
comment on column acf_store.Address is '详细地址';
comment on column acf_store.Telephone is '电话';
comment on column acf_store.List_Image_Url is '门店列表图地址';
comment on column acf_store.Detail_Image_Url is '门店详情图地址';
comment on column acf_store.Create_User is '创建人';
comment on column acf_store.Create_Date is '创建时间';
comment on column acf_store.Update_User is '更新人';
comment on column acf_store.Udpate_Date is '更新时间';
comment on column acf_store.Row_Version is '行版本';

--省份
drop table acf_province;

create table acf_province
(
Id varchar2(36) not null primary key,        --主键
Name nvarchar2(50) not null,                 --名称
Code varchar2(20) not null,                  --编号
Create_User varchar2(36) not null,           --创建人
Create_Date date default (sysdate) not null, --创建时间
Update_User varchar2(36),                    --更新人
Udpate_Date date,                            --更新时间
Row_Version varchar2(36) not null            --行版本
);

comment on table acf_province is '门店信息';
comment on column acf_province.Id is '主健';
comment on column acf_province.Name is '名称';
comment on column acf_province.Code is '编号';
comment on column acf_province.Create_User is '创建人';
comment on column acf_province.Create_Date is '创建时间';
comment on column acf_province.Update_User is '更新人';
comment on column acf_province.Udpate_Date is '更新时间';
comment on column acf_province.Row_Version is '行版本';

--城市
drop table acf_city;

create table acf_city
(
Id varchar2(36) not null primary key,        --主键
Name nvarchar2(50) not null,                 --名称
Code varchar2(20) not null,                  --编号
Province_Code varchar2(20) not null,         --省份编号
Create_User varchar2(36) not null,           --创建人
Create_Date date default (sysdate) not null, --创建时间
Update_User varchar2(36),                    --更新人
Udpate_Date date,                            --更新时间
Row_Version varchar2(36) not null            --行版本
);

comment on table acf_city is '门店信息';
comment on column acf_city.Id is '主健';
comment on column acf_city.Name is '名称';
comment on column acf_city.Code is '编号';
comment on column acf_city.Province_Code is '省份编号';
comment on column acf_city.Create_User is '创建人';
comment on column acf_city.Create_Date is '创建时间';
comment on column acf_city.Update_User is '更新人';
comment on column acf_city.Udpate_Date is '更新时间';
comment on column acf_city.Row_Version is '行版本';

--用户
drop table acf_user;

create table acf_user
(
User_Id        VARCHAR2(36) not null,        --主键 
User_Name      NVARCHAR2(50) not null,       --用户名
Login_Name     NVARCHAR2(50) not null,       --登录名
Login_Password NVARCHAR2(50) not null,       --登录密码  
Last_Login_Date DATE,                        --最近登录时间 
Create_User varchar2(36) not null,           --创建人
Create_Date date default (sysdate) not null, --创建时间
Update_User varchar2(36),                    --更新人
Udpate_Date date,                            --更新时间
Row_Version varchar2(36) not null            --行版本
);

comment on table acf_user is '用户';
comment on column acf_user.User_Id is '主键';
comment on column acf_user.User_Name is '用户名';
comment on column acf_user.Login_Name is '登录名';
comment on column acf_user.Login_Password is '登录密码';
comment on column acf_user.Last_Login_Date is '最近登录时间';
comment on column acf_user.Create_User is '创建人';
comment on column acf_user.Create_Date is '创建时间';
comment on column acf_user.Update_User is '更新人';
comment on column acf_user.Udpate_Date is '更新时间';
comment on column acf_user.Row_Version is '行版本';


--实体
drop table acf_Entity;

create table acf_Entity
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

--实体属性
drop table acf_Entity_Property;

create table acf_Entity_Property
(
Id varchar2(36) not  null primary key,
Entity_Id varchar2(36) not  null,
Name nvarchar2(50) not null,
Type varchar2(20) not null
);


