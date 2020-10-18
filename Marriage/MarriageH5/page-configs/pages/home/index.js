module.exports = {
    name: "index",
    type: "View",
    properties: getProperties()
}

function getProperties() {
    return [
        getCarousel(),
        getLinkMenus(),
        getTopActivities(),
        getTopClassRoom(),
        getTopEdgeApp(),
        getTopBook(),
        getTopProductCenter()
    ]
}

function getTopProductCenter() {
    return {
        name: 'topProductCenter',
        type: 'topDataView',
        className: 'divTopProductCenter',
        title: '产品中心',
        leftImageUrl: 'productcenter.png',
        rightImageLink: {
            text: 'MORE',
            url: '/library/index?tabPage=5',
            imageUrl: 'rightarrow.png'
        },
        listName: 'List',
        itemType: 'TopProductCenterItem',
        detailPageUrl: '/detail/library?tabPage=4',
        serviceDataSource: getTopProductCenterDataSource()
    }
}

function getTopBook() {
    return {
        name: 'topBook',
        type: 'topDataView',
        className: 'divEdgeApp',
        title: '入门手册',
        leftImageUrl: 'book.png',
        rightImageLink: {
            text: 'MORE',
            url: '/library/index?tabPage=4',
            imageUrl: 'rightarrow.png'
        },
        listName: 'List',
        itemType: 'TopEdgeAppItem',
        detailPageUrl: '/detail/library?tabPage=3',
        serviceDataSource: getTopBookDataSource()
    }
}

function getTopEdgeApp() {
    return {
        name: 'topEdgeApp',
        type: 'topDataView',
        className: 'divEdgeApp',
        title: '前沿应用',
        leftImageUrl: 'edgeapp.png',
        rightImageLink: {
            text: 'MORE',
            url: '/library/index?tabPage=2',
            imageUrl: 'rightarrow.png'
        },
        listName: 'List',
        itemType: 'TopEdgeAppItem',
        detailPageUrl: '/detail/library?tabPage=2',
        serviceDataSource: getTopEdgeAppDataSource()
    }
}

function getTopClassRoom() {
    return {
        name: 'topClassRoom',
        type: 'topDataView',
        className: 'divClassRoom',
        title: '云课堂',
        leftImageUrl: 'classroom.png',
        rightImageLink: {
            text: 'MORE',
            url: '/spectral/list?tabPage=2',
            imageUrl: 'rightarrow.png'
        },
        listName: 'List',
        itemType: 'TopClassRoomItem',
        detailPageUrl: '/detail/video?tabPage=2',
        serviceDataSource: getTopClassRoomDataSource()
    }
}

function getTopActivities() {
    return {
        name: 'topActivities',
        type: 'topDataView',
        className: 'divTopActivities',
        title: '推荐活动',
        leftImageUrl: 'activity.png',
        isSpectral: true,
        rightImageLink: {
            text: 'MORE',
            url: '/spectral/list?tabPage=0',
            imageUrl: 'rightarrow.png'
        },
        listName: 'List',
        itemType: 'TopActivityItem',
        detailPageUrl: '/detail/activity?tabPage=0',
        serviceDataSource: getTopActivitiesDataSource()
    }
}

function getLinkMenus() {
    return {
        name: "imgeLinkMenus",
        type: 'ImageLinkMenus',
        className: 'divImageLinkMenus',
        menus: [getLinkMenu('news', '新闻', '/news/index'),
        getLinkMenu('library', '图书馆', '/library/index'),
        getLinkMenu('spectral', '光谱学院', '/spectral/index'),
        getLinkMenu('chance', '机会', '/chance/index'),
        getLinkMenu('3aclub', '3A俱乐部', '/mine/index')]
    }
}

function getLinkMenu(name, text, url) {
    return { name, text, url, imageUrl: name + '.png' };
}

function getCarousel() {
    return {
        name: 'bannerList',
        type: 'Carousel',
        hrefName: 'LinkHref',
        listName: 'List',
        imageUrlName: 'BannerImg',
        isImageLink: true,
        className: 'divImage',
        autoplay: true,
        infinite: true,
        serviceDataSource: getBannerListDataSource()
    }
}

function getBannerListDataSource() {
    return {
        stateName: "getBannersList",
        serviceName: "HomeService",
        actionName: "getBannersList",
        payload: {
            formData: {
                Param: '{ BannerType: 10 }',
                Act: 'Banners_GetList'
            }
        }
    }
}

function getTopActivitiesDataSource() {
    return {
        stateName: "getTopActivities",
        serviceName: "HomeService",
        actionName: "getTopActivities",
        payload: {
            formData: {
                Param: '{"ActivityIndex":"StartDate","PageSize":2,"PageNumber":1}',
                Act: 'OpticalSchool_GetActivitiesList'
            }
        }
    }
}

function getTopClassRoomDataSource() {
    return {
        stateName: "getTopClassRoom",
        serviceName: "HomeService",
        actionName: "getTopClassRoom",
        payload: {
            formData: {
                Param: '{"PageSize":2,"PageNumber":1,"VideoIndex":"DateTimeDesc"}',
                Act: 'OpticalSchool_GetVideosList'
            }
        }
    }
}

function getTopEdgeAppDataSource() {
    return {
        stateName: "getTopEdgeApp",
        serviceName: "HomeService",
        actionName: "getTopEdgeApp",
        payload: {
            formData: {
                Param: '{"LibraryIndex":"DateTimeDesc","SetTopIndex":true,"PageSize":2,"PageNumber":"1","LibraryTypeUID":"4eb44483-c00c-4b9d-9229-843a7c065d53"}',
                Act: 'Library_GetList'
            }
        }
    }
}

function getTopBookDataSource() {
    return {
        stateName: "getTopBook",
        serviceName: "HomeService",
        actionName: "getTopBook",
        payload: {
            formData: {
                Param: '{"LibraryIndex":"ClicksDesc","SetTopIndex":true,"PageSize":2,"PageNumber":"1","LibraryTypeUID":"28b32ffc-8ad1-403a-878d-8891e4b46ed8"}',
                Act: 'Library_GetList'
            }
        }
    }
}

function getTopProductCenterDataSource() {
    return {
        stateName: "getTopProductCenter",
        serviceName: "HomeService",
        actionName: "getTopProductCenter",
        payload: {
            formData: {
                Param: '{"LibraryIndex":"ClicksDesc","SetTopIndex":true,"PageSize":2,"PageNumber":"1","LibraryTypeUID":"8da9bd02-dd48-458e-b798-85a0ae5ee684"}',
                Act: 'Library_GetList'
            }
        }
    }
}