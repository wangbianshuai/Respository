using Marriage.Entity.Application.MarriageUserPhoto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Marriage.Application.Impl
{
    /// <summary>
    /// 相亲照片
    /// </summary>
    public class MarriageUserPhoto : BaseAction, IMarriageUserPhoto
    {
        public Domain.IMarriageUserPhoto _MarriageUserPhoto { get; set; }

        /// <summary>
        /// 获取用户生活照列表
        /// </summary>
        public GetUserPhotosResponse GetUserPhotos(GetUserPhotosRequest request)
        {
            string title = "获取用户生活照列表";
            string requestContent = Utility.Common.ToJson(request);
            GetUserPhotosResponse response = new GetUserPhotosResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、获取用户生活照列表
            int stepNo = 1;
            GetUserPhotos(stepNo, request, response);

            //2、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<GetUserPhotosResponse>(title, "GetUserPhotos", requestContent, response);
        }

        /// <summary>
        /// 保存用户照片
        /// </summary>
        public SaveUserPhotoResponse SaveUserPhoto(SaveUserPhotoRequest request)
        {
            string title = "保存用户照片";
            string requestContent = Utility.Common.ToJson(request);
            SaveUserPhotoResponse response = new SaveUserPhotoResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、保存用户照片
            int stepNo = 1;
            SaveUserPhoto(stepNo, request, response);

            //2、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<SaveUserPhotoResponse>(title, "SaveUserPhoto", requestContent, response);
        }

        /// <summary>
        /// 保存用户照片
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool SaveUserPhoto(int stepNo, SaveUserPhotoRequest request, SaveUserPhotoResponse response)
        {
            Func<bool> execStep = () =>
            {

                response.PhotoId = _MarriageUserPhoto.SaveUserPhoto(Guid.Parse(request.LoginUserId), request.PhotoUrl);
                return response.PhotoId != Guid.Empty;
            };

            return this.InsertEntityData(stepNo, "保存用户照片", "SaveUserPhoto", response, execStep);
        }

        /// <summary>
        /// 获取用户生活照列表
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private List<Entity.Domain.MarriageUserPhoto> GetUserPhotos(int stepNo, GetUserPhotosRequest request, GetUserPhotosResponse response)
        {
            Func<List<Entity.Domain.MarriageUserPhoto>> execStep = () =>
            {

                var list = _MarriageUserPhoto.GetUserPhotos(Guid.Parse(request.LoginUserId));

                response.DataList = (from a in list
                                     select new UserPhoto()
                                     {
                                         PhotoId = a.PhotoId,
                                         PhotoUrl = a.PhotoUrl
                                     }).ToList();

                return list;
            };

            return this.GetEntityDataList<Entity.Domain.MarriageUserPhoto>(stepNo, "获取用户生活照列表", "GetUserPhotos", response, execStep, false);
        }
    }
}
