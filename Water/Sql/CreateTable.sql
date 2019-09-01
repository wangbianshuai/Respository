-- 实体名
drop table t_Entity;

create table t_Entity
(
Id varchar(36) not  null primary key comment '主键',
Entity_Name varchar(36) not null comment '实体名',
Name varchar(50) not null comment '名称',
Table_Name varchar(30) comment '表名',
With_Sql text comment 'with sql查询语句',
Primary_Key varchar(50) comment '主键',
No_Select_Names varchar(1000) comment '不可查询字段名集合，以逗号隔开',
Is_Get tinyint default 1 comment '是否允许GET',
Is_Post tinyint default 1 comment '是否允许POST',
Is_Put tinyint default 1 comment '是否允许PUT',
Is_Delete tinyint default 1 comment '是否允许DELETE',
Is_Get_Log tinyint default 0 comment '是否记录GET日志',
Is_Post_Query_Log tinyint default 0 comment '是否记录POST查询日志',
Is_Post_Log tinyint default 1 comment '是否记录POST日志',
Is_Put_Log tinyint default 1 comment '是否记录PUT日志',
Is_Delete_Log tinyint default 1 comment '是否记录DELETE日志',
Remark varchar(200) comment '备注',
Create_User varchar(36) not null comment '创建人',
Create_Date    datetime default now() not null comment '创建时间',
Update_User varchar(36) comment '更新人',
Update_Date    datetime comment '更新时间',
Row_Version varchar(36) not null comment '行版本'
) comment='实体';

-- 实体属性
drop table t_Entity_Property;

create table t_Entity_Property
(
Id varchar(36) not null primary key comment '主键',
Entity_Id varchar(36) not  null comment '实体主键',
Name varchar(50) not null comment '名称',
Type varchar(20) not null comment '数据类型'
) comment='实体属性';

-- 管理员用户
drop table t_Admin_User;

create table t_Admin_User
(
  User_Id        varchar(36) not null primary key comment '主键',
  User_Name      varchar(50) not null comment '用户名',
  Login_Name     varchar(50) not null comment '登录名',
  Login_Password varchar(50) not null comment '登录密码',
  Last_Login_Date datetime comment '最近登录时间',
  Is_Delete tinyint default 0 not null comment '是否删除,1:删除,0:正常',
  Create_User varchar(36) not null comment '创建人',
  Create_Date    datetime default now() not null comment '创建时间',
  Update_User varchar(36) comment '更新人',
  Update_Date    datetime comment '更新时间',
  Row_Version varchar(36) not null comment '行版本'
) comment='管理员用户';

-- 键值对配置
drop table d_dictionary;

create table d_dictionary
(
Id varchar(36) not null primary key primary key comment '主键',
Name varchar(50) not null not null comment '名称',
Value varchar(500) not null not null comment '值',
Remark varchar(200) comment '备注',
Is_Delete tinyint default 0 not null comment '是否删除,1:删除,0:正常',
Create_User varchar(36) not null comment '创建人',
Create_Date    datetime default now() not null comment '创建时间',
Update_User varchar(36) comment '更新人',
Update_Date    datetime comment '更新时间',
Row_Version varchar(36) not null comment '行版本'
) comment '键值对配置';

-- 饮水机
drop table t_water_machine;

create table t_water_machine
(
Id varchar(36) not null primary key primary key comment '主键',
Name varchar(50) not null not null comment '名称',
Model varchar(50) comment '型号',
MAC varchar(30) comment 'MAC地址',
IP  varchar(30) comment 'IP地址',
Address varchar(100) comment '地址',
Status tinyint default 1 not null comment '状态,1:正常,2:维修中,3:损坏,4:暂停使用,5:注销',
Remark varchar(200) comment '备注',
Is_Delete tinyint default 0 not null comment '是否删除,1:删除,0:正常',
Create_User varchar(36) not null comment '创建人',
Create_Date    datetime default now() not null comment '创建时间',
Update_User varchar(36) comment '更新人',
Update_Date    datetime comment '更新时间',
Row_Version varchar(36) not null comment '行版本'
) comment '饮水机';

-- 用户
drop table t_User;

create table t_User
(
Id varchar(36) not null primary key primary key comment '主键',
Weixin_openid varchar(50) comment '微信用户的标识，对当前公众号唯一',
Weixin_nickname varchar(50) comment '微信用户的昵称',
Weixin_sex tinyint comment '用户的性别，值为1时是男性，值为2时是女性，值为0时是未知',
Weixin_city  varchar(50) comment '用户所在城市',
Weixin_country  varchar(50) comment '用户所在国家',
Weixin_province  varchar(50) comment '用户所在省份',
Weixin_headimgurl  varchar(200) comment '用户头像，最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640*640正方形头像），用户没有头像时该项为空。若用户更换头像，原有头像URL将失效。',
Weixin_subscribe_time  varchar(50) comment '用户关注时间，为时间戳。如果用户曾多次关注，则取最后关注时间',
Status tinyint default 1 not null comment '状态,1:正常,2:注销',
Remark varchar(200) comment '备注',
Is_Delete tinyint default 0 not null comment '是否删除,1:删除,0:正常',
Create_Date    datetime default now() not null comment '创建时间',
Update_Date    datetime comment '更新时间,每次登录更新一次',
Update_Admin_User varchar(36) comment '更新人,管理员用户',
Update_Admin_Date    datetime comment '更新时间,管理员用户',
Row_Version varchar(36) not null comment '行版本'
) comment '用户';

-- 订单
drop table t_Order;

create table t_Order
(
Id varchar(36) not null primary key primary key comment '主键',
User_Id varchar(36) not null comment '用户主键',
Water_Type tinyint not null comment '水的种类,1:碱性水、2:酸性水、3:纯净水',
Capacity float not null comment '容量,单位ml',
Intensity tinyint comment '强度：1:强、2:中、3:弱',
Temperature_type  tinyint default 0 comment '水温类型：0:常温水、1:热水',
Amount double not null comment '金额',
Discount double not null comment '折扣金额',
Actual_Amount  double not null comment '实付金额',
Status tinyint default 1 not null comment '状态,1:待付款,2:已付款,3:已取消,4:付款失败',
Remark varchar(200) comment '备注',
Is_Delete tinyint default 0 not null comment '是否删除,1:删除,0:正常',
Create_Date    datetime default now() not null comment '创建时间',
Update_Date    datetime comment '更新时间',
Update_Admin_User varchar(36) comment '更新人,管理员用户',
Update_Admin_Date    datetime comment '更新时间,管理员用户',
Row_Version varchar(36) not null comment '行版本'
) comment '订单';

-- 支付记录
drop table t_Payment_Record;

create table t_Payment_Record
(
Id varchar(36) not null primary key primary key comment '主键',
User_Id varchar(36) not null comment '用户主键',
Amount double not null comment '金额',
Payment_Date  datetime  not null comment '支付时间',
Status tinyint default 1 not null comment '状态,1:待付款,2:已付款,3:已取消,4:付款失败',
Remark varchar(200) comment '备注',
Is_Delete tinyint default 0 not null comment '是否删除,1:删除,0:正常',
Create_Date    datetime default now() not null comment '创建时间',
Update_Date    datetime comment '更新时间',
Update_Admin_User varchar(36) comment '更新人,管理员用户',
Update_Admin_Date    datetime comment '更新时间,管理员用户',
Row_Version varchar(36) not null comment '行版本'
) comment '支付记录';

-- 广告
drop table t_advertisement;

create table t_advertisement
(
Id varchar(36) not null primary key primary key comment '主键',
Name varchar(50) not null not null comment '名称',
Image_Url varchar(200) not null comment '图片地址',
Display_Index int not null comment '显示顺序',
Status tinyint default 0 not null comment '状态,1:上架,2:下架',
Remark varchar(200) comment '备注',
Is_Delete tinyint default 0 not null comment '是否删除,1:删除,0:正常',
Create_User varchar(36) not null comment '创建人',
Create_Date    datetime default now() not null comment '创建时间',
Update_User varchar(36) comment '更新人',
Update_Date    datetime comment '更新时间',
Row_Version varchar(36) not null comment '行版本'
) comment '广告';
