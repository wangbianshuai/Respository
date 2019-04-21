using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Serialization;

namespace Cert509Test
{
    /// <summary>
    /// 通用类
    /// </summary>
    public class Common
    {
        /// <summary>
        /// 对象序例化成XML
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static string XmlSerialize<T>(T obj)
        {
            XmlSerializerNamespaces nameSpace = new XmlSerializerNamespaces();
            nameSpace.Add("", "");
            MemoryStream ms = new MemoryStream();
            XmlSerializer xmlSerializer = new XmlSerializer(typeof(T));
            using (XmlWriter xmlWriter = XmlWriter.Create(ms))
            {
                xmlSerializer.Serialize(xmlWriter, obj, nameSpace);
            }
            return Encoding.UTF8.GetString(ms.ToArray());
        }

        /// <summary>  
        /// XML反序列化成对象  
        /// </summary>  
        public static T XmlDeserialize<T>(string xml)
        {
            XmlSerializer xmlSerializer = new XmlSerializer(typeof(T));
            using (TextReader textReader = new StringReader(xml))
            {
                return (T)xmlSerializer.Deserialize(textReader);
            }
        }

        /// <summary>
        /// 字符串转化成Base64编码
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public static string ToBase64String(string str)
        {
            return Convert.ToBase64String(Encoding.UTF8.GetBytes(str));
        }

        /// <summary>
        /// Base64编码转化成字符串
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public static string FromBase64String(string str)
        {
            return Encoding.UTF8.GetString(Convert.FromBase64String(str));
        }

        /// <summary>
        /// SHA1withRSA签名
        /// </summary>
        /// <param name="content"></param>
        /// <param name="xmlString"></param>
        /// <returns></returns>
        public static string SHA1Sign(string content, string xmlString)
        {
            byte[] bytes = Encoding.UTF8.GetBytes(content);
            RSACryptoServiceProvider rsa = new RSACryptoServiceProvider();
            rsa.FromXmlString(xmlString);
            using (var sh = SHA1.Create())
            {
                return BytesToHexString(rsa.SignData(bytes, sh));
            }
        }

        /// <summary>
        /// 取得证书私钥
        /// </summary>
        /// <param name="pfxPath">证书的绝对路径</param>
        /// <param name="password">访问证书的密码</param>
        /// <returns></returns>
        public static string GetPrivateKey(string pfxPath, string password)
        {
            X509Certificate2 pfx = new X509Certificate2(pfxPath, password, X509KeyStorageFlags.Exportable);
            return pfx.PrivateKey.ToXmlString(true);
        }

        /// <summary>
        /// 取得证书的公钥
        /// </summary>
        /// <param name="cerPath">证书的绝对路径</param>
        /// <returns></returns>
        public static string GetPublicKey(string cerPath)
        {
            X509Certificate2 cer = new X509Certificate2(cerPath);
            return cer.PublicKey.Key.ToXmlString(false);
        }

        /// <summary>
        /// 验签
        /// </summary>
        /// <param name="content"></param>
        /// <param name="sign"></param>
        /// <param name="xmlString"></param>
        /// <returns></returns>
        public static bool SHA1VerifySign(string content, string sign, string xmlString)
        {
            RSACryptoServiceProvider rsa = new RSACryptoServiceProvider();
            rsa.FromXmlString(xmlString);
            SHA1CryptoServiceProvider sha1 = new SHA1CryptoServiceProvider();
            return rsa.VerifyData(Convert.FromBase64String(content), sha1, HexStringToBytes(sign));
        }

        /// <summary>
        /// 字节数组转化成十六进制字符串
        /// </summary>
        /// <param name="bytes"></param>
        /// <returns></returns>
        public static string BytesToHexString(byte[] bytes)
        {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < bytes.Length; i++)
            {
                sb.Append(bytes[i].ToString("X2"));
            }
            return sb.ToString(); ;
        }

        /// <summary>
        /// 十六进制字符串转换成字节数组
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public static byte[] HexStringToBytes(string str)
        {
            str = str.Replace("\n", "");
            str = str.Replace("\r", "");
            str = str.Trim();
            byte[] bytes = new byte[str.Length / 2];
            for (int i = 0; i < str.Length; i += 2) bytes[i / 2] = Convert.ToByte(str.Substring(i, 2), 16);
            return bytes;
        }

        /// <summary>
        /// 创建RSA公钥私钥
        /// </summary>
        public static void CreateRSAKey()
        {
            //设置[公钥私钥]文件路径
            string privateKeyPath = @"d:\\PrivateKey.xml";
            string publicKeyPath = @"d:\\PublicKey.xml";
            //创建RSA对象
            RSACryptoServiceProvider rsa = new RSACryptoServiceProvider();
            //生成RSA[公钥私钥]
            string privateKey = rsa.ToXmlString(true);
            string publicKey = rsa.ToXmlString(false);
            //将密钥写入指定路径
            File.WriteAllText(privateKeyPath, privateKey);//文件内包含公钥和私钥
            File.WriteAllText(publicKeyPath, publicKey);//文件内只包含公钥
        }
        /// <summary>
        /// 使用RSA实现加密
        /// </summary>
        /// <param name="data">加密数据</param>
        /// <returns></returns>
        public static string RSAEncrypt(string data)
        {
            //C#默认只能使用[公钥]进行加密(想使用[公钥解密]可使用第三方组件BouncyCastle来实现)
            string publicKeyPath = @"d:\\PublicKey.xml";
            string publicKey = File.ReadAllText(publicKeyPath);
            //创建RSA对象并载入[公钥]
            RSACryptoServiceProvider rsaPublic = new RSACryptoServiceProvider();
            rsaPublic.FromXmlString(publicKey);
            //对数据进行加密
            byte[] publicValue = rsaPublic.Encrypt(Encoding.UTF8.GetBytes(data), false);
            string publicStr = Convert.ToBase64String(publicValue);//使用Base64将byte转换为string
            return publicStr;
        }
        /// <summary>
        /// 使用RSA实现解密
        /// </summary>
        /// <param name="data">解密数据</param>
        /// <returns></returns>
        public static string RSADecrypt(string data)
        {
            //C#默认只能使用[私钥]进行解密(想使用[私钥加密]可使用第三方组件BouncyCastle来实现)
            string privateKeyPath = @"d:\\PrivateKey.xml";
            string privateKey = File.ReadAllText(privateKeyPath);
            //创建RSA对象并载入[私钥]
            RSACryptoServiceProvider rsaPrivate = new RSACryptoServiceProvider();
            rsaPrivate.FromXmlString(privateKey);
            //对数据进行解密
            byte[] privateValue = rsaPrivate.Decrypt(Convert.FromBase64String(data), false);//使用Base64将string转换为byte
            string privateStr = Encoding.UTF8.GetString(privateValue);
            return privateStr;
        }
    }
}
