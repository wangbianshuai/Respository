﻿using System;
using System.IO;
using System.Text;
using System.Security.Cryptography;

using ComponentAce.Compression.Libs.zlib;

namespace Marriage.Utility
{
    public class TLSSigAPIv2
    {
        private readonly int sdkappid;
        private readonly string key;

        public TLSSigAPIv2(int sdkappid, string key)
        {
            this.sdkappid = sdkappid;
            this.key = key;
        }

        public byte[] GetUserBuf(string account, uint authId, uint expireTime, uint privilegeBitMap, uint accountType)
        {
            int length = 1 + 2 + account.Length + 20;
            int offset = 0;
            byte[] userBuf = new byte[length];

            userBuf[offset++] = 0;

            userBuf[offset++] = (byte)((account.Length & 0xFF00) >> 8);
            userBuf[offset++] = (byte)(account.Length & 0x00FF);

            byte[] accountByte = System.Text.Encoding.UTF8.GetBytes(account);
            accountByte.CopyTo(userBuf, offset);
            offset += account.Length;

            userBuf[offset++] = (byte)((sdkappid & 0xFF000000) >> 24);
            userBuf[offset++] = (byte)((sdkappid & 0x00FF0000) >> 16);
            userBuf[offset++] = (byte)((sdkappid & 0x0000FF00) >> 8);
            userBuf[offset++] = (byte)(sdkappid & 0x000000FF);

            userBuf[offset++] = (byte)((authId & 0xFF000000) >> 24);
            userBuf[offset++] = (byte)((authId & 0x00FF0000) >> 16);
            userBuf[offset++] = (byte)((authId & 0x0000FF00) >> 8);
            userBuf[offset++] = (byte)(authId & 0x000000FF);

            userBuf[offset++] = (byte)((expireTime & 0xFF000000) >> 24);
            userBuf[offset++] = (byte)((expireTime & 0x00FF0000) >> 16);
            userBuf[offset++] = (byte)((expireTime & 0x0000FF00) >> 8);
            userBuf[offset++] = (byte)(expireTime & 0x000000FF);

            userBuf[offset++] = (byte)((privilegeBitMap & 0xFF000000) >> 24);
            userBuf[offset++] = (byte)((privilegeBitMap & 0x00FF0000) >> 16);
            userBuf[offset++] = (byte)((privilegeBitMap & 0x0000FF00) >> 8);
            userBuf[offset++] = (byte)(privilegeBitMap & 0x000000FF);

            userBuf[offset++] = (byte)((accountType & 0xFF000000) >> 24);
            userBuf[offset++] = (byte)((accountType & 0x00FF0000) >> 16);
            userBuf[offset++] = (byte)((accountType & 0x0000FF00) >> 8);
            userBuf[offset++] = (byte)(accountType & 0x000000FF);

            return userBuf;
        }

        private static byte[] CompressBytes(byte[] sourceByte)
        {
            MemoryStream inputStream = new MemoryStream(sourceByte);
            Stream outStream = CompressStream(inputStream);
            byte[] outPutByteArray = new byte[outStream.Length];
            outStream.Position = 0;
            outStream.Read(outPutByteArray, 0, outPutByteArray.Length);
            return outPutByteArray;
        }

        private static Stream CompressStream(Stream sourceStream)
        {
            MemoryStream streamOut = new MemoryStream();
            ZOutputStream streamZOut = new ZOutputStream(streamOut, zlibConst.Z_DEFAULT_COMPRESSION);
            CopyStream(sourceStream, streamZOut);
            streamZOut.finish();
            return streamOut;
        }

        public static void CopyStream(System.IO.Stream input, System.IO.Stream output)
        {
            byte[] buffer = new byte[2000];
            int len;
            while ((len = input.Read(buffer, 0, 2000)) > 0)
            {
                output.Write(buffer, 0, len);
            }
            output.Flush();
        }

        private string HMACSHA256(string identifier, long currTime, int expire, string base64UserBuf, bool userBufEnabled)
        {
            string rawContentToBeSigned = "TLS.identifier:" + identifier + "\n"
                 + "TLS.sdkappid:" + sdkappid + "\n"
                 + "TLS.time:" + currTime + "\n"
                 + "TLS.expire:" + expire + "\n";
            if (true == userBufEnabled)
            {
                rawContentToBeSigned += "TLS.userbuf:" + base64UserBuf + "\n";
            }
            using (HMACSHA256 hmac = new HMACSHA256())
            {
                UTF8Encoding encoding = new UTF8Encoding();
                Byte[] textBytes = encoding.GetBytes(rawContentToBeSigned);
                Byte[] keyBytes = encoding.GetBytes(key);
                Byte[] hashBytes;
                using (HMACSHA256 hash = new HMACSHA256(keyBytes))
                    hashBytes = hash.ComputeHash(textBytes);
                return Convert.ToBase64String(hashBytes);
            }
        }

        private string GenSig(string identifier, int expire, byte[] userbuf, bool userBufEnabled)
        {
            DateTime epoch = new DateTime(1970, 1, 1); // unix 时间戳
            Int64 currTime = (Int64)(DateTime.UtcNow - epoch).TotalMilliseconds / 1000;

            string base64UserBuf;
            string jsonData;
            if (true == userBufEnabled)
            {
                base64UserBuf = Convert.ToBase64String(userbuf);
                string base64sig = HMACSHA256(identifier, currTime, expire, base64UserBuf, userBufEnabled);
                // 没有引入 json 库，所以这里手动进行组装，
                // 这里如果用户 identifier 中出现 json 元字符将会出错
                jsonData = String.Format("{{"
                   + "\"TLS.ver\":" + "\"2.0\","
                   + "\"TLS.identifier\":" + "\"{0}\","
                   + "\"TLS.sdkappid\":" + "{1},"
                   + "\"TLS.expire\":" + "{2},"
                   + "\"TLS.time\":" + "{3},"
                   + "\"TLS.sig\":" + "\"{4}\","
                   + "\"TLS.userbuf\":" + "\"{5}\""
                   + "}}", identifier, sdkappid, expire, currTime, base64sig, base64UserBuf);
            }
            else
            {
                // 没有引入 json 库，所以这里手动进行组装
                string base64sig = HMACSHA256(identifier, currTime, expire, "", false);
                jsonData = String.Format("{{"
                    + "\"TLS.ver\":" + "\"2.0\","
                    + "\"TLS.identifier\":" + "\"{0}\","
                    + "\"TLS.sdkappid\":" + "{1},"
                    + "\"TLS.expire\":" + "{2},"
                    + "\"TLS.time\":" + "{3},"
                    + "\"TLS.sig\":" + "\"{4}\""
                    + "}}", identifier, sdkappid, expire, currTime, base64sig);
            }

            byte[] buffer = Encoding.UTF8.GetBytes(jsonData);
            return Convert.ToBase64String(CompressBytes(buffer))
                .Replace('+', '*').Replace('/', '-').Replace('=', '_');
        }

        public string GenSig(string identifier, int expire = 180 * 86400)
        {
            return GenSig(identifier, expire, null, false);
        }

        public string GenSigWithUserBuf(string identifier, int expire, byte[] userBuf)
        {
            return GenSig(identifier, expire, userBuf, true);
        }
    }
}