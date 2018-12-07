package com.xxd.ha.hystrix.vo.bulletin;

import lombok.Data;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Data
public class BulletinAnnouncementVo implements Serializable {


    private static final long serialVersionUID = -3398770274766339111L;

    private List<Item> items = new ArrayList<Item>();

    @Data
    public static class Item {

        private String text;

        private String textHref;

    }
}
