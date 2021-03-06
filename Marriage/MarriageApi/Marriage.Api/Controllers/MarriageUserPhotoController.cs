﻿using System.ComponentModel;
using System.Threading.Tasks;
using Marriage.Api.Code;
using Marriage.Entity.Application.MarriageUserPhoto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Marriage.Api.Controllers
{
    /// <summary>
    /// 相亲照片
    /// </summary>
    [Route("api/[controller]/[action]")]
    [Produces("application/json")]
    [ApiController]
    [TokenFilter]
    [ApiExceptionFilter]
    [Description("相亲照片")]
    public class MarriageUserPhotoController : ControllerBase
    {
        public Application.IMarriageUserPhoto _MarriageUserPhoto { get; set; }

        /// <summary>
        /// 获取用户生活照列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<GetUserPhotosResponse> GetUserPhotos(GetUserPhotosRequest request)
        {
            return await Task.Run(() => _MarriageUserPhoto.GetUserPhotos(request));
        }

        /// <summary>
        /// 保存用户照片
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<SaveUserPhotoResponse> SaveUserPhoto(SaveUserPhotoRequest request)
        {
            return await Task.Run(() => _MarriageUserPhoto.SaveUserPhoto(request));
        }

        /// <summary>
        /// 删除用户照片
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<DeleteUserPhotosResponse> DeleteUserPhotos(DeleteUserPhotosRequest request)
        {
            return await Task.Run(() => _MarriageUserPhoto.DeleteUserPhotos(request));
        }

        /// <summary>
        /// 获取红娘下用户生活照列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<GetUserPhotoByMatchmakerResponse> GetUserPhotoByMatchmaker(GetUserPhotoByMatchmakerRequest request)
        {
            return await Task.Run(() => _MarriageUserPhoto.GetUserPhotoByMatchmaker(request));
        }

        /// <summary>
        /// 获取用户下用户生活照列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<GetUserPhotoByUserResponse> GetUserPhotoByUser(GetUserPhotoByUserRequest request)
        {
            return await Task.Run(() => _MarriageUserPhoto.GetUserPhotoByUser(request));
        }

        /// <summary>
        /// 获取相亲安排下用户生活照列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerOpenApiTokenParameter]
        public async Task<GetMarriageArrangeUserPhotoResponse> GetMarriageArrangeUserPhoto(GetMarriageArrangeUserPhotoRequest request)
        {
            return await Task.Run(() => _MarriageUserPhoto.GetMarriageArrangeUserPhoto(request));
        }
    }
}
