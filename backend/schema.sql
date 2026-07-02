-- Cesium API Database Schema
-- SQLite

-- Users Table
CREATE TABLE IF NOT EXISTS Users (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Username TEXT NOT NULL UNIQUE,
    Email TEXT NOT NULL UNIQUE,
    PasswordHash TEXT NOT NULL,
    CreatedAt TEXT NOT NULL,
    UpdatedAt TEXT
);

-- Roles Table
CREATE TABLE IF NOT EXISTS Roles (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL UNIQUE,
    Description TEXT
);

-- UserRoles Junction Table
CREATE TABLE IF NOT EXISTS UserRoles (
    UserId INTEGER NOT NULL,
    RoleId INTEGER NOT NULL,
    PRIMARY KEY (UserId, RoleId),
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY (RoleId) REFERENCES Roles(Id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS IX_UserRoles_UserId ON UserRoles(UserId);
CREATE INDEX IF NOT EXISTS IX_UserRoles_RoleId ON UserRoles(RoleId);
CREATE INDEX IF NOT EXISTS IX_Roles_Name ON Roles(Name);
CREATE INDEX IF NOT EXISTS IX_Users_Username ON Users(Username);
CREATE INDEX IF NOT EXISTS IX_Users_Email ON Users(Email);

-- Insert Default Roles
INSERT OR IGNORE INTO Roles (Name, Description) VALUES
    ('Admin', 'Administrator with full access'),
    ('User', 'Standard user');
