using Microsoft.AspNetCore.Identity;

namespace CesiumApi.Helpers;

public static class PasswordHelper
{
    private static readonly PasswordHasher<object> _passwordHasher = new();
    private static readonly object? _nullUser = null;

    public static string HashPassword(string password)
    {
        return _passwordHasher.HashPassword(_nullUser, password);
    }

    public static bool VerifyPassword(string password, string storedHash)
    {
        return _passwordHasher.VerifyHashedPassword(_nullUser, storedHash, password) 
            != PasswordVerificationResult.Failed;
    }
}
