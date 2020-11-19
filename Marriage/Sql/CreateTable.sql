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
OpenId varchar(50) not null,                                   --微信OpenId
NickName nvarchar(50),                                         --微信昵称 
Sex tinyint not null default(0),                               --微信用户的性别，值为1时是男性，值为2时是女性，值为0时是未知
City nvarchar(20),                                             --微信用户所在城市
Province nvarchar(20),                                         --微信用户所在省份
HeadImgUrl nvarchar(200),                                      --微信用户头像，最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640*640正方形头像），用户没有头像时该项为空。若用户更换头像，原有头像URL将失效。
IdCard varchar(20) not null,                                   --身份证号码
Phone varchar(20) not null,                                    --手机号码
Address nvarchar(100) not null,                                --地址
Features nvarchar(500),                                        --特点说明
IsAppMatchmaker tinyint not null default(0),                   --是否平台红娘
Status tinyint not null default(0),                            --状态：0：待审核，1：审核通过，2：审核不通过，3：关闭
UpdateStatusDate datetime,                                     --更新状态时间
NoPassReason nvarchar(500),                                    --审核不通过原因
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
exec proc_AddCellExplanation '微信OpenId','t_Matchmaker','OpenId'
exec proc_AddCellExplanation '微信昵称','t_Matchmaker','NickName'
exec proc_AddCellExplanation '微信用户的性别，值为1时是男性，值为2时是女性，值为0时是未知','t_Matchmaker','Sex'
exec proc_AddCellExplanation '微信用户所在城市','t_Matchmaker','City'
exec proc_AddCellExplanation '微信用户所在省份','t_Matchmaker','Province'
exec proc_AddCellExplanation '微信用户头像，最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640*640正方形头像），用户没有头像时该项为空。若用户更换头像，原有头像URL将失效。','t_Matchmaker','HeadImgUrl'
exec proc_AddCellExplanation '地址','t_Matchmaker','Address'
exec proc_AddCellExplanation '身份证号码','t_Matchmaker','IdCard'
exec proc_AddCellExplanation '手机','t_Matchmaker','Phone'
exec proc_AddCellExplanation '特点说明','t_Matchmaker','Features'
exec proc_AddCellExplanation '是否平台红娘','t_Matchmaker','IsAppMatchmaker'
exec proc_AddCellExplanation '状态：0：待审核，1：审核通过，2：审核不通过，3：关闭','t_Matchmaker','Status'
exec proc_AddCellExplanation '更新状态时间','t_Matchmaker','UpdateStatusDate'
exec proc_AddCellExplanation '最近登录时间','t_Matchmaker','LastLoginDate'
exec proc_AddCellExplanation '审核不通过原因','t_Matchmaker','NoPassReason'
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
case when a.Status=0 then '待审核' when a.Status=1 then '审核通过'
when a.Status=2 then '审核不通过' when a.Status=3 then '关闭' else '未知' end StatusName,
case when a.Sex=1 then '男' when a.Sex=2 then '女' else '未知' end SexName,
case when a.IsAppMatchmaker=1 then '是' else '否' end IsAppMatchmakerName
from t_Matchmaker a 
where a.IsDelete=0
go

--3、相亲用户信息表（t_MarriageUser）
if exists(select * from sysobjects where name='t_MarriageUser')
drop table t_MarriageUser
go

create table t_MarriageUser
(
UserId uniqueidentifier not null primary key,                  --主键
Name nvarchar(50) not null,                                    --名称
OpenId varchar(50),                                            --微信OpenId
NickName nvarchar(50),                                         --微信昵称 
Sex tinyint not null default(0),                               --微信用户的性别，值为1时是男性，值为2时是女性，值为0时是未知
City nvarchar(20),                                             --微信用户所在城市
Province nvarchar(20),                                         --微信用户所在省份
HeadImgUrl nvarchar(200),                                      --微信用户头像，最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640*640正方形头像），用户没有头像时该项为空。若用户更换头像，原有头像URL将失效。
IdCard varchar(20) not null,                                   --身份证号码
Phone varchar(20) not null,                                    --手机号码
Address nvarchar(100) not null,                                --家庭地址
NowAddress nvarchar(100),                                      --现居住地
Birthday datetime,                                             --公历生日
BirthTime int not null,                                        --时辰
LunarBirthday nvarchar(30),                                    --农历生日
BirthEight nvarchar(30),                                       --生辰八字
IsPublic tinyint not null default(0),                          --是否公开
MatchmakerId uniqueidentifier not null,                        --所属红娘
Status tinyint not null default(0),                            --状态：0：待审核，1：审核通过，2：审核不通过，3：关闭
UpdateStatusDate datetime,                                     --更新状态时间
NoPassReason nvarchar(500),                                    --审核不通过原因
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

exec proc_AddCellExplanation '主键','t_MarriageUser','UserId'
exec proc_AddCellExplanation '名称','t_MarriageUser','Name'
exec proc_AddCellExplanation '微信OpenId','t_MarriageUser','OpenId'
exec proc_AddCellExplanation '微信昵称','t_MarriageUser','NickName'
exec proc_AddCellExplanation '微信用户的性别，值为1时是男性，值为2时是女性，值为0时是未知','t_MarriageUser','Sex'
exec proc_AddCellExplanation '微信用户所在城市','t_MarriageUser','City'
exec proc_AddCellExplanation '微信用户所在省份','t_MarriageUser','Province'
exec proc_AddCellExplanation '微信用户头像','t_MarriageUser','HeadImgUrl'
exec proc_AddCellExplanation '身份证号码','t_MarriageUser','IdCard'
exec proc_AddCellExplanation '手机','t_MarriageUser','Phone'
exec proc_AddCellExplanation '家庭地址','t_MarriageUser','Address'
exec proc_AddCellExplanation '现居住地','t_MarriageUser','NowAddress'
exec proc_AddCellExplanation '公历生日','t_MarriageUser','Birthday'
exec proc_AddCellExplanation '时辰','t_MarriageUser','BirthTime'
exec proc_AddCellExplanation '农历生日','t_MarriageUser','LunarBirthday'
exec proc_AddCellExplanation '生辰八字','t_MarriageUser','BirthEight'
exec proc_AddCellExplanation '是否公开','t_MarriageUser','IsPublic'
exec proc_AddCellExplanation '所属红娘','t_MarriageUser','MatchmakerId'
exec proc_AddCellExplanation '状态：0：待审核，1：审核通过，2：审核不通过，3：关闭','t_MarriageUser','Status'
exec proc_AddCellExplanation '更新状态时间','t_MarriageUser','UpdateStatusDate'
exec proc_AddCellExplanation '最近登录时间','t_MarriageUser','LastLoginDate'
exec proc_AddCellExplanation '审核不通过原因','t_MarriageUser','NoPassReason'
exec proc_AddCellExplanation '登录Ip','t_MarriageUser','LoginIp'
exec proc_AddCellExplanation '备注','t_MarriageUser','Remark'
exec proc_AddCellExplanation '是否删除','t_MarriageUser','IsDelete'
exec proc_AddCellExplanation '创建人','t_MarriageUser','CreateUser'
exec proc_AddCellExplanation '创建时间','t_MarriageUser','CreateDate'
exec proc_AddCellExplanation '更新人','t_MarriageUser','UpdateUser'
exec proc_AddCellExplanation '更新时间','t_MarriageUser','UpdateDate'
exec proc_AddCellExplanation '行版本','t_MarriageUser','RowVersion'
go

if exists(select * from sysobjects where name='v_MarriageUser')
drop view v_MarriageUser
go

create view v_MarriageUser
as
select a.*,
case when a.Status=0 then '待审核' when a.Status=1 then '审核通过'
when a.Status=2 then '审核不通过' when a.Status=3 then '关闭' else '未知' end StatusName,
case when a.Sex=1 then '男' when a.Sex=2 then '女' else '未知' end SexName,
year(GETDATE())- YEAR(Birthday) as Age,b.Name as MatchmakerName,
SUBSTRING(LunarBirthday,4,1) as Shengxiao,
Case when a.IsPublic = 1 then '公开' else '未公开' end IsPublicName,
case when a.BirthTime=0 then '子 00:00-00:59'
when a.BirthTime=1 then '丑 01:00-01:59'
when a.BirthTime=2 then '丑 02:00-02:59'
when a.BirthTime=3 then '寅 03:00-03:59'
when a.BirthTime=4 then '寅 04:00-04:59'
when a.BirthTime=5 then '卯 05:00-05:59'
when a.BirthTime=6 then '卯 06:00-06:59'
when a.BirthTime=7 then '辰 07:00-07:59'
when a.BirthTime=8 then '辰 08:00-08:59'
when a.BirthTime=9 then '巳 09:00-09:59'
when a.BirthTime=10 then '巳 10:00-10:59'
when a.BirthTime=11 then '午 11:00-11:59'
when a.BirthTime=12 then '午 12:00-12:59'
when a.BirthTime=13 then '未 13:00-13:59'
when a.BirthTime=14 then '未 14:00-14:59'
when a.BirthTime=15 then '申 15:00-15:59'
when a.BirthTime=16 then '申 16:00-16:59'
when a.BirthTime=17 then '酉 17:00-17:59'
when a.BirthTime=18 then '酉 18:00-18:59'
when a.BirthTime=19 then '戌 19:00-19:59'
when a.BirthTime=20 then '戌 20:00-20:59'
when a.BirthTime=21 then '亥 21:00-21:59'
when a.BirthTime=22 then '亥 22:00-22:59'
when a.BirthTime=23 then '子 23:00-23:59'
else '未知'
end BirthTimeName
from t_MarriageUser a 
left join t_Matchmaker b on a.MatchmakerId=b.MatchmakerId
where a.IsDelete=0
go


if exists(select * from sysobjects where name='v_MarriageUser2')
drop view v_MarriageUser2
go

create view v_MarriageUser2
as
select a.UserId,a.Sex,
a.Name +'('+ a.Phone+')' UserName,
a.MatchmakerId,a.UpdateStatusDate
from t_MarriageUser a
where a.IsDelete=0 and a.Status=1
and not exists
(
select 1 from t_MarriageArrange b where (a.UserId = b.ManUserId or a.UserId=b.WomanUserId) 
and b.Status in (3,4,5)
)
go


--16、相亲安排信息表（t_ArrangeMarriage）
if exists(select * from sysobjects where name='t_MarriageArrange')
drop table t_MarriageArrange
go

create table t_MarriageArrange
(
MarriageArrangeId uniqueidentifier not null primary key,       --主键
ArrangeId int not null identity(10001,1),                      --编号
ManUserId uniqueidentifier not null,                           --男生ID
WomanUserId uniqueidentifier not null,                         --女生ID
ManMatchmakerId uniqueidentifier not null,                     --男生红娘
WomanMatchmakerId uniqueidentifier not null,                   --女生红娘
AppMatchmakerId uniqueidentifier not null,                     --平台红娘
MarriageDate datetime not null,                                --相亲时间
MarriageAddress nvarchar(100),                                 --相亲地点
MarriageContent nvarchar(500),                                 --相亲情况
SourceType tinyint not null,                                   --来源类型：1：相亲匹配，2：相亲广场，3：相亲牵线
Status tinyint not null default(0),                            --状态：0：待相亲，1：有意向，2：无意向，3：牵手成功，4：订婚，5：结婚，6：分手，7：取消
IsManAgree tinyint not null default(0),                        --男生是否同意
NoManAgreeRemark nvarchar(500),                                --男生不同意原因
IsWomanAgree tinyint not null default(0),                      --女生是否同意
NoWomanAgreeRemark nvarchar(500),                              --女生不同意原因
CancelReason nvarchar(500),                                    --取消原因
FeeDate datetime,                                              --费用日期
BookMarryDate datetime,                                        --订婚日期
MarryDate datetime,                                            --结婚日期
BreakUpDate datetime,                                          --分手日期
BreakUpReason nvarchar(500),                                   --分手原因
Amount money,                                                  --相亲总费用
Remark nvarchar(200),                                          --备注 
IsDelete tinyint not null default(0),                          --是否删除
CreateUser uniqueidentifier not null,                          --创建人
CreateDate datetime default(getdate()) not null,               --创建时间
UpdateUser uniqueidentifier,                                   --更新人
UpdateDate datetime,                                           --更新时间
RowVersion timestamp not null                                  --行版本
)
go

exec proc_AddCellExplanation '主键','t_MarriageArrange','MarriageArrangeId'
exec proc_AddCellExplanation '编号','t_MarriageArrange','ArrangeId'
exec proc_AddCellExplanation '男生ID','t_MarriageArrange','ManUserId'
exec proc_AddCellExplanation '女生ID','t_MarriageArrange','WomanUserId'
exec proc_AddCellExplanation '男生红娘','t_MarriageArrange','ManMatchmakerId'
exec proc_AddCellExplanation '女生红娘','t_MarriageArrange','WomanMatchmakerId'
exec proc_AddCellExplanation '平台红娘','t_MarriageArrange','AppMatchmakerId'
exec proc_AddCellExplanation '相亲时间','t_MarriageArrange','MarriageDate'
exec proc_AddCellExplanation '相亲地点','t_MarriageArrange','MarriageAddress'
exec proc_AddCellExplanation '相亲情况','t_MarriageArrange','MarriageContent'
exec proc_AddCellExplanation '来源类型：1：相亲匹配，2：相亲广场，3：相亲牵线','t_MarriageArrange','SourceType'
exec proc_AddCellExplanation '状态：0：待相亲，1：有意向，2：无意向，3：牵手成功，4：订婚，5：结婚，6：分手，7：取消','t_MarriageArrange','Status'
exec proc_AddCellExplanation '男生是否同意','t_MarriageArrange','IsManAgree'
exec proc_AddCellExplanation '男生不同意原因','t_MarriageArrange','NoManAgreeRemark'
exec proc_AddCellExplanation '女生是否同意','t_MarriageArrange','IsWomanAgree'
exec proc_AddCellExplanation '女生不同意原因','t_MarriageArrange','NoWomanAgreeRemark'
exec proc_AddCellExplanation '取消原因','t_MarriageArrange','CancelReason'
exec proc_AddCellExplanation '费用日期','t_MarriageArrange','FeeDate'
exec proc_AddCellExplanation '订婚日期','t_MarriageArrange','BookMarryDate'
exec proc_AddCellExplanation '结婚日期','t_MarriageArrange','MarryDate'
exec proc_AddCellExplanation '分手日期','t_MarriageArrange','BreakUpDate'
exec proc_AddCellExplanation '备注','t_MarriageArrange','Remark'
exec proc_AddCellExplanation '分手原因','t_MarriageArrange','BreakUpReason'
exec proc_AddCellExplanation '相亲总费用','t_MarriageArrange','Amount'
exec proc_AddCellExplanation '备注','t_MarriageArrange','Remark'
exec proc_AddCellExplanation '是否删除','t_MarriageArrange','IsDelete'
exec proc_AddCellExplanation '创建人','t_MarriageArrange','CreateUser'
exec proc_AddCellExplanation '创建时间','t_MarriageArrange','CreateDate'
exec proc_AddCellExplanation '更新人','t_MarriageArrange','UpdateUser'
exec proc_AddCellExplanation '更新时间','t_MarriageArrange','UpdateDate'
exec proc_AddCellExplanation '行版本','t_MarriageArrange','RowVersion'
go

if exists(select * from sysobjects where name='v_MarriageArrange')
drop view v_MarriageArrange
go

create view v_MarriageArrange
as
select a.*,
case when a.Status=0 then '待相亲' when a.Status=1 then '有意向' when a.Status=2 then '无意向'
when a.Status=3 then '牵手成功' when a.Status=4 then '订婚' when a.Status=5 then '结婚'
when a.Status=6 then '分手' when a.Status=7 then '取消'  else '未知' end StatusName,
case when a.SourceType=1 then '相亲匹配' when a.SourceType=2 then '相亲广场'
when a.SourceType=3 then '相亲牵线' else '未知' end SourceTypeName,
b.Name+'('+ b.Phone+')' AppMatchmakerName,
c.Name+'('+ c.Phone+')' ManMatchmakerName,
d.Name+'('+ d.Phone+')' WomanMatchmakerName,
e.Name+'('+ e.Phone+')' ManUserName,
f.Name+'('+ f.Phone+')' WomanUserName,
g.Name CreateUserName,
case when a.Status=2 and a.IsManAgree=1 then '同意' when a.Status=2 and a.IsManAgree=0 then '不同意' else '' end IsManAgreeName,
case when a.Status=2 and a.IsWomanAgree=1 then '同意' when a.Status=2 and a.IsWomanAgree=0 then '不同意' else '' end IsWomanAgreeName
from t_MarriageArrange a
left join t_Matchmaker b on a.AppMatchmakerId=b.MatchmakerId
left join t_Matchmaker c on a.ManMatchmakerId=c.MatchmakerId
left join t_Matchmaker d on a.WomanMatchmakerId=d.MatchmakerId
left join t_MarriageUser e on a.ManUserId=e.UserId
left join t_MarriageUser f on a.WomanUserId=f.UserId
left join t_AppUser g on a.CreateUser=g.CreateUser
where a.IsDelete=0
go

if exists(select * from sysobjects where name='v_MarriageArrange2')
drop view v_MarriageArrange2
go

create view v_MarriageArrange2
as
select a.*,
b.Name AppMatchmakerName,
e.Name ManUserName,
e.HeadImgUrl ManHeadImgUrl,
year(GETDATE())- YEAR(e.Birthday) as ManAge,
f.Name WomanUserName,
f.HeadImgUrl WomanHeadImgUrl,
year(GETDATE())- YEAR(f.Birthday) as WomanAge,
isNull(a.UpdateDate,a.CreateDate) UpdateDate2
from t_MarriageArrange a
left join t_Matchmaker b on a.AppMatchmakerId=b.MatchmakerId
left join t_MarriageUser e on a.ManUserId=e.UserId
left join t_MarriageUser f on a.WomanUserId=f.UserId
where a.IsDelete=0
go

if exists(select * from sysobjects where name='v_MarriageArrangeUser1')
drop view v_MarriageArrangeUser1
go

create view v_MarriageArrangeUser1
as
select a.UserId,
a.NickName,
a.HeadImgUrl,
a.Sex,
a.Remark,
year(GETDATE())- YEAR(Birthday) as Age,
isnull(b.UpdateDate,b.CreateDate) as UpdateDate,
b.ManUserId SelfUserId,
b.Status,
b.MarriageArrangeId
from t_MarriageUser a,t_MarriageArrange b 
where a.IsDelete=0 and a.Status=1 and a.UserId=b.WomanUserId
and b.IsDelete=0
go

if exists(select * from sysobjects where name='v_MarriageArrangeUser2')
drop view v_MarriageArrangeUser2
go

create view v_MarriageArrangeUser2
as
select a.UserId,
a.NickName,
a.HeadImgUrl,
a.Sex,
a.Remark,
year(GETDATE())- YEAR(Birthday) as Age,
isnull(b.UpdateDate,b.CreateDate) as UpdateDate,
b.WomanUserId SelfUserId,
b.Status,
b.MarriageArrangeId
from t_MarriageUser a,t_MarriageArrange b 
where a.IsDelete=0 and a.Status=1 and a.UserId=b.ManUserId
and b.IsDelete=0
go

--4、相亲广场信息表（t_MarriageSquare）
if exists(select * from sysobjects where name='t_MarriageSquare')
drop table t_MarriageSquare
go

create table t_MarriageSquare
(
MarriageSquareId uniqueidentifier not null primary key,        --主键
UserId uniqueidentifier not null,                              --相亲用户ID
OtherSideUserId uniqueidentifier not null,                     --对方用户Id
UpdateDate datetime not null,                                  --更新时间
RoseCount int not null,                                        --玫瑰数量
CreateDate datetime default(getdate()) not null,               --创建时间
RowVersion timestamp not null                                  --行版本
)
go

exec proc_AddCellExplanation '主键','t_MarriageSquare','MarriageSquareId'
exec proc_AddCellExplanation '相亲用户ID','t_MarriageSquare','UserId'
exec proc_AddCellExplanation '对方用户ID','t_MarriageSquare','OtherSideUserId'
exec proc_AddCellExplanation '玫瑰数量','t_MarriageSquare','RoseCount'
exec proc_AddCellExplanation '更新时间','t_MarriageSquare','UpdateDate'
exec proc_AddCellExplanation '创建时间','t_MarriageSquare','CreateDate'
exec proc_AddCellExplanation '行版本','t_MarriageSquare','RowVersion'
go

if exists(select * from sysobjects where name='v_MarriageSquare')
drop view v_MarriageSquare
go

create view v_MarriageSquare
as
select a.*,b.Name+'('+ b.Phone+')' UserName, 
b.Sex UserSex,
case when b.Sex=1 then '男' when b.Sex=2 then '女' else '未知' end UserSexName,
c.Name+'('+ c.Phone+')' OtherSideUserName,
c.Sex OtherSideUserSex,
case when c.Sex=1 then '男' when c.Sex=2 then '女' when c.Sex is null then null else '未知' end OtherSideUserSexName
from t_MarriageSquare a
inner join t_MarriageUser b on a.UserId=b.UserId and b.Status=1 and b.IsDelete=0
inner join t_MarriageUser c on a.OtherSideUserId=c.UserId and c.Status=1 and c.IsDelete=0
go

if exists(select * from sysobjects where name='v_MarriageSquare2')
drop view v_MarriageSquare2
go

create view v_MarriageSquare2
as
with ManUser as
(
select a.*,b.Name+'('+ b.Phone+')' ManUserName,b.MatchmakerId as ManMatchmakerId from t_MarriageSquare a,t_MarriageUser b
where a.UserId=b.UserId and b.Status=1 and IsDelete=0 and Sex=1
),
WomanUser as
(
select a.*,b.Name+'('+ b.Phone+')' WomanUserName,b.MatchmakerId as WomanMatchmakerId from t_MarriageSquare a,t_MarriageUser b
where a.UserId=b.UserId and b.Status=1 and IsDelete=0 and Sex=2
)
select a.MarriageSquareId,a.UserId ManUserId,a.ManUserName,a.CreateDate, a.ManMatchmakerId,
a.RoseCount,
a.UpdateDate,
b.CreateDate CreateDate2,
b.RoseCount RoseCount2,
b.UpdateDate UpdateDate2,
b.UserId WomanUserId,
b.WomanMatchmakerId,
b.WomanUserName,
c.ArrangeId,
case when c.MarriageArrangeId is null then '相亲安排' else '' end ArrangeLabel,
d.Name+'('+ d.Phone+')' ManMatchmakerName,
e.Name+'('+ e.Phone+')' WomanMatchmakerName,
case when a.UpdateDate>b.UpdateDate then a.UpdateDate else b.UpdateDate end UpdateDate3
from ManUser a
inner join WomanUser b on a.UserId=b.OtherSideUserId and a.OtherSideUserId=b.UserId
left join t_MarriageArrange c on a.UserId=c.ManUserId and a.OtherSideUserId=c.WomanUserId and c.IsDelete=0
left join t_Matchmaker d on a.ManMatchmakerId=d.MatchmakerId and d.IsDelete=0
left join t_Matchmaker e on b.WomanMatchmakerId=e.MatchmakerId and e.IsDelete=0
go


if exists(select * from sysobjects where name='v_MarriageSquareUser')
drop view v_MarriageSquareUser
go

create view v_MarriageSquareUser
as
select a.UserId,
a.NickName,
a.HeadImgUrl,
a.Sex,
a.Remark,
year(GETDATE())- YEAR(Birthday) as Age,
isnull(a.UpdateDate,CreateDate) as UpdateDate
from t_MarriageUser a
where a.IsDelete=0 and a.Status=1 and a.IsPublic=1
go

if exists(select * from sysobjects where name='v_MarriageSquareUser1')
drop view v_MarriageSquareUser1
go

create view v_MarriageSquareUser1
as
select a.UserId,
a.NickName,
a.HeadImgUrl,
a.Sex,
a.Remark,
year(GETDATE())- YEAR(Birthday) as Age,
b.RoseCount,
b.UpdateDate,
b.UserId SelfUserId
from  t_MarriageUser a,t_MarriageSquare b
where a.IsDelete=0 and a.Status=1
and a.UserId=b.OtherSideUserId
go

if exists(select * from sysobjects where name='v_MarriageSquareUser2')
drop view v_MarriageSquareUser2
go

create view v_MarriageSquareUser2
as
select a.UserId,
a.NickName,
a.HeadImgUrl,
a.Sex,
a.Remark,
year(GETDATE())- YEAR(Birthday) as Age,
b.RoseCount,
b.UpdateDate,
b.OtherSideUserId SelfUserId
from  t_MarriageUser a,t_MarriageSquare b
where a.IsDelete=0 and a.Status=1
and a.UserId=b.UserId
go

if exists(select * from sysobjects where name='v_MarriageSquareUser3')
drop view v_MarriageSquareUser3
go

create view v_MarriageSquareUser3
as
with ManUser as
(
select a.*
from t_MarriageSquare a,t_MarriageUser b
where a.UserId=b.UserId and b.Status=1 and IsDelete=0 and Sex=1
),
WomanUser as
(
select a.*,
b.NickName,
b.HeadImgUrl,
b.Sex,
b.Remark,
year(GETDATE())- YEAR(b.Birthday) as Age
from t_MarriageSquare a,t_MarriageUser b
where a.UserId=b.UserId and b.Status=1 and IsDelete=0 and Sex=2
)
select 
b.UserId,
b.NickName,
b.HeadImgUrl,
b.Sex,
b.Remark,
b.Age,
a.RoseCount,
b.RoseCount RoseCount2,
case when a.UpdateDate>b.UpdateDate then a.UpdateDate else b.UpdateDate end UpdateDate,
a.UserId SelfUserId
from ManUser a
inner join WomanUser b on a.UserId=b.OtherSideUserId and a.OtherSideUserId=b.UserId
go

if exists(select * from sysobjects where name='v_MarriageSquareUser4')
drop view v_MarriageSquareUser4
go

create view v_MarriageSquareUser4
as
with ManUser as
(
select a.*,
b.NickName,
b.HeadImgUrl,
b.Sex,
b.Remark,
year(GETDATE())- YEAR(b.Birthday) as Age
from t_MarriageSquare a,t_MarriageUser b
where a.UserId=b.UserId and b.Status=1 and IsDelete=0 and Sex=1
),
WomanUser as
(
select a.*
from t_MarriageSquare a,t_MarriageUser b
where a.UserId=b.UserId and b.Status=1 and IsDelete=0 and Sex=2
)
select 
a.UserId,
a.NickName,
a.HeadImgUrl,
a.Sex,
a.Remark,
a.Age,
b.RoseCount,
a.RoseCount RoseCount2,
case when a.UpdateDate>b.UpdateDate then a.UpdateDate else b.UpdateDate end UpdateDate,
b.UserId SelfUserId
from ManUser a
inner join WomanUser b on a.UserId=b.OtherSideUserId and a.OtherSideUserId=b.UserId
go

--6、红娘中介费明细表
if exists(select * from sysobjects where name='t_MatchmakerFeeDetail')
drop table t_MatchmakerFeeDetail
go

create table t_MatchmakerFeeDetail
(
DetailId uniqueidentifier not null primary key,                --主键
MatchmakerId uniqueidentifier not null,                        --红娘Id
MatchmakerType tinyint not null,                               --红娘类型，1：男方，2：女方，3：平台
MarriageArrangeId uniqueidentifier not null,                   --相亲安排Id
FeeDate datetime not null,                                     --费用日期
Amount money not null,                                         --金额
AppAmount money not null default(0),                           --平台中介费             
Remark nvarchar(200),                                          --备注 
IsDelete tinyint not null default(0),                          --是否删除
CreateUser uniqueidentifier not null,                          --创建人
CreateDate datetime default(getdate()) not null,               --创建时间
RowVersion timestamp not null                                  --行版本
)
go

exec proc_AddCellExplanation '主键','t_MatchmakerFeeDetail','DetailId'
exec proc_AddCellExplanation '红娘Id','t_MatchmakerFeeDetail','MatchmakerId'
exec proc_AddCellExplanation '红娘类型，1：男方，2：女方，3：平台','t_MatchmakerFeeDetail','MatchmakerType'
exec proc_AddCellExplanation '相亲安排Id','t_MatchmakerFeeDetail','MarriageArrangeId'
exec proc_AddCellExplanation '费用日期','t_MatchmakerFeeDetail','FeeDate'
exec proc_AddCellExplanation '金额','t_MatchmakerFeeDetail','Amount'
exec proc_AddCellExplanation '平台中介费','t_MatchmakerFeeDetail','AppAmount'
exec proc_AddCellExplanation '备注','t_MatchmakerFeeDetail','Remark'
exec proc_AddCellExplanation '是否删除','t_MatchmakerFeeDetail','IsDelete'
exec proc_AddCellExplanation '创建人','t_MatchmakerFeeDetail','CreateUser'
exec proc_AddCellExplanation '创建时间','t_MatchmakerFeeDetail','CreateDate'
exec proc_AddCellExplanation '行版本','t_MatchmakerFeeDetail','RowVersion'
go

if exists(select * from sysobjects where name='v_MatchmakerFeeDetail')
drop view v_MatchmakerFeeDetail
go

create view v_MatchmakerFeeDetail
as
select a.*,b.ArrangeId,
case when a.MatchmakerType=1 then '男方' when a.MatchmakerType=2 then '女方' when a.MatchmakerType=3 then '平台' else '未知' end MatchmakerTypeName,
c.Name ManName,
d.Name WomanName,
e.Name MatchmakerName
from t_MatchmakerFeeDetail a 
left join t_MarriageArrange b on a.MarriageArrangeId=b.MarriageArrangeId
left join t_MarriageUser c on b.ManUserId=c.UserId
left join t_MarriageUser d on b.WomanUserId=d.UserId
left join t_Matchmaker e on a.MatchmakerId=e.MatchmakerId
where a.IsDelete=0
go

--7、相亲用户生活照信息表
if exists(select * from sysobjects where name='t_MarriageUserPhoto')
drop table t_MarriageUserPhoto
go

create table t_MarriageUserPhoto
(
PhotoId uniqueidentifier not null primary key,                 --主键
MarriageUserId uniqueidentifier not null,                      --相亲用户ID
PhotoUrl varchar(500) not null,                                --照片地址
IsDelete tinyint not null default(0),                          --是否删除
CreateUser uniqueidentifier not null,                          --创建人
CreateDate datetime default(getdate()) not null,               --创建时间
)
go

exec proc_AddCellExplanation '主键','t_MarriageUserPhoto','PhotoId'
exec proc_AddCellExplanation '相亲用户ID','t_MarriageUserPhoto','MarriageUserId'
exec proc_AddCellExplanation '照片地址','t_MarriageUserPhoto','PhotoUrl'
exec proc_AddCellExplanation '是否删除','t_MarriageUserPhoto','IsDelete'
exec proc_AddCellExplanation '创建人','t_MarriageUserPhoto','CreateUser'
exec proc_AddCellExplanation '创建时间','t_MarriageUserPhoto','CreateDate'
go

if exists(select * from sysobjects where name='v_MarriageUserPhoto')
drop view v_MarriageUserPhoto
go

create view v_MarriageUserPhoto
as
select a.*
from t_MarriageUserPhoto a 
where a.IsDelete=0
go


--8、数据源（t_DataSource）
if exists(select * from sysobjects where name='t_DataSource')
drop table t_DataSource
go

create table t_DataSource
(
DataSourceId uniqueidentifier not null primary key,            --主键
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

exec proc_AddCellExplanation '主键','t_DataSource','DataSourceId'
exec proc_AddCellExplanation '名称','t_DataSource','Name'
exec proc_AddCellExplanation '备注','t_DataSource','Remark'
exec proc_AddCellExplanation '是否删除','t_DataSource','IsDelete'
exec proc_AddCellExplanation '创建人','t_DataSource','CreateUser'
exec proc_AddCellExplanation '创建时间','t_DataSource','CreateDate'
exec proc_AddCellExplanation '更新人','t_DataSource','UpdateUser'
exec proc_AddCellExplanation '更新时间','t_DataSource','UpdateDate'
exec proc_AddCellExplanation '行版本','t_DataSource','RowVersion'
go

if exists(select * from sysobjects where name='v_DataSource')
drop view v_DataSource
go

create view v_DataSource
as
select a.*
from t_DataSource a where IsDelete=0
go

--9、数据源选项信息表
if exists(select * from sysobjects where name='t_DataSourceItem')
drop table t_DataSourceItem
go

create table t_DataSourceItem
(
ItemId uniqueidentifier not null primary key,                  --主键
DataSourceId uniqueidentifier not null,                        --数据源Id
Name nvarchar(100) not null,                                   --名称
Value nvarchar(100) not null,                                  --值
)
go

exec proc_AddCellExplanation '主键','t_DataSourceItem','ItemId'
exec proc_AddCellExplanation '数据源ID','t_DataSourceItem','DataSourceId'
exec proc_AddCellExplanation '名称','t_DataSourceItem','Name'
exec proc_AddCellExplanation '值','t_DataSourceItem','Value'
go


if exists(select * from sysobjects where name='v_DataSourceItem')
drop view v_DataSourceItem
go

create view v_DataSourceItem
as
select a.*
from t_DataSourceItem a, t_DataSource b where a.DataSourceId=b.DataSourceId and  b.IsDelete=0
go


--10、条件类型信息表（t_ConditionType）
if exists(select * from sysobjects where name='t_ConditionType')
drop table t_ConditionType
go

create table t_ConditionType
(
ConditionTypeId uniqueidentifier not null primary key,         --主键
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

exec proc_AddCellExplanation '主键','t_ConditionType','ConditionTypeId'
exec proc_AddCellExplanation '名称','t_ConditionType','Name'
exec proc_AddCellExplanation '备注','t_ConditionType','Remark'
exec proc_AddCellExplanation '是否删除','t_ConditionType','IsDelete'
exec proc_AddCellExplanation '创建人','t_ConditionType','CreateUser'
exec proc_AddCellExplanation '创建时间','t_ConditionType','CreateDate'
exec proc_AddCellExplanation '更新人','t_ConditionType','UpdateUser'
exec proc_AddCellExplanation '更新时间','t_ConditionType','UpdateDate'
exec proc_AddCellExplanation '行版本','t_ConditionType','RowVersion'
go

--11、条件选项信息表
if exists(select * from sysobjects where name='t_ConditionItem')
drop table t_ConditionItem
go

create table t_ConditionItem
(
ItemId uniqueidentifier not null primary key,                  --主键
ConditionTypeId uniqueidentifier not null,                     --条件类型Id
Title nvarchar(100) not null,                                  --标题
Sex tinyint not null default(0),                               --性别，1：男生，2：女生
DataType varchar(10) not null,                                 --数据类型
DataSourceId uniqueidentifier,                                 --数据源Id
IsSingle tinyint not null default(0),                          --是否单选，1：是
IsInterval tinyint not null default(0),                        --是否区间，1：是，一般数据类型为数值
DisplayIndex int not null default(0),                          --显示顺序
)
go

exec proc_AddCellExplanation '主键','t_ConditionItem','ItemId'
exec proc_AddCellExplanation '条件类型Id','t_ConditionItem','ConditionTypeId'
exec proc_AddCellExplanation '标题','t_ConditionItem','Title'
exec proc_AddCellExplanation '性别，1：男生，2：女生','t_ConditionItem','Sex'
exec proc_AddCellExplanation '数据类型','t_ConditionItem','DataType'
exec proc_AddCellExplanation '数据源ID','t_ConditionItem','DataSourceId'
exec proc_AddCellExplanation '是否单选，1：是','t_ConditionItem','IsSingle'
exec proc_AddCellExplanation '是否区间，1：是，一般数据类型为数值','t_ConditionItem','IsInterval'
exec proc_AddCellExplanation '显示顺序','t_ConditionItem','DisplayIndex'
go

if exists(select * from sysobjects where name='v_ConditionType')
drop view v_ConditionType
go

create view v_ConditionType
as
with ConditionItemCount as
(
select ConditionTypeId,sum(case when Sex in (0,1) then 1 else 0 end) ManItemCount,
sum(case when Sex in (0,2) then 1 else 0 end) WomanItemCount
from t_ConditionItem
group by ConditionTypeId
)
select a.*,b.ManItemCount,b.WomanItemCount
from t_ConditionType a, ConditionItemCount b
where IsDelete=0 and a.ConditionTypeId=b.ConditionTypeId
go

--12、相亲用户条件类型信息表
if exists(select * from sysobjects where name='t_UserConditionType')
drop table t_UserConditionType
go

create table t_UserConditionType
(
UserConditionTypeId uniqueidentifier not null primary key,     --主键
UserId uniqueidentifier not null,                              --相亲用户Id
SelectType tinyint not null,                                   --选择类型，1：条件，2：择偶标准
ConditionTypeId uniqueidentifier not null,                     --条件类型Id
IsPublic tinyint not null default(0),                          --是否公开
CreateUser uniqueidentifier not null,                          --创建人
CreateDate datetime default(getdate()) not null,               --创建时间
UpdateUser uniqueidentifier,                                   --更新人
UpdateDate datetime,                                           --更新时间
RowVersion timestamp not null                                  --行版本
)
go

exec proc_AddCellExplanation '主键','t_UserConditionType','UserConditionTypeId'
exec proc_AddCellExplanation '相亲用户Id','t_UserConditionType','UserId'
exec proc_AddCellExplanation '选择类型，1：条件值，2：择偶标准值','t_UserConditionType','SelectType'
exec proc_AddCellExplanation '条件类型Id','t_UserConditionType','ConditionTypeId'
exec proc_AddCellExplanation '是否公开','t_UserConditionType','IsPublic'
exec proc_AddCellExplanation '创建人','t_UserConditionType','CreateUser'
exec proc_AddCellExplanation '创建时间','t_UserConditionType','CreateDate'
exec proc_AddCellExplanation '更新人','t_UserConditionType','UpdateUser'
exec proc_AddCellExplanation '更新时间','t_UserConditionType','UpdateDate'
exec proc_AddCellExplanation '行版本','t_UserConditionType','RowVersion'
go

--12、相亲用户条件选项值信息表
if exists(select * from sysobjects where name='t_UserConditionSelectValue')
drop table t_UserConditionSelectValue
go

create table t_UserConditionSelectValue
(
ItemId uniqueidentifier not null primary key,                  --主键
UserConditionTypeId uniqueidentifier not null,                 --相亲用户条件类型Id
ConditionItemId uniqueidentifier not null,                     --条件项Id
Value nvarchar(2000),                                          --值
)
go

exec proc_AddCellExplanation '主键','t_UserConditionSelectValue','ItemId'
exec proc_AddCellExplanation '相亲用户条件类型Id','t_UserConditionSelectValue','UserConditionTypeId'
exec proc_AddCellExplanation '条件项Id','t_UserConditionSelectValue','ConditionItemId'
exec proc_AddCellExplanation '值','t_UserConditionSelectValue','Value'
go

if exists(select * from sysobjects where name='v_UserConditionType')
drop view v_UserConditionType
go

create view v_UserConditionType
as
with UserConditionItemCount as
(
select UserConditionTypeId,
sum(case when b.Sex in (0,1) then 1 else 0 end) ManUserItemCount,
sum(case when b.Sex in (0,2) then 1 else 0 end) WomanUserItemCount
from t_UserConditionSelectValue a,t_ConditionItem b
where a.ConditionItemId= b.ItemId
group by UserConditionTypeId
),
ConditionItemCount as
(
select ConditionTypeId,sum(case when Sex in (0,1) then 1 else 0 end) ManItemCount,
sum(case when Sex in (0,2) then 1 else 0 end) WomanItemCount
from t_ConditionItem
group by ConditionTypeId
)
select a.UserConditionTypeId,
a.ConditionTypeId,
a.SelectType,
a.UserId,
a.IsPublic,
d.Name as ConditionTypeName,
b.ManUserItemCount,
b.WomanUserItemCount,
c.ManItemCount,
c.WomanItemCount,
case when c.ManItemCount=0 then 0 else convert(int,(b.ManUserItemCount*100)/c.ManItemCount) end ManPercentage, 
case when c.WomanItemCount=0 then 0 else convert(int,(b.WomanUserItemCount*100)/c.WomanItemCount) end WomanPercentage 
from t_UserConditionType a, UserConditionItemCount b,ConditionItemCount c,t_ConditionType d
where a.UserConditionTypeId=b.UserConditionTypeId
and a.ConditionTypeId= c.ConditionTypeId
and a.ConditionTypeId= d.ConditionTypeId
and d.IsDelete=0
go

if exists(select * from sysobjects where name='v_UserConditionType2')
drop view v_UserConditionType2
go

create view v_UserConditionType2
as
select a.*,b.Name ConditionTypeName,b.CreateDate CreateDate2 from t_UserConditionType a,t_ConditionType b
where a.ConditionTypeId=b.ConditionTypeId
and b.IsDelete=0
go

if exists(select * from sysobjects where name='v_UserConditionSelectValue')
drop view v_UserConditionSelectValue
go

create view v_UserConditionSelectValue
as
select a.*,b.UserId,b.SelectType,c.DataSourceId,c.DataType,c.DisplayIndex,c.IsInterval,c.IsSingle,c.Sex,c.Title from t_UserConditionSelectValue a, t_UserConditionType b,
t_ConditionItem c 
where a.UserConditionTypeId=b.UserConditionTypeId
and a.ConditionItemId= c.ItemId
go


--13、相亲配对计算信息表
if exists(select * from sysobjects where name='t_MarriageMakePair')
drop table t_MarriageMakePair
go

create table t_MarriageMakePair
(
MakePairId uniqueidentifier not null primary key,              --主键
UserId uniqueidentifier not null,                              --相亲用户ID
OtherSideUserId uniqueidentifier not null,                     --对方用户Id
PercentValue decimal(8,2) not null,                            --匹配度（%）
CreateDate datetime default(getdate()) not null,               --创建时间
RowVersion timestamp not null                                  --行版本
)
go

exec proc_AddCellExplanation '主键','t_MarriageMakePair','MakePairId'
exec proc_AddCellExplanation '对方用户Id','t_MarriageMakePair','OtherSideUserId'
exec proc_AddCellExplanation '相亲用户Id','t_MarriageMakePair','UserId'
exec proc_AddCellExplanation '匹配度（%）','t_MarriageMakePair','PercentValue'
exec proc_AddCellExplanation '更新时间','t_MarriageMakePair','CreateDate'
exec proc_AddCellExplanation '行版本','t_MarriageMakePair','RowVersion'
go

if exists(select * from sysobjects where name='v_MarriageMakePair')
drop view v_MarriageMakePair
go

create view v_MarriageMakePair
as
select a.MakePairId,a.UserId,
a.OtherSideUserId,convert(varchar(10),a.PercentValue)+'%' PercentValue,
a.CreateDate,
b.Name+'('+ b.Phone+')' UserName, 
b.Sex UserSex,
case when b.Sex=1 then '男' when b.Sex=2 then '女' else '未知' end UserSexName,
c.Name+'('+ c.Phone+')' OtherSideUserName,
c.Sex OtherSideUserSex,
case when c.Sex=1 then '男' when c.Sex=2 then '女' when c.Sex is null then null else '未知' end OtherSideUserSexName
from t_MarriageMakePair a
inner join t_MarriageUser b on a.UserId=b.UserId and b.Status=1 and b.IsDelete=0
inner join t_MarriageUser c on a.OtherSideUserId=c.UserId and c.Status=1 and c.IsDelete=0
go

if exists(select * from sysobjects where name='v_MarriageMakePair2')
drop view v_MarriageMakePair2
go

create view v_MarriageMakePair2
as
with ManUser as
(
select a.*,b.Name+'('+ b.Phone+')' ManUserName,b.MatchmakerId as ManMatchmakerId from t_MarriageMakePair a,t_MarriageUser b
where a.UserId=b.UserId and b.Status=1 and IsDelete=0 and Sex=1
),
WomanUser as
(
select a.*,b.Name+'('+ b.Phone+')' WomanUserName,b.MatchmakerId as WomanMatchmakerId from t_MarriageMakePair a,t_MarriageUser b
where a.UserId=b.UserId and b.Status=1 and IsDelete=0 and Sex=2
)
select a.MakePairId,a.UserId ManUserId,a.ManUserName,a.CreateDate, a.ManMatchmakerId,
convert(varchar(10),a.PercentValue)+'%' PercentValue,
b.CreateDate CreateDate2,
convert(varchar(10),b.PercentValue)+'%' PercentValue2,
b.UserId WomanUserId,
b.WomanMatchmakerId,
b.WomanUserName,
b.MakePairId MakePairId2,
c.ArrangeId,
case when c.MarriageArrangeId is null then '相亲安排' else '' end ArrangeLabel,
d.Name+'('+ d.Phone+')' ManMatchmakerName,
e.Name+'('+ e.Phone+')' WomanMatchmakerName,
case when a.CreateDate>b.CreateDate then a.CreateDate else b.CreateDate end CreateDate3,
convert(varchar(10), convert(decimal(10,2),(a.PercentValue+b.PercentValue)/2)) +'%' PercentValue3
from ManUser a
inner join WomanUser b on a.UserId=b.OtherSideUserId and a.OtherSideUserId=b.UserId
left join t_MarriageArrange c on a.UserId=c.ManUserId and a.OtherSideUserId=c.WomanUserId and c.IsDelete=0
left join t_Matchmaker d on a.ManMatchmakerId=d.MatchmakerId and d.IsDelete=0
left join t_Matchmaker e on b.WomanMatchmakerId=e.MatchmakerId and e.IsDelete=0
go

--14、相亲配对计算明细表
if exists(select * from sysobjects where name='t_MarriageMakePairDetail')
drop table t_MarriageMakePairDetail
go

create table t_MarriageMakePairDetail
(
DetailId uniqueidentifier not null primary key,                --主键
MakePairId uniqueidentifier not null,                          --配对Id
ConditionTypeId uniqueidentifier not null,                     --条件类型Id
ConditionTypeName nvarchar(50) not null,                       --条件类型
ConditionItemId uniqueidentifier not null,                     --条件选项Id
ConditionItemTitle nvarchar(100) not null,                     --条件标题
SelfSelectValue nvarchar(2000) not null,                       --自己选择值
OtherSideSelectValue nvarchar(2000) not null,                  --对方选择值
PercentValue decimal(8,2) not null                             --匹配度（%）
)
go

exec proc_AddCellExplanation '主键','t_MarriageMakePairDetail','DetailId'
exec proc_AddCellExplanation '配对明细Id','t_MarriageMakePairDetail','MakePairId'
exec proc_AddCellExplanation '条件类型Id','t_MarriageMakePairDetail','ConditionTypeId'
exec proc_AddCellExplanation '条件类型','t_MarriageMakePairDetail','ConditionTypeName'
exec proc_AddCellExplanation '条件选项Id','t_MarriageMakePairDetail','ConditionItemId'
exec proc_AddCellExplanation '条件标题','t_MarriageMakePairDetail','ConditionItemTitle'
exec proc_AddCellExplanation '自己选择值','t_MarriageMakePairDetail','SelfSelectValue'
exec proc_AddCellExplanation '对方选择值','t_MarriageMakePairDetail','OtherSideSelectValue'
exec proc_AddCellExplanation '匹配度（%）','t_MarriageMakePairDetail','PercentValue'
go

if exists(select * from sysobjects where name='v_MarriageMakePairDetail')
drop view v_MarriageMakePairDetail
go

create view v_MarriageMakePairDetail
as
select a.*,
convert(varchar(10),a.PercentValue)+'%' PercentValueName
from t_MarriageMakePairDetail a
go

--18、生辰八字匹配结果（t_BirthEightResult）
if exists(select * from sysobjects where name='t_BirthEightResult')
drop table t_BirthEightResult
go

create table t_BirthEightResult
(
ResultId uniqueidentifier not null primary key,                --主键
ManUserId uniqueidentifier not null,                           --男生ID
WomanUserId uniqueidentifier not null,                         --女生ID
Content nvarchar(max),                                         --匹配结果
Remark nvarchar(200),                                          --备注 
IsDelete tinyint not null default(0),                          --是否删除
CreateUser uniqueidentifier not null,                          --创建人
CreateDate datetime default(getdate()) not null,               --创建时间
UpdateUser uniqueidentifier,                                   --更新人
UpdateDate datetime,                                           --更新时间
RowVersion timestamp not null                                  --行版本
)
go

exec proc_AddCellExplanation '主键','t_BirthEightResult','ResultId'
exec proc_AddCellExplanation '男生ID','t_BirthEightResult','ManUserId'
exec proc_AddCellExplanation '女生ID','t_BirthEightResult','WomanUserId'
exec proc_AddCellExplanation '匹配结果','t_BirthEightResult','Content'
exec proc_AddCellExplanation '备注','t_BirthEightResult','Remark'
exec proc_AddCellExplanation '是否删除','t_BirthEightResult','IsDelete'
exec proc_AddCellExplanation '创建人','t_BirthEightResult','CreateUser'
exec proc_AddCellExplanation '创建时间','t_BirthEightResult','CreateDate'
exec proc_AddCellExplanation '更新人','t_BirthEightResult','UpdateUser'
exec proc_AddCellExplanation '更新时间','t_BirthEightResult','UpdateDate'
exec proc_AddCellExplanation '行版本','t_BirthEightResult','RowVersion'
go

if exists(select * from sysobjects where name='v_BirthEightResult')
drop view v_BirthEightResult
go

create view v_BirthEightResult
as
select a.*
from t_BirthEightResult a where IsDelete=0
go


--18、键值配置（t_DictionaryConfig）
if exists(select * from sysobjects where name='t_DictionaryConfig')
drop table t_DictionaryConfig
go

create table t_DictionaryConfig
(
DictionaryConfigId uniqueidentifier not null primary key,      --主键
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

--19、操作日志
if exists(select * from sysobjects where name='t_OperationLog')
drop table t_OperationLog 
go

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
OperationUser uniqueidentifier,                                 --操作人
CreateDate datetime not null default(getdate()),                --创建时间
RowVersion timestamp not null                                   --行版本
)
go

exec proc_AddCellExplanation '主键','t_OperationLog','LogId'
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

if exists(select * from sysobjects where name='v_OperationLog')
drop view v_OperationLog
go

create view v_OperationLog
as
select a.*,b.Name, '详细' LookDetail from t_OperationLog a
left join t_AppUser b
on a.OperationUser=b.UserId
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
 WHERE o.name = 't_Matchmaker'
 ORDER BY c.column_id
 go
