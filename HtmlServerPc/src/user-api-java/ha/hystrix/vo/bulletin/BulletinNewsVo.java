package com.xxd.ha.hystrix.vo.bulletin;

import lombok.Data;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Data
public class BulletinNewsVo implements Serializable {

    private static final long serialVersionUID = 8980385546212446427L;

    private List<Item> items = new ArrayList<Item>();

    @Data
    public static class Item {

        private String text;

        private String textHref;
    }

}
