package com.xxd.ha.hystrix.vo.bulletin;

import lombok.Data;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Data
public class BulletinAdVo implements Serializable {

    private static final long serialVersionUID = 6809990338435060164L;

    private String code;

    private AdData data;

    @Data
    public static class AdData {

        private List<Item> items = new ArrayList<Item>();

        @Data
        public static class Item {

            private String text;

            private String backgroundColor;

            private String extendUrl;

            private String textHref;

            private String extendUrlFront;

            private String extendUrlBack;

            private String id;

        }

    }
}
