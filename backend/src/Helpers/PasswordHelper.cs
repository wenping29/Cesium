using System.Security.Cryptography;

namespace CesiumApi.Helpers;

public static class PasswordHelper
{
    private const int SaltSize = 16;
    private const int HashSize = 32;
    private const int Iterations = 100000;

    public static string HashPassword(string password)
    {
        using var hmac = new HMACSHA256();
        var salt = hmac.Key;
        var hash = Rfc2898DeriveBytes.Pbkdf2(
            password,
            salt,
            Iterations,
            HashAlgorithmName.SHA256,
            HashSize);

        var saltBytes = salt;
        var hashBytes = hash;

        var hashBytesCombined = new byte[SaltSize + HashSize];
        Array.Copy(saltBytes, 0, hashBytesCombined, 0, SaltSize);
        Array.Copy(hashBytes, 0, hashBytesCombined, SaltSize, HashSize);

        return Convert.ToBase64String(hashBytesCombined);
    }

    public static bool VerifyPassword(string password, string storedHash)
    {
        var hashBytesCombined = Convert.FromBase64String(storedHash);
        var saltBytes = new byte[SaltSize];
        var hashBytes = new byte[HashSize];

        Array.Copy(hashBytesCombined, 0, saltBytes, 0, SaltSize);
        Array.Copy(hashBytesCombined, SaltSize, hashBytes, 0, HashSize);

        var computedHash = Rfc2898DeriveBytes.Pbkdf2(
            password,
            saltBytes,
            Iterations,
            HashAlgorithmName.SHA256,
            HashSize);

        return computedHash.SequenceEqual(hashBytes);
    }
}
