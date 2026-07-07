-- ========================================================
-- 创建通知表并插入测试数据
-- ========================================================

-- 创建通知表
CREATE TABLE IF NOT EXISTS Notifications (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Type TEXT NOT NULL,
    Sender TEXT NOT NULL,
    Date TEXT NOT NULL,
    Title TEXT NOT NULL,
    Content TEXT NOT NULL,
    Detail TEXT NOT NULL,
    Read INTEGER NOT NULL DEFAULT 0,
    Icon TEXT NOT NULL,
    Color TEXT NOT NULL,
    UserId INTEGER,
    CreatedAt TEXT NOT NULL,
    UpdatedAt TEXT
);

-- 创建索引
CREATE INDEX IF NOT EXISTS IX_Notifications_UserId ON Notifications(UserId);
CREATE INDEX IF NOT EXISTS IX_Notifications_Type ON Notifications(Type);
CREATE INDEX IF NOT EXISTS IX_Notifications_Read ON Notifications(Read);
CREATE INDEX IF NOT EXISTS IX_Notifications_Date ON Notifications(Date);

-- 插入测试数据
INSERT OR IGNORE INTO Notifications (Type, Sender, Date, Title, Content, Detail, Read, Icon, Color, UserId, CreatedAt) VALUES
('system', '系统管理员', '2024-01-15 18:50', '系统更新通知', '系统将于今晚22:00进行维护升级，请提前保存工作内容。', '本次维护将进行以下更新：
1. 系统安全补丁
2. 性能优化
3. 新功能上线

预计维护时间为2小时，期间系统将无法访问。请各位同事提前保存好工作内容，避免数据丢失。如有紧急问题，请联系IT支持。', 0, 'SystemUpdate', 'primary', 1, '2024-01-15 18:50:00'),
('task', '张三', '2024-01-15 18:30', '收到新任务', '张三给您分配了一个新任务：完成Q4财务报表。', '任务详情：

任务名称：完成Q4财务报表
截止日期：2024-01-20
任务描述：需要完成第四季度的财务报表统计，包括收入、支出、利润等数据的汇总和分析。

相关文件：
- Q3财务报表.xlsx
- 12月账单.pdf', 0, 'Assignment', 'success', 1, '2024-01-15 18:30:00'),
('task', '系统提醒', '2024-01-15 18:00', '任务提醒', '您的任务"项目规划"将在明天截止，请尽快完成。', '任务提醒：

任务名称：项目规划
截止日期：2024-01-16
当前进度：80%

剩余工作：
- 风险评估
- 资源分配

请尽快完成剩余工作，确保项目按时交付。', 0, 'Assignment', 'warning', 1, '2024-01-15 18:00:00'),
('system', '会议助手', '2024-01-15 16:00', '会议提醒', '下午14:00的周会即将开始，请准时参加。', '会议详情：

会议名称：部门周会
时间：2024-01-16 14:00-15:00
地点：301会议室
参会人员：所有部门成员

会议议程：
1. 上周工作总结
2. 本周工作安排
3. 问题讨论
4. 其他事项', 1, 'Event', 'info', 1, '2024-01-15 16:00:00'),
('message', '李四', '2024-01-15 15:00', '新消息', '李四给您发送了一条消息：请问项目进度如何？', '李四 发送于 2024-01-15 15:00

请问项目进度如何？需要我这边协助吗？我们负责的模块已经基本完成了，随时可以对接。', 1, 'Chat', 'secondary', 1, '2024-01-15 15:00:00'),
('system', '人事系统', '2024-01-15 14:00', '新用户注册', '新用户王五已完成注册，等待审核。', '新用户注册通知：

用户名：王五
工号：E008
部门：技术部
职位：前端开发工程师
入职日期：2024-01-15

请人事管理员尽快完成审核流程。', 1, 'PersonAdd', 'info', 1, '2024-01-15 14:00:00'),
('task', '张三', '2024-01-14 17:00', '任务已完成', '您分配给张三的任务已标记为完成，请查看。', '任务完成通知：

任务名称：UI设计稿
完成时间：2024-01-14 17:00
完成人：张三

附件：
- 首页设计稿.sketch
- 详情页设计稿.sketch
- 图标资源.zip', 1, 'Assignment', 'success', 1, '2024-01-14 17:00:00'),
('system', '安全中心', '2024-01-13 10:00', '安全提醒', '您的账号在新设备上登录，如非本人操作请及时修改密码。', '安全提醒：

登录时间：2024-01-13 10:00
设备信息：Windows PC (Chrome 120)
IP地址：192.168.1.100
位置：北京市

如非本人操作，请立即修改密码并联系IT安全部门。', 1, 'SystemUpdate', 'error', 1, '2024-01-13 10:00:00');

-- 验证数据
SELECT '=== 通知数据 ===' AS info;
SELECT Id, Type, Sender, Title, Read, Date FROM Notifications ORDER BY Id;
