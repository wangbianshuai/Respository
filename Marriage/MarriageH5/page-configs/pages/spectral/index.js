module.exports = {
    name: "index",
    type: "View",
    properties: getProperties()
}

function getProperties() {
    return [
        getCarousel(),
        { name: 'whiteSpace30', type: 'WhiteSpace', className: 'whiteSpace30' },
        getTopActivities(),
        getTopExperiences(),
        getTopVideos(),
        getTools(),
    ]
}

function getTools() {
    return {
        name: 'tools',
        type: 'topDataView',
        className: 'divEdgeApp',
        title: '工具',
        rightImageLink: {
            text: 'MORE',
            url: '/spectral/list?tabPage=3',
            imageUrl: 'rightarrow.png'
        },
        itemType: 'TopToolsItem',
        detailPageUrl: '/spectral/tools?tabPage=3',
        dataSource: getToolsDataSource()
    }
}

function getToolsDataSource() {
    return [
        addToolsItem('Optical Formula', 'Are you still looking for optical formulas? Here we provide a series of formulas to make your research easy. Just put in the desired data, we will generate the solution for you.'),
        addToolsItem('Grating Tools', 'This spectrometer calculator is very convenient for the users to get spectroscopy parameters after selecting different spectrometers, detectors and gratings.'),
    ]
}

function addToolsItem(title, content) {
    return { title, content }
}


function getTopExperiences() {
    return {
        name: 'topExperiences',
        type: 'topDataView',
        className: 'divEdgeApp',
        title: '科研经验',
        isSpectral: true,
        rightImageLink: {
            text: 'MORE',
            url: '/spectral/list?tabPage=1',
            imageUrl: 'rightarrow.png'
        },
        listName: 'List',
        itemType: 'TopEdgeAppItem',
        detailPageUrl: '/detail/experience?tabPage=1',
        serviceDataSource: getTopExperiencesDataSource()
    }
}

function getTopVideos() {
    return {
        name: 'topVideos',
        type: 'topDataView',
        className: 'divClassRoom',
        title: '云课堂',
        rightImageLink: {
            text: 'MORE',
            url: '/spectral/list?tabPage=2',
            imageUrl: 'rightarrow.png'
        },
        listName: 'List',
        itemType: 'TopClassRoomItem',
        detailPageUrl: '/detail/video?tabPage=2',
        serviceDataSource: getTopVideosDataSource()
    }
}

function getTopActivities() {
    return {
        name: 'topActivities',
        type: 'topDataView',
        className: 'divTopActivities',
        title: '活动',
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
        serviceName: "SpectralService",
        actionName: "getBannersList",
        payload: {
            formData: {
                Param: '{ BannerType: 30 }',
                Act: 'Banners_GetList'
            }
        }
    }
}

function getTopActivitiesDataSource() {
    return {
        stateName: "getTopActivities",
        serviceName: "SpectralService",
        actionName: "getTopActivities",
        payload: {
            formData: {
                Param: '{"ActivityIndex":"StartDate","PageSize":2,"PageNumber":1}',
                Act: 'OpticalSchool_GetActivitiesList'
            }
        }
    }
}

function getTopVideosDataSource() {
    return {
        stateName: "getTopVideos",
        serviceName: "SpectralService",
        actionName: "getTopVideos",
        payload: {
            formData: {
                Param: '{"SetTopIndex":true,"PageSize":2,"PageNumber":1}',
                Act: 'OpticalSchool_GetVideosList'
            }
        }
    }
}

function getTopExperiencesDataSource() {
    return {
        stateName: "getTopExperiences",
        serviceName: "SpectralService",
        actionName: "getTopExperiences",
        payload: {
            formData: {
                Param: '{"SetTopIndex":true,"PageSize":2,"PageNumber":1}',
                Act: 'OpticalSchool_GetResearchExList'
            }
        }
    }
}