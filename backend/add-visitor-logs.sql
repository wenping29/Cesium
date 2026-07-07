-- ========================================================
-- 创建访客记录表并插入测试数据
-- ========================================================

-- 创建访客记录表
CREATE TABLE IF NOT EXISTS VisitorLogs (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    IpAddress TEXT NOT NULL,
    UserAgent TEXT,
    PageUrl TEXT NOT NULL,
    Referrer TEXT,
    Country TEXT,
    Region TEXT,
    City TEXT,
    DeviceType TEXT,
    Browser TEXT,
    Os TEXT,
    SessionId TEXT,
    Duration INTEGER DEFAULT 0,
    UserId INTEGER,
    CreatedAt TEXT NOT NULL,
    UpdatedAt TEXT,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE SET NULL
);

-- 创建索引
CREATE INDEX IF NOT EXISTS IX_VisitorLogs_CreatedAt ON VisitorLogs(CreatedAt);
CREATE INDEX IF NOT EXISTS IX_VisitorLogs_IpAddress ON VisitorLogs(IpAddress);
CREATE INDEX IF NOT EXISTS IX_VisitorLogs_UserId ON VisitorLogs(UserId);
CREATE INDEX IF NOT EXISTS IX_VisitorLogs_SessionId ON VisitorLogs(SessionId);
CREATE INDEX IF NOT EXISTS IX_VisitorLogs_PageUrl ON VisitorLogs(PageUrl);

-- 插入测试数据
INSERT OR IGNORE INTO VisitorLogs (IpAddress, UserAgent, PageUrl, Referrer, Country, Region, City, DeviceType, Browser, Os, SessionId, Duration, UserId, CreatedAt) VALUES
('192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', '/', 'https://google.com', '中国', '北京', '北京', 'Desktop', 'Chrome', 'Windows 10', 'session-001', 120, 1, '2024-01-15 10:00:00'),
('192.168.1.101', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15', '/dashboard', '', '中国', '上海', '上海', 'Mobile', 'Safari', 'iOS 17', 'session-002', 180, NULL, '2024-01-15 10:15:00'),
('192.168.1.102', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36', '/profile', 'https://github.com', '中国', '广东', '深圳', 'Desktop', 'Chrome', 'macOS 14', 'session-003', 90, 2, '2024-01-15 10:30:00'),
('192.168.1.103', 'Mozilla/5.0 (Linux; Android 13; SM-S901B) AppleWebKit/537.36', '/about', '', '中国', '浙江', '杭州', 'Mobile', 'Chrome', 'Android 13', 'session-004', 60, NULL, '2024-01-15 11:00:00'),
('192.168.1.104', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0', '/settings', 'https://linkedin.com', '中国', '江苏', '南京', 'Desktop', 'Firefox', 'Windows 10', 'session-005', 240, 3, '2024-01-15 11:20:00'),
('192.168.1.105', 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15', '/', '', '中国', '四川', '成都', 'Tablet', 'Safari', 'iPadOS 17', 'session-006', 150, NULL, '2024-01-15 11:45:00'),
('192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '/dashboard', '/', '中国', '北京', '北京', 'Desktop', 'Chrome', 'Windows 10', 'session-001', 300, 1, '2024-01-15 12:00:00');

-- 验证数据
SELECT '=== 访客日志数据 ===' AS info;
SELECT Id, IpAddress, PageUrl, DeviceType, Country, CreatedAt FROM VisitorLogs ORDER BY Id;
