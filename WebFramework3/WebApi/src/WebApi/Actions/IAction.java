package WebApi.Actions;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by Bianshuai on 2017/1/8.
 */
public interface IAction {

    // 请求行为实现
    String RequestAction(Request request);
}
