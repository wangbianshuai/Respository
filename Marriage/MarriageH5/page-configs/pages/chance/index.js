module.exports = {
    name: "index",
    type: "View",
    properties: getProperties()
}

function getProperties() {
    return [
        getCarousel(),
        { name: 'whiteSpace30', type: 'WhiteSpace', className: 'whiteSpace30' },
        getTopPartners(),
        getTopJobs(),
        getTopTechnicals()
    ]
}

function getTopJobs() {
    return {
        name: 'topJobs',
        type: 'topDataView',
        className: 'divJobs',
        title: '人才招募',
        isChance: true,
        rightImageLink: {
            text: 'MORE',
            url: '/chance/list?tabPage=1',
            imageUrl: 'rightarrow.png'
        },
        listName: 'List',
        itemType: 'TopJobItem',
        detailPageUrl: '/chance/job?tabPage=1',
        serviceDataSource: getTopJobsDataSource()
    }
}

function getTopTechnicals() {
    return {
        name: 'topTechnicals',
        type: 'topDataView',
        className: 'divTechnicals',
        title: '技术转让',
        rightImageLink: {
            text: 'MORE',
            url: '/chance/list?tabPage=2',
            imageUrl: 'rightarrow.png'
        },
        itemType: 'TopTechnicalItem',
        dataSource: getTopTechnicalsDataSource()
    }
}

function getTopPartners() {
    return {
        name: 'topPartners',
        type: 'topDataView',
        className: 'divTopPartners',
        title: '合作伙伴',
        isChance: true,
        rightImageLink: {
            text: 'MORE',
            url: '/chance/list?tabPage=0',
            imageUrl: 'rightarrow.png'
        },
        listName: 'List',
        itemType: 'TopPartnerItem',
        detailPageUrl: '/chance/partner?tabPage=0',
        serviceDataSource: getTopPartnersDataSource()
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
        serviceName: "ChanceService",
        actionName: "getBannersList",
        payload: {
            formData: {
                Param: '{ BannerType: 30 }',
                Act: 'Banners_GetList'
            }
        }
    }
}

function getTopPartnersDataSource() {
    return {
        stateName: "getTopPartners",
        serviceName: "ChanceService",
        actionName: "getTopPartners",
        payload: {
            formData: {
                Param: '{"ApplicationIndex":"PointsDesc","PageSize":2,"PageNumber":1}',
                Act: 'Opportunity_GetCollaborationList'
            }
        }
    }
}

function getTopTechnicalsDataSource() {
    return [{ value: '1', text: '如果你有' }, { value: '2', text: '新技术、新工艺、新方法' }]
}

function getTopJobsDataSource() {
    return {
        stateName: "getTopJobs",
        serviceName: "ChanceService",
        actionName: "getTopJobs",
        payload: {
            formData: {
                Param: '{"JobReleaseIndex":"CreatedDateTimeDesc","JobType":10,"PageSize":2,"PageNumber":1}',
                Act: 'Opportunity_GetJobReleaseList'
            }
        }
    }
}