using Microsoft.AspNetCore.Identity;

namespace CesiumApi.Helpers;

public static class PasswordHelper
{
    private static readonly PasswordHasher<object> _passwordHasher = new();

    public static string HashPassword(string password)
    {
        return _passwordHasher.HashPassword(null, password);
    }

    public static bool VerifyPassword(string password, string storedHash)
    {
        return _passwordHasher.VerifyHashedPassword(null, storedHash, password) 
            != PasswordVerificationResult.Failed;
    }
}
