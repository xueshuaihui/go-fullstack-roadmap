**解决什么问题**：写登录接口本身——验证密码、签发 token、服务端验证 token、数据隔离、敏感字段不出响应。

### 知识点

| 知识点 | 核心内容 |
| :--- | :--- |
| **密码哈希** | **首选 Argon2id**：推荐参数 **m=64 MiB，t=3，p=4**（OWASP 2025）；目标单次哈希耗时 150–250ms。内存受限时退回 OWASP 最小值 m=19 MiB, t=2, p=1（降级配置）。**bcrypt 备选**：**显式设 cost=12**（不要依赖 `DefaultCost`）。无论哪种，**绝不存明文**，每个密码使用唯一盐值。 |
| **JWT 签发** | `jwt.NewWithClaims`，payload 含 `user_id` 和过期时间，密钥签名 |
| **JWT 验证** | `jwt.ParseWithClaims`，验证签名和过期时间 |
| **认证中间件** | 从 `Authorization: Bearer <token>` 取 token → 验证 → `user_id` 放入 `context` |
| **context 取值** | `r.Context().Value(userIDKey)` |
| **数据隔离** | 账目表加 `user_id`；**每个查询必须带 `WHERE user_id = ?`** |
| **敏感字段隔离** | `PasswordHash` 加 `json:"-"`，或使用独立响应 DTO；**任何响应不得包含密码哈希** |

**学习方式**：先写 `POST /register` 和 `POST /login`，curl 测试。再写认证中间件套在 `/ledger` 路由上，不带 token 返回 401。最后改账本 handler，从 context 取 `user_id`。

**常见卡点**：token 解析失败（检查 `Bearer ` 后的空格、密钥一致）；登录成功但 401（中间件没套上或 token 过期）；A 能看到 B 的账（**查询漏了 `user_id` 条件，最重要的安全检查点**）。

### 练手项目：带认证的账本 API

- `POST /register`、`POST /login`
- `/ledger` 全部需认证
- 账目表加 `user_id`
- 响应中无 `password_hash`
