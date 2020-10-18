use Marriage
go

if exists(select 1 from sys.objects where name='proc_AddCellExplanation')
DROP PROC proc_AddCellExplanation
GO
CREATE PROC proc_AddCellExplanation
  @Explanation nvarchar(100),--说明
  @TableName nvarchar(100),--表名
  @CellName nvarchar(100)--列名
  as
  declare @sum int
  select @sum=count(*)
from sys.extended_properties A inner join sys.columns B 
    on A.major_id=B.object_id 
    and A.minor_id=B.Column_id 
inner join sys.types c on B.user_type_id=C.user_type_id
where A.major_ID=object_id(@tablename) and b.name 

=@CellName
  if(@sum>0)
begin
	EXEC sys.sp_updateextendedproperty @name=N'MS_Description', @value=@Explanation , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=@tablename, @level2type=N'COLUMN',@level2name=@CellName
end
else
begin 
	EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=@Explanation , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=@tablename, @level2type=N'COLUMN',@level2name=@CellName
end
go

  @TableName nvarchar(100),--表名
  @CellName nvarchar(100)--列名
  as
  declare @sum int
  select @sum=count(*)
from sys.extended_properties A inner join sys.columns B 
    on A.major_id=B.object_id 
    and A.minor_id=B.Column_id 
inner join sys.types c on B.user_type_id=C.user_type_id
where A.major_ID=object_id(@tablename) and b.name 

=@CellName
  if(@sum>0)
begin
	EXEC sys.sp_updateextendedproperty @name=N'MS_Description', @value=@Explanation , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=@tablename, @level2type=N'COLUMN',@level2name=@CellName
end
else
begin 
	EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=@Explanation , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=@tablename, @level2type=N'COLUMN',@level2name=@CellName
end
go

--1、平台用户（t_AppUser）
if exists(select * from sysobjects where name='t_AppUser')
drop table t_AppUser
go

create table t_AppUser
(
UserId uniqueidentifier not null primary key,                  --主键
Name nvarchar(50) not null,                                    --名称
LoginName nvarchar(50) not null,                               --登录名
LoginPassword varchar(50) not null,                            --登录密码
Status tinyint not null default(1),                            --状态：1：正常，2：关闭
LastLoginDate datetime,                                        --最近登录时间
LoginIp varchar(30),                                           --登录Ip
Remark nvarchar(200),                                          --备注 
IsDelete tinyint not null default(0),                          --是否删除
CreateUser uniqueidentifier not null,                          --创建人
CreateDate datetime default(getdate()) not null,               --创建时间
UpdateUser uniqueidentifier,                                   --更新人
UpdateDate datetime,                                           --更新时间
RowVersion timestamp not null                                  --行版本
)
go

exec proc_AddCellExplanation '主键','t_AppUser','UserId'
exec proc_AddCellExplanation '名称','t_AppUser','Name'
exec proc_AddCellExplanation '登录名','t_AppUser','LoginName'
exec proc_AddCellExplanation '登录密码','t_AppUser','LoginPassword'
exec proc_AddCellExplanation '状态：1：正常，2：关闭','t_AppUser','Status'
exec proc_AddCellExplanation '最近登录时间','t_AppUser','LastLoginDate'
exec proc_AddCellExplanation '登录Ip','t_AppUser','LoginIp'
exec proc_AddCellExplanation '备注','t_AppUser','Remark'
exec proc_AddCellExplanation '是否删除','t_AppUser','IsDelete'
exec proc_AddCellExplanation '创建人','t_AppUser','CreateUser'
exec proc_AddCellExplanation '创建时间','t_AppUser','CreateDate'
exec proc_AddCellExplanation '更新人','t_AppUser','UpdateUser'
exec proc_AddCellExplanation '更新时间','t_AppUser','UpdateDate'
exec proc_AddCellExplanation '行版本','t_AppUser','RowVersion'
go

if exists(select * from sysobjects where name='v_AppUser')
drop view v_AppUser
go

create view v_AppUser
as
select a.*,
case when a.Status=1 then '正常' when a.Status=2 then '关闭' else '未知' end StatusName
from t_AppUser a 
where a.IsDelete=0
go

--2、红娘信息表（t_Matchmaker）
if exists(select * from sysobjects where name='t_Matchmaker')
drop table t_Matchmaker
go

create table t_Matchmaker
(
MatchmakerId uniqueidentifier not null primary key,            --主键
Name nvarchar(50) not null,                                    --名称
LoginName nvarchar(50) not null,                               --登录名
LoginPassword varchar(50) not null,                            --登录密码
HeadImageUrl nvarchar(200),                                    --头像图片地址
Sex tinyint not null,                                          --性别，1：男，2：女
IdCard varchar(20) not null,                                   --身份证号码
Phone varchar(20) not null,                                    --手机号码
Address nvarchar(100) not null,                                --地址
Features nvarchar(500)，                                       --特点说明
Status tinyint not null default(1),                            --状态：1：正常，2：关闭
LastLoginDate datetime,                                        --最近登录时间
LoginIp varchar(30),                                           --登录Ip
Remark nvarchar(200),                                          --备注 
IsDelete tinyint not null default(0),                          --是否删除
CreateUser uniqueidentifier not null,                          --创建人
CreateDate datetime default(getdate()) not null,               --创建时间
UpdateUser uniqueidentifier,                                   --更新人
UpdateDate datetime,                                           --更新时间
RowVersion timestamp not null                                  --行版本
)
go

exec proc_AddCellExplanation '主键','t_Matchmaker','MatchmakerId'
exec proc_AddCellExplanation '名称','t_Matchmaker','Name'
exec proc_AddCellExplanation '登录名','t_Matchmaker','LoginName'
exec proc_AddCellExplanation '登录密码','t_Matchmaker','LoginPassword'
exec proc_AddCellExplanation '头像图片地址','t_Matchmaker','HeadImageUrl'
exec proc_AddCellExplanation '性别，1：男，2：女','t_Matchmaker','Sex'
exec proc_AddCellExplanation '地址','t_Matchmaker','Address'
exec proc_AddCellExplanation '身份证号码','t_Matchmaker','IdCard'
exec proc_AddCellExplanation '手机','t_Matchmaker','Phone'
exec proc_AddCellExplanation '特点说明','t_Matchmaker','Features'
exec proc_AddCellExplanation '状态：1：正常，2：关闭','t_Matchmaker','Status'
exec proc_AddCellExplanation '最近登录时间','t_Matchmaker','LastLoginDate'
exec proc_AddCellExplanation '登录Ip','t_Matchmaker','LoginIp'
exec proc_AddCellExplanation '备注','t_Matchmaker','Remark'
exec proc_AddCellExplanation '是否删除','t_Matchmaker','IsDelete'
exec proc_AddCellExplanation '创建人','t_Matchmaker','CreateUser'
exec proc_AddCellExplanation '创建时间','t_Matchmaker','CreateDate'
exec proc_AddCellExplanation '更新人','t_Matchmaker','UpdateUser'
exec proc_AddCellExplanation '更新时间','t_Matchmaker','UpdateDate'
exec proc_AddCellExplanation '行版本','t_Matchmaker','RowVersion'
go

if exists(select * from sysobjects where name='v_Matchmaker')
drop view v_Matchmaker
go

create view v_Matchmaker
as
select a.*,
case when a.Status=1 then '正常' when a.Status=2 then '关闭' else '未知' end StatusName
from t_Matchmaker a 
where a.IsDelete=0
go

--2、App账户访问Token（t_AppAccountToken）
if exists(select * from sysobjects where name='t_AppAccountToken')
drop table t_AppAccountToken
go
create table t_AppAccountToken
(
TokenId uniqueidentifier not null primary key,                 --主键
AppAccountId uniqueidentifier not null,                        --App账户ID
AccessToken varchar(1000),                                     --微信access token
ExpiresIn int,                                                 --微信token有效时间（秒）
UpdateDate datetime not null,                                      --更新时间
RowVersion timestamp not null                                  --行版本
)
go

exec proc_AddCellExplanation '主键','t_AppAccountToken','TokenId'
exec proc_AddCellExplanation 'App账户ID','t_AppAccountToken','AppAccountId'
exec proc_AddCellExplanation '微信access token','t_AppAccountToken','AccessToken'
exec proc_AddCellExplanation '微信token有效时间（秒）','t_AppAccountToken','ExpiresIn'
exec proc_AddCellExplanation '更新时间','t_AppAccountToken','UpdateDate'
exec proc_AddCellExplanation '行版本','t_AppAccountToken','RowVersion'
go

create index t_AppAccountToken_AppAccountId on t_AppAccountToken(AppAccountId)
go

--3、行为类型（t_ActionType）
if exists(select * from sysobjects where name='t_ActionType')
drop table t_ActionType
go

create table t_ActionType
(
ActionTypeId uniqueidentifier not null primary key,            --主键
Name nvarchar(50) not null,                                    --名称
ActionKey nvarchar(50),                                        --行为KEY值
Remark nvarchar(200),                                          --备注 
IsDelete tinyint not null default(0),                          --是否删除
CreateUser uniqueidentifier not null,                          --创建人
CreateDate datetime default(getdate()) not null,               --创建时间
UpdateUser uniqueidentifier,                                   --更新人
UpdateDate datetime,                                           --更新时间
RowVersion timestamp not null                                  --行版本
)
go

exec proc_AddCellExplanation '主键','t_ActionType','ActionTypeId'
exec proc_AddCellExplanation '名称','t_ActionType','Name'
exec proc_AddCellExplanation '行为KEY值','t_ActionType','ActionKey'
exec proc_AddCellExplanation '备注','t_ActionType','Remark'
exec proc_AddCellExplanation '是否删除','t_ActionType','IsDelete'
exec proc_AddCellExplanation '创建人','t_ActionType','CreateUser'
exec proc_AddCellExplanation '创建时间','t_ActionType','CreateDate'
exec proc_AddCellExplanation '更新人','t_ActionType','UpdateUser'
exec proc_AddCellExplanation '更新时间','t_ActionType','UpdateDate'
exec proc_AddCellExplanation '行版本','t_ActionType','RowVersion'
go

if exists(select * from sysobjects where name='v_ActionType')
drop view v_ActionType
go

create view v_ActionType
as
select a.*
from t_ActionType a where IsDelete=0
go

--4、接收微信消息（t_ReceiveWeChatMessage）
if exists(select * from sysobjects where name='t_ReceiveWeChatMessage')
drop table t_ReceiveWeChatMessage
go

create table t_ReceiveWeChatMessage
(
MessageId uniqueidentifier not null primary key,               --主键
ToUserName varchar(50) not null,                               --开发者微信号
FromUserName varchar(50) not null,                             --发送方帐号（一个OpenID）
CreateTime datetime not null,                                  --消息创建时间 （整型）
MsgType varchar(30) not null,                                  --消息类型
Content nvarchar(max),                                         --文本消息内容
MsgId bigint,                                                  --消息id，64位整型
PicUrl nvarchar(500),                                          --图片链接（由系统生成）
MediaId varchar(50),                                           --图片消息媒体id，可以调用获取临时素材接口拉取数据。             
Format varchar(30),                                            --语音格式，如amr，speex等
Recognition nvarchar(500),                                     --语音识别结果，UTF8编码
ThumbMediaId varchar(50),                                      --视频消息缩略图的媒体id，可以调用多媒体文件下载接口拉取数据。
Location_X float,                                              --地理位置维度
Location_Y float,                                              --地理位置经度
Scale float,                                                   --地图缩放大小
Label nvarchar(200),                                           --地理位置信息
Title nvarchar(100),                                           --消息标题
Description nvarchar(500),                                     --消息描述
Url nvarchar(200),                                             --消息链接
Event varchar(30),                                             --事件类型，subscribe(订阅)、unsubscribe(取消订阅)
EventKey varchar(50),                                          --事件KEY值，qrscene_为前缀，后面为二维码的参数值
Ticket varchar(200),                                           --二维码的ticket，可用来换取二维码图片
Latitude float,                                                --地理位置纬度
Longitude float,                                               --地理位置经度
Precision float,                                               --地理位置精度
CreateDate datetime default(getdate()) not null,               --创建时间
RowVersion timestamp not null                                  --行版本
)
go

exec proc_AddCellExplanation '主键','t_ReceiveWeChatMessage','MessageId'
exec proc_AddCellExplanation '开发者微信号','t_ReceiveWeChatMessage','ToUserName'
exec proc_AddCellExplanation '发送方帐号（一个OpenID）','t_ReceiveWeChatMessage','FromUserName'
exec proc_AddCellExplanation '消息创建时间','t_ReceiveWeChatMessage','CreateTime'
exec proc_AddCellExplanation '消息类型','t_ReceiveWeChatMessage','MsgType'
exec proc_AddCellExplanation '文本消息内容','t_ReceiveWeChatMessage','Content'
exec proc_AddCellExplanation '消息id，64位整型','t_ReceiveWeChatMessage','MsgId'
exec proc_AddCellExplanation '图片链接（由系统生成）','t_ReceiveWeChatMessage','PicUrl'
exec proc_AddCellExplanation '图片消息媒体id，可以调用获取临时素材接口拉取数据。 ','t_ReceiveWeChatMessage','MediaId'
exec proc_AddCellExplanation '语音格式，如amr，speex等','t_ReceiveWeChatMessage','Format'
exec proc_AddCellExplanation '语音识别结果，UTF8编码','t_ReceiveWeChatMessage','Recognition'
exec proc_AddCellExplanation '视频消息缩略图的媒体id，可以调用多媒体文件下载接口拉取数据。','t_ReceiveWeChatMessage','ThumbMediaId'
exec proc_AddCellExplanation '地理位置维度','t_ReceiveWeChatMessage','Location_X'
exec proc_AddCellExplanation '地理位置经度','t_ReceiveWeChatMessage','Location_Y'
exec proc_AddCellExplanation '地图缩放大小','t_ReceiveWeChatMessage','Scale'
exec proc_AddCellExplanation '地理位置信息','t_ReceiveWeChatMessage','Label'
exec proc_AddCellExplanation '消息标题','t_ReceiveWeChatMessage','Title'
exec proc_AddCellExplanation '消息描述','t_ReceiveWeChatMessage','Description'
exec proc_AddCellExplanation '消息链接','t_ReceiveWeChatMessage','Url'
exec proc_AddCellExplanation '事件类型，subscribe(订阅)、unsubscribe(取消订阅)','t_ReceiveWeChatMessage','Event'
exec proc_AddCellExplanation '事件KEY值，qrscene_为前缀，后面为二维码的参数值','t_ReceiveWeChatMessage','EventKey'
exec proc_AddCellExplanation '二维码的ticket，可用来换取二维码图片','t_ReceiveWeChatMessage','Ticket'
exec proc_AddCellExplanation '地理位置纬度','t_ReceiveWeChatMessage','Latitude'
exec proc_AddCellExplanation '地理位置经度','t_ReceiveWeChatMessage','Longitude'
exec proc_AddCellExplanation '地理位置精度','t_ReceiveWeChatMessage','Precision'
exec proc_AddCellExplanation '创建时间','t_ReceiveWeChatMessage','CreateDate'
exec proc_AddCellExplanation '行版本','t_ReceiveWeChatMessage','RowVersion'
go


--5、粉丝行为记录（t_UserActionRecord）
if exists(select * from sysobjects where name='t_UserActionRecord')
drop table t_UserActionRecord
go

create table t_UserActionRecord
(
RecordId uniqueidentifier not null primary key,                --主键
AppAccountId uniqueidentifier not null,                        --App账号ID
OpenId varchar(50) not null,                                   --用户OpenID
RecordType tinyint not null,                                   --记录类型，1：微信消息推送记录，2：页面自定义埋点记录
MessageId uniqueidentifier,                                    --接收微信消息ID
ActionTypeId uniqueidentifier not null,                        --行为类型ID
ActionName nvarchar(200) not null,                             --行为名称
UserTagIds nvarchar(500),                                      --用户标签Ids,以逗号隔开
Remark nvarchar(200),                                          --备注
CreateDate datetime default(getdate()) not null,               --创建时间
RowVersion timestamp not null                                  --行版本
)
go

exec proc_AddCellExplanation '主键','t_UserActionRecord','RecordId'
exec proc_AddCellExplanation 'App账号ID','t_UserActionRecord','AppAccountId'
exec proc_AddCellExplanation '用户OpenID','t_UserActionRecord','OpenID'
exec proc_AddCellExplanation '记录类型，1：微信消息推送记录，2：页面自定义埋点记录','t_UserActionRecord','RecordType'
exec proc_AddCellExplanation '接收微信消息ID','t_UserActionRecord','MessageId'
exec proc_AddCellExplanation '行为类型ID','t_UserActionRecord','ActionTypeId'
exec proc_AddCellExplanation '行为名称','t_UserActionRecord','ActionName'
exec proc_AddCellExplanation '用户标签Ids,以逗号隔开','t_UserActionRecord','UserTagIds'
exec proc_AddCellExplanation '备注','t_UserActionRecord','Remark'
exec proc_AddCellExplanation '创建时间','t_UserActionRecord','CreateDate'
exec proc_AddCellExplanation '行版本','t_UserActionRecord','RowVersion'
go

create index t_UserActionRecord_AppAccountId on t_UserActionRecord(AppAccountId)
go

--6、粉丝标签（t_UserTag）
if exists(select * from sysobjects where name='t_UserTag')
drop table t_UserTag
go

create table t_UserTag
(
UserTagId uniqueidentifier not null primary key,               --主键
AppAccountId uniqueidentifier not null,                        --App账号ID
Name nvarchar(50) not null,                                    --名称
Remark nvarchar(200),                                          --备注 
IsDelete tinyint not null default(0),                          --是否删除
CreateUser uniqueidentifier not null,                          --创建人
CreateDate datetime default(getdate()) not null,               --创建时间
UpdateUser uniqueidentifier,                                   --更新人
UpdateDate datetime,                                           --更新时间
RowVersion timestamp not null                                  --行版本
)
go

exec proc_AddCellExplanation '主键','t_UserTag','UserTagId'
exec proc_AddCellExplanation 'App账号ID','t_UserTag','AppAccountId'
exec proc_AddCellExplanation '名称','t_UserTag','Name'
exec proc_AddCellExplanation '备注','t_UserTag','Remark'
exec proc_AddCellExplanation '是否删除','t_UserTag','IsDelete'
exec proc_AddCellExplanation '创建人','t_UserTag','CreateUser'
exec proc_AddCellExplanation '创建时间','t_UserTag','CreateDate'
exec proc_AddCellExplanation '更新人','t_UserTag','UpdateUser'
exec proc_AddCellExplanation '更新时间','t_UserTag','UpdateDate'
exec proc_AddCellExplanation '行版本','t_UserTag','RowVersion'
go

create index t_UserTag_AppAccountId on t_UserTag(AppAccountId)
go

if exists(select * from sysobjects where name='v_UserTag')
drop view v_UserTag
go

create view v_UserTag
as
select a.*
from t_UserTag a where IsDelete=0
go

--7、菜单（t_Menu）
if exists(select * from sysobjects where name='t_Menu')
drop table t_Menu
go

create table t_Menu
(
MenuId uniqueidentifier not null primary key,                  --主键
AppAccountId uniqueidentifier not null,                        --App账号ID
Name nvarchar(50) not null,                                    --名称
Content nvarchar(max) not null,                                --菜单结构json
Remark nvarchar(200),                                          --备注 
CreateUser uniqueidentifier not null,                          --创建人
CreateDate datetime default(getdate()) not null,               --创建时间
UpdateUser uniqueidentifier,                                   --更新人
UpdateDate datetime,                                           --更新时间
RowVersion timestamp not null                                  --行版本
)
go

exec proc_AddCellExplanation '主键','t_Menu','MenuId'
exec proc_AddCellExplanation 'App账号ID','t_Menu','AppAccountId'
exec proc_AddCellExplanation '名称','t_Menu','Name'
exec proc_AddCellExplanation '菜单结构json','t_Menu','Content'
exec proc_AddCellExplanation '备注','t_Menu','Remark'
exec proc_AddCellExplanation '创建人','t_Menu','CreateUser'
exec proc_AddCellExplanation '创建时间','t_Menu','CreateDate'
exec proc_AddCellExplanation '更新人','t_Menu','UpdateUser'
exec proc_AddCellExplanation '更新时间','t_Menu','UpdateDate'
exec proc_AddCellExplanation '行版本','t_Menu','RowVersion'
go

create index t_Menu_AppAccountId on t_Menu(AppAccountId)
go

--8、微信模板（t_WeChatTemplate）
if exists(select * from sysobjects where name='t_WeChatTemplate')
drop table t_WeChatTemplate
go

create table t_WeChatTemplate
(
TemplateId  nvarchar(100) not null primary key,                --主键
AppAccountId uniqueidentifier not null,                        --App账号ID
Title nvarchar(100) not null,                                  --微信模板标题
PrimaryIndustry nvarchar(100),                                 --模板所属行业的一级行业 
DeputyIndustry nvarchar(100),                                  --模板所属行业的二级行业 
Content nvarchar(max),                                         --模板内容
Example nvarchar(max),                                         --模板示例
UpdateUser uniqueidentifier,                                   --更新人
UpdateDate datetime,                                           --更新时间
RowVersion timestamp not null                                  --行版本
)
go

exec proc_AddCellExplanation '微信模板Id','t_WeChatTemplate','TemplateId'
exec proc_AddCellExplanation 'App账号ID','t_WeChatTemplate','AppAccountId'
exec proc_AddCellExplanation '微信模板标题','t_WeChatTemplate','Title'
exec proc_AddCellExplanation '模板所属行业的一级行业','t_WeChatTemplate','PrimaryIndustry'
exec proc_AddCellExplanation '模板所属行业的二级行业','t_WeChatTemplate','DeputyIndustry'
exec proc_AddCellExplanation '模板内容','t_WeChatTemplate','Content'
exec proc_AddCellExplanation '模板示例','t_WeChatTemplate','Example'
exec proc_AddCellExplanation '更新人','t_WeChatTemplate','UpdateUser'
exec proc_AddCellExplanation '更新时间','t_WeChatTemplate','UpdateDate'
exec proc_AddCellExplanation '行版本','t_WeChatTemplate','RowVersion'
go

create index t_WeChatTemplate_AppAccountId on t_WeChatTemplate(AppAccountId)
go

--10、发送模板消息（t_SendTemplateMessage）
if exists(select * from sysobjects where name='t_SendTemplateMessage')
drop table t_SendTemplateMessage
go

create table t_SendTemplateMessage
(
SendTemplateMessageId uniqueidentifier not null primary key,   --主键
AppAccountId uniqueidentifier not null,                        --App账号ID
TemplateId varchar(100) not null,                              --微信模板ID
ResultResponse nvarchar(1000),                                 --结果响应
Status tinyint not null default(0),                            --状态：0：未发送,1：已发送
UserTagIds nvarchar(500) not null,                             --用户标签Ids,以逗号隔开
Color nvarchar(20),                                            --模板内容字体颜色，不填默认为黑色
Remark nvarchar(200),                                          --备注 
IsDelete tinyint not null default(0),                          --是否删除
CreateUser uniqueidentifier not null,                          --创建人
CreateDate datetime default(getdate()) not null,               --创建时间
UpdateUser uniqueidentifier,                                   --更新人
UpdateDate datetime,                                           --更新时间
RowVersion timestamp not null                                  --行版本
)
go

exec proc_AddCellExplanation '主键','t_SendTemplateMessage','SendTemplateMessageId'
exec proc_AddCellExplanation 'App账号ID','t_SendTemplateMessage','AppAccountId'
exec proc_AddCellExplanation '模板消息ID','t_SendTemplateMessage','TemplateId'
exec proc_AddCellExplanation '结果响应','t_SendTemplateMessage','ResultResponse'
exec proc_AddCellExplanation '状态：0：未发送,1：已发送','t_SendTemplateMessage','Status'
exec proc_AddCellExplanation '用户标签Ids,以逗号隔开','t_SendTemplateMessage','UserTagIds'
exec proc_AddCellExplanation '模板内容字体颜色，不填默认为黑色','t_SendTemplateMessage','Color'
exec proc_AddCellExplanation '备注','t_SendTemplateMessage','Remark'
exec proc_AddCellExplanation '是否删除','t_SendTemplateMessage','IsDelete'
exec proc_AddCellExplanation '创建人','t_SendTemplateMessage','CreateUser'
exec proc_AddCellExplanation '创建时间','t_SendTemplateMessage','CreateDate'
exec proc_AddCellExplanation '更新人','t_SendTemplateMessage','UpdateUser'
exec proc_AddCellExplanation '更新时间','t_SendTemplateMessage','UpdateDate'
exec proc_AddCellExplanation '行版本','t_SendTemplateMessage','RowVersion'
go

create index t_SendTemplateMessage_AppAccountId on t_SendTemplateMessage(AppAccountId)
go

if exists(select * from sysobjects where name='v_SendTemplateMessage')
drop view v_SendTemplateMessage
go

create view v_SendTemplateMessage
as
select a.*,b.Title as WeChatTemplateName,
case when a.Status=1 then '已发送' else '未发送' end StatusName,
STUFF((SELECT ',' + Name FROM t_UserTag 
where a.UserTagIds like '%'+convert(varchar(36),UserTagId)+'%'
FOR xml path('')), 1, 1 ,'') as UserTagNames
from t_SendTemplateMessage a 
left join t_WeChatTemplate b on a.TemplateId=b.TemplateId
where IsDelete=0 
go

--11、发送模板消息属性（t_SendTemplateMessageProperty）
if exists(select * from sysobjects where name='t_SendTemplateMessageProperty')
drop table t_SendTemplateMessageProperty
go

create table t_SendTemplateMessageProperty
(
Id uniqueidentifier not null primary key,                      --主键
SendTemplateMessageId uniqueidentifier not null,                              --发送模板消息ID
PropertyName nvarchar(50) not null,                            --属性名
Value varchar(1000),                                           --值
Color nvarchar(20),                                            --模板内容字体颜色，不填默认为黑色
)
go

exec proc_AddCellExplanation '主键','t_SendTemplateMessageProperty','Id'
exec proc_AddCellExplanation '发送模板消息ID','t_SendTemplateMessageProperty','SendTemplateMessageId'
exec proc_AddCellExplanation '属性名','t_SendTemplateMessageProperty','PropertyName'
exec proc_AddCellExplanation '值','t_SendTemplateMessageProperty','Value'
exec proc_AddCellExplanation '模板内容字体颜色，不填默认为黑色','t_SendTemplateMessageProperty','Color'
go

--12、关键字配置（t_KeywordConfig）
if exists(select * from sysobjects where name='t_KeywordConfig')
drop table t_KeywordConfig
go

create table t_KeywordConfig
(
KeywordConfigId uniqueidentifier not null primary key,         --主键
AppAccountId uniqueidentifier not null,                        --App账号ID
Keyword nvarchar(50) not null,                                 --关键字
ReplyContent nvarchar(4000),                                   --回复内容
Remark nvarchar(200),                                          --备注 
IsDelete tinyint not null default(0),                          --是否删除
CreateUser uniqueidentifier not null,                          --创建人
CreateDate datetime default(getdate()) not null,               --创建时间
UpdateUser uniqueidentifier,                                   --更新人
UpdateDate datetime,                                           --更新时间
RowVersion timestamp not null                                  --行版本
)
go

exec proc_AddCellExplanation '主键','t_KeywordConfig','KeywordConfigId'
exec proc_AddCellExplanation 'App账号ID','t_KeywordConfig','AppAccountId'
exec proc_AddCellExplanation '关键字','t_KeywordConfig','Keyword'
exec proc_AddCellExplanation '回复内容','t_KeywordConfig','ReplyContent'
exec proc_AddCellExplanation '备注','t_KeywordConfig','Remark'
exec proc_AddCellExplanation '是否删除','t_KeywordConfig','IsDelete'
exec proc_AddCellExplanation '创建人','t_KeywordConfig','CreateUser'
exec proc_AddCellExplanation '创建时间','t_KeywordConfig','CreateDate'
exec proc_AddCellExplanation '更新人','t_KeywordConfig','UpdateUser'
exec proc_AddCellExplanation '更新时间','t_KeywordConfig','UpdateDate'
exec proc_AddCellExplanation '行版本','t_KeywordConfig','RowVersion'
go

create index t_KeywordConfig_AppAccountId on t_KeywordConfig(AppAccountId)
go

if exists(select * from sysobjects where name='v_KeywordConfig')
drop view v_KeywordConfig
go

create view v_KeywordConfig
as
select a.*
from t_KeywordConfig a where IsDelete=0
go

--13、粉丝用户（t_User）
if exists(select * from sysobjects where name='t_User')
drop table t_User
go

create table t_User
(
OpenId varchar(50) not null primary key,                       --微信OpenId
AppAccountId uniqueidentifier not null,                        --App账号ID
UnionId varchar(50),                                           --微信UnionId
NickName nvarchar(50),                                         --微信昵称 
Sex tinyint not null default(0),                               --微信用户的性别，值为1时是男性，值为2时是女性，值为0时是未知
City nvarchar(20),                                             --微信用户所在城市
Province nvarchar(20),                                         --微信用户所在省份
HeadImgUrl nvarchar(200),                                      --微信用户头像，最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640*640正方形头像），用户没有头像时该项为空。若用户更换头像，原有头像URL将失效。
Remark nvarchar(200),                                          --备注
UpdateUser uniqueidentifier,                                   --更新人
UpdateDate datetime,                                           --更新时间
RowVersion timestamp not null                                  --行版本
)
go

exec proc_AddCellExplanation '微信OpenId','t_User','OpenId'
exec proc_AddCellExplanation 'App账号ID','t_User','AppAccountId'
exec proc_AddCellExplanation '微信UnionId','t_User','UnionId'
exec proc_AddCellExplanation '微信昵称','t_User','NickName'
exec proc_AddCellExplanation '微信用户的性别，值为1时是男性，值为2时是女性，值为0时是未知','t_User','Sex'
exec proc_AddCellExplanation '微信用户所在城市','t_User','City'
exec proc_AddCellExplanation '微信用户所在省份','t_User','Province'
exec proc_AddCellExplanation '微信用户头像，最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640*640正方形头像），用户没有头像时该项为空。若用户更换头像，原有头像URL将失效。','t_User','HeadImgUrl'
exec proc_AddCellExplanation '备注','t_User','Remark'
exec proc_AddCellExplanation '更新人','t_User','UpdateUser'
exec proc_AddCellExplanation '更新时间','t_User','UpdateDate'
exec proc_AddCellExplanation '行版本','t_User','RowVersion'
go

create index t_User_AppAccountId on t_User(AppAccountId)
go

if exists(select * from sysobjects where name='v_User')
drop view v_User
go

create view v_User
as
select a.*,
case when a.Sex=1 then '男' when a.Sex=2 then '女' else '未知' end SexName
from t_User a
go

if exists(select * from sysobjects where name='v_User2')
drop view v_User2
go

create view v_User2
as
select a.*,
case when a.Sex=1 then '男' when a.Sex=2 then '女' else '未知' end SexName,
STUFF((SELECT ',' + Name FROM t_UserTag c,t_User_UserTag b 
where c.IsDelete=0 and  c.UserTagId=b.UserTagId and b.OpenId=a.OpenId
FOR xml path('')), 1, 1 ,'') as UserTagNames
from t_User a
go

if exists(select * from sysobjects where name='v_User_UserTag')
drop view v_User_UserTag
go

create view v_User_UserTag
as
select a.*,b.UserTagId,
case when a.Sex=1 then '男' when a.Sex=2 then '女' else '未知' end SexName
from t_User a, t_User_UserTag b,t_UserTag c
where a.OpenId=b.OpenId and b.UserTagId=c.UserTagId
and c.IsDelete=0
go

if exists(select * from sysobjects where name='v_User_UserTag2')
drop view v_User_UserTag2
go

create view v_User_UserTag2
as
select a.*,b.UserTagId,
case when a.Sex=1 then '男' when a.Sex=2 then '女' else '未知' end SexName,
STUFF((SELECT ',' + Name FROM t_UserTag e,t_User_UserTag d 
where e.IsDelete=0 and e.UserTagId=d.UserTagId and d.OpenId=a.OpenId
FOR xml path('')), 1, 1 ,'') as UserTagNames
from t_User a, t_User_UserTag b,t_UserTag c
where a.OpenId=b.OpenId and b.UserTagId=c.UserTagId
and c.IsDelete=0
go


--14、粉丝用户标签
if exists(select * from sysobjects where name='t_User_UserTag')
drop table t_User_UserTag
go

create table t_User_UserTag
(
Id uniqueidentifier not null primary key,                      --主键
OpenId varchar(50) not null,                                   --用户OpenID
UserTagId uniqueidentifier not null                            --标签ID
)
go

exec proc_AddCellExplanation '主键','t_User_UserTag','Id'
exec proc_AddCellExplanation '用户OpenID','t_User_UserTag','OpenId'
exec proc_AddCellExplanation '标签ID','t_User_UserTag','UserTagId'
go

create index t_User_UserTag_UserTagId on t_User_UserTag(UserTagId);
go

--14、服务接口（t_ServiceInterface）
if exists(select * from sysobjects where name='t_ServiceInterface')
drop table t_ServiceInterface
go

create table t_ServiceInterface
(
ServiceInterfaceId uniqueidentifier not null primary key,      --主键
Name nvarchar(50) not null,                                    --名称
InterfaceName varchar(50) not null,                            --接口名
MethodName varchar(50) not null,                               --方法名
Url nvarchar(200),                                             --URL
Remark nvarchar(200),                                          --备注 
IsDelete tinyint not null default(0),                          --是否删除
CreateUser uniqueidentifier not null,                          --创建人
CreateDate datetime default(getdate()) not null,               --创建时间
UpdateUser uniqueidentifier,                                   --更新人
UpdateDate datetime,                                           --更新时间
RowVersion timestamp not null                                  --行版本
)
go

exec proc_AddCellExplanation '主键','t_ServiceInterface','ServiceInterfaceId'
exec proc_AddCellExplanation '名称','t_ServiceInterface','Name'
exec proc_AddCellExplanation '接口名','t_ServiceInterface','InterfaceName'
exec proc_AddCellExplanation '方法名','t_ServiceInterface','MethodName'
exec proc_AddCellExplanation 'URL','t_ServiceInterface','Url'
exec proc_AddCellExplanation '备注','t_ServiceInterface','Remark'
exec proc_AddCellExplanation '是否删除','t_ServiceInterface','IsDelete'
exec proc_AddCellExplanation '创建人','t_ServiceInterface','CreateUser'
exec proc_AddCellExplanation '创建时间','t_ServiceInterface','CreateDate'
exec proc_AddCellExplanation '更新人','t_ServiceInterface','UpdateUser'
exec proc_AddCellExplanation '更新时间','t_ServiceInterface','UpdateDate'
exec proc_AddCellExplanation '行版本','t_ServiceInterface','RowVersion'
go

if exists(select * from sysobjects where name='v_ServiceInterface')
drop view v_ServiceInterface
go

create view v_ServiceInterface
as
select a.*
from t_ServiceInterface a where IsDelete=0
go

--15、后台用户(t_AdminUser)
if exists(select * from sysobjects where name='t_AdminUser')
drop table t_AdminUser
go

create table t_AdminUser
(
AdminUserId uniqueidentifier not null primary key,             --主键
AppAccountId uniqueidentifier not null,                        --App账号ID
UserName nvarchar(50) not null,                                --用户名
LoginName nvarchar(50) not null,                               --登录名
LoginPassword nvarchar(50) not null,                           --登录密码
LastLoginDate datetime,                                        --最近登录时间 
IsDelete tinyint not null default(0),                          --是否删除
CreateUser uniqueidentifier not null,                          --创建人
CreateDate datetime default(getdate()) not null,               --创建时间
UpdateUser uniqueidentifier,                                   --更新人
UpdateDate datetime,                                           --更新时间
RowVersion timestamp not null                                  --行版本
)
go

exec proc_AddCellExplanation '主键','t_AdminUser','AdminUserId'
exec proc_AddCellExplanation 'App账号ID','t_AdminUser','AppAccountId'
exec proc_AddCellExplanation '用户名','t_AdminUser','UserName'
exec proc_AddCellExplanation '登录名','t_AdminUser','LoginName'
exec proc_AddCellExplanation '登录密码','t_AdminUser','LoginPassword'
exec proc_AddCellExplanation '最近登录时间','t_AdminUser','LastLoginDate'
exec proc_AddCellExplanation '是否删除','t_AdminUser','IsDelete'
exec proc_AddCellExplanation '创建人','t_AdminUser','CreateUser'
exec proc_AddCellExplanation '创建时间','t_AdminUser','CreateDate'
exec proc_AddCellExplanation '更新人','t_AdminUser','UpdateUser'
exec proc_AddCellExplanation '更新时间','t_AdminUser','UpdateDate'
exec proc_AddCellExplanation '行版本','t_AdminUser','RowVersion'
go

if exists(select * from sysobjects where name='v_AdminUser')
drop view v_AdminUser
go

create view v_AdminUser
as
select a.*
from t_AdminUser a where IsDelete=0
go

--16、键值配置（t_DictionaryConfig）
if exists(select * from sysobjects where name='t_DictionaryConfig')
drop table t_DictionaryConfig
go

create table t_DictionaryConfig
(
DictionaryConfigId uniqueidentifier not null primary key,                      --主键
Name nvarchar(50) not null,                                    --名称
Value nvarchar(1000),                                          --值
TypeName nvarchar(50),                                         --类型名
Remark nvarchar(200),                                          --备注 
IsDelete tinyint not null default(0),                          --是否删除
CreateUser uniqueidentifier not null,                          --创建人
CreateDate datetime default(getdate()) not null,               --创建时间
UpdateUser uniqueidentifier,                                   --更新人
UpdateDate datetime,                                           --更新时间
RowVersion timestamp not null                                  --行版本
)
go

exec proc_AddCellExplanation '主键','t_DictionaryConfig','DictionaryConfigId'
exec proc_AddCellExplanation '名称','t_DictionaryConfig','Name'
exec proc_AddCellExplanation '值','t_DictionaryConfig','Value'
exec proc_AddCellExplanation '类型名','t_DictionaryConfig','TypeName'
exec proc_AddCellExplanation '备注','t_DictionaryConfig','Remark'
exec proc_AddCellExplanation '是否删除','t_DictionaryConfig','IsDelete'
exec proc_AddCellExplanation '创建人','t_DictionaryConfig','CreateUser'
exec proc_AddCellExplanation '创建时间','t_DictionaryConfig','CreateDate'
exec proc_AddCellExplanation '更新人','t_DictionaryConfig','UpdateUser'
exec proc_AddCellExplanation '更新时间','t_DictionaryConfig','UpdateDate'
exec proc_AddCellExplanation '行版本','t_DictionaryConfig','RowVersion'
go

if exists(select * from sysobjects where name='v_DictionaryConfig')
drop view v_DictionaryConfig
go

create view v_DictionaryConfig
as
select a.*
from t_DictionaryConfig a where IsDelete=0
go

--17、操作日志
if exists(select * from sysobjects where name='t_OperationLog')
drop table t_OperationLog 
go

create table t_OperationLog
(
LogId uniqueidentifier not null primary key default(newid()),   --主键
AppAccountId uniqueidentifier not null,                         --App账号ID
LogType nvarchar(20) not null,                                  --日志类型
LogPath nvarchar(200) not null,                                 --日志路径
EntityName varchar(50) not null,                                --实体名
RequestType varchar(10) not null,                               --请求类型
MethodName varchar(50),                                         --方法名
IPAddress varchar(30),                                          --IP地址
StartTime datetime not null,                                    --开始时间
EndTime datetime not null,                                      --结束时间
ElapsedMilliseconds bigint not null,                            --运行耗时
OperationUser uniqueidentifier,                                 --操作人
CreateDate datetime not null default(getdate()),                --创建时间
RowVersion timestamp not null                                   --行版本
)
go

exec proc_AddCellExplanation '主键','t_OperationLog','LogId'
exec proc_AddCellExplanation 'App账号ID','t_OperationLog','AppAccountId'
exec proc_AddCellExplanation '日志类型','t_OperationLog','LogType'
exec proc_AddCellExplanation '日志路径','t_OperationLog','LogPath'
exec proc_AddCellExplanation '实体名','t_OperationLog','EntityName'
exec proc_AddCellExplanation '请求类型','t_OperationLog','RequestType'
exec proc_AddCellExplanation '方法名','t_OperationLog','MethodName'
exec proc_AddCellExplanation 'IP地址','t_OperationLog','IPAddress'
exec proc_AddCellExplanation '开始时间','t_OperationLog','StartTime'
exec proc_AddCellExplanation '结束时间','t_OperationLog','EndTime'
exec proc_AddCellExplanation '运行耗时','t_OperationLog','ElapsedMilliseconds'
exec proc_AddCellExplanation '操作人','t_OperationLog','OperationUser'
exec proc_AddCellExplanation '创建时间','t_OperationLog','CreateDate'
exec proc_AddCellExplanation '行版本','t_OperationLog','RowVersion'
go

create index t_OperationLog_AppAccountId on t_OperationLog(AppAccountId)
go

if exists(select * from sysobjects where name='v_OperationLog')
drop view v_OperationLog
go

create view v_OperationLog
as
select a.*,b.UserName, '详细' LookDetail from t_OperationLog a
left join t_AdminUser b
on a.OperationUser=b.AdminUserId
go

--18、接口日志
if exists(select * from sysobjects where name='t_ApiLog')
drop table t_ApiLog 
go

create table t_ApiLog
(
LogId uniqueidentifier not null primary key default(newid()),   --主键
AppAccountId uniqueidentifier not null,                         --App账号ID
LogType nvarchar(20) not null,                                  --日志类型
LogPath nvarchar(200) not null,                                 --日志路径
EntityName varchar(50) not null,                                --实体名
MethodName varchar(50) not null,                                 --方法名
IPAddress varchar(30),                                          --IP地址
StartTime datetime not null,                                    --开始时间
EndTime datetime not null,                                      --结束时间
ElapsedMilliseconds bigint not null,                            --运行耗时
CreateDate datetime not null default(getdate()),                --创建时间
RowVersion timestamp not null                                   --行版本
)
go

exec proc_AddCellExplanation '主键','t_ApiLog','LogId'
exec proc_AddCellExplanation 'App账号ID','t_ApiLog','AppAccountId'
exec proc_AddCellExplanation '日志类型','t_ApiLog','LogType'
exec proc_AddCellExplanation '日志路径','t_ApiLog','LogPath'
exec proc_AddCellExplanation '实体名','t_ApiLog','EntityName'
exec proc_AddCellExplanation '方法名','t_ApiLog','MethodName'
exec proc_AddCellExplanation 'IP地址','t_ApiLog','IPAddress'
exec proc_AddCellExplanation '开始时间','t_ApiLog','StartTime'
exec proc_AddCellExplanation '结束时间','t_ApiLog','EndTime'
exec proc_AddCellExplanation '运行耗时','t_ApiLog','ElapsedMilliseconds'
exec proc_AddCellExplanation '创建时间','t_ApiLog','CreateDate'
exec proc_AddCellExplanation '行版本','t_ApiLog','RowVersion'
go

create index t_ApiLog_AppAccountId on t_ApiLog(AppAccountId)
go

if exists(select * from sysobjects where name='v_ApiLog')
drop view v_ApiLog
go

create view v_ApiLog
as
select a.*, '详细' LookDetail from t_ApiLog a
go

--19、请求服务日志（t_RequestServiceLog）
if exists(select * from sysobjects where name='t_RequestServiceLog')
drop table t_RequestServiceLog 
go

create table t_RequestServiceLog
(
LogId uniqueidentifier not null primary key default(newid()),   --主键
AppAccountId uniqueidentifier not null,                         --App账号ID
LogType tinyint not null,                                       --日志类型，1:成功、2:失败
ServiceInterfaceId  uniqueidentifier not null,                  --服务接口ID
RequestServiceLogId uniqueidentifier,                           --请求服务日志ID,重发请求记录失败请求日志ID
RequestContent  nvarchar(max),                                  --请求报文
ResponseContent nvarchar(max),                                  --响应报文
StartTime datetime not null,                                    --开始时间
EndTime datetime not null,                                      --结束时间
ElapsedMilliseconds bigint not null,                            --运行耗时
DataId uniqueidentifier,                                        --数据Id,比如发送模板消息ID
CreateDate datetime not null default(getdate()),                --创建时间
RowVersion timestamp not null                                   --行版本
)
go

exec proc_AddCellExplanation '主键','t_RequestServiceLog','Id'
exec proc_AddCellExplanation 'App账号ID','t_RequestServiceLog','AppAccountId'
exec proc_AddCellExplanation '日志类型，1:成功、2:失败','t_RequestServiceLog','LogType'
exec proc_AddCellExplanation '服务接口ID','t_RequestServiceLog','ServiceInterfaceId'
exec proc_AddCellExplanation '请求服务日志ID,重发请求记录失败请求日志ID','t_RequestServiceLog','RequestServiceLogId'
exec proc_AddCellExplanation '请求报文','t_RequestServiceLog','RequestContent'
exec proc_AddCellExplanation '响应报文','t_RequestServiceLog','ResponseContent'
exec proc_AddCellExplanation '开始时间','t_RequestServiceLog','StartTime'
exec proc_AddCellExplanation '结束时间','t_RequestServiceLog','EndTime'
exec proc_AddCellExplanation '运行耗时','t_RequestServiceLog','ElapsedMilliseconds'
exec proc_AddCellExplanation '数据Id,比如发送模板消息ID','t_RequestServiceLog','DataId'
exec proc_AddCellExplanation '创建时间','t_RequestServiceLog','CreateDate'
exec proc_AddCellExplanation '行版本','t_RequestServiceLog','RowVersion'
go

create index t_RequestServiceLog_AppAccountId on t_RequestServiceLog(AppAccountId)
go

if exists(select * from sysobjects where name='v_RequestServiceLog')
drop view v_RequestServiceLog
go

create view v_RequestServiceLog
as
with LogCount as
(
select RequestServiceLogId,COUNT(*) ReSendCount from t_RequestServiceLog
group by RequestServiceLogId
)
select a.*,b.Name ServiceInterfaceName,isNull(c.ReSendCount,0) ReSendCount,
case when a.LogType=1 then '成功' else '失败' end as LogTypeName,
case when a.RequestServiceLogId!=null then '是' else '否' end as IsReSendName
from t_RequestServiceLog a
left join t_ServiceInterface b on a.ServiceInterfaceId=b.ServiceInterfaceId
left join LogCount c on a.LogId=c.RequestServiceLogId
go


--20、直播信息表（t_Live）
if exists(select * from sysobjects where name='t_Live')
drop table t_Live
go

create table t_Live
(
LiveId uniqueidentifier not null primary key,                  --主键
Name nvarchar(50) not null,                                    --名称
LiveCode varchar(50) not null,                                 --直播房间编号
CustomerId varchar(50) not null,                               --客户ID
PushDomainName varchar(50) not null,                           --推流域名
PlayDomainName varchar(50) not null,                           --播放域名
AppName  varchar(50) not null,                                 --App名称
StreamName varchar(50) not null,                               --流名称
StartDate datetime not null,                                   --开始时间
EndDate datetime,                                              --结束时间
ChatRoomId varchar(50) not null,                               --聊天室ID
LogoImageUrl varchar(300) not null,                            --Logo图片地址
Sponsor varchar(50) not null,                                  --主办方
Summary nvarchar(max),                                         --简介
AassistantPassword varchar(50) not null,                       --助理登录密码
SpeakerPassword varchar(50) not null,                          --主讲登录密码
GuestPassword varchar(50) not null,                            --嘉宾登录密码
LiveStatus tinyint not null default(0),                        --直播状态，0：未开始，1：直播中，2：已结束
SpeakerUserId varchar(30) not null,                            --主讲用户Id
SpeakerRoomId varchar(30) not null,                            --主讲房间Id
IsRecord  tinyint not null default(0),                         --是否录制
EditMediaTaskId varchar(100),                                  --编辑视频任务Id
EditMediaFileId varchar(50),                                   --编辑视频输出文件ID
EditMediaFileUrl varchar(200),                                 --编辑视频输出文件URL
IsFiltering tinyint not null default(0),                       --是否过滤
IsAllBanned tinyint not null default(0),                       --是否全体禁言
ActivityImageUrl varchar(300),                                 --活动图片地址
AllowPcBrowser int not null default(0),                        --是否允许在PC上打开, 1:允许全部平台打开；2：只允许在微信中打开
WxIdentificationType int not null default(0),                  --微信粉丝浏览器设置，1：必须关注公众号；2：静默授权；3：显式授权
FormUID varchar(50),                                           --表单UID
FormTitle nvarchar(50),                                        --表单标题
LabelList varchar(2000),                                       --标签UID集合
ActivityUID varchar(50),                                       --活动UID
Remark nvarchar(200),                                          --备注 
IsDelete tinyint not null default(0),                          --是否删除
CreateUser varchar(50) not null,                               --创建人
CreateDate datetime default(getdate()) not null,               --创建时间
UpdateUser varchar(50),                                        --更新人
UpdateDate datetime,                                           --更新时间
RowVersion timestamp not null                                  --行版本
)
go

exec proc_AddCellExplanation '主键','t_Live','LiveId'
exec proc_AddCellExplanation '名称','t_Live','Name'
exec proc_AddCellExplanation '直播房间编号','t_Live','LiveCode'
exec proc_AddCellExplanation '客户ID','t_Live','CustomerId'
exec proc_AddCellExplanation '推流域名','t_Live','PushDomainName'
exec proc_AddCellExplanation '播放域名','t_Live','PlayDomainName'
exec proc_AddCellExplanation 'App名称','t_Live','AppName'
exec proc_AddCellExplanation '流名称','t_Live','StreamName'
exec proc_AddCellExplanation '开始时间','t_Live','StartDate'
exec proc_AddCellExplanation '结束时间','t_Live','EndDate'
exec proc_AddCellExplanation '聊天室ID','t_Live','ChatRoomId'
exec proc_AddCellExplanation 'Logo图片地址','t_Live','LogoImageUrl'
exec proc_AddCellExplanation '主办方','t_Live','Sponsor'
exec proc_AddCellExplanation '简介','t_Live','Summary'
exec proc_AddCellExplanation '助理登录密码','t_Live','AassistantPassword'
exec proc_AddCellExplanation '主讲登录密码','t_Live','SpeakerPassword'
exec proc_AddCellExplanation '嘉宾登录密码','t_Live','GuestPassword'
exec proc_AddCellExplanation '直播状态，0：未开始，1：直播中，2：已结束','t_Live','LiveStatus'
exec proc_AddCellExplanation '主讲用户Id','t_Live','SpeakerUserId'
exec proc_AddCellExplanation '主讲房间Id','t_Live','SpeakerRoomId'
exec proc_AddCellExplanation '是否录制','t_Live','IsRecord'
exec proc_AddCellExplanation '编辑视频任务Id','t_Live','EditMediaTaskId'
exec proc_AddCellExplanation '编辑视频输出文件ID','t_Live','EditMediaFileId'
exec proc_AddCellExplanation '编辑视频输出文件URL','t_Live','EditMediaFileUrl'
exec proc_AddCellExplanation '是否过滤','t_Live','IsFiltering'
exec proc_AddCellExplanation '是否全体禁言','t_Live','IsAllBanned'
exec proc_AddCellExplanation '活动图片地址','t_Live','ActivityImageUrl'
exec proc_AddCellExplanation '是否允许在PC上打开, 1:允许全部平台打开；2：只允许在微信中打开','t_Live','AllowPcBrowser'
exec proc_AddCellExplanation '微信粉丝浏览器设置，1：必须关注公众号；2：静默授权；3：显式授权','t_Live','WxIdentificationType'
exec proc_AddCellExplanation '表单UID','t_Live','FormUID'
exec proc_AddCellExplanation '表单标题','t_Live','FormTitle'
exec proc_AddCellExplanation '标签UID集合','t_Live','LabelList'
exec proc_AddCellExplanation '活动UID','t_Live','ActivityUID'
exec proc_AddCellExplanation '备注','t_Live','Remark'
exec proc_AddCellExplanation '是否删除','t_Live','IsDelete'
exec proc_AddCellExplanation '创建人','t_Live','CreateUser'
exec proc_AddCellExplanation '创建时间','t_Live','CreateDate'
exec proc_AddCellExplanation '更新人','t_Live','UpdateUser'
exec proc_AddCellExplanation '更新时间','t_Live','UpdateDate'
exec proc_AddCellExplanation '行版本','t_Live','RowVersion'
go

create index t_Live_CustomerId_Idx on t_Live(CustomerId)
go

if exists(select * from sysobjects where name='v_Live')
drop view v_Live
go

create view v_Live
as
select a.*
from t_Live a where IsDelete=0
go

 
--20、直播用户状态表（t_Live）
if exists(select * from sysobjects where name='t_LiveUserStatus')
drop table t_LiveUserStatus
go

create table t_LiveUserStatus
(
UserStatusId uniqueidentifier not null primary key,            --主键
LiveId uniqueidentifier not null,                              --直播ID
UserId varchar(50) not null,                                   --用户ID
IsBanned tinyint not null default(0),                          --是否禁言
IsRemove tinyint not null default(0),                          --是否被踢出
RowVersion timestamp not null                                  --行版本
)
go

exec proc_AddCellExplanation '主键','t_LiveUserStatus','UserStatusId'
exec proc_AddCellExplanation '直播ID','t_LiveUserStatus','LiveId'
exec proc_AddCellExplanation '用户ID','t_LiveUserStatus','UserId'
exec proc_AddCellExplanation '是否禁言','t_LiveUserStatus','IsBanned'
exec proc_AddCellExplanation '是否被踢出','t_LiveUserStatus','IsRemove'
exec proc_AddCellExplanation '行版本','t_LiveUserStatus','RowVersion'
go


--22、直播费用价格信息表（t_LiveFeePrice）
if exists(select * from sysobjects where name='t_LiveFeePrice')
drop table t_LiveFeePrice
go

create table t_LiveFeePrice
(
FeeId uniqueidentifier not null primary key,                    --主键
LiveId uniqueidentifier not null,                              --直播ID
FeeType tinyint not null,                                      --费用类型，1：直播流量，2：点播流量，3：实时音视频时间
Price money not null                                           --单价(元/GB 或 元/分钟)
)
go

exec proc_AddCellExplanation '主键','t_LiveFeePrice','FeeId'
exec proc_AddCellExplanation '直播ID','t_LiveFeePrice','LiveId'
exec proc_AddCellExplanation '费用类型，1：直播流量，2：点播流量，3：实时音视频时间','t_LiveFeePrice','FeeType'
exec proc_AddCellExplanation '单价(元/MB 或 元/分钟)','t_LiveFeePrice','Price'
go


--23、直播流量播放信息表（t_LiveStreamPlayInfo）
if exists(select * from sysobjects where name='t_LiveStreamPlayInfo')
drop table t_LiveStreamPlayInfo
go

create table t_LiveStreamPlayInfo
(
InfoId uniqueidentifier not null primary key,                  --主键
DayTime varchar(10) not null,                                  --日期，格式：YYYY-mm-dd
PageNum int not null,                                          --页数
StreamName varchar(50) not null,                               --流名称
TotalFlux float not null,	                                   --总流量，单位: MB
CreateDate datetime default(getdate()) not null,               --创建时间
)
go

exec proc_AddCellExplanation '主键','t_LiveStreamPlayInfo','InfoId'
exec proc_AddCellExplanation '日期，格式：YYYY-mm-dd','t_LiveStreamPlayInfo','DayTime'
exec proc_AddCellExplanation '页数','t_LiveStreamPlayInfo','PageNum'
exec proc_AddCellExplanation '流名称','t_LiveStreamPlayInfo','StreamName'
exec proc_AddCellExplanation '总流量，单位: MB','t_LiveStreamPlayInfo','TotalFlux'
exec proc_AddCellExplanation '创建时间','t_LiveStreamPlayInfo','CreateDate'
go

--24、直播实时音视频通话时长信息表
if exists(select * from sysobjects where name='t_LiveRoomCallTimeInfo')
drop table t_LiveRoomCallTimeInfo
go

create table t_LiveRoomCallTimeInfo
(
InfoId uniqueidentifier not null primary key,                  --主键
LiveId uniqueidentifier not null,                              --直播ID
TotalMinutes int not null,                                     --总通话时长
CreateDate datetime default(getdate()) not null,               --创建时间
)
go

exec proc_AddCellExplanation '主键','t_LiveRoomCallTimeInfo','InfoId'
exec proc_AddCellExplanation '直播ID，格式：YYYY-mm-dd','t_LiveRoomCallTimeInfo','LiveId'
exec proc_AddCellExplanation '总通话时长','t_LiveRoomCallTimeInfo','TotalMinutes'
exec proc_AddCellExplanation '创建时间','t_LiveRoomCallTimeInfo','CreateDate'
go

--24、直播云点播流量信息表
if exists(select * from sysobjects where name='t_LiveVodPlayInfo')
drop table t_LiveVodPlayInfo
go

create table t_LiveVodPlayInfo
(
InfoId uniqueidentifier not null primary key,                  --主键
FileId varchar(50) not null,                                   --文件ID
DayTime datetime not null,                                     --日期，格式：YYYY-mm-dd
TotalFlux float not null,	                                   --总流量，单位: MB
SyncCode varchar(20) not null,                                 --同步编号
ResponseStatus tinyint not null,                               --响应状态，1：成功，2：失败
ResponseContent nvarchar(4000),                                --响应报文
CreateDate datetime default(getdate()) not null,               --创建时间
)
go

exec proc_AddCellExplanation '主键','t_LiveVodPlayInfo','InfoId'
exec proc_AddCellExplanation '文件ID，格式：YYYY-mm-dd','t_LiveVodPlayInfo','FileId'
exec proc_AddCellExplanation '日期，格式：YYYY-mm-dd','t_LiveVodPlayInfo','DayTime'
exec proc_AddCellExplanation '总流量，单位: MB','t_LiveVodPlayInfo','TotalFlux'
exec proc_AddCellExplanation '同步编号','t_LiveVodPlayInfo','SyncCode'
exec proc_AddCellExplanation '响应状态，1：成功，2：失败','t_LiveVodPlayInfo','ResponseStatus'
exec proc_AddCellExplanation '响应报文','t_LiveVodPlayInfo','ResponseContent'
exec proc_AddCellExplanation '创建时间','t_LiveVodPlayInfo','CreateDate'
go

if exists(select * from sysobjects where name='v_LiveVodPlayInfo')
drop view v_LiveVodPlayInfo
go

create view v_LiveVodPlayInfo
as
select a.*,b.Name,b.LiveCode,
case when a.ResponseStatus = 1 then '成功' when a.ResponseStatus=2 then '失败' else '' end ResponseStatusName
from t_LiveVodPlayInfo a, t_Live b 
where a.FileId= b.EditMediaFileId and a.ResponseStatus>0
go

if exists(select * from sysobjects where name='v_LiveVodPlaySyncRecord')
drop view v_LiveVodPlaySyncRecord
go

create view v_LiveVodPlaySyncRecord
as
select DayTime,SyncCode,SUM(case when responsestatus in(1,2) then 1 else 0 end) RecordCount, SUM(case when responsestatus=1 then 1 else 0 end) SucceedCount,
SUM(case when responsestatus=2 then 1 else 0 end) FailedCount
from t_LiveVodPlayInfo a
group by DayTime,SyncCode
go



--直播费用
if exists(select * from sysobjects where name='v_LiveFee')
drop view v_LiveFee
go

create view v_LiveFee
as
with sumStreamFlux as 
(
select StreamName, sum(TotalFlux)/1024 TotalFlux from t_LiveStreamPlayInfo
group by StreamName
),
 sumVodFlux as 
(
select FileId, sum(TotalFlux)/1024 TotalFlux from t_LiveVodPlayInfo
group by FileId
)
select a.LiveId,a.LiveCode,a.Name,a.StreamName,a.SpeakerRoomId,isNull(b.Price,0) as FluxPirce,isnull(c.TotalFlux,0) as TotalFlux, 
ROUND(isnull(b.Price,0)* isnull(c.TotalFlux,0),2) as TotalStreamAmount,
isNull(f.Price,0) VodPrice,
isnull(g.TotalFlux,0) TotalVodFlux,
ROUND(isnull(f.Price,0)* isnull(g.TotalFlux,0),2) as TotalVodAmount,
ISNULL(d.Price,0) CallPrice,
ISNULL(e.TotalMinutes,0) TotalMinutes,
ROUND(isnull(d.Price,0)* isnull(e.TotalMinutes,0),2) as TotalCallAmount
from t_Live a
left join t_LiveFeePrice b on a.LiveId= b.LiveId and b.FeeType=1
left join sumStreamFlux c  on a.StreamName=c.StreamName
left join t_LiveFeePrice f on a.LiveId= f.LiveId and f.FeeType=2
left join sumVodFlux g  on a.EditMediaFileId=g.FileId
left join t_LiveFeePrice d on a.LiveId=d.LiveId and d.FeeType=3
left join t_LiveRoomCallTimeInfo e on e.LiveId=e.LiveId
go


--21、活动表单记录（EventsFormRecord）
if exists(select * from sysobjects where name='EventsFormRecord')
drop table EventsFormRecord
go

create table EventsFormRecord
(
UID uniqueidentifier not null primary key,                     --主键
CompanyID int not null,                                        --公司ID
EventUID uniqueidentifier not null,                            --活动ID  
EventFormUID uniqueidentifier not null,                         --活动表单ID
OpenId varchar(50),                                            --用户OpenId
CreatedDate datetime default(getdate()) not null,              --创建时间
Field0 nvarchar(2000),
Field1 nvarchar(2000),
Field2 nvarchar(2000),
Field3 nvarchar(2000),
Field4 nvarchar(2000),
Field5 nvarchar(2000),
Field6 nvarchar(2000),
Field7 nvarchar(2000),
Field8 nvarchar(2000),
Field9 nvarchar(2000),
Field10 nvarchar(2000),
Field11 nvarchar(2000),
Field12 nvarchar(2000),
Field13 nvarchar(2000),
Field14 nvarchar(2000),
Field15 nvarchar(2000),
Field16 nvarchar(2000),
Field17 nvarchar(2000),
Field18 nvarchar(2000),
Field19 nvarchar(2000),
Field20 nvarchar(2000),
Field21 nvarchar(2000),
Field22 nvarchar(2000),
Field23 nvarchar(2000),
Field24 nvarchar(2000),
Field25 nvarchar(2000),
Field26 nvarchar(2000),
Field28 nvarchar(2000),
Field29 nvarchar(2000),
Field30 nvarchar(2000),
Field31 nvarchar(2000),
Field32 nvarchar(2000),
Field33 nvarchar(2000),
Field34 nvarchar(2000),
Field35 nvarchar(2000),
Field36 nvarchar(2000),
Field38 nvarchar(2000),
Field39 nvarchar(2000),
Field40 nvarchar(2000),
Field41 nvarchar(2000),
Field42 nvarchar(2000),
Field43 nvarchar(2000),
Field44 nvarchar(2000),
Field45 nvarchar(2000),
Field46 nvarchar(2000),
Field48 nvarchar(2000),
Field49 nvarchar(2000),
Field50 nvarchar(2000)
)
go

exec proc_AddCellExplanation '主键','EventsFormRecord','UID'
exec proc_AddCellExplanation '公司ID','EventsFormRecord','CompanyID'
exec proc_AddCellExplanation '活动ID','EventsFormRecord','EventUID'
exec proc_AddCellExplanation '活动表单ID','EventsFormRecord','EventFormUID'
exec proc_AddCellExplanation '用户OpenId','EventsFormRecord','OpenId'
exec proc_AddCellExplanation '创建时间','EventsFormRecord','CreatedDate'
go


SELECT o.name as TableName,
       c.name AS 字段名,
       TYPE_NAME(c.user_type_id) AS 类型,
       max_length as 长度,
	   case when is_Nullable=0 then 'not null' else 'null' end  as 是否可空,
       isnull(ep.value, '') AS 说明,
       ISNULL(d.is_primary_key, 0) as 是否主键
  FROM sys.objects AS o
  JOIN sys.columns AS c
    ON o.object_id = c.object_id
  LEFT JOIN sys.extended_properties ep
    ON c.object_id = ep.major_id
   and c.column_id = ep.minor_id
  left join (select a.object_id, b.column_id, a.is_primary_key
               from sys.indexes         a,
                    sys.index_columns   b,
                    sys.key_constraints c
              where a.index_id = b.index_id
                and a.object_id = b.object_id
                and a.object_id = c.parent_object_id
                and a.is_primary_key = 1) d
    on c.object_id = d.object_id
   and c.column_id = d.column_id
 WHERE o.name = 't_RequestServiceLog'
 ORDER BY c.column_id
 go