using System;
using System.IO;
using System.Text;
using System.Security.Cryptography;
using System.Web;

namespace EntityDataService.Utility
{
    public class DESEncryptor
    {
        #region 私有成员
        /**/
        /// <summary> 
        /// 输入字符串 
        /// </summary> 
        private string inputString = null;
        /**/
        /// <summary> 
        /// 输出字符串 
        /// </summary> 
        private string outString = null;
        /**/
        /// <summary> 
        /// 输入文件路径 
        /// </summary> 
        private string inputFilePath = null;
        /**/
        /// <summary> 
        /// 输出文件路径 
        /// </summary> 
        private string outFilePath = null;
        /**/
        /// <summary> 
        /// 加密密钥 
        /// </summary> 
        private string encryptKey = null;
        /**/
        /// <summary> 
        /// 解密密钥 
        /// </summary> 
        private string decryptKey = null;
        /**/
        /// <summary> 
        /// 提示信息 
        /// </summary> 
        private string noteMessage = null;
        #endregion

        #region 公共属性
        /**/
        /// <summary> 
        /// 输入字符串 
        /// </summary> 
        public string InputString
        {
            get { return inputString; }
            set { inputString = value; }
        }
        /**/
        /// <summary> 
        /// 输出字符串 
        /// </summary> 
        public string OutString
        {
            get { return outString; }
            set { outString = value; }
        }
        /**/
        /// <summary> 
        /// 输入文件路径 
        /// </summary> 
        public string InputFilePath
        {
            get { return inputFilePath; }
            set { inputFilePath = value; }
        }
        /**/
        /// <summary> 
        /// 输出文件路径 
        /// </summary> 


        public string OutFilePath
        {
            get { return outFilePath; }
            set { outFilePath = value; }
        }
        /**/
        /// <summary> 
        /// 加密密钥 
        /// </summary> 
        public string EncryptKey
        {
            get { return encryptKey; }
            set { encryptKey = value; }
        }
        /**/
        /// <summary> 
        /// 解密密钥 
        /// </summary> 
        public string DecryptKey
        {
            get { return decryptKey; }
            set { decryptKey = value; }
        }
        /**/
        /// <summary> 
        /// 错误信息 
        /// </summary> 
        public string NoteMessage
        {
            get { return noteMessage; }
            set { noteMessage = value; }
        }
        #endregion

        #region 构造函数
        public DESEncryptor()
        {
            // 
            // TODO: 在此处添加构造函数逻辑 
            // 
        }
        #endregion

        #region DES加密字符串
        /**/
        /// <summary> 
        /// 加密字符串 
        /// 注意:密钥必须为８位 
        /// </summary> 
        /// <param name="strText">字符串</param> 
        /// <param name="encryptKey">密钥</param> 
        public void DesEncrypt()
        {
            byte[] byKey = null;
            //byte[] IV = { 0x12, 0x34, 0x56, 0x78, 0x90, 0xAB, 0xCD, 0xEF };
            byte[] IV = Encoding.UTF8.GetBytes(this.EncryptKey.Substring(0, 8));
            try
            {
                byKey = System.Text.Encoding.UTF8.GetBytes(this.EncryptKey.Substring(0, 8));
                DESCryptoServiceProvider des = new DESCryptoServiceProvider();
                byte[] inputByteArray = Encoding.UTF8.GetBytes(this.InputString);
                MemoryStream ms = new MemoryStream();
                CryptoStream cs = new CryptoStream(ms, des.CreateEncryptor(byKey, IV), CryptoStreamMode.Write);
                cs.Write(inputByteArray, 0, inputByteArray.Length);
                cs.FlushFinalBlock();
                this.outString = Convert.ToBase64String(ms.ToArray());
            }
            catch (System.Exception error)
            {
                this.noteMessage = error.Message;
            }
        }
        #endregion

        #region DES解密字符串
        /**/
        /// <summary> 
        /// 解密字符串 
        /// </summary> 
        /// <param name="this.inputString">加了密的字符串</param> 
        /// <param name="decryptKey">密钥</param>  
        public void DesDecrypt()
        {
            byte[] byKey = null;
            //byte[] IV = { 0x12, 0x34, 0x56, 0x78, 0x90, 0xAB, 0xCD, 0xEF };
            byte[] IV = Encoding.UTF8.GetBytes(this.DecryptKey.Substring(0, 8));
            byte[] inputByteArray = new Byte[this.inputString.Length];
            try
            {
                byKey = System.Text.Encoding.UTF8.GetBytes(this.DecryptKey.Substring(0, 8));
                DESCryptoServiceProvider des = new DESCryptoServiceProvider();
                inputByteArray = Convert.FromBase64String(this.InputString);
                MemoryStream ms = new MemoryStream();
                CryptoStream cs = new CryptoStream(ms, des.CreateDecryptor(byKey, IV), CryptoStreamMode.Write);
                cs.Write(inputByteArray, 0, inputByteArray.Length);
                cs.FlushFinalBlock();
                System.Text.Encoding encoding = new System.Text.UTF8Encoding();
                this.outString = encoding.GetString(ms.ToArray());
            }
            catch (System.Exception error)
            {
                this.noteMessage = error.Message;
            }
        }
        #endregion

        #region DES加密文件
        /**/
        /// <summary> 
        /// DES加密文件 
        /// </summary> 
        /// <param name="this.inputFilePath">源文件路径</param> 
        /// <param name="this.outFilePath">输出文件路径</param> 
        /// <param name="encryptKey">密钥</param> 
        public void FileDesEncrypt()
        {
            byte[] byKey = null;
            //byte[] IV = { 0x12, 0x34, 0x56, 0x78, 0x90, 0xAB, 0xCD, 0xEF };
            byte[] IV = Encoding.UTF8.GetBytes(this.EncryptKey.Substring(0, 8));
            try
            {
                byKey = System.Text.Encoding.UTF8.GetBytes(this.EncryptKey.Substring(0, 8));
                FileStream fin = new FileStream(this.inputFilePath, FileMode.Open, FileAccess.Read);
                FileStream fout = new FileStream(this.outFilePath, FileMode.OpenOrCreate, FileAccess.Write);
                fout.SetLength(0);
                //Create variables to help with read and write. 
                byte[] bin = new byte[100]; //This is intermediate storage for the encryption. 
                long rdlen = 0; //This is the total number of bytes written. 
                long totlen = fin.Length; //This is the total length of the input file. 
                int len; //This is the number of bytes to be written at a time. 
                DES des = new DESCryptoServiceProvider();
                CryptoStream encStream = new CryptoStream(fout, des.CreateEncryptor(byKey, IV), CryptoStreamMode.Write);



                //Read from the input file, then encrypt and write to the output file. 
                while (rdlen < totlen)
                {
                    len = fin.Read(bin, 0, 100);
                    encStream.Write(bin, 0, len);
                    rdlen = rdlen + len;
                }



                encStream.Close();
                fout.Close();
                fin.Close();


            }
            catch (System.Exception error)
            {
                this.noteMessage = error.Message.ToString();




            }
        }
        #endregion

        #region DES解密文件
        /**/
        /// <summary> 
        /// 解密文件 
        /// </summary> 
        /// <param name="this.inputFilePath">加密了的文件路径</param> 
        /// <param name="this.outFilePath">输出文件路径</param> 
        /// <param name="decryptKey">密钥</param> 
        public void FileDesDecrypt()
        {
            byte[] byKey = null;
            //byte[] IV = { 0x12, 0x34, 0x56, 0x78, 0x90, 0xAB, 0xCD, 0xEF };
            byte[] IV = Encoding.UTF8.GetBytes(this.DecryptKey.Substring(0, 8));
            try
            {
                byKey = System.Text.Encoding.UTF8.GetBytes(this.DecryptKey.Substring(0, 8));
                FileStream fin = new FileStream(this.inputFilePath, FileMode.Open, FileAccess.Read);
                FileStream fout = new FileStream(this.outFilePath, FileMode.OpenOrCreate, FileAccess.Write);
                fout.SetLength(0);
                //Create variables to help with read and write. 
                byte[] bin = new byte[100]; //This is intermediate storage for the encryption. 
                long rdlen = 0; //This is the total number of bytes written.  
                long totlen = fin.Length; //This is the total length of the input file. 
                int len; //This is the number of bytes to be written at a time. 
                DES des = new DESCryptoServiceProvider();
                CryptoStream encStream = new CryptoStream(fout, des.CreateDecryptor(byKey, IV), CryptoStreamMode.Write);


                //Read from the input file, then encrypt and write to the output file. 
                while (rdlen < totlen)
                {
                    len = fin.Read(bin, 0, 100);
                    encStream.Write(bin, 0, len);
                    rdlen = rdlen + len;
                }

                encStream.Close();
                fout.Close();
                fin.Close();
            }
            catch (System.Exception error)
            {
                this.noteMessage = error.Message.ToString();
            }
        }
        #endregion

        #region MD5
        /**/
        /// <summary> 
        /// MD5 Encrypt 
        /// </summary> 
        /// <param name="strText">text</param> 
        /// <returns>md5 Encrypt string</returns> 
        public void MD5Encrypt()
        {
            MD5 md5 = new MD5CryptoServiceProvider();
            byte[] result = md5.ComputeHash(System.Text.Encoding.Default.GetBytes(this.InputString));
            this.outString = System.Text.Encoding.Default.GetString(result);
        }
        #endregion

        #region 加密方法
        /// <summary>
        /// 加密方法
        /// </summary>
        /// <param name="pToEncrypt"></param>
        /// <param name="sKey"></param>
        /// <returns></returns>
        public string DESEncrypt(string pToEncrypt, string sKey)
        {
            DESCryptoServiceProvider des = new DESCryptoServiceProvider();
            //把字符串放到byte数组中  
            //原来使用的UTF8编码，我改成Unicode编码了，不行  
            byte[] inputByteArray = Encoding.Default.GetBytes(pToEncrypt);
            //byte[]  inputByteArray=Encoding.Unicode.GetBytes(pToEncrypt);  

            //建立加密对象的密钥和偏移量  
            //原文使用ASCIIEncoding.ASCII方法的GetBytes方法  
            //使得输入密码必须输入英文文本  
            des.Key = ASCIIEncoding.ASCII.GetBytes(sKey);
            des.IV = ASCIIEncoding.ASCII.GetBytes(sKey);
            MemoryStream ms = new MemoryStream();
            CryptoStream cs = new CryptoStream(ms, des.CreateEncryptor(), CryptoStreamMode.Write);
            //Write  the  byte  array  into  the  crypto  stream  
            //(It  will  end  up  in  the  memory  stream)  
            cs.Write(inputByteArray, 0, inputByteArray.Length);
            cs.FlushFinalBlock();
            //Get  the  data  back  from  the  memory  stream,  and  into  a  string  
            StringBuilder ret = new StringBuilder();
            foreach (byte b in ms.ToArray())
            {
                //Format  as  hex  
                ret.AppendFormat("{0:X2}", b);
            }
            ret.ToString();
            return ret.ToString();
        }
        #endregion

        #region 解密方法
        /// <summary>
        /// 解密方法
        /// </summary>
        /// <param name="pToDecrypt"></param>
        /// <param name="sKey"></param>
        /// <returns></returns>
        public string DESDecrypt(string pToDecrypt, string sKey)
        {
            DESCryptoServiceProvider des = new DESCryptoServiceProvider();

            //Put  the  input  string  into  the  byte  array  
            byte[] inputByteArray = new byte[pToDecrypt.Length / 2];
            for (int x = 0; x < pToDecrypt.Length / 2; x++)
            {
                int i = (Convert.ToInt32(pToDecrypt.Substring(x * 2, 2), 16));
                inputByteArray[x] = (byte)i;
            }

            //建立加密对象的密钥和偏移量，此值重要，不能修改  
            des.Key = ASCIIEncoding.ASCII.GetBytes(sKey);
            des.IV = ASCIIEncoding.ASCII.GetBytes(sKey);
            MemoryStream ms = new MemoryStream();
            CryptoStream cs = new CryptoStream(ms, des.CreateDecryptor(), CryptoStreamMode.Write);
            //Flush  the  data  through  the  crypto  stream  into  the  memory  stream  
            cs.Write(inputByteArray, 0, inputByteArray.Length);
            cs.FlushFinalBlock();

            //Get  the  decrypted  data  back  from  the  memory  stream  
            //建立StringBuild对象，CreateDecrypt使用的是流对象，必须把解密后的文本变成流对象  
            StringBuilder ret = new StringBuilder();

            return System.Text.Encoding.Default.GetString(ms.ToArray());
        }
        #endregion

        #region 使用缺省密钥字符串加密
        /// <summary> 
        /// 使用缺省密钥字符串加密 
        /// </summary> 
        /// <param name="original">明文</param> 
        /// <returns>密文</returns> 
        public static string Encrypt(string original)
        {
            return Encrypt(original, "DESEncrypt");
        }
        #endregion

        #region 使用缺省密钥解密
        /// <summary> 
        /// 使用缺省密钥解密 
        /// </summary> 
        /// <param name="original">密文</param> 
        /// <returns>明文</returns> 
        public static string Decrypt(string original)
        {
            return Decrypt(original, "DESEncrypt", System.Text.Encoding.Default);
        }
        #endregion

        #region 使用给定密钥解密
        /// <summary> 
        /// 使用给定密钥解密 
        /// </summary> 
        /// <param name="original">密文</param> 
        /// <param name="key">密钥</param> 
        /// <returns>明文</returns> 
        public static string Decrypt(string original, string key)
        {
            return Decrypt(original, key, System.Text.Encoding.Default);
        }
        #endregion

        #region  使用缺省密钥解密,返回指定编码方式明文
        /// <summary> 
        /// 使用缺省密钥解密,返回指定编码方式明文 
        /// </summary> 
        /// <param name="original">密文</param> 
        /// <param name="encoding">编码方式</param> 
        /// <returns>明文</returns> 
        public static string Decrypt(string original, Encoding encoding)
        {
            return Decrypt(original, "DESEncrypt", encoding);
        }
        #endregion

        #region 使用给定密钥加密
        /// <summary> 
        /// 使用给定密钥加密 
        /// </summary> 
        /// <param name="original">原始文字</param> 
        /// <param name="key">密钥</param> 
        /// <param name="encoding">字符编码方案</param> 
        /// <returns>密文</returns> 
        public static string Encrypt(string original, string key)
        {
            byte[] buff = System.Text.Encoding.Default.GetBytes(original);
            byte[] kb = System.Text.Encoding.Default.GetBytes(key);
            return Convert.ToBase64String(Encrypt(buff, kb));
        }
        #endregion

        #region 使用给定密钥解密
        /// <summary> 
        /// 使用给定密钥解密 
        /// </summary> 
        /// <param name="encrypted">密文</param> 
        /// <param name="key">密钥</param> 
        /// <param name="encoding">字符编码方案</param> 
        /// <returns>明文</returns> 
        public static string Decrypt(string encrypted, string key, Encoding encoding)
        {
            byte[] buff = Convert.FromBase64String(encrypted);
            byte[] kb = System.Text.Encoding.Default.GetBytes(key);
            return encoding.GetString(Decrypt(buff, kb));
        }
        #endregion

        #region 生成MD5摘要
        /// <summary> 
        /// 生成MD5摘要 
        /// </summary> 
        /// <param name="original">数据源</param> 
        /// <returns>摘要</returns> 
        public static byte[] MakeMD5(byte[] original)
        {
            MD5CryptoServiceProvider hashmd5 = new MD5CryptoServiceProvider();
            byte[] keyhash = hashmd5.ComputeHash(original);
            hashmd5 = null;
            return keyhash;
        }
        #endregion

        #region 使用给定密钥加密
        /// <summary> 
        /// 使用给定密钥加密 
        /// </summary> 
        /// <param name="original">明文</param> 
        /// <param name="key">密钥</param> 
        /// <returns>密文</returns> 
        public static byte[] Encrypt(byte[] original, byte[] key)
        {
            TripleDESCryptoServiceProvider des = new TripleDESCryptoServiceProvider();
            des.Key = MakeMD5(key);
            des.Mode = CipherMode.ECB;

            return des.CreateEncryptor().TransformFinalBlock(original, 0, original.Length);
        }
        #endregion

        #region 使用给定密钥解密数据
        /// <summary> 
        /// 使用给定密钥解密数据 
        /// </summary> 
        /// <param name="encrypted">密文</param> 
        /// <param name="key">密钥</param> 
        /// <returns>明文</returns> 
        public static byte[] Decrypt(byte[] encrypted, byte[] key)
        {
            TripleDESCryptoServiceProvider des = new TripleDESCryptoServiceProvider();
            des.Key = MakeMD5(key);
            des.Mode = CipherMode.ECB;

            return des.CreateDecryptor().TransformFinalBlock(encrypted, 0, encrypted.Length);
        }
        #endregion

        #region 使用给定密钥加密
        /// <summary> 
        /// 使用给定密钥加密 
        /// </summary> 
        /// <param name="original">原始数据</param> 
        /// <param name="key">密钥</param> 
        /// <returns>密文</returns> 
        public static byte[] Encrypt(byte[] original)
        {
            byte[] key = System.Text.Encoding.Default.GetBytes("DESEncrypt");
            return Encrypt(original, key);
        }
        #endregion

        #region 使用缺省密钥解密数据
        /// <summary> 
        /// 使用缺省密钥解密数据 
        /// </summary> 
        /// <param name="encrypted">密文</param> 
        /// <param name="key">密钥</param> 
        /// <returns>明文</returns> 
        public static byte[] Decrypt(byte[] encrypted)
        {
            byte[] key = System.Text.Encoding.Default.GetBytes("DESEncrypt");
            return Decrypt(encrypted, key);
        }
        #endregion
    }
}