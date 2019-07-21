package OpenDataAccess.Service;

import OpenDataAccess.Entity.EntityType;
import OpenDataAccess.Entity.IEntityData;
import OpenDataAccess.LambdaInterface.IAction2;
import OpenDataAccess.LambdaInterface.IFunction;
import OpenDataAccess.Utility.Common;
import com.sun.jndi.toolkit.url.UrlUtil;

import java.io.BufferedWriter;
import java.net.MalformedURLException;
import java.util.Date;
import java.util.List;
import java.util.Map;

public class Request {
    public String GetRequestId() {
        return _RequestId;
    }

    private String _RequestId = null;
    public String Content = null;
    public Map<String, List<IEntityData>> Entities = null;
    public EntityType Entity = null;
    public EntityType OperationLogEntity = null;
    public String MethodName = null;
    public String RequestType = null;
    public Map<String, String> QueryString = null;
    public String EntityName = null;
    public String OperationUser = null;
    public Date StartTime = null;
    public Date EndTime = null;
    public long ElapsedMilliseconds = 0;
    public boolean IsLog = false;
    public boolean IsPostQuery = false;
    public String IPAddress = null;
    public IAction2<BufferedWriter, String> CustomWriterLog = null;
    public Exception Excption = null;
    public String RootPath = null;
    public String PathAndQuery = null;
    public String RawUrl = null;
    public String PathInfo = null;

    public IFunction<Boolean> IsDirectRequest = null;

    public Request() {
        this._RequestId = Common.CreateGuid();
    }

    public String GetParameterValue(String name) throws MalformedURLException {
        String key = QueryString.keySet().stream().filter(f -> f.trim().toLowerCase().equals(name.trim().toLowerCase())).findFirst().get();
        if (Common.StringIsNullOrEmpty(key)) {
            String value = QueryString.get(key);
            if (value.equals("undefined")) return "";
            else return UrlUtil.decode(key);
        } else return "";
    }
}
