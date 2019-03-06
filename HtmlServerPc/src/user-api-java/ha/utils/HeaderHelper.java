package com.xxd.ha.utils;

import com.xxd.common.remoting.http.parameters.Headers;

/**
 * header工具类.
 */
public class HeaderHelper {


    public static Headers createDefaultHeaders() {
        return Headers.createHeaders()
                .addHeader("clientId", "XXD_FRONT_END")
                .addHeader("clientTime", System.currentTimeMillis())
                .addHeader("s", "111");
    }


    public static Headers createHeadersWithDefaultUserAgent() {

        return createDefaultHeaders()
                .addHeader("User-Agent", "XXD_FRONT_END");

    }


}
