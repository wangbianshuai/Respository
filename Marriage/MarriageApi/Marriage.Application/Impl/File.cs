using Marriage.Entity.Application;
using Marriage.Entity.Application.File;
using OpenDataAccessCore.Utility;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Application.Impl
{
    /// <summary>
    /// 文件
    /// </summary>
    public class File : BaseAction, IFile
    {
        public Domain.IFileRecord _FileRecord { get; set; }

        /// <summary>
        /// 上传文件
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public UploadFileResponse UploadFile(UploadFileRequest request)
        {
            string title = "上传文件";
            string requestContent = Utility.Common.ToJson(new { FileName = request.FileName, FileSize = request.FileSize, FileType = request.FileType });
            UploadFileResponse response = new UploadFileResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、验证数据
            int stepNo = 1;
            this.ValidateUploadFileData(stepNo, request, response);

            //2、保存上传文件
            stepNo += 1;
            Entity.Domain.FileRecord fileRecord= this.SaveUploadFile(stepNo, request, response);

            //3、插入文件记录
            stepNo += 1;
            this.InsertFileRecord(stepNo, fileRecord, request, response);

            //4、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<UploadFileResponse>(title, "UploadFile", requestContent, response);
        }

        /// <summary>
        /// 获取文件
        /// </summary>
        /// <param name="request"></param>
        /// <param name="httpHost"></param>
        /// <returns></returns>
        public GetFileResponse GetFile(GetFileRequest request, string httpHost)
        {
            string title = "获取文件";
            string requestContent = Utility.Common.ToJson(request);
            GetFileResponse response = new GetFileResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、验证数据
            int stepNo = 1;
            this.ValidateGetFileData(stepNo, request, response);

            //2、获取文件记录
            stepNo += 1;
            GetFileRecord(stepNo, httpHost, request, response);
   
            //3、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<GetFileResponse>(title, "UploadFile", requestContent, response);
        }

        /// <summary>
        /// 删除文件
        /// </summary>
        /// <param name="request"></param>
        /// <param name="webRootPath"></param>
        /// <returns></returns>
        public DeleteFileResponse DeleteFile(DeleteFileRequest request, string webRootPath)
        {
            string title = "删除文件";
            string requestContent = Utility.Common.ToJson(request);
            DeleteFileResponse response = new DeleteFileResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、验证数据
            int stepNo = 1;
            this.ValidateDeleteFileData(stepNo, request, response);

            //2、获取文件记录
            stepNo += 1;
            Entity.Domain.FileRecord fileRecord = GetFileRecord(stepNo, request.FileId, response);

            //3、删除文件记录
            stepNo += 1;
            DeleteFileRecord(stepNo, request, response);

            //4、删除文件
            stepNo += 1;
            DeleteFile(stepNo, webRootPath, fileRecord, response);

  
            //5、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<DeleteFileResponse>(title, "UploadFile", requestContent, response);
        }

        /// <summary>
        /// 删除文件记录
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool DeleteFileRecord(int stepNo, DeleteFileRequest request, DeleteFileResponse response)
        {
            Func<bool> execStep = () =>
            {
                return _FileRecord.DeleteFileRecord(request.FileId);
            };

            return this.UpdateEntityData(stepNo, "删除文件记录", "DeleteFileRecord", response, execStep);
        }

        /// <summary>
        /// 删除文件
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="webRootPath"></param>
        /// <param name="fileRecord"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool DeleteFile(int stepNo, string webRootPath, Entity.Domain.FileRecord fileRecord, DeleteFileResponse response)
        {
            Func<bool> execStep = () =>
            {
                string path = webRootPath + "\\" + fileRecord.FilePath.Replace("/", "\\");
                if(System.IO.File.Exists(path))
                {
                    System.IO.File.Delete(path);
                    return true;
                }
                return false;
            };

            return this.Exce(stepNo, "删除文件", "DeleteFile", response, execStep);
        }

        /// <summary>
        /// 获取文件记录
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="fileId"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.FileRecord GetFileRecord(int stepNo, Guid fileId, IResponse response)
        {
            Func<Entity.Domain.FileRecord> execStep = () =>
            {
                return _FileRecord.GetFileRecord(fileId);
            };

            return this.GetEntityData<Entity.Domain.FileRecord>(stepNo, "获取文件记录", "GetFileRecord", response, execStep);
        }

        /// <summary>
        /// 验证数据
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool ValidateDeleteFileData(int stepNo, DeleteFileRequest request, DeleteFileResponse response)
        {
            Func<bool> execStep = () =>
            {
                if (request.FileId == Guid.Empty)
                {
                    this.SetValidateMessageRepsonse("文件ID不能为空", response);
                }

                return response.Ack.IsSuccess;
            };

            return this.ExecValidate(stepNo, "验证数据", "ValidateDeleteFileData", response, execStep);
        }


        /// <summary>
        /// 获取文件记录
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.FileRecord GetFileRecord(int stepNo, string httpHost, GetFileRequest request, GetFileResponse response)
        {
            Func<Entity.Domain.FileRecord> execStep = () =>
            {
                var fileRecord = _FileRecord.GetFileRecord(request.FileId);

                if (fileRecord != null)
                {
                    response.FileId = fileRecord.FileId;
                    response.FileName = fileRecord.FileName;
                    response.FileSize = Common.GetFileSize(Convert.ToInt32(fileRecord.FileSize));
                    response.FileType = fileRecord.FileType == "file" ? string.Empty : fileRecord.FileType;
                    response.FileUrl = string.Format("{0}{1}", httpHost, fileRecord.FilePath);
                }
                return fileRecord;
            };

            return this.GetEntityData<Entity.Domain.FileRecord>(stepNo, "获取文件记录", "GetFileRecord", response, execStep);
        }

        /// <summary>
        /// 验证数据
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool ValidateGetFileData(int stepNo, GetFileRequest request, GetFileResponse response)
        {
            Func<bool> execStep = () =>
            {
                if (request.FileId == Guid.Empty)
                {
                    this.SetValidateMessageRepsonse("文件ID不能为空", response);
                }

                return response.Ack.IsSuccess;
            };

            return this.ExecValidate(stepNo, "验证数据", "ValidateGetFileData", response, execStep);
        }

        /// <summary>
        /// 插入文件记录
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="fileRecord"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool InsertFileRecord(int stepNo, Entity.Domain.FileRecord fileRecord, UploadFileRequest request, UploadFileResponse response)
        {
            Func<bool> execStep = () =>
            {
                fileRecord.AppId = request.AppId;
                fileRecord.IpAddress = request.IpAddress;
                response.Ack.IsSuccess= _FileRecord.InsertFileRecord(fileRecord);

                if (response.Ack.IsSuccess)
                {
                    response.FileId = fileRecord.FileId;
                    response.FileName = fileRecord.FileName;
                    response.FileSize = Common.GetFileSize(Convert.ToInt32(fileRecord.FileSize));
                    response.FileType = fileRecord.FileType == "file" ? string.Empty : fileRecord.FileType;
                    response.FileUrl = string.Format("{0}{1}", request.HttpHost, fileRecord.FilePath);
                }

                return response.Ack.IsSuccess;
            };

            return this.InsertEntityData(stepNo, "插入文件记录", "InsertFileRecord", response, execStep);
        }

        /// <summary>
        /// 保存上传文件
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.FileRecord SaveUploadFile(int stepNo, UploadFileRequest request, UploadFileResponse response)
        {
            Func<Entity.Domain.FileRecord> execStep = () =>
            {
                Entity.Domain.FileRecord fileRecord = new Entity.Domain.FileRecord();

                string filePath = string.Format("resouces/{0}/{1}/", DateTime.Now.ToString("yyyyMM"), request.FileType);
                string fileName = DateTime.Now.ToString("ddHHmmssfff") + new Random().Next(100000, 999999) + request.FileExt;

                string path = request.WebRootPath + "\\" + filePath.Replace("/", "\\");
                filePath += fileName;

                if (!System.IO.Directory.Exists(path)) System.IO.Directory.CreateDirectory(path);

                path += fileName;

                Common.SaveFile(request.Stream, path);

                fileRecord.FileId = Guid.NewGuid();
                fileRecord.FileName = request.FileName;
                fileRecord.FilePath = filePath;
                fileRecord.FileSize = request.FileSize;
                fileRecord.FileType = request.FileType;

                return fileRecord;
            };

            Func<Entity.Domain.FileRecord, bool> setSucceed = (data) =>
            {
                return data != null;
            };

            return this.InsertEntityData<Entity.Domain.FileRecord>(stepNo, "保存上传文件", "SaveUploadFile", response, execStep, setSucceed);
        }

        /// <summary>
        /// 验证数据
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool ValidateUploadFileData(int stepNo, UploadFileRequest request, UploadFileResponse response)
        {
            Func<bool> execStep = () =>
            {
                if (request.Stream == null)
                {
                    this.SetValidateMessageRepsonse("未有上传文件", response);
                }

                return response.Ack.IsSuccess;
            };

            return this.ExecValidate(stepNo, "验证数据", "ValidateUploadFileData", response, execStep);
        }

    }
}
