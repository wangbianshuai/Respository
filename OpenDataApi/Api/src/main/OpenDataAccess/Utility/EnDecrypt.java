package OpenDataAccess.Utility;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.DESKeySpec;
import javax.crypto.spec.IvParameterSpec;
import java.util.Base64;

public class EnDecrypt {
    public static String ToBase64(String str) {
        if (Common.IsNullOrEmpty(str)) return str;
        return Base64.getEncoder().encodeToString(str.getBytes());
    }

    public static String BytesToBase64(byte[] bs) {
        if (bs == null) return "";
        return Base64.getEncoder().encodeToString(bs);
    }

    public static String FromBase64(String base64) {
        if (Common.IsNullOrEmpty(base64)) return base64;

        return new String(Base64.getDecoder().decode(base64));
    }

    public static byte[] Base64ToBytes(String base64) {
        if (Common.IsNullOrEmpty(base64)) return null;

        return Base64.getDecoder().decode(base64);
    }

    /**
     * 加密
     */
    private static byte[] Encrypt(byte[] content, byte[] keyBytes, String algorithm) {
        try {
            DESKeySpec keySpec = new DESKeySpec(keyBytes);

            SecretKeyFactory keyFactory = SecretKeyFactory.getInstance(algorithm);
            SecretKey key = keyFactory.generateSecret(keySpec);

            String transformation = "DES/CBC/PKCS5Padding"; //用什么样的转型方式
            Cipher cipher = Cipher.getInstance(transformation);
            cipher.init(Cipher.ENCRYPT_MODE, key, new IvParameterSpec(keySpec.getKey()));

            byte[] result = cipher.doFinal(content);

            return result;

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public static String DesEncrypt(String content, String key) {
        return BytesToBase64(Encrypt(content.getBytes(), key.getBytes(), "DES"));
    }

    public static String DesEncrypt(String content) {
        String key = "DesEnDecrypt";
        return DesEncrypt(content, key);
    }

    /**
     * 解密
     */
    public static byte[] Decrypt(byte[] content, byte[] keyBytes, String algorithm) {
        try {
            DESKeySpec keySpec = new DESKeySpec(keyBytes);

            SecretKeyFactory keyFactory = SecretKeyFactory.getInstance(algorithm);
            SecretKey key = keyFactory.generateSecret(keySpec);

            String transformation = "DES/CBC/PKCS5Padding";
            Cipher cipher = Cipher.getInstance(transformation);
            cipher.init(Cipher.DECRYPT_MODE, key, new IvParameterSpec(keyBytes));
            byte[] result = cipher.doFinal(content);

            return result;

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public static String DesDecrypt(String content, String key) {
        return new String(Decrypt(Base64ToBytes(content), key.getBytes(), "DES"));
    }

    public static String DesDecrypt(String content) {
        String key = "DesEnDecrypt";
        return DesDecrypt(content, key);
    }
}
