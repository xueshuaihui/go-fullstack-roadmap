<!--day 1 | core-->
#### 密码不能加密，只能哈希
「加密」意味着可解密，只要密钥泄漏就全盘皆输。密码存储只能用**单向哈希**：验证时把用户输入再哈希一次，比较结果。

但普通哈希（SHA-256）也不行——它太快了。现代 GPU 每秒能算几十亿次 SHA-256，一个 8 位密码的哈希库几个小时内就能暴力破解完。所以密码哈希必须**故意慢**，并且**每个用户加盐**。

#### 三种攻击，三个对应设计
| 攻击 | 手段 | 防御 |
| :--- | :--- | :--- |
| 彩虹表 | 预计算 hash→明文 表 | 每用户唯一盐值 |
| 暴力枚举 | 高速 GPU 试密码 | 慢哈希 + 参数可调 |
| 撞库 | 拿到别的站密码库 | 慢哈希 + 限流 + 不存明文 |

**盐值不需要保密**，它和哈希一起存。它的作用是让「同一个密码」在不同用户那里产生不同哈希，从而让预计算表失效。

#### 为什么首选 Argon2id
Argon2 是密码哈希竞赛（PHC）的获胜者，`id` 是混合模式：先用 `Argon2i` 的抗侧信道特性填充内存，再用 `Argon2d` 的抗 GPU 特性计算。它的关键优势是**内存硬（memory-hard）**：每次计算需要占用大量内存，GPU 的并行优势被内存带宽卡死。

OWASP 2025 推荐参数：
```
m = 64 MiB   (内存)
t = 3        (迭代次数)
p = 4        (并行度)
```
目标：**单次哈希 150–250ms**。太慢会让登录接口被拖死（还可被用来做 DoS），太快则防护不足。

内存受限环境（小内存 VPS、容器限 128MB）退回 OWASP 最小值：
```
m = 19 MiB, t = 2, p = 1
```

#### bcrypt 是合格的备选，但有两个硬限制
```go
hash, _ := bcrypt.GenerateFromPassword([]byte(pw), 12)
```
1. **cost 必须显式写 12**，不要用 `bcrypt.DefaultCost`（当前是 10，偏低，而且会随版本变化）。
2. **输入最长 72 字节**，超出部分被静默截断。长密码要先 SHA-256 再 base64 再交给 bcrypt，否则「前 72 字节相同的两个密码」等价。

#### 判据
写一个基准测试，确认单次哈希落在 150–250ms：
```go
func BenchmarkHash(b *testing.B) {
    for i := 0; i < b.N; i++ {
        hashPassword("correct horse battery staple")
    }
}
// go test -bench=Hash -benchtime=10x
```
如果只有 20ms，说明参数太低；超过 500ms，说明服务器扛不住并发登录。

::q 为什么不能用 SHA-256 存密码？
::a SHA-256 设计目标是快，GPU 每秒可算数十亿次，暴力破解 8 位密码的成本极低。密码哈希需要「故意慢」且「内存硬」，才能让每次尝试都昂贵，把暴力破解的可行性降到可接受范围。
::q 盐值需要保密吗？它的作用是什么？
::a 不需要保密，和哈希一起存即可。作用是让相同密码产生不同哈希，使预计算的彩虹表失效，并防止「一次破解、多处通用」。攻击者只能针对单个用户逐个暴力破解，成本大幅上升。
::q Argon2id 相比 bcrypt 的核心优势是什么？
::a 内存硬。bcrypt 只消耗 CPU，GPU/ASIC 可以大规模并行；Argon2id 每次计算要占用几十 MB 内存，并行规模被内存带宽限制。同时它的参数（内存、迭代、并行度）更细粒度，能按硬件能力调整。

<!--day 2 | core-->
#### 编码格式要自带参数，否则以后改不了
```go
// PHC 字符串格式
// $argon2id$v=19$m=65536,t=3,p=4$<salt-b64>$<hash-b64>
```
**把参数写进哈希串**，验证时从串里解析出来。这样以后提高参数，老用户的密码仍能用旧参数验证，下次登录时再按新参数重算（渐进式升级）。如果把参数写死在代码常量里，改一次就会让所有老用户无法登录。

```go
func hashPassword(pw string) (string, error) {
    salt := make([]byte, 16)
    if _, err := rand.Read(salt); err != nil {
        return "", fmt.Errorf("read salt: %w", err)
    }
    // 参数：64MiB, t=3, p=4, keyLen=32
    h := argon2.IDKey([]byte(pw), salt, 3, 64*1024, 4, 32)
    return fmt.Sprintf("$argon2id$v=%d$m=%d,t=%d,p=%d$%s$%s",
        argon2.Version, 64*1024, 3, 4,
        base64.RawStdEncoding.EncodeToString(salt),
        base64.RawStdEncoding.EncodeToString(h)), nil
}
```
用 `base64.RawStdEncoding`（不带 `=` 填充），因为 PHC 格式里的 `$` 是分隔符，填充符会带来歧义。

#### 验证必须用恒定时间比较
```go
func verifyPassword(pw, encoded string) (bool, error) {
    parts := strings.Split(encoded, "$")
    if len(parts) != 6 || parts[1] != "argon2id" {
        return false, fmt.Errorf("invalid hash format")
    }
    var m uint32
    var t uint32
    var p uint8
    if _, err := fmt.Sscanf(parts[3], "m=%d,t=%d,p=%d", &m, &t, &p); err != nil {
        return false, fmt.Errorf("parse params: %w", err)
    }
    salt, err := base64.RawStdEncoding.DecodeString(parts[4])
    if err != nil { return false, err }
    want, err := base64.RawStdEncoding.DecodeString(parts[5])
    if err != nil { return false, err }

    got := argon2.IDKey([]byte(pw), salt, t, m, p, uint32(len(want)))
    return subtle.ConstantTimeCompare(got, want) == 1, nil
}
```
**`subtle.ConstantTimeCompare`** 而不是 `bytes.Equal`：后者在第一个不同字节就返回，比较耗时随匹配前缀长度变化，理论上可被计时攻击推断哈希。密码比较必须恒定时间。

#### 三个必须避免的写法
1. 明文或 MD5/SHA1 存库——直接不合格。
2. 固定盐（全局一个 salt）——等于没有盐。
3. 把哈希和密码一起返回给前端——`json:"-"` 或独立 DTO。

#### 判据
```go
h1, _ := hashPassword("same-password")
h2, _ := hashPassword("same-password")
fmt.Println(h1 == h2)   // false（盐不同）

ok, _ := verifyPassword("same-password", h1)   // true
ok, _ = verifyPassword("wrong", h1)            // false
```

::q 为什么参数要编码进哈希字符串，而不是写在代码常量里？
::a 因为参数会随硬件升级而调整。写进字符串后，老哈希仍能用它自己的参数验证，新密码用新参数，实现平滑升级；写死在代码里则一改参数全体用户无法登录。这是密码存储必须遵守的向前兼容设计。
::q `bytes.Equal` 比较哈希为什么不够安全？
::a 它在遇到第一个不同字节时立刻返回，比较耗时与「匹配前缀长度」相关。攻击者可以通过大量请求测量时间差，逐字节推断出正确哈希（理论上可行，实践中需要极稳定的环境）。`subtle.ConstantTimeCompare` 无论内容如何都比较完全部字节。
::q 同一个密码两次哈希结果不同，会不会导致登录失败？
::a 不会。验证时从存储的字符串里取出盐值，用同样的参数重新计算，再比较哈希。盐值随哈希一起存，所以能复现。这也说明「哈希不同」正是盐生效的证据。

<!--day 3 | normal-->
#### cost 是「时间成本」，不是安全等级
```go
const cost = 12
hash, err := bcrypt.GenerateFromPassword([]byte(pw), cost)
err = bcrypt.CompareHashAndPassword(hash, []byte(pw))
```
cost=12 意味着 2^12 = 4096 轮。每加 1，耗时翻倍。现代服务器上 cost=12 大约 200–300ms，符合目标区间。

**显式写 12 的理由**：`bcrypt.DefaultCost` 是 10，约 50–80ms，偏低；而且默认值可能随库版本变化，导致你的安全基线悄悄漂移。

#### 72 字节限制不能忽略
```go
// 超过 72 字节被静默截断
bcrypt.GenerateFromPassword([]byte(strings.Repeat("a", 100)), 12)
```
两个前 72 字节相同的密码会被判为同一个。修复方式（bcrypt 官方推荐）：
```go
sum := sha256.Sum256([]byte(pw))
pw64 := base64.StdEncoding.EncodeToString(sum[:])   // 44 字节，稳定
bcrypt.GenerateFromPassword([]byte(pw64), cost)
```
注意：这个预处理**必须固定**，一旦上线就不能改，否则所有密码失效。

#### 迁移路径：从 bcrypt 到 Argon2id
1. 验证时先看哈希前缀（`$2a$` → bcrypt，`$argon2id$` → Argon2）。
2. 用对应算法验证。
3. 验证成功后，若算法过时，立即用新算法重算并更新库。
4. 长期不登录的用户保持旧哈希，不影响使用。

**这个模式叫「登录时重哈希」，是密码算法升级的唯一平滑路径。**

#### 成本参数怎么定：从目标耗时反推
不要凭感觉选 cost。步骤：
```go
for c := 10; c <= 14; c++ {
    start := time.Now()
    bcrypt.GenerateFromPassword([]byte("benchmark-password"), c)
    fmt.Printf("cost=%d %v\n", c, time.Since(start))
}
```
在**目标部署机器**上跑，选落在 150–250ms 的最小 cost。开发机通常比家庭服务器快 3–5 倍，在 MacBook 上测出的 200ms，到小主机上可能变成 800ms——登录会明显变慢。

#### 并发下的现实问题
每次登录要占 200ms CPU。如果同时有 10 个登录请求，就需要 2 秒的 CPU 时间。家庭账本无所谓，但要知道：**慢哈希会把「登录接口」变成最容易被打的资源**。这也是为什么阶段六要把限流放在认证之前。

#### 判据
```go
start := time.Now()
bcrypt.GenerateFromPassword([]byte("x"), 12)
fmt.Println(time.Since(start))   // 150–300ms
```
跑 10 次取中位数，确认没有抖动到 1s 以上（否则并发登录会排队）。

::q 为什么不用 `bcrypt.DefaultCost`？
::a 它的当前值是 10，约 50–80ms，低于 OWASP 建议的 150ms 下限；而且默认值属于库的实现细节，升级库版本可能变化，你会在不知情的情况下改变安全基线。显式写常数才能被 review 和测试。
::q bcrypt 的 72 字节截断会造成什么实际问题？
::a 两个前 72 字节相同、后面不同的密码会被认为是同一个，用户以为自己设了长密码但实际只有前 72 字节生效。修复是先做 SHA-256 再 base64（固定 44 字节）后交给 bcrypt，但这个预处理一旦上线不可更改。
::q 「登录时重哈希」解决了什么问题？
::a 它让算法和参数可以升级而不用强制所有用户改密码：老哈希继续能验证，验证成功的那一刻用新算法重算并覆盖。这样存量用户在自然登录过程中逐步迁移，不需要一次性迁移窗口。

<!--day 4 | normal-->
#### 表设计：约束写在数据库里，不只写在代码里
```sql
CREATE TABLE users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    email         TEXT    NOT NULL UNIQUE,
    password_hash TEXT    NOT NULL,
    created_at    TEXT    NOT NULL
);
CREATE UNIQUE INDEX idx_users_email ON users(email);
```
**`UNIQUE` 是并发安全的最后一道防线。** 「先查邮箱是否存在，再插入」这个流程在两个并发请求下都能查到「不存在」，然后都插入成功。只有数据库的唯一约束能真正拦住。

所以注册接口的正确写法是：
```go
_, err := db.ExecContext(ctx, `INSERT INTO users (email, password_hash, created_at) VALUES (?,?,?)`, ...)
if isUniqueViolation(err) {
    return ErrEmailTaken
}
```
而不是先 SELECT 再 INSERT。

#### 邮箱规范化
```go
email = strings.ToLower(strings.TrimSpace(email))
```
不规范化会导致 `A@x.com` 和 `a@x.com` 被当成两个账号，用户自己都记不清注册的是哪个。注意：只在存储和比较时规范化，展示时保留原样（如果要保留大小写，就额外存一列 `email_display`）。

#### 识别唯一约束冲突
```go
func isUniqueViolation(err error) bool {
    if err == nil { return false }
    msg := err.Error()
    return strings.Contains(msg, "UNIQUE constraint failed") ||
           strings.Contains(msg, "constraint failed: UNIQUE")
}
```
SQLite 的错误是字符串，不同驱动措辞略有差异。**这类字符串判断要集中在一个函数里**，将来换 Postgres（有 `SQLSTATE 23505`）只改这一处。

#### 判据
```sql
INSERT INTO users (email, password_hash, created_at) VALUES ('a@x.com','h','2026-10-19');
INSERT INTO users (email, password_hash, created_at) VALUES ('a@x.com','h','2026-10-19');
-- 第二条必须报 UNIQUE constraint failed
```
再用两个并发请求打注册接口，只有一个成功。

::q 「先查邮箱是否存在，再插入」为什么不可靠？
::a 存在 TOCTOU 竞态：两个并发请求可能同时查到「不存在」，然后都执行插入。数据库的唯一约束才是原子性的保证。正确做法是直接 INSERT 并捕获唯一冲突错误，把它转成业务错误。
::q 邮箱为什么要统一转小写？
::a 因为用户会把 `A@x.com` 和 `a@x.com` 当作同一个邮箱，若不规范化就会注册出两个账号，后续登录、找回密码都会混乱。规范化的时机应在入库前，比较时也用小写。
::q 把「唯一约束冲突」的判断写成字符串匹配，风险是什么？
::a 依赖驱动的错误文案，换驱动或升级版本可能失效，导致冲突被当成 500。缓解办法是集中在单个函数里，并为它写测试；换数据库时只需改这一处（Postgres 可用 SQLSTATE 判断）。

<!--day 5 | normal-->
#### 注册的四步：规范化 → 校验 → 哈希 → 插入
```go
func (s *Service) Register(ctx context.Context, email, pw string) (int64, error) {
    email = strings.ToLower(strings.TrimSpace(email))
    if !strings.Contains(email, "@") {
        return 0, &ValidationError{Field: "email", Msg: "格式不正确"}
    }
    if len(pw) < 10 {                     // 长度优先于复杂度
        return 0, &ValidationError{Field: "password", Msg: "至少 10 位"}
    }

    hash, err := hashPassword(pw)
    if err != nil { return 0, fmt.Errorf("hash: %w", err) }

    id, err := s.store.CreateUser(ctx, email, hash)
    if errors.Is(err, store.ErrDuplicate) {
        return 0, ErrEmailTaken
    }
    return id, err
}
```

#### 为什么「长度优先于复杂度」
NIST SP 800-63B 明确建议：**要求长度，不要求大小写+数字+符号的混合**。强制混合会让人写出 `Passw0rd!` 这种可预测的密码，而 16 位纯小写短语的熵高得多。也不要做定期强制改密（会催生 `Passw0rd1` → `Passw0rd2`）。

#### 注册接口的返回
- 成功：`201`，返回 `{id, email}`，**绝不返回 hash**。
- 邮箱已存在：`409 Conflict`，`code=EMAIL_TAKEN`。
  - 更严格的隐私考虑是不暴露「邮箱是否已注册」，但那会牺牲用户体验。家庭内网场景可以直接返回 409。

#### 不该在注册里做的事
- 不要「注册成功自动登录」——把签发 token 的逻辑耦合进来，测试会变复杂。让前端再调一次 `/login`。
- 不要在注册时校验「密码不含邮箱前缀」，规则越奇葩越容易被绕过。

#### 判据
```bash
curl -i -X POST localhost:8080/register -d '{"email":"a@x.com","password":"correct horse battery"}'
# 201
curl -i -X POST localhost:8080/register -d '{"email":"A@X.com","password":"correct horse battery"}'
# 409（规范化生效）
```
第二条必须是 409，否则说明大小写没统一。

::q 为什么密码规则更该要求长度而不是大小写+符号混合？
::a 强制混合会诱导用户产生可预测的变形（`Password1!`），实际熵不高；而长短语（如四个随机单词）熵更高且更好记。NIST 800-63B 因此建议以长度为主，并禁止强制定期改密。
::q 注册成功为什么不该顺便签发 token？
::a 会把「账号创建」和「会话建立」两个关注点耦合在一起：测试注册要连带验证 JWT，改认证方案要动注册逻辑，也无法单独支持「注册后要求邮箱验证再登录」的流程。分开更清晰。
::q 返回 409 而不是 400，差别在哪？
::a 409 表示「请求与服务器当前状态冲突」（邮箱已被占用），400 表示「请求本身格式错误」。前端可以据此给出不同提示（提示登录 vs 提示改格式），监控上也能区分用户行为与参数错误。

<!--day 6 | core-->
#### 登录必须做的事：统一错误、恒定时间、不区分账号密码
```go
func (s *Service) Login(ctx context.Context, email, pw string) (string, error) {
    email = strings.ToLower(strings.TrimSpace(email))
    u, err := s.store.FindUserByEmail(ctx, email)
    if errors.Is(err, store.ErrNotFound) {
        // 仍然跑一次哈希，抹平时间差
        _, _ = verifyPassword(pw, dummyHash)
        return "", ErrInvalidCredentials
    }
    if err != nil { return "", fmt.Errorf("find user: %w", err) }

    ok, err := verifyPassword(pw, u.PasswordHash)
    if err != nil || !ok {
        return "", ErrInvalidCredentials
    }
    return s.issueToken(u.ID, u.Email)
}
```
三个关键点：

1. **统一错误 `ErrInvalidCredentials`**。区分「用户不存在」和「密码错误」等于给攻击者一个账号枚举接口。
2. **用户不存在时也跑一次哈希**。否则「不存在」立即返回、「存在」要 200ms，攻击者靠响应时间就能枚举账号。这叫**时间侧信道**。
3. **`dummyHash`** 是一个预先算好的合法哈希串，用来消耗同样的时间。

#### 会话建立后的两件事
```go
// 1. 记录登录审计（可选但有用）
s.store.LogLogin(ctx, u.ID, r.RemoteAddr, time.Now())

// 2. 签发 token（阶段六改为 HttpOnly Cookie）
token, err := s.issueToken(u.ID, u.Email)
```

#### 限流是登录接口的必需品
即使哈希很慢，攻击者仍可以高频打接口。最低限度：**同一 IP + 同一邮箱，连续失败 5 次后延迟递增（指数退避），或锁定 15 分钟。** 阶段六会讲限流中间件的位置，现在至少要知道「没有限流 = 慢哈希只是让攻击变慢，而不是不可行」。

#### 判据
```bash
time curl -s -X POST localhost:8080/login -d '{"email":"nobody@x.com","password":"whatever"}'
time curl -s -X POST localhost:8080/login -d '{"email":"a@x.com","password":"wrong"}'
```
两次耗时应当在同一量级（相差不超过 2 倍），且都返回同样的 `code=INVALID_CREDENTIALS`。

::q 为什么「用户不存在」时还要跑一次密码哈希？
::a 为了让两条路径耗时接近。如果「不存在」立即返回、「存在但密码错」要 200ms，攻击者仅凭响应时间就能判断账号是否注册，形成账号枚举漏洞。跑一次 dummy 哈希可以抹平这个差异。
::q 登录失败为什么统一返回「邮箱或密码错误」？
::a 区分两者会让攻击者先枚举出有效邮箱，再进行针对性爆破。统一错误把「账号是否存在」这个信息隐藏起来。代价是用户体验略差（不知道是哪个错），这是安全与体验的常见取舍。
::q 有了 200ms 的慢哈希，还需要限流吗？
::a 需要。慢哈希只是把单次尝试的成本提高，攻击者仍可并发发起大量请求（尤其分布式），还可能借登录接口消耗服务器 CPU 做 DoS。限流控制的是「单位时间尝试次数」，与单次成本互补。

<!--day 7 | core-->
#### JWT 的三个部分，以及「为什么不能放敏感信息」
```
header.payload.signature
```
- header：`{"alg":"HS256","typ":"JWT"}`，base64url 编码，**明文可读**。
- payload：claims，base64url 编码，**明文可读**（任何人拿到 token 都能解出内容）。
- signature：用密钥对 `header.payload` 签名，防篡改。

**关键认知：JWT 是签名，不是加密。** 放进去的 `user_id`、`email` 谁都能看到，所以绝不放密码、手机号、身份证。

#### 签发
```go
type Claims struct {
    UserID int64  `json:"uid"`
    Email  string `json:"email"`
    jwt.RegisteredClaims
}

func (s *Service) issueToken(uid int64, email string) (string, error) {
    now := time.Now()
    claims := Claims{
        UserID: uid,
        Email:  email,
        RegisteredClaims: jwt.RegisteredClaims{
            Subject:   strconv.FormatInt(uid, 10),
            IssuedAt:  jwt.NewNumericDate(now),
            ExpiresAt: jwt.NewNumericDate(now.Add(2 * time.Hour)),
            Issuer:    "family-ledger",
        },
    }
    tok := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return tok.SignedString([]byte(s.secret))
}
```
claims 用结构体而不是 `map[string]any`：类型安全、能统一校验 `exp`。

#### 有效期与刷新
- **access token 短（15 分钟–2 小时）**：泄漏后的窗口可控。
- **refresh token 长（7–30 天）**，只存哈希在库里，可吊销。
- 家庭账本可以简化：2 小时 access + 重新登录。**但要明确这是一个取舍**，不是「不需要刷新」。

#### 密钥管理
```go
secret := os.Getenv("JWT_SECRET")
if len(secret) < 32 {
    log.Fatal("JWT_SECRET 必须至少 32 字节")
}
```
- **不写死在代码或配置文件里**，走环境变量 / secrets。
- 长度至少 32 字节（HS256 的密钥强度应不低于哈希输出）。
- 启动时校验，**缺失就退出**，不要用默认值兜底——默认密钥等于没有密钥。

#### 判据
把 token 贴到 jwt.io 或本地解码，能看到 `uid`、`exp`；把 payload 改一位再请求，签名验证必须失败。

::q JWT 的 payload 是加密的吗？
::a 不是，只是 base64url 编码，任何人可解。安全性来自签名（防篡改），不来自保密。所以 payload 里不能放密码、手机号、身份证等敏感信息；需要保密就得用 JWE（加密 JWT），成本更高。
::q `HS256` 和 `RS256` 该怎么选？
::a 单一服务自己签发自己验证，用 HS256（对称密钥）最简单。如果验证方是多个独立服务、不希望它们持有签发密钥，用 RS256（私钥签、公钥验）。家庭账本单服务，HS256 足够。
::q 为什么密钥缺失时应该启动失败，而不是用默认值？
::a 默认值意味着所有部署共用同一个公开密钥，任何人都能伪造合法 token，认证形同虚设。启动即失败能让配置错误在部署阶段暴露，而不是以「看起来正常但完全不安全」的方式上线。

<!--day 8 | core-->
#### 验证要检查的四个东西
```go
func (s *Service) parseToken(raw string) (*Claims, error) {
    var claims Claims
    tok, err := jwt.ParseWithClaims(raw, &claims, func(t *jwt.Token) (any, error) {
        if t.Method.Alg() != jwt.SigningMethodHS256.Alg() {
            return nil, fmt.Errorf("unexpected alg: %s", t.Method.Alg())
        }
        return []byte(s.secret), nil
    })
    if err != nil { return nil, mapJWTError(err) }
    if !tok.Valid { return nil, ErrInvalidToken }
    return &claims, nil
}
```
1. **签名** — 库自动验证。
2. **算法** — 必须显式校验！`alg: none` 攻击和 `HS256↔RS256` 混淆攻击都靠这里拦住。
3. **过期** — `exp` 由库自动检查（`tok.Valid`）。
4. **签发者/受众** — 多服务场景要校验 `iss` / `aud`，单服务可省。

#### 错误分类，决定返回什么状态码
```go
func mapJWTError(err error) error {
    switch {
    case errors.Is(err, jwt.ErrTokenExpired):
        return ErrTokenExpired        // → 401 + code=TOKEN_EXPIRED
    case errors.Is(err, jwt.ErrTokenMalformed):
        return ErrInvalidToken        // → 401 + code=INVALID_TOKEN
    case errors.Is(err, jwt.ErrTokenSignatureInvalid):
        return ErrInvalidToken
    default:
        return ErrInvalidToken
    }
}
```
**`TOKEN_EXPIRED` 要单独给码**：前端据此触发「静默刷新」或「跳登录」，而 `INVALID_TOKEN` 应当直接清空本地凭证。两者混在一起，前端只能一律跳登录，体验差。

#### 四个常见坑
1. **忘记校验算法** → `alg: none` 伪造通过（老库有漏洞，但自己的代码也常漏）。
2. **把 `exp` 当唯一失效手段** → 无法主动吊销。登出、改密码后旧 token 仍有效 2 小时。需要吊销就加 `token_version` 字段或黑名单。
3. **时间偏差** → 服务器与签发机时钟差几分钟会导致误判。用 NTP 同步，必要时给 `leeway`。
4. **把 token 放在 URL 里** → 会进浏览器历史、代理日志、Referer。只能放 Header 或 HttpOnly Cookie。

#### 判据
```bash
# 篡改 payload 一位
curl -i -H "Authorization: Bearer <tampered>" localhost:8080/ledger
# 401 + code=INVALID_TOKEN

# 用过期 token
# 401 + code=TOKEN_EXPIRED
```

::q 为什么必须显式校验 `t.Method.Alg()`？
::a 防止算法混淆攻击：攻击者把 header 的 alg 改成 `none` 或从 RS256 改成 HS256，诱导验证方用公钥当作 HMAC 密钥，从而伪造签名。只信任自己签发的算法，是 JWT 验证的必备步骤。
::q `TOKEN_EXPIRED` 和 `INVALID_TOKEN` 为什么要分成两个 code？
::a 前端处理方式不同：过期可以静默刷新或提示「登录已过期」，无效则必须清空本地凭证重新登录。合并成一个码会让前端无法区分，只能一律跳登录，交互变差。
::q JWT 签发后，用户改密码，旧 token 还有效吗？
::a 默认仍有效直到 `exp` 到期，因为验证只看签名和过期时间。要立即失效，需要在用户表加 `token_version`（签发时写进 claims，验证时比对），或维护吊销黑名单。这是无状态 token 的固有代价。

<!--day 9 | core-->
#### 中间件的职责边界
```go
func WithAuth(svc *Service) func(http.Handler) http.Handler {
    return func(next http.Handler) http.Handler {
        return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            raw := bearerToken(r)
            if raw == "" {
                Fail(w, http.StatusUnauthorized, "UNAUTHORIZED", "missing token")
                return
            }
            claims, err := svc.parseToken(raw)
            if err != nil {
                code, status := "INVALID_TOKEN", http.StatusUnauthorized
                if errors.Is(err, ErrTokenExpired) { code = "TOKEN_EXPIRED" }
                Fail(w, status, code, "invalid token")
                return
            }
            ctx := context.WithValue(r.Context(), userIDKey, claims.UserID)
            next.ServeHTTP(w, r.WithContext(ctx))     // 必须 WithContext
        })
    }
}

func bearerToken(r *http.Request) string {
    h := r.Header.Get("Authorization")
    const prefix = "Bearer "
    if len(h) <= len(prefix) || !strings.EqualFold(h[:len(prefix)], prefix) {
        return ""
    }
    return strings.TrimSpace(h[len(prefix):])
}
```
中间件只做三件事：**提取 → 验证 → 注入 context**。不做业务判断（比如「这个用户能不能看这条账」——那属于数据隔离，在查询里做）。

#### 为什么用 `strings.EqualFold`
`Bearer` 大小写不敏感（RFC 6750）。用 `==` 比较会在某些客户端失败，表现为「token 明明传了却 401」。`Bearer` 后的**单个空格**也是常见错误点：`Bearer  xxx`（两个空格）会让 token 带上前导空格导致签名失败，`TrimSpace` 可以兜住。

#### 不该用中间件做的事
- 不要在中间件里查数据库取用户详情（每个请求一次查询，且拿不到就用不了）。需要时在 handler 里按 `uid` 查。
- 不要在中间件里做「权限分级」（admin/user）——那是独立的 `WithRole` 中间件，职责分离。
- 不要对 `/login`、`/register`、`/healthz` 套认证。**套错会导致登录接口要求登录**，这类 bug 很常见。

#### 路由分组
```go
public := http.NewServeMux()
public.HandleFunc("POST /login", login(svc))
public.HandleFunc("POST /register", register(svc))
public.HandleFunc("GET /healthz", healthz)

protected := http.NewServeMux()
protected.HandleFunc("GET /ledger", listEntries(svc))
protected.HandleFunc("POST /ledger", createEntry(svc))

root := http.NewServeMux()
root.Handle("/", WithAuth(svc)(protected))   // 兜底：其余全部需要认证
root.Handle("/login", public)
```
用「一个兜底认证 + 显式公开路径」的结构，比逐个路由套认证安全——**漏套的后果是裸奔，漏放的后果只是多一次 401。**

#### 判据
```bash
curl -i localhost:8080/ledger                                # 401
curl -i -H "Authorization: Bearer x" localhost:8080/ledger   # 401 INVALID_TOKEN
curl -i -H "Authorization: Bearer $TOKEN" localhost:8080/ledger  # 200
curl -i -X POST localhost:8080/login -d '{...}'              # 不能被 401 拦住
```

::q 认证中间件为什么不该查数据库加载用户详情？
::a 每个请求都多一次查询，且大多数 handler 只需要 `user_id`。更关键的是它把「认证」和「用户信息加载」耦合，一旦查询失败就变成 500 而不是 401。需要详情时在 handler 里按需查。
::q 为什么推荐「兜底认证 + 显式公开路径」的结构？
::a 默认安全：新加的路由自动受保护，漏配的后果是一个 401（明显、可测），而不是接口裸奔（隐蔽、危险）。反过来「默认公开、逐个加认证」一旦漏加，就是数据泄漏。
::q `Authorization: Bearer  <token>`（两个空格）会发生什么？
::a token 会带上前导空格，签名验证失败返回 401，但排查时很难看出是空格问题。用 `strings.TrimSpace` 处理掉，同时对前缀用 `EqualFold` 兼容大小写，能消除这类「明明传了却认证失败」的困扰。

<!--day 10 | normal-->
#### 从 context 取值的标准写法
```go
type ctxKey struct{}

var userIDKey ctxKey

func userIDFrom(ctx context.Context) (int64, bool) {
    uid, ok := ctx.Value(userIDKey).(int64)
    return uid, ok
}

// handler 里
uid, ok := userIDFrom(r.Context())
if !ok {
    Fail(w, http.StatusUnauthorized, "UNAUTHORIZED", "no user in context")
    return
}
```
要点：
- key 用**未导出的自定义类型**，别的包无法构造同名 key，杜绝撞键。
- 封装成 `userIDFrom` 函数，handler 不直接碰 `ctx.Value`，将来改存储方式只改一处。
- **必须判断 `ok`**。缺失时直接 panic 是常见事故。

#### 改造所有账本 handler
```go
func listEntries(svc *ledger.Service) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        uid, ok := userIDFrom(r.Context())
        if !ok { Fail(w, 401, "UNAUTHORIZED", "no user"); return }

        items, total, err := svc.List(r.Context(), uid, ledger.ListQuery{...})
        if err != nil { writeError(w, r, err); return }
        OK(w, Page[ledger.Entry]{Items: items, Total: total, ...})
    }
}
```
**注意 `uid` 的传递方向**：从 context 取出后作为**显式参数**传给 Service，而不是继续放在 ctx 里往下传。业务函数签名里出现 `uid` 是好事——它让「这个操作属于谁」可见、可测。

#### 为什么不在 Service 里直接读 ctx
```go
// ❌ 隐式依赖，测试时必须伪造 ctx
func (s *Service) List(ctx context.Context) ([]Entry, error) {
    uid := ctx.Value(userIDKey).(int64)
}
```
显式参数能编译期检查、能 mock、能读懂。context 只传「横切关注点」（取消、trace），业务参数一律走签名。

#### 判据
```bash
# 用 A 的 token 请求，日志里 uid 应为 A 的 id
# 不传 token 的请求不应到达 handler（被中间件拦住）
```
在 handler 里临时 `log.Println(uid)`，确认每次都是正确用户。

::q 为什么把 uid 从 context 取出来后要作为显式参数传给 Service？
::a 显式参数让依赖可见、可测试、可编译期检查。埋在 ctx 里的话，Service 的测试必须构造带值的 ctx，调用者也看不出这个方法依赖用户身份，容易漏传导致越权。
::q context key 为什么用未导出的自定义类型而不是字符串？
::a 字符串 key 在任何包里都能构造同名值，容易与其他库撞键导致读到错误的值。未导出的自定义类型只有本包能创建实例，天然唯一。这是 Go 官方推荐的实践。
::q handler 里不判断 `ok` 直接断言会怎样？
::a 类型断言 `ctx.Value(k).(int64)` 在值不存在（nil）时会 panic，导致 500 或进程崩溃。必须用双返回值形式判断 `ok`，缺失时返回 401。这是「认证中间件没套上」时唯一的兜底。

<!--day 11 | core-->
#### 数据隔离不是「加个 if」，是每条查询都必须带 user_id
```go
// ❌ 只按 id 查：任何人改个 id 就能看别人的账
SELECT * FROM entries WHERE id = ?

// ✅ 同时限定归属
SELECT * FROM entries WHERE id = ? AND user_id = ?
```
`WHERE id = ? AND user_id = ?` 是最重要的一行 SQL。**漏掉 user_id 的查询，就是越权漏洞**，而且它不会报错、不会崩，测试不覆盖就永远发现不了。

#### 三类必须改造的语句
```sql
-- 查询单条
SELECT ... FROM entries WHERE id = ? AND user_id = ?;
-- 列表
SELECT ... FROM entries WHERE user_id = ? AND date LIKE ? ORDER BY date DESC;
-- 更新 / 删除
UPDATE entries SET amount = ? WHERE id = ? AND user_id = ?;
DELETE FROM entries WHERE id = ? AND user_id = ?;
```
更新和删除尤其要检查 `RowsAffected()`：**返回 0 行通常意味着「ID 存在但不属于你」**，此时应该返回 404（而不是 403，避免暴露「这条记录存在」）。

#### 为什么不用「先查再判断」
```go
e, _ := store.Get(ctx, id)        // 不带 user_id
if e.UserID != uid { return 403 } // 事后判断
```
问题：
1. 多一次查询，且中间有 TOCTOU 窗口（虽然这里影响小）。
2. 忘了判断就全泄漏，而 SQL 里带上条件是**默认安全**。
3. 403 暴露了「这个 ID 存在」，可被用来探测。

**原则：把权限条件写进 WHERE，而不是写在 if 里。**

#### 用测试锁住它
```go
func TestEntryIsolation(t *testing.T) {
    // A 创建一条
    idA, _ := svc.Create(ctxA, in)
    // B 用自己的 uid 去读
    _, err := svc.Get(ctxB, idA)
    if !errors.Is(err, ledger.ErrNotFound) {
        t.Fatalf("B 读到了 A 的数据: %v", err)
    }
}
```
这个测试必须存在。**它是唯一能防止「后来某次重构漏加 user_id」的机制。**

#### 判据
```bash
# A 登录拿 tokenA，创建一笔，记下 id
# B 登录拿 tokenB，请求 /ledger/{id}
curl -i -H "Authorization: Bearer $TOKEN_B" localhost:8080/ledger/<idA>
# 必须 404
```
再跑 `go test ./... -run Isolation`，通过。

::q 越权访问应该返回 403 还是 404？
::a 通常返回 404。403 等于确认「这个资源存在，只是你没权限」，可被用来枚举 ID 探测数据量。404 把「不存在」和「不属于你」合并，不泄漏信息。除非业务明确需要告知用户「你无权访问他人的账本」。
::q 为什么「先查出来再判断 UserID」不如「SQL 里直接带 user_id」？
::a SQL 带条件是默认安全：漏写逻辑分支不会导致泄漏，而是查不到数据。事后判断则依赖每个调用点都记得写 if，一旦遗漏就是漏洞，而且没有任何编译或运行时提示。此外还能少一次查询、避免 403 泄漏存在性。
::q 更新语句 `RowsAffected() == 0` 说明什么？
::a 说明没有行被更新：ID 不存在，或者存在但不属于当前用户。业务上应统一返回 404，而不是「更新成功」。这个信号是数据隔离的第二道检查——即使 WHERE 写对了，也能通过影响行数发现异常。

<!--day 12 | normal-->
#### 三条防线，防止密码哈希泄漏到响应
1. **结构体打标签**：`PasswordHash string \`json:"-"\`` —— 最省事，但容易被「复制结构体到 DTO」时忘掉。
2. **独立 DTO**：响应结构体里根本没有这个字段 —— 最可靠。
3. **测试断言**：`if strings.Contains(body, "password") { t.Fatal }` —— 兜底。

推荐 2 + 3：DTO 保证「不可能泄漏」，测试保证「将来加字段时被发现」。

```go
type UserDTO struct {
    ID    int64  `json:"id"`
    Email string `json:"email"`
}

func toDTO(u store.User) UserDTO {
    return UserDTO{ID: u.ID, Email: u.Email}
}
```

#### 阶段验收（逐条执行）
```bash
# 1. A 创建一笔
curl -s -X POST localhost:8080/ledger -H "Authorization: Bearer $A" -d '{...}'
# 2. B 登录看不到
curl -s localhost:8080/ledger -H "Authorization: Bearer $B" | jq '.data.total'   # 0
# 3. 无 token 401
curl -i localhost:8080/ledger
# 4. 任何响应无密码哈希
curl -s localhost:8080/login -d '{"email":"a@x.com","password":"..."}' | grep -i "password\|\$argon2" || echo "clean"
```

#### 复盘：这 12 天建立的安全模型
| 威胁 | 防御 |
| :--- | :--- |
| 拖库后还原密码 | 慢哈希 + 唯一盐 |
| 账号枚举 | 统一错误 + 恒定时间 |
| token 伪造 | 签名 + 算法白名单 |
| 越权读写 | 每条 SQL 带 user_id |
| 信息泄漏 | DTO + 响应不含敏感字段 |

任何一条缺失，整个模型就有缺口。**安全不是「做了几项」，是「没有短板」。**

#### 泄漏往往不是「忘了加标签」，而是「复制结构体」
最常见的路径：
```go
// 某天为了省事，直接把 store 层的结构体返回了
func (h *Handler) me(w http.ResponseWriter, r *http.Request) {
    u, _ := h.svc.GetUser(r.Context(), uid)
    OK(w, u)          // ❌ u 里有 PasswordHash
}
```
`store.User` 上有 `json:"-"` 的话这里侥幸没事，但只要有人为了调试把它改成 `json:"password_hash"`，或者新建了一个 DTO 又复制了所有字段，泄漏就发生了。

**防线是「响应结构里不存在这个字段」**，而不是「记得别序列化它」。所以 `UserDTO` 只声明 `ID`/`Email` 两个字段，从类型上就排除了泄漏可能。

#### 验收脚本要检查响应体，不是只检查状态码
```bash
curl -s "$BASE/login" -H 'Content-Type: application/json' \
  -d '{"email":"a@x.com","password":"correct horse battery"}' \
  | grep -Ei 'password|argon2|\$2[aby]\$' && { echo "泄漏了密码字段"; exit 1; } || echo clean
```
正则要覆盖三种形态：字段名 `password`、Argon2 的 `$argon2`、bcrypt 的 `$2a$`。只查字段名的脚本会漏掉被塞进别的字段里的哈希。

::q 只靠 `json:"-"` 防止密码哈希泄漏，风险在哪？
::a 一旦有人为了让响应「复用」而把 `User` 结构体直接返回，或在别的 DTO 里嵌入了它，标签可能被绕过或遗忘。用独立 DTO 让响应结构里根本不存在该字段，是结构性的保证；再加一条测试断言作为回归防线。
::q 为什么说安全「不是做了几项，而是没有短板」？
::a 攻击者只走最短路径。做了慢哈希但允许账号枚举、或做了 JWT 但某条 SQL 漏了 user_id，整个防护就失效。安全是链式结构，强度等于最弱一环。
