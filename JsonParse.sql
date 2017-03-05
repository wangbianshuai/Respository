--创建获取JSON字符串中字符串函数
drop function fn_GetStringList
go

create function fn_GetStringList
(
@JsonString nvarchar(max)
)
returns @Dict table
(
NumId int,
StringKey nvarchar(200),
StringValue nvarchar(max),
JsonString  nvarchar(max)
)
as
begin
declare @startIndex int = 0,
 @curChar nvarchar(1)='',
 @preChar nvarchar(1) ='',
 @blStart bit=0,
 @blStart2 bit=0,
 @output nvarchar(max)='',
 @output2 nvarchar(max) =null,
 @keyValue nvarchar(50)='',
 @NumId int =0

while @startIndex<LEN(@JsonString)
begin
  set @startIndex+=1
  set @curChar=SUBSTRING(@JsonString,@startIndex,1)
 
  if @blStart=0
  begin 
     if @preChar <> '\' and @curChar= '"' 
	 begin
	 set @blStart=1
	 set @blStart2=1
	 end
  end

  if @blStart=1
  begin
     if @blStart2=1
	 begin
	 set @output2=''
	 end
  end
  else 
  begin
     set @output += @curChar
  end

  if @output2 is not null
  begin
     set @output2 += @curChar
  end

  if @blStart=1 and @blStart2=0 and @preChar <> '\' and @curChar = '"'
  begin
    set @blStart=0
	set @keyValue = 'str$KeyValue'+  ltrim(rtrim(str(@StartIndex))) + '$'
    set @output += @keyValue
	set @NumId+=1
	insert into @Dict values(@NumId, @keyValue,SUBSTRING(@output2,2,len(@output2)-2),'')

	set @output2=null
  end

  set @preChar=@curChar
  set @blStart2=0
end

   insert into @Dict values(0, '','' ,@output)
return 
end
go

drop function fn_CheckStartEnd
go

create function fn_CheckStartEnd
(
@JsonString nvarchar(max)
)
returns bit
as
begin
declare @blSuccess bit =1
   
   if SUBSTRING(@JsonString,1,1) <> '{' and SUBSTRING(@JsonString,1,1) <> '['
   and SUBSTRING(@JsonString,len(@JsonString)-1,1) <> '}' and SUBSTRING(@JsonString,len(@JsonString),1) <> ']'
   begin
      set @blSuccess=0 
   end

   if @blSuccess=1 and SUBSTRING(@JsonString,1,1) = '{' and SUBSTRING(@JsonString,len(@JsonString),1) <> '}'
   begin
      set @blSuccess=0 
   end 

   if @blSuccess=1 and SUBSTRING(@JsonString,1,1) = '[' and SUBSTRING(@JsonString,len(@JsonString),1) <> ']'
   begin
      set @blSuccess=0
   end

return @blSuccess
end
go

drop function fn_Split
go

create function fn_Split
(
@Str nvarchar(max),
@Split nvarchar(10)
)
returns @StringArray Table
(
NumId int,
StringValue nvarchar(max)
)
as
begin
  declare @StartIndex int=1,
  @EndIndex int=0,
  @StringValue nvarchar(max),
  @NumId int = 0

  while @StartIndex>0
  begin
      set @EndIndex= CHARINDEX(@Split, @Str,@StartIndex)
	  if @EndIndex>0
	  begin
	    set @StringValue= SUBSTRING(@Str,@StartIndex,@EndIndex-@StartIndex)
		set @NumId+=1
		insert into @StringArray values (@NumId, @StringValue)
		set @StartIndex= @EndIndex+1
	  end
	  else
	  begin
	   set @StringValue= SUBSTRING(@Str,@StartIndex,len(@Str)-@StartIndex+1)
	   set @NumId+=1
	   insert into @StringArray values (@NumId,@StringValue)
	   set @StartIndex=0
	  end
  end

  return 
end
go

drop function fn_GetObjectJsonStringList
go

create function fn_GetObjectJsonStringList
(
@JsonString nvarchar(max),
@blArray bit
)
returns @Dict table
(
NumId int,
StringKey nvarchar(200),
StringValue nvarchar(max),
JsonString  nvarchar(max)
)
as
begin
declare @startIndex int = 0,
 @curChar nvarchar(1)='',
 @output nvarchar(max)='',
 @output2 nvarchar(max) =null,
 @keyValue nvarchar(50)='',
 @preKey nvarchar(10)='',
 @sc char(1)='',
 @ec char(1)='',
 @NumId int=0

if @blArray=1
begin 
   set @sc='['
   set @ec=']' 
   set @preKey='arr'
end
else 
begin
  set @sc='{'
  set @ec='}' 
  set @preKey='obj'
end

while @startIndex<LEN(@JsonString)
begin
  set @startIndex+=1
  set @curChar=SUBSTRING(@JsonString,@startIndex,1)

  if @curChar = @sc
  begin 
     if @output2 is not null
	 begin
	    set @output += @output2
	 end

	 set @output2=''
  end

  if @output2 is not null
  begin
     set @output2+= @curChar
  end
  else
  begin
     set @output += @curChar
  end

  if @output2 is not null and @curChar=@ec
  begin
	set @keyValue = @preKey+ '$KeyValue'+  ltrim(rtrim(str(@StartIndex))) + '$'
	set @output+= @keyValue
    set @NumId+=1
	insert into @Dict values(@NumId, @keyValue,SUBSTRING(@output2,2,len(@output2)-2),'')

	set @output2=null
  end

end

  if @output<>@JsonString 
  begin
    insert into @Dict values (0, '','' ,@output)
  end

  return
end
go


drop type t_DictionaryTable
go

create type t_DictionaryTable as Table
(
NumId int,
DataType int,
StringKey nvarchar(200),
StringValue nvarchar(max),
JsonString  nvarchar(max)
)
go

drop function fn_JsonToDictionaryList
go

create function fn_JsonToDictionaryList
(
@JsonString nvarchar(max),
@DataId nvarchar(50)
)
returns @KeyValue table
(
DataId nvarchar(50),
DictionaryId int,
Name nvarchar(200),
Value nvarchar(1000)
)
as
begin
declare @Dict t_DictionaryTable

if @JsonString is null or ltrim(rtrim(@JsonString))='' or ltrim(rtrim(@JsonString))='{}' or ltrim(rtrim(@JsonString))='[]'
or dbo.fn_CheckStartEnd(@JsonString)=0
begin
return
end

declare @iCount int=0,
@iCount2 int=0,
@blFirst bit=1,
@i int=0,
@RowCount int=0,
@StringValue nvarchar(max),
@StringValue2 nvarchar(max)

--字符串属性名或值
insert into @Dict
select NumId, 1,StringKey,StringValue,JsonString from dbo.fn_GetStringList(@JsonString)

select @JsonString =JsonString from @Dict
where DataType=1 and StringKey='' and JsonString<> ''

--Object字符串
while @blFirst=1 or @iCount<@iCount2
begin
   set @blFirst=0
   set @iCount=@iCount2

   insert into @Dict
   select NumId,2,StringKey,StringValue,JsonString from dbo.fn_GetObjectJsonStringList(@JsonString,0)

   select @JsonString =JsonString from @Dict
   where DataType=2 and StringKey='' and JsonString<> ''

   select @iCount2=count(*) from @Dict where DataType=2 and NumId>0
end

--数组字符串
set @blFirst=1
set @iCount=0
set @iCount2=0

while @blFirst=1 or @iCount<@iCount2
begin
   set @blFirst=0
   set @iCount=@iCount2

   insert into @Dict
   select NumId,3,StringKey,StringValue,JsonString from dbo.fn_GetObjectJsonStringList(@JsonString,1)

   select @JsonString =JsonString from @Dict
   where DataType=3 and StringKey='' and JsonString<> ''

   select @iCount2=count(*) from @Dict where DataType=3 and NumId>0
end

--Object中的数组
set @i=1
select @RowCount=count(*) from @Dict where DataType=2
while @i<=@RowCount
begin
   select @StringValue=StringValue from @Dict where DataType=2 and NumId=@i

   --遍历，获取数组
     set @blFirst=1
     set @iCount=0
     set @iCount2=0

     while @blFirst=1 or @iCount<@iCount2
     begin
       set @blFirst=0
       set @iCount=@iCount2

       insert into @Dict
       select NumId,3,StringKey,StringValue,JsonString from dbo.fn_GetObjectJsonStringList(@StringValue,1)

       select @StringValue2 =JsonString from @Dict
       where DataType=3 and StringKey='' and JsonString<> ''

       select @iCount2=count(*) from @Dict where DataType=3
     end
   
   --更新
   if @StringValue<>@StringValue2
   begin
     update @Dict set StringValue=@StringValue where DataType=2 and NumId=@i
   end

   set @i+=1
end

insert into @KeyValue select * from dbo.fn_GetArrayList(@JsonString,@DataId,@Dict)

return
end
go

drop function fn_GetArrayList
go

create function fn_GetArrayList
(
@JsonString nvarchar(max),
@DataId nvarchar(50),
@Dict t_DictionaryTable readonly
)
returns @KeyValue table
(
DataId nvarchar(50),
DictionaryId int,
Name nvarchar(200),
Value nvarchar(1000)
)
as
begin
declare @StringArray Table
(
NumId int,
StringValue nvarchar(max)
)
declare @i int=0,
@RowCount int=0,
@StringValue nvarchar(max)=''

insert into @StringArray select * from dbo.fn_Split(@JsonString,',')
select @RowCount=count(*) from @StringArray

while @i< @RowCount
begin
   set @i+=1
   select @StringValue =StringValue from @StringArray where NumId=@i 
   insert into @KeyValue select * from fn_GetObjectValue(@StringValue,@DataId,@Dict)
end

return
end
go

drop function fn_GetObjectValue
go

create function fn_GetObjectValue
(
@Value nvarchar(max),
@DataId nvarchar(50),
@Dict t_DictionaryTable readonly
)
returns @KeyValue table
(
DataId nvarchar(50),
DictionaryId int,
Name nvarchar(200),
Value nvarchar(1000)
)
as 
begin
   declare @value2 nvarchar(max) =null,
   @NumId int=0

      if (SUBSTRING(@Value,1,3)='arr')
	  begin
	     select @value2 = StringValue from @Dict where DataType=3 and StringKey=@Value
	  end

	  if @value2 is not null
	  begin
	      insert into @KeyValue select * from fn_GetArrayList(@value2,@DataId,@Dict)
	  end
	  else 
	  begin
	     if (SUBSTRING(@Value,1,3)='obj')
		 begin
		    select @value2 = StringValue,@NumId=NumId from @Dict where DataType=2 and StringKey=@Value
		 end

		 if @value2 is not null
		 begin
		   insert into @KeyValue select * from fn_GetDictionary(@value2,@DataId,@NumId,@Dict)
		 end
	  end

return
end
go

drop function fn_GetDictionary
go

create function fn_GetDictionary
(
@JsonString nvarchar(max),
@DataId nvarchar(50),
@DictionaryId int,
@Dict t_DictionaryTable readonly
)
returns @KeyValue table
(
DataId nvarchar(50),
DictionaryId int,
Name nvarchar(200),
Value nvarchar(1000)
)
as 
begin
declare @StringArray Table
(
NumId int,
StringValue nvarchar(max)
)
declare @i int=0,
@RowCount int=0,
@StringValue nvarchar(max),
@StartIndex int =0,
@Key nvarchar(200),
@Value nvarchar(1000),
@KeyVlaue nvarchar(200),
@Value2 nvarchar(1000)

insert into @StringArray select * from dbo.fn_Split(@JsonString,',')
select @RowCount=count(*) from @StringArray

while @i< @RowCount
begin
   set @i+=1
   select @StringValue =StringValue from @StringArray where NumId=@i

   set @StartIndex= CHARINDEX(':',@StringValue,1)

   if @StartIndex>0
   begin
     set @Key= SUBSTRING(@StringValue,1,@StartIndex-1)
	 set @Value= SUBSTRING(@StringValue,@StartIndex+1,len(@StringValue)-@StartIndex)

	 select @KeyVlaue=StringValue from @Dict where DataType=1 and StringKey=@Key
	 if @KeyVlaue is null 
	 begin
	   set @KeyVlaue= @Key
	 end

	 select @Value2=StringValue from @Dict where DataType=1 and StringKey=@Value
	 if @Value2 is null 
	 begin
	   set @Value2= @Value
	 end
	 
	 --获取值
	 insert into @KeyValue values(@DataId,@DictionaryId,@KeyVlaue,@Value2)
   end
  
end

return 
end
go