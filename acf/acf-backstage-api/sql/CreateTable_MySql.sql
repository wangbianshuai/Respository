--  服务分类
drop table acf_service_category;

create table acf_service_category
(
Id varchar(36) not null primary key comment '主健',   
Name1 varchar(50) not null           comment  'I类名称',
Name2 varchar(50) not null                comment  'II类名称',
Status tinyint default 1 not null comment  '服务状态，1：使用中，0：已关闭',
Create_User varchar(36) not null comment   '创建人',
Create_Date datetime default now() not null comment '创建时间',
Update_User varchar(36)  comment '更新人',
Udpate_Date datetime comment '更新时间',
Row_Version varchar(36) not null  comment'行版本'
) comment='服务分类';

-- 门店信息
drop table acf_store;

create table acf_store
(
Id varchar(36) not null primary key comment '主键',
Name varchar(50) not null comment '门店名称',
Store_Code varchar(50) not null comment '门店编号',
Status tinyint default 1 not null comment '营业状态，1：营业中，2：放假中，0：已关闭',
Business_Start_Time varchar(20) not null comment '营业开始时间',
Business_End_Time varchar(20) not null comment '营业结束时间',
Province_Code varchar(20) not null  comment '省 ', 
City_Code varchar(20) not null comment '市',
Address varchar(100) not null comment '详细地址',
Telephone varchar(50) not null comment '电话',
List_Image_Url varchar(200) not null comment '门店列表图地址',
Detail_Image_Url varchar(200) not null comment '门店详情图地址',
Create_User varchar(36) not null comment   '创建人',
Create_Date datetime default now() not null comment '创建时间',
Update_User varchar(36)  comment '更新人',
Udpate_Date datetime comment '更新时间',
Row_Version varchar(36) not null  comment'行版本'
) comment='门店信息';

-- 省份
drop table acf_province;

create table acf_province
(
Id varchar(36) not null primary key comment '主键',
Name varchar(50) not null comment '名称',               
Code varchar(20) not null comment '编号',                 
Create_User varchar(36) not null comment   '创建人',
Create_Date datetime default now() not null comment '创建时间',
Update_User varchar(36)  comment '更新人',
Udpate_Date datetime comment '更新时间',
Row_Version varchar(36) not null  comment'行版本'
) comment='省份';


-- 城市
drop table acf_city;

create table acf_city
(
Id varchar(36) not null primary key comment '主键',      
Name varchar(50) not null comment '名称',              
Code varchar(20) not null comment '编号',              
Province_Code varchar(20) not null comment '省份编号', 
Create_User varchar(36) not null comment   '创建人',
Create_Date datetime default now() not null comment '创建时间',
Update_User varchar(36)  comment '更新人',
Udpate_Date datetime comment '更新时间',
Row_Version varchar(36) not null  comment'行版本'
) comment='城市';

-- 用户
drop table acf_user;

create table acf_user
(
User_Id        varchar(36) not null,        -- 主键 
User_Name      varchar(50) not null,       -- 用户名
Login_Name     varchar(50) not null,       -- 登录名
Login_Password varchar(50) not null,       -- 登录密码  
Last_Login_Date datetime,                        -- 最近登录时间 
Create_User varchar(36) not null comment   '创建人',
Create_Date datetime default now() not null comment '创建时间',
Update_User varchar(36)  comment '更新人',
Udpate_Date datetime comment '更新时间',
Row_Version varchar(36) not null  comment'行版本'
) comment='用户';

-- 实体
drop table acf_Entity;

create table acf_Entity
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
Create_User varchar(36) not null comment   '创建人',
Create_Date datetime default now() not null comment '创建时间',
Update_User varchar(36)  comment '更新人',
Udpate_Date datetime comment '更新时间',
Row_Version varchar(36) not null  comment'行版本'
) comment='实体';

-- 实体属性
drop table acf_Entity_Property;

create table acf_Entity_Property
(
Id varchar(36) not  null primary key,
Entity_Id varchar(36) not  null,
Name varchar(50) not null,
Type varchar(20) not null
) comment='实体属性';

