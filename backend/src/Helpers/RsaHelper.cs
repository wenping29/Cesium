using System.Security.Cryptography;
using System.Text;

namespace CesiumApi.Helpers;

public static class RsaHelper
{
    private static RSA? _rsa;

    public static void Initialize()
    {
        _rsa = RSA.Create(2048);
    }

    public static string GetPublicKey()
    {
        if (_rsa == null) throw new InvalidOperationException("RSA not initialized");
        return _rsa.ExportPkcs8PublicKeyInfo().ToString();
    }

    public static string GetPublicKeyPem()
    {
        if (_rsa == null) throw new InvalidOperationException("RSA not initialized");
        var publicKeyBytes = _rsa.ExportSubjectPublicKeyInfo();
        return "-----BEGIN PUBLIC KEY-----\n" +
               Convert.ToBase64String(publicKeyBytes, Base64FormattingOptions.InsertLineBreaks) +
               "\n-----END PUBLIC KEY-----";
    }

    public static string Decrypt(string encryptedBase64)
    {
        if (_rsa == null) throw new InvalidOperationException("RSA not initialized");
        var encryptedBytes = Convert.FromBase64String(encryptedBase64);
        var decryptedBytes = _rsa.Decrypt(encryptedBytes, RSAEncryptionPadding.OaepSHA256);
        return Encoding.UTF8.GetString(decryptedBytes);
    }

    public static string DecryptBase64Url(string encryptedBase64Url)
    {
        var base64 = encryptedBase64Url.Replace('-', '+').Replace('_', '/');
        switch (base64.Length % 4)
        {
            case 2: base64 += "=="; break;
            case 3: base64 += "="; break;
        }
        return Decrypt(base64);
    }
}
