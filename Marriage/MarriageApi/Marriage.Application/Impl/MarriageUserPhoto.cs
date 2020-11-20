using Marriage.Entity.Application;
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

        public Domain.IMarriageUser _MarriageUser { get; set; }

        public Domain.IMatchmaker _Matchmaker { get; set; }

        public Domain.IMarriageArrange _MarriageArrange { get; set; }

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
        /// 删除用户照片
        /// </summary>
        public DeleteUserPhotosResponse DeleteUserPhotos(DeleteUserPhotosRequest request)
        {
            string title = "删除用户照片";
            string requestContent = Utility.Common.ToJson(request);
            DeleteUserPhotosResponse response = new DeleteUserPhotosResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、删除用户照片
            int stepNo = 1;
            DeleteUserPhotos(stepNo, request, response);

            //2、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<DeleteUserPhotosResponse>(title, "DeleteUserPhotos", requestContent, response);
        }

        /// <summary>
        /// 获取红娘下用户生活照列表
        /// </summary>
        public GetUserPhotoByMatchmakerResponse GetUserPhotoByMatchmaker(GetUserPhotoByMatchmakerRequest request)
        {
            string title = "获取红娘下用户生活照列表";
            string requestContent = Utility.Common.ToJson(request);
            GetUserPhotoByMatchmakerResponse response = new GetUserPhotoByMatchmakerResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、以主键获取红娘信息
            int stepNo = 1;
            this.GetMatchmakerById(stepNo, request.LoginUserId, response);

            //2、获取用户信息
            stepNo += 1;
            var user = GetUserInfoById(stepNo, request.UserId, response);

            //3、获取用户生活照列表
            stepNo += 1;
            GetUserPhotos(stepNo, user, request, response);

            //4、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<GetUserPhotoByMatchmakerResponse>(title, "GetUserPhotoByMatchmaker", requestContent, response);
        }


        /// <summary>
        /// 获取用户下用户生活照列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public GetUserPhotoByUserResponse GetUserPhotoByUser(GetUserPhotoByUserRequest request)
        {
            string title = "获取用户下用户生活照列表";
            string requestContent = Utility.Common.ToJson(request);
            GetUserPhotoByUserResponse response = new GetUserPhotoByUserResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //2、获取用户信息
            int stepNo = 1;
            Entity.Domain.MarriageUser user = null;
            
            if(request.Type== 1) user= GetMarriageSquareUserByUserId(stepNo, request.LoginUserId, request.UserId, response);
            else if(request.Type ==2) user= GetMarriageArrangeUserByUserId(stepNo, request.LoginUserId, request.UserId, response);

            //3、获取用户生活照列表
            stepNo += 1;
            GetUserPhotos(stepNo, user, request, response);

            //4、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<GetUserPhotoByUserResponse>(title, "GetUserPhotoByUser", requestContent, response);
        }


        /// <summary>
        /// 获取相亲安排下用户生活照列表
        /// </summary>
        public GetMarriageArrangeUserPhotoResponse GetMarriageArrangeUserPhoto(GetMarriageArrangeUserPhotoRequest request)
        {
            string title = "获取相亲安排下用户生活照列表";
            string requestContent = Utility.Common.ToJson(request);
            GetMarriageArrangeUserPhotoResponse response = new GetMarriageArrangeUserPhotoResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);


            //1、获取用户信息
            int stepNo = 1;
            this.GetMatchmakerById(stepNo, request.LoginUserId, response);

            //2、获取相亲安排
            stepNo += 1;
            var marriageArrange = GetMarriageArrange(stepNo, request.MarriageArrangeId, response);

            //3、获取相亲安排下用户生活照列表
            stepNo += 1;
            GetMarriageArrangeUserPhoto(stepNo, marriageArrange, request, response);

            //4、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<GetMarriageArrangeUserPhotoResponse>(title, "GetMarriageArrangeUserPhoto", requestContent, response);
        }

        /// <summary>
        /// 获取相亲安排下用户生活照列表
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="marriageArrange"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private List<Entity.Domain.MarriageUserPhoto> GetMarriageArrangeUserPhoto(int stepNo, Entity.Domain.MarriageArrange marriageArrange, GetMarriageArrangeUserPhotoRequest request, GetMarriageArrangeUserPhotoResponse response)
        {
            Func<List<Entity.Domain.MarriageUserPhoto>> execStep = () =>
            {
                var list = _MarriageUserPhoto.GetUserPhotos(request.UserId);

                response.DataList = (from a in list
                                     select new UserPhoto()
                                     {
                                         PhotoId = a.PhotoId,
                                         PhotoUrl = a.PhotoUrl
                                     }).ToList();

                return list;
            };

            return this.GetEntityDataList<Entity.Domain.MarriageUserPhoto>(stepNo, "获取相亲安排下用户生活照列表", "GetMarriageArrangeUserPhoto", response, execStep, false);
        }

        /// <summary>
        /// 以主键获取相亲安排
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="marriageArrangeId"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.MarriageArrange GetMarriageArrange(int stepNo, Guid marriageArrangeId, IResponse response)
        {
            Func<Entity.Domain.MarriageArrange> execStep = () =>
            {
                return _MarriageArrange.GetMarriageArrange(marriageArrangeId);
            };

            return this.GetEntityData<Entity.Domain.MarriageArrange>(stepNo, "以主键获取相亲安排", "GetMarriageArrange", response, execStep);
        }

        /// <summary>
        /// 获取用户生活照列表
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private List<Entity.Domain.MarriageUserPhoto> GetUserPhotos(int stepNo, Entity.Domain.MarriageUser user, GetUserPhotoByUserRequest request, GetUserPhotoByUserResponse response)
        {
            Func<List<Entity.Domain.MarriageUserPhoto>> execStep = () =>
            {
                var list = _MarriageUserPhoto.GetUserPhotos(user.UserId);

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

        /// <summary>
        /// 获取相亲广场用户信息
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.MarriageUser GetMarriageSquareUserByUserId(int stepNo, string loginUserId, Guid userId, IResponse response)
        {
            Func<Entity.Domain.MarriageUser> execStep = () =>
            {
                return _MarriageUser.GetMarriageSquareUserByUserId(Guid.Parse(loginUserId), userId);
            };

            return this.GetEntityData<Entity.Domain.MarriageUser>(stepNo, "获取相亲广场用户信息", "GetMarriageSquareUserByUserId", response, execStep);
        }

        /// <summary>
        /// 获取相亲安排用户信息
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="loginUserId"></param>
        /// <param name="userId"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.MarriageUser GetMarriageArrangeUserByUserId(int stepNo, string loginUserId, Guid userId, IResponse response)
        {
            Func<Entity.Domain.MarriageUser> execStep = () =>
            {
                return _MarriageUser.GetMarriageArrangeUserByUserId(Guid.Parse(loginUserId), userId);
            };

            return this.GetEntityData<Entity.Domain.MarriageUser>(stepNo, "获取相亲安排用户信息", "GetUserInfoById", response, execStep);
        }

        /// <summary>
        /// 以主键获取红娘信息
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="userId"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.Matchmaker GetMatchmakerById(int stepNo, string userId, IResponse response)
        {
            Func<Entity.Domain.Matchmaker> execStep = () =>
            {
                var entity = _Matchmaker.GetMatchmakerById(Guid.Parse(userId));
                if (entity == null || entity.Status != 1) return null;
                return entity;
            };

            return this.GetEntityData<Entity.Domain.Matchmaker>(stepNo, "以主键获取红娘信息", "GetMatchmakerInfoById", response, execStep, false);
        }

        /// <summary>
        /// 获取用户生活照列表
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private List<Entity.Domain.MarriageUserPhoto> GetUserPhotos(int stepNo, Entity.Domain.MarriageUser user, GetUserPhotoByMatchmakerRequest request, GetUserPhotoByMatchmakerResponse response)
        {
            Func<List<Entity.Domain.MarriageUserPhoto>> execStep = () =>
            {

                if (user.MatchmakerId != Guid.Parse(request.LoginUserId)) return null;

                var list = _MarriageUserPhoto.GetUserPhotos(user.UserId);

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

        /// <summary>
        /// 以主键获取用户信息
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.MarriageUser GetUserInfoById(int stepNo, Guid userId, IResponse response)
        {
            Func<Entity.Domain.MarriageUser> execStep = () =>
            {
                return _MarriageUser.GetUserInfoById(userId);
            };

            return this.GetEntityData<Entity.Domain.MarriageUser>(stepNo, "以主键获取用户信息", "GetUserInfoById", response, execStep);
        }

        /// <summary>
        /// 删除用户照片
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool DeleteUserPhotos(int stepNo, DeleteUserPhotosRequest request, DeleteUserPhotosResponse response)
        {
            Func<bool> execStep = () =>
            {

                return _MarriageUserPhoto.DeleteUserPhotos(Guid.Parse(request.LoginUserId), request.PhotoIds);
            };

            return this.InsertEntityData(stepNo, "删除用户照片", "DeleteUserPhotos", response, execStep);
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
