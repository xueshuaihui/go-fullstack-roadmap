<!--day 1-->
::pre 知道「哈希不可逆」；知道 salt 的存在。
::predict
账户 A 密码 `password123`，账户 B 密码也是 `password123`。
用 SHA-256 直接存哈希（不加盐），两条记录的值相同吗？
::ask 相同吗？攻击者从这个「相同」能得到什么？
::ans 相同。后果有两层：① **彩虹表**——SHA-256 的常见密码哈希表是公开的，`password123` 的哈希可以直接反查；② **横向识别**——攻击者不用破解就知道「这两个人密码一样」，撞库时一次命中两个账号。加盐后每人一个随机 salt，同样的密码得到不同哈希，彩虹表失效。**salt 的作用不是「让哈希更难算」，是「让同样的输入产生不同结果」**。
::predict
Argon2id 参数 m=64MiB, t=3, p=4，单次哈希约 200ms。
::ask 这 200ms 对登录接口意味着什么？如果 20 个用户同时登录呢？
::ans 20 个并发登录需要 20 × 200ms = 4 秒的**纯 CPU/内存时间**。如果机器 4 核，排队后最后一个要等约 1 秒以上。这意味着：**慢哈希把登录接口变成了最容易被打的资源**——攻击者不需要破解，只要狂发登录请求就能让 CPU 打满。所以认证层前面必须有速率限制（阶段六），且 Argon2 的内存参数（64MiB）也要算进并发预算：20 个并发 × 64MiB = 1.25GB 内存峰值，小内存机器会 OOM。
::debug
```go
h := sha256.Sum256([]byte(password))
stored := hex.EncodeToString(h[:])
```
::sym 安全审计指出「密码存储不合规」。
::ask 这段代码有几个问题？分别对应什么攻击？
::ans 三个：① **用了快哈希**——SHA-256 单次微秒级，GPU 每秒能算几十亿次，离线爆破毫无门槛；② **没有盐**——彩虹表直接反查，且相同密码产生相同哈希；③ **没有迭代/成本参数**——无法通过调参对抗硬件升级。密码哈希必须用**专为「慢」设计的算法**：Argon2id、bcrypt、scrypt、PBKDF2。SHA-256 是「校验数据完整性」的工具，不是「存密码」的工具。
::transfer
::scene 你要在 OWASP 建议和家庭服务器（2GB 内存）之间做取舍。
::ask Argon2id 参数怎么定？内存不够时降级到什么？降级后风险是什么？
::hint 参数三元组 m/t/p 分别控制什么？
::ans 首选 OWASP 2025 推荐：`m=64MiB, t=3, p=4`，目标单次 150-250ms。2GB 内存机器上并发登录可能 OOM，退到 OWASP 最小值 `m=19MiB, t=2, p=1`。降级代价：内存成本降低意味着**GPU/ASIC 并行破解的性价比上升**，同样硬件能同时跑更多哈希。风险缓解：① 登录接口限流（每 IP/每账号）；② 强密码策略；③ 监控异常登录。**参数不是越强越好，是「在你能承受的并发下，尽量贴近 200ms」**——先在目标机器上实测再定。
::crit 能解释 salt 防的是彩虹表和「相同密码识别」，不是防暴力破解
::crit 知道慢哈希的计算成本会成为登录接口的容量瓶颈，能算出并发预算
::crit 能说出 SHA-256 存密码的三个问题及对应攻击
::crit 能给出「首选参数 + 降级参数 + 降级后的补偿措施」

<!--day 2-->
::pre 完成 D1；知道 Argon2id 的参数含义。
::predict
```go
hash, _ := argon2.IDKey([]byte(pw), salt, 1, 64*1024, 4, 32)
// 存库时只存 hash
```
::ask 只存 hash 够吗？验证时怎么知道用哪个 salt、哪个参数？
::ans 不够。验证时需要**同样的 salt 和同样的参数**重算，所以要把 `salt`、`m`、`t`、`p`、`keyLen` 一起存下来。标准做法是存**编码后的完整字符串**：`$argon2id$v=19$m=65536,t=3,p=4$<b64salt>$<b64hash>`——这是 PHC 标准格式，一行含全部参数。好处是以后调参数时，老用户的哈希仍能按老参数验证，新用户用新参数，**不需要强制所有人改密码**。
::predict
```go
func verify(pw, encoded string) bool {
    parts := strings.Split(encoded, "$")
    salt := parts[4]
    want := parts[5]
    got, _ := argon2.IDKey([]byte(pw), []byte(salt), 1, 64*1024, 4, 32)
    return base64.RawStdEncoding.EncodeToString(got) == want
}
```
::ask 这段验证代码至少有三个错误，找出来。
::ans ① **salt 没解码**：编码串里的 salt 是 base64，直接 `[]byte(salt)` 用的是 base64 文本而不是原始字节，算出的哈希永远不匹配；② **参数写死**：`t=1, m=64*1024` 与实际存储的参数可能不一致，应该从 `parts[3]` 解析；③ **字符串比较不是常数时间**：`==` 在第一个不同字符就返回，理论上可被计时攻击（虽然实践难度高，但密码比较应该用 `subtle.ConstantTimeCompare`）。另外 `parts` 长度没校验，畸形输入会 panic。**「验证」比「生成」更容易写错**，因为错误表现是「永远 false」或「偶尔 true」，很难察觉。
::debug
```go
h1, _ := hashPassword("abc")
h2, _ := hashPassword("abc")
fmt.Println(h1 == h2)   // false
```
::sym 两个相同的密码算出不同哈希，测试 `h1 == h2` 失败。
::ask 这是 bug 吗？测试该怎么写才对？
::ans 不是 bug，是**正确行为**——每次哈希用新的随机 salt，所以结果必然不同。测试应该验证「用 verify 能通过」而不是「哈希相等」：`verifyPassword("abc", h1) == true && verifyPassword("abd", h1) == false`。**测试要针对「性质」而不是「输出值」**，否则会把随机性当成缺陷。同理，任何含随机 salt/nonce 的函数都不能断言具体输出。
::transfer
::scene 你要实现 `hashPassword` 和 `verifyPassword`，并写出它们的错误契约。
::ask 两个函数的签名分别是什么？各返回哪些错误？为什么 verify 不应返回 error 而应返回 bool？
::hint 想想「密码错误」到底是「业务失败」还是「系统错误」。
::ans 
```go
func hashPassword(pw string) (string, error)         // 只有系统错误：随机源失败、参数非法
func verifyPassword(pw, encoded string) (bool, error) // bool=是否匹配；error=编码串损坏等系统问题
```
`verify` 必须区分三者：匹配（true, nil）、不匹配（false, nil）、**哈希串本身损坏**（false, err）。如果只返回 bool，编码串损坏会被当成「密码错」，用户永远登不上却查不出原因。而 handler 层：`(false, nil)` → 401「邮箱或密码错误」（**不区分是邮箱不存在还是密码错**，防止账号枚举）；`(_, err)` → 500 + 日志。**「认证失败」和「系统故障」必须分开，但对用户要模糊**。
::crit 存储用 PHC 编码串（含算法、参数、salt、hash），不是分开的列
::crit verify 从编码串解析参数，不写死 m/t/p
::crit 比较用常数时间函数，且校验编码串结构避免 panic
::crit 测试断言「verify 通过/不通过」，不断言哈希值相等

<!--day 3-->
::pre 完成 D2；Argon2id 已能跑通。
::predict
```go
bcrypt.GenerateFromPassword([]byte(pw), bcrypt.DefaultCost)
```
::ask `DefaultCost` 是多少？为什么生产环境不该依赖它？
::ans `DefaultCost = 10`（bcrypt 库的默认值）。不该依赖的原因：**默认值是库作者的选择，可能随版本变化**，而且 10 在现代硬件上约 50-60ms，低于 OWASP 建议的 150-250ms 区间。应显式写 `bcrypt.GenerateFromPassword([]byte(pw), 12)`。显式还有一个好处：代码评审时能一眼看到成本参数，而不是去查文档。**安全参数必须显式写出，不能依赖默认值**——这条对超时、TLS 版本、哈希成本都成立。
::predict
```go
hash, _ := bcrypt.GenerateFromPassword([]byte(pw), 12)
// 数据库 VARCHAR(60)
```
::ask 60 字符够存 bcrypt 哈希吗？Argon2 的编码串呢？
::ans bcrypt 哈希固定 60 字符（`$2a$12$` + 22 salt + 31 hash），刚好够，但没有余量。Argon2 的 PHC 编码串约 95-100 字符（含参数），**`VARCHAR(60)` 会截断**，截断后验证永远失败。建议统一用 `VARCHAR(255)` 或 `TEXT`。**字段长度要按「最长的可能编码」留余量**，不要按某个算法的当前格式卡死——换算法时不用改表。
::debug
```go
// 迁移：从 bcrypt 换到 Argon2id
// 直接改 hashPassword 用 Argon2
h, _ := hashPassword(pw)   // 现在是 $argon2id$...
verifyPassword(pw, oldBcryptHash)  // 老用户登录
```
::sym 老用户全部登录失败。
::ask 怎么在不强制改密码的前提下平滑迁移？
::ans 验证时**按前缀分派**：`if strings.HasPrefix(encoded, "$2") { bcrypt.Compare } else if strings.HasPrefix(encoded, "$argon2id$") { argon2 验证 }`。更进一步做**登录时升级**：老用户用 bcrypt 验证成功后，立刻用 Argon2 重新哈希并更新库（`UPDATE users SET password_hash=? WHERE id=?`）。这样用户无感，活跃用户逐步迁移，长期不登录的保留旧格式也能用。**任何哈希/加密算法的迁移，都要走「双读单写 + 登录时升级」这条路**，不能一刀切。
::transfer
::scene 项目要在 Argon2id 和 bcrypt 之间做最终选择。
::ask 从「安全强度、实现复杂度、依赖、内存占用、迁移成本」五个维度对比，给出结论。
::hint 家庭账本场景：单机、低并发、2GB 内存。
::ans
| 维度 | Argon2id | bcrypt |
| 抗 GPU | 强（内存硬） | 中（可并行） |
| 实现复杂度 | 中（参数多、编码格式要自己处理） | 低（标准库 API 简单） |
| 依赖 | `golang.org/x/crypto/argon2` | `golang.org/x/crypto/bcrypt` |
| 内存占用 | 64MiB/次（并发时叠加） | 约 4KB |
| 迁移成本 | 需要处理参数升级 | cost 可直接调 |
结论：**默认 Argon2id**（内存硬优势明显，OWASP 首选）；如果部署环境内存吃紧（比如树莓派 1GB 且多用户），用 bcrypt cost=12 作为可接受的次优解。**不要为了「更安全」把内存参数设到机器扛不住**——OOM 导致服务不可用，是比「哈希稍弱」更现实的风险。
::crit 显式指定 bcrypt cost=12，不依赖 `DefaultCost`
::crit 密码字段长度 ≥ 255，能容纳 Argon2 的 PHC 编码串
::crit 能写出「按前缀分派 + 登录时升级」的迁移方案
::crit 能对比两种算法并给出「在什么条件下选哪个」的判据

<!--day 4-->
::pre 完成 D2-D3；会建表和写迁移 SQL。
::predict
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL
);
```
::ask 这个表能挡住「同一个邮箱注册两次」吗？
::ans 不能。没有唯一约束，两次注册会插入两行，之后 `SELECT ... WHERE email = ?` 可能返回任意一条，登录行为不确定。必须加 `UNIQUE`：`email TEXT NOT NULL UNIQUE`。**唯一性是数据库的责任，不是应用层「先查再插」的责任**——后者在并发下必然失效。
::predict
```sql
INSERT INTO users(email, password_hash) VALUES ('a@x.com', 'h1');
INSERT INTO users(email, password_hash) VALUES ('a@x.com', 'h2');
```
::ask 第二条会怎样？Go 里怎么判断这个错误？
::ans 报错：`UNIQUE constraint failed: users.email`。Go 里要判断它，`modernc.org/sqlite` 没有导出错误码常量，通常用 `strings.Contains(err.Error(), "UNIQUE constraint failed")` 或检查 `sqlite.Error` 的 Code。这看起来违背了「不靠字符串匹配」的原则，但驱动没提供类型化错误时是唯一选择——**关键是把这种判断收敛到一个函数里**（`func isUniqueViolation(err error) bool`），而不是散落在各处。
::debug
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  email TEXT NOT NULL UNIQUE
);
INSERT INTO users(email) VALUES ('A@X.com');
INSERT INTO users(email) VALUES ('a@x.com');
```
::sym 两条都插进去了，但业务上它们是同一个邮箱。
::ask 为什么唯一约束没生效？怎么修？
::ans SQLite 的 `TEXT` 比较**默认区分大小写**（`BINARY` collation），`A@X.com` 和 `a@x.com` 被视为不同值。修法：① 列定义加 `COLLATE NOCASE`：`email TEXT NOT NULL UNIQUE COLLATE NOCASE`；② 或在写入前统一 `strings.ToLower(strings.TrimSpace(email))`（推荐，因为「存储规范化」比「查询时比较」更可控，也便于索引）。**邮箱规范化必须在入库前做**：trim 空格、转小写、不做过度的点号/加号处理（那是 Gmail 特有语义，不能通用）。
::transfer
::scene 设计完整的 `users` 表，还要支持「以后可能改用手机号登录」。
::ask 表结构怎么写？哪些字段将来会疼？
::hint 想「登录标识」和「用户资料」是不是一回事，以及软删除对唯一约束的影响。
::ans
```sql
CREATE TABLE users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  display_name  TEXT NOT NULL DEFAULT '',
  created_at    TEXT NOT NULL,
  updated_at    TEXT NOT NULL
);
```
注意三点：① `AUTOINCREMENT` 保证 ID 不复用（删除用户后新用户不会拿到旧 ID，避免「旧 token 指向新用户」）；② 如果以后要软删除 + 允许同邮箱重新注册，`UNIQUE(email)` 会挡住——需要改成 `UNIQUE(email, deleted_at)` 或部分索引 `WHERE deleted_at IS NULL`；③ 手机号登录要新加 `phone TEXT UNIQUE`，且**允许 email 和 phone 都为空但不能都为空**（需要 `CHECK` 约束或应用层保证）。**唯一约束和软删除天然冲突，早想清楚比后期改表便宜**。
::crit `email` 有 `UNIQUE`，且写入前做了 trim + 小写规范化
::crit 能写出「重复注册」的错误判断，并收敛到一个函数里
::crit 知道软删除与唯一约束的冲突，能说出两种解法
::crit 主键用 AUTOINCREMENT，能解释「ID 不复用」的安全意义

<!--day 5-->
::pre 完成 D4：users 表可用。
::predict
```go
func (h *Handler) Register(w http.ResponseWriter, r *http.Request) {
    in, ok := decodeJSON[RegisterInput](w, r)
    if !ok { return }
    h.svc.CreateUser(r.Context(), in.Email, in.Password)
    OK(w, nil)
}
```
::ask 这个注册接口有几个安全问题？
::ans 至少四个：① **没校验密码强度**——用户能设 `1`；② **没校验邮箱格式**——`a@` 也能注册；③ **错误被忽略**——重复邮箱时 `CreateUser` 返回错误但没检查，接口仍返回 200，用户以为注册成功；④ **响应体没返回用户信息**，前端无法确认注册成了哪个账号。另外还应该：密码不小于 8 位、不超过 72 字节（bcrypt 会截断到 72 字节，超长密码被静默截断是安全隐患）、邮箱长度上限 254。
::predict
```go
// 注册时把密码原样写日志
log.Printf("register email=%s password=%s", in.Email, in.Password)
```
::ask 这行有什么问题？为什么它比「数据库泄漏」更常见？
::ans **密码明文进了日志**，而日志通常：① 被收集到集中式平台（ELK/Loki），保留 30-90 天；② 权限比数据库松（开发、运维都能看）；③ 可能被同步到第三方 SaaS。所以「日志泄漏密码」的实际发生概率**远高于数据库被拖库**。规则：日志里永不出现密码、token、Cookie、完整银行卡号。要记录「注册成功」就记 `user_id` 和邮箱的哈希/掩码（`a***@x.com`）。**日志是审计工具，不是调试打印**。
::debug
```bash
curl -X POST /register -d '{"email":"a@x.com","password":"123"}'
# 201 Created
curl -X POST /register -d '{"email":"a@x.com","password":"456"}'
# 201 Created   ← 重复注册也成功？
```
::ask 第二次为什么也返回 201？
::ans 因为代码忽略了 `CreateUser` 的错误（D4 讲过 UNIQUE 会报错，但这里没检查），或者用了 `INSERT OR IGNORE`（静默跳过）。两种都糟糕：前者让用户以为注册成功但实际没建账号，后者更隐蔽——用户以为改了密码，其实还是旧账号。正确行为：捕获唯一约束错误 → 返回 **409 Conflict** + `EMAIL_TAKEN`。**「注册」这个动作必须给出确定的结果：要么建了，要么明确告诉你为什么没建**。
::transfer
::scene 设计注册接口的完整校验清单与响应。
::ask 列出所有校验（含顺序），并说明为什么某些校验要在哈希之前。
::hint 哈希很贵（200ms），别让无效请求付费。
::ans 顺序：① 请求体大小与 JSON 结构（最便宜）；② 邮箱 trim + 小写 + 格式正则 + 长度 ≤ 254；③ 密码长度 8-72 字节 + 不全是数字/不常见弱密码；④ **查重（可选，仅为了快速失败）**；⑤ **哈希**（200ms，最贵，放最后）；⑥ 插入，捕获唯一冲突 → 409。响应：201 + `{id, email}`，**不含 password_hash**。两个要点：**贵的操作放最后**（挡住无效请求）；**查重不能替代唯一约束**（并发窗口），它只是优化体验（早报错）。
::crit 注册校验覆盖邮箱格式/长度、密码强度/长度，且顺序合理（哈希最后）
::crit 重复邮箱返回 409 而不是 201/500
::crit 日志里搜不到明文密码
::crit 响应体不含 password_hash，只含 id 与 email

<!--day 6-->
::pre 完成 D5：能注册、能存哈希。
::predict
```go
func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
    var in LoginInput
    decodeJSON(w, r, &in)
    var hash string
    var id int64
    err := db.QueryRow("SELECT id, password_hash FROM users WHERE email = ?", in.Email).Scan(&id, &hash)
    if err != nil {
        Fail(w, 401, 2001, "邮箱不存在")
        return
    }
    if ok, _ := verifyPassword(in.Password, hash); !ok {
        Fail(w, 401, 2001, "密码错误")
        return
    }
    OK(w, map[string]any{"user_id": id})
}
```
::ask 这个接口有两个安全问题，分别是什么？
::ans ① **账号枚举**：邮箱不存在返回「邮箱不存在」，密码错返回「密码错误」——攻击者可以批量探测哪些邮箱注册过。两者都应该返回同一句「邮箱或密码错误」。② **响应差异可被计时**：邮箱不存在时立刻返回（几微秒），密码错时要跑 200ms 哈希——攻击者用响应时间就能判断邮箱是否存在。修法：邮箱不存在时**也跑一次哈希**（对一个固定的假哈希验证），让两条路径耗时接近。**「认证失败」的所有分支必须看起来一样**，包括措辞、状态码、耗时。
::predict
```go
// 登录成功，签一个 24 小时有效的 token
claims := jwt.MapClaims{
    "user_id": id,
    "exp":     time.Now().Add(24 * time.Hour).Unix(),
}
token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
s, _ := token.SignedString([]byte(secret))
```
::ask `exp` 用 `Unix()` 秒级时间戳，客户端时钟偏差会有什么影响？
::ans JWT 的 `exp` 是**服务端**校验的（用服务端当前时间），客户端的时钟不影响。真正的风险在别处：① **没有 `iat`**，无法判断 token 签发时间，也无法做「签发后改密码则全部失效」；② **没有 `nbf`** 时默认无起始限制，签发即生效；③ 24 小时太长，token 泄漏后有整整一天的窗口。建议：`exp` 15 分钟-1 小时（配 refresh token）或家庭场景 24 小时但**支持服务端吊销**（存一个 `token_version`，改密码时自增）。**JWT 的无状态特性意味着「签发后无法撤回」，除非你额外维护状态**。
::debug
```go
// 登录成功后
http.SetCookie(w, &http.Cookie{Name: "token", Value: s})
```
::sym 前端拿不到 Cookie，或者下次请求没带上。
::ask 这段 Cookie 少了哪些属性？各自的作用是什么？
::ans 少了四个关键属性：`HttpOnly: true`（JS 读不到，防 XSS 窃取）、`Secure: true`（只走 HTTPS）、`SameSite: Lax/Strict`（限制跨站携带，防 CSRF）、`Path: "/"`（默认是当前路径，可能导致其他路径不带）。还有 `MaxAge` 要跟 token 的 `exp` 对齐，否则 Cookie 还在但 token 已过期。**Cookie 的每个属性都对应一类攻击**，缺一个就少一层防护。
::transfer
::scene 你要设计登录的错误响应策略，兼顾「安全」与「可用」。
::ask 哪些错误可以明确告诉用户，哪些必须模糊？分别给出响应。
::hint 想「用户自己填错了」和「攻击者在探测」的区别。
::ans **必须模糊**：邮箱不存在 / 密码错 / 账号被禁用 → 统一 `401 {"code":2001,"message":"邮箱或密码错误"}`，且耗时接近。**可以明确**：请求格式错（`400 INVALID_JSON`）、字段缺失（`400 MISSING_FIELD`）、请求过于频繁（`429 TOO_MANY_REQUESTS` 带 `Retry-After`）、服务端故障（`500` + request_id）。判断标准：**如果明确说明会让攻击者获得「某个账号是否存在」的信息，就必须模糊**；如果只是「你的请求写错了」，明确说明是在帮用户。**不要用 403 区分「密码错」和「账号锁定」**，那也是在泄漏状态。
::crit 登录失败的所有分支返回同一响应，且耗时接近
::crit token 含 `exp` 与 `iat`，有效期有明确理由
::crit Cookie 至少设置 `HttpOnly + Secure + SameSite + Path`，`MaxAge` 与 exp 对齐
::crit 能说出「哪些错误必须模糊、哪些应该明确」的判断标准

<!--day 7-->
::pre 完成 D6：登录能校验密码。
::predict
```go
token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
    "user_id": 42,
    "role":    "admin",
})
s, _ := token.SignedString([]byte("secret"))
```
::ask 这个 token 的 payload 能被客户端看到吗？能改吗？
::ans **能被看到，不能改**。JWT 的 payload 只是 base64url 编码，不是加密——任何人拿到 token 都能解出 `user_id` 和 `role`。但改了之后签名对不上，服务端验证会失败。所以：**绝不能在 payload 里放敏感信息**（密码、身份证、完整手机号）。同时这也意味着「用户知道自己的 user_id」是正常的，别把它当秘密。
::predict
```go
var secret = []byte("secret")
// 生产环境用同一个硬编码值
```
::ask 密钥硬编码在代码里，会导致什么？
::ans ① 代码进 Git 后，任何有仓库读权限的人都能伪造任意用户的 token（包括 `user_id: 1` 的管理员）；② 开源/泄漏后无法补救，除非改代码重新部署；③ 多环境共用同一个密钥，测试环境的 token 能在生产用。正确做法：密钥从环境变量/密钥管理服务读取，**启动时校验非空且长度足够**（HS256 建议 ≥ 32 字节随机值），缺失就拒绝启动。**「启动即失败」比「用默认密钥跑起来」安全一万倍**。
::debug
```go
// 签发
jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
// 另一处代码用 None 算法验证
token, _ := jwt.Parse(s, func(t *jwt.Token) (any, error) {
    return secret, nil
})
```
::ask 这个 Parse 有什么漏洞？
::ans **没有校验签名算法**。`golang-jwt` 的 keyfunc 如果不检查 `t.Method`，攻击者可以把 header 改成 `alg: none` 或 `alg: RS256`（然后用公钥当 HMAC 密钥）来绕过验证。历史上大量 JWT 漏洞都源于此。必须显式检查：
```go
if t.Method.Alg() != jwt.SigningMethodHS256.Alg() {
    return nil, fmt.Errorf("unexpected alg: %v", t.Method.Alg())
}
```
**永远不要信任 token header 里的算法字段**——这是 JWT 使用的第一原则。
::transfer
::scene 设计 token 的 payload 与有效期策略。
::ask 该放哪些字段？不该放哪些？刷新机制怎么做？
::hint 想想「什么信息每次请求都需要」和「什么信息变了要立刻生效」。
::ans **该放**：`sub`（user_id）、`iat`、`exp`、`jti`（token 唯一 ID，便于吊销）。**不该放**：密码哈希、邮箱（可能变）、角色权限（改了要等 token 过期才生效）、任何敏感数据。**有效期**：access token 15-30 分钟 + refresh token 7-30 天（refresh 存库、可吊销、一次性使用）。家庭账本可以简化：单个 token 24 小时 + 服务端 `token_version` 字段（改密码时自增，验证时比对），这样「改密码后旧 token 立刻失效」——用一点状态换取可吊销性，比纯无状态更实用。**纯无状态 JWT 的代价是「无法撤回」，要接受它或补状态**。
::crit token payload 只有 `sub/iat/exp/jti` 等必要字段，无敏感信息
::crit 密钥来自环境变量，启动时校验长度，缺失拒绝启动
::crit 验证时显式校验 `alg`，拒绝 `none` 和其他算法
::crit 有明确的吊销策略（短过期 + refresh，或 `token_version`）

<!--day 8-->
::pre 完成 D7：能签发 token。
::predict
```go
token, err := jwt.ParseWithClaims(raw, &Claims{}, keyfunc)
if err != nil {
    return nil, err
}
return token.Claims.(*Claims), nil
```
::ask 这段验证漏了什么关键检查？
::ans 漏了 `token.Valid`。`ParseWithClaims` 在**签名无效或过期**时会返回 err，但某些实现细节下 `token` 非 nil 而 `Valid == false`。更稳妥的写法：
```go
if err != nil { return nil, err }
if !token.Valid { return nil, ErrInvalidToken }
```
另外要检查 `token.Method` 是否是预期算法（D7 讲过）。**「解析成功」不等于「验证通过」**，这两步必须分开确认。
::predict
```go
// 客户端传了一个过期 1 秒的 token
```
::ask 服务端应该返回什么？前端怎么知道该刷新还是该重新登录？
::ans 返回 **401**，但错误码要能区分「过期」和「无效」：`TOKEN_EXPIRED` vs `TOKEN_INVALID`。前端收到 `EXPIRED` 就尝试用 refresh token 换新，收到 `INVALID` 就跳登录页。如果两者都返回同一个通用 401，前端只能无脑跳登录，用户体验差（刚刷新页面就被踢出）。实现上：`errors.Is(err, jwt.ErrTokenExpired)` 能区分（`golang-jwt` v5 提供了这个哨兵）。**错误码的粒度要服务于客户端的决策**。
::debug
```go
uid, _ := claims["user_id"].(int64)
```
::ask 这个类型断言为什么总是失败？
::ans 因为 JSON 反序列化后数字都是 `float64`，`claims["user_id"]` 是 `float64` 而不是 `int64`。断言 `.(int64)` 失败返回 0（且 `ok` 被忽略，你连失败都不知道）。正确做法：用**强类型 Claims 结构体**：
```go
type Claims struct {
    UserID int64 `json:"user_id"`
    jwt.RegisteredClaims
}
```
`ParseWithClaims(raw, &Claims{}, ...)` 之后直接 `claims.UserID`，由 JSON 库负责转换。**永远不要用 `MapClaims` + 手动断言**——它把类型安全丢在了运行时，而错误会被 `_` 静默吞掉。
::transfer
::scene 写一个 `ParseToken(raw string) (*Claims, error)`，覆盖所有失败形态。
::ask 列出所有可能的失败，并说明各返回什么错误。
::hint 从「格式、算法、签名、过期、字段缺失」五个维度想。
::ans ① 空字符串/格式不是三段 → `ErrTokenMalformed`；② `alg` 不是 HS256 → `ErrTokenAlg`；③ 签名不匹配 → `ErrTokenInvalid`；④ `exp` 已过 → `ErrTokenExpired`（包一层哨兵，便于 `errors.Is`）；⑤ `sub` 为空或无法解析 → `ErrTokenInvalid`；⑥ 密钥配置缺失 → 这是**服务端配置错误**，返回 500 而不是 401。全部用哨兵错误，handler 里映射：前五类 → 401（expired 单独 code），第六类 → 500。**「token 有问题」和「服务端配置有问题」不能混**。
::crit 验证时检查 `err`、`token.Valid`、`alg` 三者，缺一不可
::crit 用强类型 Claims 结构体，不用 MapClaims 手动断言
::crit 过期与其他无效错误能区分（错误码粒度服务前端决策）
::crit 密钥缺失算服务端错误（500），不算认证失败（401）

<!--day 9-->
::pre 完成 D8：能解析并验证 token。
::predict
```go
func auth(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        raw := r.Header.Get("Authorization")
        claims, err := ParseToken(raw)
        if err != nil {
            Fail(w, 401, 2001, "未登录")
            return
        }
        ctx := context.WithValue(r.Context(), "uid", claims.UserID)
        next.ServeHTTP(w, r.WithContext(ctx))
    })
}
```
::ask 这段有两个问题，分别是什么？
::ans ① **没有去掉 `Bearer ` 前缀**：`Authorization: Bearer eyJ...`，直接把整串传给 `ParseToken` 会因为多了 `Bearer ` 而解析失败，所有请求都 401。必须 `strings.TrimPrefix(raw, "Bearer ")` 并校验前缀确实存在（否则 `Basic xxx` 也会被当 token）。② **context key 用了裸 string**（`"uid"`），不同包可能用同一个 key 互相覆盖，且 `go vet` 会警告。要用自定义类型。
::predict
```go
// 中间件挂在 /ledger 上
mux.Handle("GET /ledger", auth(http.HandlerFunc(h.List)))
// 但 /summary 忘了挂
mux.HandleFunc("GET /summary", h.Summary)
```
::ask 这个错误会造成什么后果？
::ans `/summary` 变成**完全公开**的接口，未登录也能查任意用户的统计（如果 handler 里用 `user_id=0` 或从 query 取，还可能查别人的）。这类漏洞的可怕之处是「功能测试全通过」——因为测试时你自己是登录状态。防法：**默认全站需要认证，白名单显式放行**（`/healthz`、`/login`、`/register`），而不是逐个路由挂。用子路由器：`protected := mux.Group(...)`（或用 `http.StripPrefix` 组合），把所有业务路由注册到受保护的 mux 上。**「默认拒绝」比「默认允许 + 逐个加锁」安全**。
::debug
```go
ctx := context.WithValue(r.Context(), uidKey, claims.UserID)
// 下游
uid, ok := r.Context().Value(uidKey).(int64)
if !ok {
    Fail(w, 401, 2001, "未登录")
}
// 但日志显示：uid = 0，ok = true
```
::ask `ok` 为 true 但值是 0，说明什么？
::ans 说明 context 里存的是 `int64(0)` 而不是「没有值」——某个中间件或 handler 存了一个零值进去，或者 `claims.UserID` 本身就是 0（token 里没有 `sub`，解析后零值）。这掩盖了「未认证」的状态。修法：中间件在存入前校验 `claims.UserID > 0`，不满足直接 401；取值时也校验 `uid > 0`。**「零值」和「不存在」必须区分**，用 `(value, ok)` 只解决了一半——还要校验 value 本身合法。
::transfer
::scene 设计认证中间件与路由分组的完整结构。
::ask 怎么组织代码，才能保证「新增路由默认受保护」？
::hint 想想「公共 mux」和「受保护 mux」两个实例。
::ans
```go
func NewRouter(h *Handler, authMW func(http.Handler) http.Handler) http.Handler {
    public := http.NewServeMux()
    public.HandleFunc("GET /healthz", h.Health)
    public.HandleFunc("POST /api/v1/register", h.Register)
    public.HandleFunc("POST /api/v1/login", h.Login)

    protected := http.NewServeMux()
    protected.HandleFunc("POST /api/v1/ledger", h.Create)
    protected.HandleFunc("GET /api/v1/ledger", h.List)
    // ... 所有业务路由

    root := http.NewServeMux()
    root.Handle("/api/v1/", authMW(protected))   // 前缀挂载
    root.Handle("/", public)
    return root
}
```
关键：**业务路由全部注册在 `protected` 上，认证只需要挂一次**；新增业务路由时因为写进 `protected` 块，天然受保护。公共路由只有明确列出的三个。**结构上防止遗漏，比靠代码评审检查可靠**。
::crit `Bearer ` 前缀正确剥离且校验存在，`Basic` 之类的不会被误当 token
::crit context key 用自定义类型，取值后校验 `> 0`
::crit 路由分组：业务路由全部在受保护 mux，公共路由显式白名单
::crit 新增一个业务路由时，不需要额外记得「加认证」

<!--day 10-->
::pre 完成 D9：认证中间件能拒绝未登录。
::predict
```go
type ctxKey int
const uidKey ctxKey = 1

// 中间件写入
ctx := context.WithValue(r.Context(), uidKey, claims.UserID)

// handler 读取
uid := r.Context().Value(uidKey).(int64)
```
::ask 直接断言不检查 `ok`，什么情况下会 panic？
::ans 当 context 里没有这个 key 时，`Value` 返回 `nil`，`nil.(int64)` 直接 panic：`interface conversion: interface {} is nil, not int64`。什么时候会没有？① 该路由忘了挂认证中间件；② 中间件因为某个分支提前 return 了但 handler 还是被调用（逻辑错误）；③ 测试里直接调 handler 没经过中间件。修法：用 `uid, ok := ...; if !ok { 401 }`，**用 `ok` 而不是靠 panic 兜底**——panic 会被 Recovery 中间件转成 500，而正确语义是 401。
::predict
```go
// handler 里
uid := r.Context().Value(uidKey).(int64)
entries, _ := h.svc.List(r.Context(), uid, month)
```
::ask 这段把 `r.Context()` 同时当作「取消信号」和「取用户身份」的载体，合理吗？
::ans 合理，而且是标准做法：context 就是「请求作用域的值 + 取消信号」的载体，用户身份属于「请求作用域的值」。但要注意两点：① **只有认证中间件能写入 uid**，业务代码只能读，不能改（否则下游可以冒充别人）；② **不要把 uid 存进 Service 的结构体字段**——Service 是长生命周期的单例，存 uid 会导致请求间串号（A 的请求读到 B 的 uid）。**身份必须沿着调用链作为参数或 context 传递，不能存在单例里**。
::debug
```go
type Service struct{ db *sql.DB; uid int64 }
func (s *Service) List(ctx context.Context, month string) ([]Entry, error) {
    return s.query(ctx, s.uid, month)   // 用了结构体里的 uid
}
```
::sym 并发测试时，用户 A 偶尔能查到用户 B 的数据。
::ask 根因是什么？这类 bug 为什么特别危险？
::ans 根因：`Service` 是单例，`s.uid` 被所有请求共享，A 的请求刚设置完，B 的请求就覆盖了，于是 A 用了 B 的 uid 查数据——**这是最严重的一类越权漏洞，而且偶发**，因为取决于并发时序。危险在于：① 测试时串行调用，永远复现不了；② 日志里看起来「A 查了 A 的数据」，因为日志也读的是被覆盖后的值；③ 一旦发生就是数据泄漏。修法：**uid 只作为函数参数或 context 值传递，绝不存进任何长生命周期对象**。这条规则没有例外。
::transfer
::scene 改造所有业务 handler，从 context 取 uid 并传给 Service。
::ask 有更好的方式避免「每个 handler 都写一遍取值」吗？
::hint 想想泛型 middle 或 helper 函数。
::ans 用一个 helper + 自定义 handler 类型：
```go
type AuthedHandler func(w http.ResponseWriter, r *http.Request, uid int64) error

func (h *Handler) wrap(fn AuthedHandler) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        uid, ok := r.Context().Value(uidKey).(int64)
        if !ok || uid <= 0 { Fail(w, 401, 2001, "未登录"); return }
        if err := fn(w, r, uid); err != nil { h.writeError(w, r, err) }
    }
}
// 使用
mux.HandleFunc("GET /ledger", h.wrap(h.list))
```
好处：**uid 的获取与校验只写一次**，业务函数签名里显式出现 `uid`（不会忘），错误处理也统一了。代价是多一层包装——但换来的是「不可能忘记取 uid」这个结构保证。
::crit handler 从 context 取 uid 时检查 `ok` 与 `> 0`，不裸断言
::crit uid 只通过参数/context 传递，Service 结构体里没有 uid 字段
::crit 用 helper 收敛「取值 + 校验 + 错误映射」，业务函数签名显式带 uid
::crit 能复现「单例存 uid 导致串号」的并发 bug，并说明为何测试难发现

<!--day 11-->
::pre 完成 D10：能拿到 uid。
::predict
```go
func (r *repo) List(ctx context.Context, month string) ([]Entry, error) {
    rows, err := r.db.QueryContext(ctx,
        `SELECT ... FROM entries WHERE date >= ? AND date < ?`, start, end)
}
```
::ask 这个查询有什么致命问题？
::ans **漏了 `user_id` 条件**，会返回所有用户的账目——最严重的数据越权。这类 bug 的特点：功能测试完全正常（因为你只有一个测试用户），代码评审时 `WHERE` 子句看起来很正常（有日期条件），只有多用户场景才暴露。**每一条涉及用户数据的查询，都必须带 `user_id = ?`，没有例外**。防法：① Repository 层的方法签名强制带 `uid int64`（不提供不带 uid 的版本）；② 代码评审时专门检查每个 WHERE；③ 写一个「两个用户交叉验证」的测试。
::predict
```go
// 更新
UPDATE entries SET amount = ? WHERE id = ?
// 删除
DELETE FROM entries WHERE id = ?
```
::ask 这两条有什么问题？攻击者怎么利用？
::ans 都漏了 `AND user_id = ?`。攻击者只要猜到别人的 entry id（自增 ID 很容易枚举），就能改或删别人的账目——**水平越权**。正确写法：`WHERE id = ? AND user_id = ?`，然后检查 `RowsAffected()`：为 0 说明「不存在或不属于你」，统一返回 404（**不要返回 403**，403 会泄漏「这条记录存在但不是你的」）。`UPDATE`/`DELETE` 的 `WHERE` 条件必须和 `SELECT` 一样严格。
::debug
```sql
-- 索引
CREATE INDEX idx_date ON entries(date);
-- 查询
SELECT * FROM entries WHERE user_id = 1 AND date >= '2026-10-01' ORDER BY date DESC;
```
::ask 这个索引对上面的查询有效吗？该怎么建？
::ans 部分有效但低效：`idx_date` 能用于日期范围，但 `user_id` 条件只能回表后过滤——如果某个用户数据占比很小，会扫描大量不属于他的行。正确索引：`(user_id, date)`，让「等值 + 范围」都走索引。**索引要按「查询的 WHERE 顺序」设计，不是按「哪个字段重要」**。加了 user_id 条件后，原来的索引设计要重新审视——这是加鉴权时最容易忽略的性能回归。
::transfer
::scene 你要在代码结构上保证「不可能写出漏 user_id 的查询」。
::ask 有哪几种做法？各自的代价是什么？
::hint 想想「接口设计」「数据库视图」「ORM 作用域」。
::ans ① **接口强制**：Repository 所有方法第一个参数是 `uid int64`，内部实现必须用；不提供不带 uid 的公开方法。代价：偶尔需要「管理员查全部」时要另开接口。② **数据库视图**：`CREATE VIEW my_entries AS SELECT * FROM entries WHERE user_id = ...`——但 SQLite 视图不能用会话变量，做不到按请求过滤，不适用。③ **ORM scope / 全局钩子**：GORM 可以用 `Scopes` 或 callback 自动加条件，但隐式行为难调试。④ **代码检查**：CI 里 grep `FROM entries` 后必须跟 `user_id`，或用 `sqlc` 之类的工具生成查询。结论：**①为主（接口强制）+ ④为辅（CI 检查）**，其余两种都有明显副作用。
::crit 所有 SELECT/UPDATE/DELETE 都带 `user_id`，且更新/删除检查 `RowsAffected`
::crit 越权访问返回 404 而非 403（不泄漏资源存在性）
::crit 索引按 `(user_id, date)` 重建，能说出「加了 user_id 后索引为何要变」
::crit 有一个「A 用户尝试读/改/删 B 的记录」的测试，且断言失败

<!--day 12-->
::pre 完成 D11：数据隔离已生效。
::predict
```go
type User struct {
    ID           int64  `json:"id"`
    Email        string `json:"email"`
    PasswordHash string `json:"password_hash"`
}
// handler
OK(w, user)
```
::ask 这个响应有什么问题？
::ans 把 `password_hash` 直接返回给客户端了。虽然哈希不可逆，但泄漏后攻击者可以离线爆破（尤其弱密码），而且这明显违反了「响应中不得包含敏感字段」的底线。修法有两条：① 加 `json:"-"` 让序列化跳过；② **用独立的响应 DTO**（`UserDTO{ID, Email}`）。**推荐 ②**——`json:"-"` 是「记得别序列化」的约定，而 DTO 是「类型上就不存在这个字段」，后者不依赖人的注意力。
::predict
```go
// 同一个结构体既做 DB 模型又做 API 响应
type Entry struct {
    ID        int64  `json:"id"`
    UserID    int64  `json:"user_id"`
    Amount    int64  `json:"amount"`
    DeletedAt string `json:"deleted_at"`
}
```
::ask 直接返回这个结构体会泄漏什么？
::ans 泄漏 `user_id`（客户端知道内部 ID 体系，便于枚举）和 `deleted_at`（暴露软删除机制，攻击者可推测数据生命周期）。更重要的是：**DB 模型和 API 契约耦合后，任何一次表结构变更都会改变 API**——加个内部字段就意外暴露，改个字段名就破坏客户端。正确做法：DB 模型（`model.Entry`）和响应 DTO（`api.EntryResp`）分离，中间做显式映射。**多写一个映射函数的成本，远低于一次意外泄漏**。
::debug
```bash
curl -s /login -d '{"email":"a@x.com","password":"..."}' | grep -i 'password\|argon\|\$2'
# 有输出
```
::ask 这条验收命令在查什么？为什么正则要覆盖三种形态？
::ans 查「响应体里有没有密码相关痕迹」。三种形态：① 字段名 `password`（有人加了 `json:"password_hash"`）；② `$argon2`（哈希被塞进别的字段，比如 `note`）；③ `$2a$`/`$2b$`（bcrypt 哈希）。只查字段名会漏掉「哈希被拼进错误信息」或「被塞进其他字段」的情况。**验收脚本要检查「值的形态」，不只检查「键的名字」**。
::transfer
::scene 写阶段四的完整验收脚本。
::ask 列出必须验证的项，以及每项的具体命令。
::hint 覆盖：注册、登录、无 token、A/B 隔离、响应无哈希、改密码后旧 token 失效。
::ans
```bash
# 1 注册 A、B（用时间戳保证唯一）
# 2 登录 A、B 拿 token
# 3 无 token 访问 /ledger → 401
# 4 错 token 访问 → 401
# 5 A 创建一条 → 201
# 6 A 列表能看到 1 条
# 7 B 列表看到 0 条          ← 数据隔离核心
# 8 B 用 A 的 entry_id 查详情 → 404
# 9 B 用 A 的 entry_id 删除 → 404，且 A 的数据还在
# 10 所有响应 grep -Ei 'password|argon2|\$2[aby]\$' → 无输出
# 11 A 改密码 → 旧 token 访问 → 401（若实现了 token_version）
```
第 7、8、9 是核心——**「A 看不到 B」不能只测列表，还要测单条详情与写操作**，因为漏 user_id 的位置往往只在其中一个。第 11 项取决于是否实现了吊销，没做要明确写「未实现」而不是假装通过。
::crit 响应里搜不到 `password` / `argon2` / `$2a$` 任一形态
::crit 有「A 创建、B 看不到、B 改不动、B 删不掉」四项交叉测试
::crit 无 token 与错 token 都返回 401，且错误码一致
::crit 用 DTO 而非 DB 模型做响应，`user_id`/`deleted_at` 不外泄
