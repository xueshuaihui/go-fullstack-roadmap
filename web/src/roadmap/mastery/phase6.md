<!--day 1-->
::pre 完成阶段五；现在配置散落在代码、环境变量、命令行参数里。
::predict
```go
port := os.Getenv("PORT")
if port == "" { port = "8080" }
dbPath := os.Getenv("DB_PATH")
if dbPath == "" { dbPath = "ledger.db" }
// 共 15 个 os.Getenv
```
::ask 这种「到处 Getenv」的方式有什么问题？
::ans ① 配置项散落在各处，没人知道总共有哪些、哪些必填；② 默认值写法不统一（有的有默认，有的没有，缺了就在运行时报错）；③ 类型转换重复（每处都要 `strconv.Atoi`）；④ 测试时无法一次性构造一套配置，只能到处 `Setenv`。修法：**启动时一次性加载到结构体**，之后全项目只用结构体。**配置是「启动时的输入」，应该在启动时定型**。
::predict
```go
type Config struct {
    Port   int
    DBPath string
}
// 加载顺序：默认值 → 配置文件 → 环境变量
```
::ask 为什么环境变量优先级最高？
::ans 因为部署时的覆盖需求：配置文件进版本库（开发默认值），环境变量由部署环境注入（生产实际值）。反过来（配置文件覆盖环境变量）会导致「容器里设了变量却被镜像里的文件覆盖」，排查时极其反直觉。这是 12-Factor App 的约定：**默认值 < 配置文件 < 环境变量 < 命令行参数**。**优先级顺序要写进文档**，否则运维不知道该改哪个。
::debug
```yaml
# config.yaml
port: 8080
db_path: ./data/ledger.db
```
```bash
PORT=9090 ./app
# 日志显示 listening on :8080
```
::ask 为什么环境变量没生效？
::ans 因为代码只读了文件，没做环境变量覆盖；或者读了但顺序反了（文件覆盖了环境变量）。这类问题在容器部署里特别常见——你改了 compose 的 `environment`，服务却还用着镜像里的默认值。修法：加载后用日志打印**最终生效值**（`slog.Info("config", "port", cfg.Port, "db", cfg.DBPath)`），让「实际用了什么」一眼可见。**配置的排查成本，取决于你有没有在启动时打印它**。
::transfer
::scene 设计完整的配置结构，覆盖端口、数据库、JWT 密钥、日志级别、CORS 来源、超时。
::ask 写出结构体与加载函数，说明哪些必填、哪些有默认值。
::hint 敏感项没有默认值，缺失就失败。
::ans
```go
type Config struct {
    Port        int      `koanf:"port"`          // 默认 8080
    DBPath      string   `koanf:"db_path"`       // 必填（或默认 ./data/ledger.db）
    JWTSecret   string   `koanf:"jwt_secret"`    // 必填，无默认
    LogLevel    string   `koanf:"log_level"`     // 默认 info
    CORSOrigins []string `koanf:"cors_origins"`  // 默认空（同源）
    ReadTimeout time.Duration `koanf:"read_timeout"`  // 默认 30s
}
```
规则：**有安全含义的（密钥）必填且无默认；有合理工程默认的（端口、超时）给默认值；环境相关的（路径、CORS）显式配置**。加载后立刻校验（D2 讲），并把 `cfg` 以值传递注入各层——**不要用全局变量**，否则测试之间会互相影响。
::crit 配置集中在一个结构体，启动时一次加载
::crit 优先级明确（默认 < 文件 < 环境变量），并写进文档
::crit 启动日志打印最终生效值（敏感项打码）
::crit 不用包级全局配置变量，靠注入传递

<!--day 2-->
::pre 完成 D1：配置结构已定。
::predict
```go
cfg.JWTSecret = os.Getenv("JWT_SECRET")   // 忘了检查空值
token.SignedString([]byte(cfg.JWTSecret))  // 空字符串
```
::ask 用空密钥签发的 token 有什么后果？
::ans 任何人只要知道「密钥是空字符串」就能伪造任意用户的 token——包括 `user_id=1` 的管理员。而且这种配置错误**不会导致任何报错**，服务正常运行，直到被利用。这就是为什么「启动即失败」是安全底线：**宁可服务起不来，也不要带着空密钥对外提供服务**。
::predict
```go
if cfg.JWTSecret == "" {
    slog.Warn("JWT_SECRET is empty, using a random one")
    cfg.JWTSecret = randomString()
}
```
::ask 这样处理有什么问题？
::ans 两个：① **多实例部署时每个实例的随机密钥不同**，A 实例签发的 token 在 B 实例验证失败，表现为「随机掉登录」；② **重启后密钥变了**，所有用户被踢下线。所以「随机生成兜底」只适合单实例 + 可接受掉登录的开发环境。生产必须：**缺失就 `log.Fatal`**，让部署流程明确失败。**「友好的降级」在安全配置上是危险的**。
::debug
```bash
docker compose up
# 服务正常启动
# 但所有登录请求返回 500
# 日志：signing key is empty
```
::ask 为什么启动时不报错？
::ans 因为密钥只在「签发 token」时才被用到，启动路径没碰它——这是典型的「延迟失败」。修法是**在启动时主动校验所有必填配置**：
```go
func (c Config) Validate() error {
    var errs []error
    if len(c.JWTSecret) < 32 { errs = append(errs, errors.New("jwt_secret 长度不足 32")) }
    if c.DBPath == "" { errs = append(errs, errors.New("db_path 未设置")) }
    if c.Port <= 0 || c.Port > 65535 { errs = append(errs, fmt.Errorf("port 非法: %d", c.Port)) }
    return errors.Join(errs...)
}
```
`errors.Join` 能把多个错误一起报出来，用户一次改完，不用「改一个、重启、再报下一个」。**配置校验要在启动时做完，且一次报全**。
::transfer
::scene 写完整的配置校验，覆盖类型、范围、依赖关系。
::ask 列出至少 6 条校验，说明每条防的是什么问题。
::hint 想「端口范围、路径可写、密钥长度、超时正数、CORS 格式、日志级别枚举」。
::ans
| 校验 | 防的问题 |
| `port` 1-65535 | 端口非法导致启动失败但错误晦涩 |
| `db_path` 非空 + 父目录可写 | 运行时才发现「打不开数据库」 |
| `jwt_secret` ≥ 32 字节 | 弱密钥可被暴力破解 |
| `read/write_timeout` > 0 | 0 意味着永不超时（Slowloris） |
| `log_level` ∈ {debug,info,warn,error} | 拼错后日志静默不输出 |
| `cors_origins` 每项是合法 URL 且不含 `*`（生产） | `*` + credentials 会被浏览器拒绝，且不安全 |
| 依赖关系：`env=production` 时 `cors_origins` 不能为空 | 生产环境默认放开跨域 |
实现上返回 `errors.Join(...)`，`main` 里 `if err := cfg.Validate(); err != nil { log.Fatal(err) }`。**每条校验都对应一个「不校验就会在运行时踩的坑」**，不是为了凑数。
::crit 必填项缺失时 `log.Fatal`，不降级、不猜默认值
::crit 校验一次报全所有问题（`errors.Join`）
::crit 密钥有最小长度校验，不是只判空
::crit 生产模式与开发模式的校验强度不同（CORS、日志级别）

<!--day 3-->
::pre 完成 D1-D2：配置可用。
::predict dockerfile
```dockerfile
FROM golang:1.23
WORKDIR /app
COPY . .
RUN go build -o app .
CMD ["./app"]
```
::ask 这个镜像有多大？有什么问题？
::ans 约 800MB-1GB（golang 镜像本身 800MB + 源码 + 构建缓存）。问题：① 把源码、测试、`.git` 全打进镜像；② 构建工具链也在里面（攻击面大）；③ 每次改代码都要重新下载依赖（除非利用缓存）；④ 以 root 运行。**多阶段构建**能把最终镜像降到 10-30MB：一个阶段编译，另一个阶段只拷二进制。
::predict dockerfile
```dockerfile
FROM golang:1.23 AS builder
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /out/app ./cmd/ledger-api

FROM alpine:3.20
COPY --from=builder /out/app /app
CMD ["/app"]
```
::ask 为什么先 `COPY go.mod go.sum` 再 `COPY . .`？
::ans 为了**利用 Docker 层缓存**：依赖只在 `go.mod`/`go.sum` 变化时才重新下载。如果先 `COPY . .`，任何一次源码改动都会让 `go mod download` 这层缓存失效，每次构建都重新拉全部依赖（几分钟）。这是 Dockerfile 最基本的优化，也是「构建慢」最常见的原因。**把「变化频率低的」放前面，「变化频率高的」放后面**。
::debug dockerfile
```dockerfile
RUN CGO_ENABLED=0 go build -o /out/app ./cmd/ledger-api
# 构建失败：no such directory
```
::ask 可能原因？
::ans ① **构建上下文不含该目录**（`.dockerignore` 排除了 `cmd/`，或者 `COPY` 的路径不对）；② 模块根不在 `WORKDIR`（`go.mod` 在上一层）；③ 包路径拼错（`./cmd/ledger-api` vs `./cmd/api`）。排查：在 builder 阶段加 `RUN ls -R .` 或 `go list ./...` 看实际有哪些包。**`go build` 的路径错误信息通常很明确（"no Go files" 或 "no such directory"），照着路径核对即可**。
::transfer
::scene 写完整的多阶段 Dockerfile，包含缓存优化、静态编译、健康检查。
::ask 写出完整文件，并说明每一行的目的。
::hint 注意 `CGO_ENABLED=0`、`-ldflags`、`HEALTHCHECK`、`USER`。
::ans
```dockerfile
# ---- build ----
FROM golang:1.23-alpine AS builder
WORKDIR /src
RUN apk add --no-cache git ca-certificates
COPY go.mod go.sum ./
RUN go mod download
COPY . .
ARG VERSION=dev
RUN CGO_ENABLED=0 GOOS=linux go build \
    -trimpath \
    -ldflags="-s -w -X main.version=${VERSION}" \
    -o /out/app ./cmd/ledger-api

# ---- runtime ----
FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=builder /out/app /app
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
EXPOSE 8080
USER nonroot:nonroot
ENTRYPOINT ["/app"]
```
要点：`CGO_ENABLED=0` 静态编译（不依赖 glibc，能跑在 distroless/scratch）；`-trimpath` 去掉本地路径（避免泄漏构建机目录，也让构建可复现）；`-s -w` 去掉符号表（镜像更小，但 panic 栈会缺行号——权衡）；`distroless:nonroot` 无 shell、无包管理器、非 root，攻击面最小。**生产镜像的原则是「只包含运行必需的东西」**。
::crit 多阶段构建，运行镜像只含二进制与必要证书
::crit `go.mod`/`go.sum` 先 COPY，依赖层能被缓存
::crit `CGO_ENABLED=0` 静态编译，能解释原因
::crit 镜像以非 root 用户运行

<!--day 4-->
::pre 完成 D3：多阶段构建可用。
::predict dockerfile
```dockerfile
FROM scratch
COPY --from=builder /out/app /app
ENTRYPOINT ["/app"]
```
::ask 用 `scratch` 会缺什么？
::ans ① **CA 证书**：任何 HTTPS 请求（调用外部 API）都会失败 `x509: certificate signed by unknown authority`；② **时区数据**：`time.LoadLocation("Asia/Shanghai")` 失败，只能用 UTC；③ **`/etc/passwd`**：`USER` 指令需要用户存在，scratch 里没有；④ 没有 shell，无法 `docker exec` 进去调试。所以要么用 `distroless`（含证书和 passwd），要么手动 COPY 证书与 `zoneinfo`。**「镜像越小越好」有下限——低于这个下限就开始缺运行时必需品**。
::predict dockerfile
```dockerfile
FROM alpine:3.20
RUN adduser -D -u 10001 app
USER app
```
::ask 切到非 root 后，可能出现什么问题？
::ans ① **数据目录权限**：挂载的 `./data` 属主是宿主机的 root，容器内 uid 10001 写不进去，报 `readonly database` 或 `permission denied`；② **端口 < 1024** 需要特权（8080 没问题）；③ 某些库要写 `/tmp` 或 `$HOME`，而 distroless 的 `$HOME` 可能不存在。修法：宿主机上 `chown -R 10001:10001 ./data`，或在 compose 里 `user: "10001:10001"` 并确保目录属主一致。**「非 root 运行」不是加一行 USER 就完事，要连带处理文件权限**。
::debug bash
```bash
docker run -v $(pwd)/data:/data myapp
# panic: unable to open database file: /data/ledger.db
# permission denied
```
::ask 三个排查方向？
::ans ① `ls -ld data` 看宿主机目录属主（大概率 root:root，而容器内是 uid 10001）；② 进容器 `id` 确认实际 uid；③ 看 DSN 路径是否真的是 `/data/ledger.db`（不是相对路径写到了别处）。修法：`chown -R 10001:10001 ./data`，或用 compose 的 `user: "${UID}:${GID}"` 对齐宿主机用户。**容器里的权限问题，永远是「容器内 uid」与「宿主机文件属主」的匹配问题**。
::transfer
::scene 为镜像瘦身做一次完整评估。
::ask 列出「必须保留 / 可以删除 / 必须加回」三类内容。
::hint 想想运行时到底需要什么。
::ans
**必须保留**：静态二进制、CA 证书（HTTPS）、时区数据（若用本地时区）、`/etc/passwd`（非 root 用户）。
**可以删除**：Go 工具链、源码、`.git`、测试文件、`node_modules`（如果是前端）、包管理器缓存、shell（除非要 exec 调试）。
**必须加回**：`ca-certificates`（如果用了 scratch）、`tzdata`（如果用 `LoadLocation`）、时区文件（`/usr/share/zoneinfo`）。
瘦身手段：`.dockerignore` 排除无关文件、`-ldflags="-s -w"`、`upx`（可选，但会拖慢启动且可能被杀软误报）。**判断标准不是「镜像多小」，而是「运行时有没有缺东西」**——一个 20MB 但 HTTPS 调用失败的镜像，比 50MB 能正常工作的更糟。
::crit 运行镜像含 CA 证书，HTTPS 调用不失败
::crit 非 root 运行且数据目录权限已对齐
::crit `.dockerignore` 排除 `.git`/测试/本地数据
::crit 能说出「scratch / distroless / alpine」三者的取舍

<!--day 5-->
::pre 完成 D3-D4：镜像可用。
::predict yaml
```yaml
services:
  api:
    image: ledger-api:latest
    ports:
      - "8080:8080"
    volumes:
      - ./data:/data
    environment:
      - DB_PATH=/data/ledger.db
```
::ask 这份 compose 少了什么关键配置？
::ans ① **没有健康检查**，编排系统不知道服务是否真的可用；② **没有重启策略**（`restart: unless-stopped`），进程崩了就停着；③ **没有资源限制**（内存/CPU），一个内存泄漏能拖垮宿主机；④ **没有日志轮转**，日志会无限增长撑爆磁盘；⑤ 镜像用 `latest`，部署不可复现。**「能 up 起来」和「能长期跑」差的就是这几项**。
::predict yaml
```yaml
volumes:
  - ./data:/data
# 后来改成
volumes:
  - ledger-data:/data
```
::ask 命名卷和绑定挂载，各自适合什么场景？
::ans **绑定挂载**（`./data:/data`）：数据在宿主机可见、易备份、易用 sqlite3 直接查看——适合家庭账本这种「我要能摸到文件」的场景。**命名卷**（`ledger-data:/data`）：由 Docker 管理，跨平台一致、权限问题少、但文件位置隐蔽（`/var/lib/docker/volumes/...`）。家庭场景推荐绑定挂载 + 明确属主；如果要「一条命令迁移到另一台机器」，命名卷配合 `docker run --volumes-from` 更方便。**关键是把数据放在「容器删除后仍然存在」的位置**，两种都满足。
::debug bash
```bash
docker compose up -d
docker compose ps
# api   Up (healthy)  ← 但实际请求 502
```
::ask 容器 healthy 但请求失败，可能原因？
::ans ① **健康检查只查了进程存活**（比如 `curl localhost:8080/healthz` 但 healthz 永远返回 200，连数据库都不查）——这就是「假健康」；② **端口映射错了**（容器内监听 9090，映射写 8080）；③ **健康检查在容器内执行，但容器里没有 curl**（distroless 镜像没有 curl！），检查一直失败或一直被当成「无法判定」。**distroless 镜像做健康检查必须在二进制里实现 `--health-check` 子命令，不能依赖 curl**。
::transfer
::scene 写完整的 compose 配置，包含迁移、健康检查、资源限制、日志轮转。
::ask 写出文件并解释关键项。
::hint 迁移用独立服务 + `service_completed_successfully`。
::ans
```yaml
services:
  migrate:
    image: ledger-api:${VERSION:-latest}
    command: ["/app", "--migrate-only"]
    volumes: ["./data:/data"]
    environment:
      DB_PATH: /data/ledger.db
    restart: "no"

  api:
    image: ledger-api:${VERSION:-latest}
    depends_on:
      migrate:
        condition: service_completed_successfully
    ports: ["8080:8080"]
    volumes: ["./data:/data"]
    environment:
      DB_PATH: /data/ledger.db
      JWT_SECRET: ${JWT_SECRET:?JWT_SECRET 必须设置}
      LOG_LEVEL: info
    healthcheck:
      test: ["CMD", "/app", "--health-check"]   # 镜像里没有 curl
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 5s
    restart: unless-stopped
    mem_limit: 256m
    logging:
      driver: json-file
      options: { max-size: "10m", max-file: "3" }
```
`${JWT_SECRET:?...}` 让缺失时 compose 直接报错，比服务起来后 500 好。`start_period` 给启动留时间，避免冷启动被判定失败。
::crit 迁移是独立服务，API 等它成功再启动
::crit 健康检查不依赖 curl（distroless 无 curl）
::crit 有重启策略、内存限制、日志轮转
::crit 敏感配置用 `${VAR:?}` 强制必填，缺失即失败

<!--day 6-->
::pre 完成 D5：compose 可跑。
::predict
```yaml
# 迁移放在 api 的 command 里
command: sh -c "goose up && /app"
```
::ask 这样有什么问题？
::ans ① 镜像里可能没有 `goose` 二进制（多阶段构建只拷了 app）；② 多个副本同时启动会并发迁移（D11 讲过的冲突）；③ 迁移失败时 `&&` 会让整个容器退出，但如果 `restart: always` 就会无限重启循环，日志被刷爆；④ 迁移和业务的日志混在一起，排查困难。**迁移应该是「一次性任务」，不是「每次启动都做的事」**。
::predict bash
```bash
docker compose run --rm migrate
# 输出：OK 00005_create_budgets.sql
docker compose up -d api
```
::ask 如果迁移执行到一半失败（比如某个 ALTER 不兼容），会发生什么？
::ans ① goose 会停在失败的版本，**后续迁移不会执行**；② 已执行的部分**不会自动回滚**（每个迁移文件是独立事务，但跨文件不是）；③ API 如果已经启动，会带着「半新半旧」的结构运行，可能报「列不存在」。处置：① 看 `goose status` 确认停在哪；② 手工修 SQL 或 `goose down` 回退到上一个版本；③ 修好后重新 `up`。**这就是为什么要 `--migrate-only` 单独跑**——失败时 API 不会启动，你不会面对「结构不对但服务在跑」的局面。
::debug bash
```bash
docker compose up -d
# api 起来了
# 但日志：no such table: budgets
```
::ask 迁移服务明明配置了，为什么表不存在？
::ans ① `depends_on` 用了 `condition: service_started` 而不是 `service_completed_successfully`（API 在迁移还没跑完就启动了）；② 迁移服务跑的是**另一个数据库路径**（卷挂载不一致）；③ 迁移服务失败了但 `restart: "no"` 让它退出，API 的 `depends_on` 没拦住（旧版 compose 不支持 condition）。排查：`docker compose logs migrate` 看它到底做了什么。**「表不存在」先看迁移容器日志，不要先改代码**。
::transfer
::scene 设计一套「部署 → 迁移 → 启动 → 验证」的完整流程。
::ask 写出流程与每步的失败处置。
::hint 每一步都要有「失败了怎么办」。
::ans
```bash
set -euo pipefail
# 1. 拉镜像 / 构建
docker compose build
# 2. 迁移（失败则整体中止，API 不启动）
docker compose run --rm migrate || { echo "迁移失败，查看 logs"; docker compose logs migrate; exit 1; }
# 3. 启动
docker compose up -d api
# 4. 等待健康
for i in {1..30}; do
  if curl -fsS localhost:8080/healthz >/dev/null; then break; fi
  sleep 1
done
curl -fsS localhost:8080/readyz || { echo "not ready"; docker compose logs api; exit 1; }
# 5. 冒烟
curl -fsS localhost:8080/api/v1/ledger -H "Authorization: Bearer $SMOKE_TOKEN" > /dev/null
```
失败处置：迁移失败 → 修 SQL 或 `goose down`；启动失败 → 看 logs；不健康 → 看 `/readyz` 的具体依赖；冒烟失败 → 回滚镜像版本（`VERSION=previous docker compose up -d`）。**部署脚本的价值在于「失败时立刻停住并告诉你原因」**。
::crit 迁移是独立步骤，失败则 API 不启动
::crit 部署后自动轮询健康检查，超时失败
::crit 有回滚方案（镜像版本可指定）
::crit 能说出「迁移失败停在中间」的处置步骤

<!--day 7-->
::pre 完成 D5-D6：服务能部署。
::predict
```go
mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, r *http.Request) {
    w.WriteHeader(200)
})
```
::ask 这个健康检查有什么问题？
::ans 它只证明「HTTP 服务器还在响应」，证明不了「业务可用」：数据库断了、磁盘满了、迁移没跑，它照样 200。但这**不一定是错的**——关键是要区分两类探针：`/healthz`（liveness，进程活着就该 200，否则重启反而更糟）和 `/readyz`（readiness，依赖都正常才 200，否则摘流量）。**把数据库检查放进 liveness，会导致「数据库抖一下，所有实例被重启」**，这是编排系统里最经典的雪崩模式。
::predict
```go
func readyz(db *sql.DB) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        if err := db.Ping(); err != nil {
            w.WriteHeader(503)
            return
        }
        w.WriteHeader(200)
    }
}
```
::ask 这里用了 `db.Ping()` 而不是 `PingContext`，有什么风险？
::ans `Ping()` 没有超时，如果数据库连接卡住（网络分区、磁盘 IO hang），这个请求会一直挂着——健康检查本身变成了「拖垮服务的请求」。必须 `PingContext(ctx)` 带短超时（1-2 秒）：
```go
ctx, cancel := context.WithTimeout(r.Context(), time.Second)
defer cancel()
if err := db.PingContext(ctx); err != nil { w.WriteHeader(503); return }
```
另外 `defer cancel()` 不能省（否则定时器泄漏），而且必须从 `r.Context()` 派生（客户端断开时探测也该结束）。**健康检查自己不能成为故障源**。
::debug bash
```bash
curl -i localhost:8080/readyz
# 200 OK
# 但紧接着业务请求全部 503
```
::ask readyz 说健康，业务却失败，可能是什么？
::ans ① readyz 只查了数据库 ping，但**迁移没跑**（表不存在）——ping 成功不代表结构对；② 数据库连接池耗尽（ping 用的是池里最后一个连接，业务请求排队超时）；③ readyz 有缓存（比如 30 秒内返回上次结果），实际已经挂了。修法：readyz 除了 ping，还应该跑一条**极轻量的真实查询**（`SELECT 1` 不够，最好 `SELECT count(*) FROM schema_version` 之类能验证结构的），且不缓存。**「能连上」和「能用」之间差一次真实查询**。
::transfer
::scene 设计 liveness / readiness / startup 三类探针的完整策略。
::ask 各自检查什么、超时多少、失败后果是什么？
::hint 想「失败后编排系统会做什么」。
::ans
| 探针 | 检查内容 | 超时 | 失败后果 |
| startup | 进程能否响应 HTTP | 3s，最多 30 次 | 重启容器（给慢启动留时间） |
| liveness | HTTP 服务器是否响应（**不查依赖**） | 1s | 重启容器 |
| readiness | 数据库 ping + 一条轻量真实查询 | 1s | **摘掉流量**，不重启 |
关键原则：**liveness 失败 = 重启（治标），readiness 失败 = 摘流量（等它恢复）**。数据库短暂不可用时，应该 readyz 失败让流量走开，而不是重启所有实例（重启也连不上，还会放大故障）。startup 探针是为了「迁移/预热慢」的场景，避免 liveness 在启动期间误判。**三类探针的语义不能混用**。
::crit 区分 liveness 与 readiness，健康检查不查依赖、就绪检查查
::crit 用 `PingContext` 带 1 秒超时，不用无超时的 `Ping`
::crit readiness 除 ping 外还有一条真实查询
::crit 能说出「数据库抖动时不重启实例」的理由

<!--day 8-->
::pre 完成 D5-D7：部署与探针就绪。
::predict
```go
srv := &http.Server{Addr: ":8080", Handler: mux}
srv.ListenAndServe()
```
::ask 收到 SIGTERM 时，这个服务会怎样？
::ans 进程**立即退出**，所有进行中的请求被强制断开（客户端看到 connection reset），数据库连接也没正常关闭。因为 Go 默认不处理 SIGTERM（会直接终止进程）。这就是为什么需要 `signal.NotifyContext` + `srv.Shutdown`。**没有优雅关闭的服务，每次部署都会丢掉正在处理的请求**——对账本来说，可能是「用户点了保存，页面报错，但数据其实写了一半」。
::predict
```go
ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
defer stop()
<-ctx.Done()
srv.Shutdown(context.Background())   // 没有超时
db.Close()
```
::ask 这段有两个问题，分别是什么？
::ans ① **`Shutdown` 用了 `context.Background()`**，没有超时——如果有请求永远不结束（死循环、无超时的外部调用），进程会永久挂住，编排系统等到 `stop_grace_period`（默认 10s）后 SIGKILL，等于没优雅。必须用 `context.WithTimeout(..., 10*time.Second)`。② **`db.Close()` 在 `Shutdown` 返回后立刻执行**，但 `Shutdown` 只保证「HTTP 请求处理完」，如果 handler 里有后台 goroutine 还在用 db，就会拿到「连接已关闭」的错误。正确顺序是：Shutdown（带超时）→ 等后台任务（WaitGroup）→ db.Close()。
::debug bash
```bash
docker stop api
# 容器 10 秒后才停（被 SIGKILL）
# 日志里没有 "shutdown complete"
```
::ask 为什么优雅关闭没生效？
::ans ① **信号没被捕获**：`CMD ["./app"]` 是 exec 形式吗？如果是 `CMD ./app`（shell 形式），PID 1 是 shell，信号发给 shell 而不是 app——docker 的 SIGTERM 到不了应用。必须用 exec 形式（JSON 数组）或 `tini`/`dumb-init` 作为 init。② **`stop_grace_period` 太小**（默认 10s），而 `Shutdown` 超时设了 30s，编排系统先动手 SIGKILL。③ 日志级别不够，看不到关闭流程。**容器里「信号收不到」十次有八次是 shell 形式 CMD**。
::transfer
::scene 写完整的优雅关闭流程。
::ask 写出代码骨架与顺序，说明每步的作用。
::hint 顺序：停止接收 → 等请求 → 等后台 → 关库 → 打日志。
::ans
```go
func run() error {
    ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGTERM, os.Interrupt)
    defer stop()

    srv := &http.Server{
        Addr:              cfg.Addr,
        Handler:           router,
        ReadHeaderTimeout: 5 * time.Second,
        ReadTimeout:       30 * time.Second,
        WriteTimeout:      30 * time.Second,
        IdleTimeout:       120 * time.Second,
    }

    errCh := make(chan error, 1)
    go func() {
        if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
            errCh <- err
        }
    }()

    select {
    case err := <-errCh:
        return err
    case <-ctx.Done():
        slog.Info("shutdown signal received")
    }

    shutCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()
    if err := srv.Shutdown(shutCtx); err != nil {
        slog.Warn("graceful shutdown timed out", "err", err)
    }
    bg.Wait()             // 等后台任务（如有）
    if err := sqlDB.Close(); err != nil { slog.Warn("db close", "err", err) }
    slog.Info("shutdown complete")
    return nil
}
```
顺序不能乱：**先停止接收新请求，再等进行中的完成，最后才关数据库**。反过来的话，正在执行的 handler 会拿到「连接已关闭」。
::crit `Server` 显式设置四个超时（含 `ReadHeaderTimeout`）
::crit `signal.NotifyContext` 捕获 SIGTERM/SIGINT
::crit `Shutdown` 用带超时的 ctx，且有兜底日志
::crit 顺序为 Shutdown → 等后台 → `db.Close()`，并说明理由

<!--day 9-->
::pre 完成 D8：已实现优雅关闭。
::predict bash
```bash
curl localhost:8080/slow &     # 一个 3 秒才返回的请求
sleep 0.5
docker stop api                # 期望：等请求完成再退出
curl 会成功吗？
```
::ask 这个测试能验证优雅关闭吗？怎么判断成功？
::ans 能，但要观察三件事：① `curl` **收到完整响应**（200 + 完整 body），不是 connection reset；② 容器退出**耗时约 3 秒**（不是瞬间，也不是 10 秒被杀）；③ 日志里有 `shutdown signal received` 和 `shutdown complete` 两条。只看「容器停了」不能证明优雅——可能只是被杀得快。**验证优雅关闭必须同时看客户端结果和服务端日志**。
::predict bash
```bash
docker stop api
# 容器 0.1 秒就退出了
# 日志：shutdown complete
```
::ask 退出太快，说明什么？
::ans 说明**根本没有进行中的请求**（测试没构造出来），或者 `Shutdown` 之后立刻 `db.Close()` + `os.Exit` 把还在跑的 goroutine 干掉了。也有可能是 `srv.Shutdown` 返回了 `context.Canceled`（因为 `srv.BaseContext` 被取消）导致提前返回。要构造「必然卡住」的请求才能验证：
```go
mux.HandleFunc("GET /slow", func(w http.ResponseWriter, r *http.Request) {
    select {
    case <-time.After(3 * time.Second):
        w.Write([]byte("done"))
    case <-r.Context().Done():
        // 被中断
    }
})
```
**没有慢请求的测试，等于没测优雅关闭**。
::debug bash
```bash
docker stop api
# 容器退出码 137
```
::ask 137 意味着什么？怎么修？
::ans 137 = 128 + 9（SIGKILL），说明**容器被强制杀死**，优雅关闭没在宽限期内完成。原因：① `Shutdown` 超时 > `stop_grace_period`（compose 默认 10s），编排系统先动手；② 有请求永远不返回（死循环、无超时的外部调用）；③ 后台 goroutine 不响应 ctx。修法：调大 `stop_grace_period: 30s`，同时把 `Shutdown` 超时设小一点（10s），并把慢操作都加上 ctx。**「退出码 137」= 你的关闭流程超时了，不是 docker 的问题**。
::transfer
::scene 写一个可靠的优雅关闭验证脚本。
::ask 脚本步骤、断言、判定标准分别是什么？
::hint 用 `/slow` 制造进行中的请求，记录耗时与响应。
::ans
```bash
#!/usr/bin/env bash
set -euo pipefail
BASE=http://localhost:8080

# 1. 启动一个 3 秒的请求（后台）
( curl -fsS -w '\nHTTP:%{http_code}\n' "$BASE/slow" > /tmp/slow.out 2>&1; echo $? > /tmp/slow.rc ) &
SLOW_PID=$!
sleep 0.5

# 2. 记录停止开始时间，发 SIGTERM
START=$(date +%s)
docker stop -t 30 api > /dev/null
END=$(date +%s)
wait $SLOW_PID || true

# 3. 断言
[ "$(cat /tmp/slow.rc)" = "0" ] || { echo "请求被中断"; exit 1; }
grep -q 'HTTP:200' /tmp/slow.out || { echo "响应不完整"; exit 1; }
ELAPSED=$((END - START))
[ "$ELAPSED" -ge 2 ] && [ "$ELAPSED" -le 8 ] || { echo "关闭耗时异常: ${ELAPSED}s"; exit 1; }
docker inspect --format '{{.State.ExitCode}}' api | grep -qx 0 || { echo "退出码非 0（可能被 SIGKILL）"; exit 1; }
docker logs api 2>&1 | grep -q 'shutdown complete' || { echo "缺少关闭日志"; exit 1; }
echo "OK: 优雅关闭验证通过（耗时 ${ELAPSED}s）"
```
四个断言覆盖四件事：**请求完成、响应完整、耗时合理、退出码 0**。少任何一个都可能「看起来优雅其实没」。
::crit 验证脚本构造了进行中的慢请求
::crit 断言请求成功 + 响应完整 + 退出码 0
::crit 能诊断退出码 137 的三个原因
::crit `stop_grace_period` > `Shutdown` 超时，两个值都显式设置

<!--day 10-->
::pre 完成 D5-D9：服务可部署、可优雅停止。
::predict
```go
w.Header().Set("Access-Control-Allow-Origin", "*")
w.Header().Set("Access-Control-Allow-Credentials", "true")
```
::ask 这两行同时设置会怎样？
::ans 浏览器会**拒绝**这个响应：`The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the credentials mode is 'include'`。因为 `*` 意味着「任何源都能带凭证访问」，这在安全上不可接受。必须返回具体的源（`https://app.example.com`），且要校验请求的 `Origin` 在白名单里。**`*` + credentials 是无效组合，不是「宽松一点」**。
::predict go
```go
// 开发时前端 5173，后端 8080
// 方案 A：后端开 CORS
// 方案 B：Vite 代理
```
::ask 两种方案各适合什么场景？生产环境用哪个？
::ans **开发**：优先 Vite 代理（`server.proxy`），因为「同源」请求不需要 CORS，也不需要处理 Cookie 的 `SameSite`——前端代码里直接写 `/api/v1/...` 即可，和生产环境一致。**生产**：优先反向代理（Nginx/Caddy）把 `/api` 转发到后端，同样实现同源。只有在「前后端确实不同域且无法反代」时才开 CORS。**能用同源解决，就不要用 CORS**——CORS 是浏览器安全模型的例外，例外越多越容易出错。
::debug bash
```bash
curl -i -X OPTIONS localhost:8080/api/v1/ledger \
  -H 'Origin: http://localhost:5173' \
  -H 'Access-Control-Request-Method: POST'
# 405 Method Not Allowed
```
::ask 为什么预检请求 405？
::ans 因为路由只注册了 `POST /api/v1/ledger`，浏览器发的 `OPTIONS` 请求没有匹配的 handler，ServeMux 返回 405。CORS 中间件必须在**路由匹配之前**处理 `OPTIONS` 并直接返回 204，而不是让它走到 mux。正确顺序：`CORS(Recovery(Logging(Auth(mux))))`——CORS 在最外层（或至少在 mux 之前），预检请求在中间件层就被短路返回。**预检请求不带业务语义，不该进入业务路由**。
::transfer
::scene 设计开发与生产两套跨域方案。
::ask 各自怎么配？Cookie 的 `SameSite` 要怎么设？
::hint 同源时 SameSite 可以 Lax，跨站时需要 None + Secure。
::ans
**开发**：Vite 代理
```ts
server: {
  proxy: { '/api': { target: 'http://localhost:8080', changeOrigin: true } }
}
```
前端请求 `/api/v1/...`，浏览器认为同源，无 CORS、无 SameSite 问题。
**生产**：Nginx 反代
```nginx
location /api/ { proxy_pass http://api:8080; proxy_set_header Host $host; }
location /     { root /usr/share/nginx/html; try_files $uri /index.html; }
```
同样是同源，Cookie 设 `SameSite=Lax` 即可。
**如果必须跨站**：`Access-Control-Allow-Origin: https://app.example.com`（具体源）、`Allow-Credentials: true`、`SameSite=None; Secure`——三者必须同时满足，缺一个 Cookie 就不会被带上。**「Cookie 带不上」第一查 SameSite，第二查 Secure 与协议**。
::crit 预检请求在中间件层返回 204，不进业务路由
::crit 不用 `*` + credentials 的组合
::crit 开发用代理、生产用反代，尽量保持同源
::crit 跨站时 `SameSite=None; Secure` 与 CORS 具体源同时配置

<!--day 11-->
::pre 完成 D3-D10：镜像与部署就绪。
::predict bash
```bash
govulncheck ./...
# Vulnerability #1: GO-2024-XXXX
#   Called by: ...
#   Found in: golang.org/x/crypto@v0.20.0
```
::ask 这个输出说明「一定需要升级」吗？
::ans 要看有没有 `Called by` 的调用栈。`govulncheck` 的核心价值是**区分「依赖里有漏洞」和「你的代码真的调用了漏洞函数」**：有调用栈 → 真实风险，必须处理；只有 "Found in" 没有 "Called by" → 当前不可达，记录并跟踪。**不做这个区分的话，每次扫描几十条告警，最后没人看**。
::predict bash
```bash
go get -u ./...
go test ./...
# 编译失败
```
::ask 为什么「全量升级」是坏策略？
::ans ① 大版本升级会有 breaking change（比如 GORM v1→v2、jwt v4→v5）；② 一次升几十个依赖，出问题时无法定位是哪个导致的；③ 升级本身引入新 bug 的风险，可能比漏洞本身更现实。正确策略：**先只升补丁版本**（`go get -u=patch ./...`），跑测试 + 重新扫描；解决不了再考虑次版本/大版本，且**一次只升一个**，单独回归。**升级要可回滚、可归因**。
::debug bash
```bash
govulncheck ./...
# No vulnerabilities found
# 但 go list -m all | grep golang.org/x/net
# v0.17.0  ← 已知有漏洞
```
::ask 为什么扫描说没漏洞，但依赖版本很旧？
::ans 因为 `govulncheck` 只报「**当前模块图里、且可达**」的漏洞。如果旧版 `x/net` 只是间接依赖且漏洞函数没被调用，它不会报。但这不代表安全——一旦将来代码路径变化调用了那个函数，风险就出现了。做法：① 定期 `go get -u=patch` 保持补丁最新；② 关注依赖的安全公告；③ 对「明知有漏洞但不可达」的依赖，在文档里记录并设复查时间。**「扫描通过」是当下的快照，不是永久免疫**。
::transfer
::scene 把漏洞扫描接入构建流程。
::ask 放在哪个环节？失败时阻断还是告警？给出具体配置。
::hint 想想「开发本地」和「CI」的差别。
::ans
**本地**：`make vuln` 手动跑，快速反馈。
**CI**：在 `docker build` **之前**跑，作为独立 step：
```yaml
- name: govulncheck
  run: |
    go install golang.org/x/vuln/cmd/govulncheck@latest
    govulncheck ./...
```
**阻断策略**：对「有调用栈」的漏洞**阻断合并**；对「不可达」的漏洞**告警 + 记录 issue**（可以用 `-json` 输出后自己判断）。全量阻断会导致「一条不可达告警卡住所有 PR」，团队最终会加 `|| true`，等于关掉扫描。**分级处置比一刀切有效**。
另外固定 `govulncheck` 版本（不要 `@latest`），否则某天工具更新导致 CI 突然红。
::crit 能区分「有调用栈」与「仅依赖存在」两类结果
::crit 升级策略是「先补丁、再逐个、每次回归」
::crit 扫描接入 CI，且分级处置（阻断/告警）
::crit 固定扫描工具版本，不用 `@latest`

<!--day 12-->
::pre 完成阶段四的 Cookie 方案；现在要补齐安全属性。
::predict
```go
http.SetCookie(w, &http.Cookie{
    Name:  "token",
    Value: signed,
})
```
::ask 这个 Cookie 缺了哪些属性？各自防什么？
::ans 缺四个：`HttpOnly`（防 XSS 通过 `document.cookie` 窃取）、`Secure`（防明文 HTTP 传输被嗅探）、`SameSite`（防跨站请求自动携带，CSRF 第一道防线）、`Path=/`（默认只在设置它的路径生效，其他接口不带）。还有 `MaxAge`（不设就是会话 Cookie，关浏览器即失效——可能不是你想要的）。**每个属性对应一类攻击，缺一个就少一层**。
::predict
```go
// 登出时
http.SetCookie(w, &http.Cookie{Name: "token", Value: "", MaxAge: -1})
```
::ask 这样能删掉 Cookie 吗？还缺什么？
::ans 大多数情况能（`MaxAge: -1` 表示立即过期），但**必须带上与原 Cookie 相同的 `Path` 和 `Domain`**，否则浏览器认为这是「另一个 Cookie」，原 Cookie 还在。常见症状：登出后刷新页面又是登录状态。正确写法：
```go
http.SetCookie(w, &http.Cookie{
    Name: "token", Value: "", Path: "/", MaxAge: -1, HttpOnly: true, Secure: true, SameSite: http.SameSiteLaxMode,
})
```
**删除 Cookie 的本质是「用相同作用域覆盖一个过期值」**，作用域不匹配就删不掉。
::debug bash
```bash
# 本地 http://localhost:8080 测试
# 登录成功，但浏览器没有保存 Cookie
```
::ask 为什么？
::ans 因为 `Secure: true` 的 Cookie **只在 HTTPS 下才会被保存**（`localhost` 在部分浏览器被视为安全上下文例外，但 `192.168.1.10` 不会）。家庭内网用 http 访问时，`Secure` 会导致 Cookie 被静默丢弃，表现为「登录成功但立刻掉登录」。取舍：① 生产/有域名时用 HTTPS + `Secure`；② 内网 http 场景，`Secure` 设为「根据协议动态」（`r.TLS != nil`），但这会让内网流量明文——要明确接受这个风险。**不要为了「配置看起来安全」而在 http 环境开 Secure，那只会让功能坏掉**。
::transfer
::scene 设计完整的 Cookie 策略，覆盖开发/生产/内网三种环境。
::ask 各环境的属性组合是什么？如何避免「本地能跑线上挂」？
::hint 用配置项控制 `Secure`，而不是硬编码。
::ans
| 环境 | Secure | SameSite | 说明 |
| 本地开发(http localhost) | false | Lax | localhost 是安全上下文，但 Secure 仍会限制 |
| 内网 http(192.168.x) | false | Lax | 明确接受明文风险，靠网络隔离 |
| 生产 https | true | Lax（或 Strict） | 标准配置 |
实现：`Secure: cfg.CookieSecure`，配置项由环境决定；启动日志打印实际值。**「安全属性」不是越多越好，要和实际协议匹配**——不匹配的结果不是「更安全」，是「功能失效 + 有人为了修好而全部关掉」。另外无论哪种环境，`HttpOnly` 都应该开（它不依赖协议），`Path=/` 都应该显式写。
::crit `HttpOnly` 在所有环境都开启
::crit `Secure` 由配置控制，与协议匹配，启动日志可见
::crit 删除 Cookie 时 `Path`/`Domain` 与原 Cookie 一致
::crit 能说出「http 环境开 Secure 会导致 Cookie 静默丢弃」

<!--day 13-->
::pre 完成 D12：Cookie 属性已配。
::predict go
```go
mux.HandleFunc("POST /api/v1/ledger", csrf.Protect(key)(h.Create))
mux.HandleFunc("GET /healthz", h.Health)
```
::ask 这样挂 CSRF 有什么问题？
::ans 只保护了创建接口，其他写接口（更新、删除、注册、登录）都没保护；而且 `csrf.Protect` 包在单个 handler 上，**未匹配的路径、其他路由都绕过了校验**。正确做法是包住整个路由器：
```go
handler := csrf.Protect(key, csrf.Secure(true))(mux)
srv := &http.Server{Handler: handler}
```
**CSRF 中间件必须在路由之前**，否则「没匹配到路由的请求」不会经过它——而攻击者恰恰可以利用这些路径。**中间件的位置决定了它的覆盖面**。
::predict go
```go
handler := Recovery(Logging(RateLimit(Auth(csrf.Protect(key)(mux)))))
```
::ask 这个顺序有什么问题？
::ans CSRF 在最内层（Auth 之后），意味着：① 未通过 CSRF 的恶意请求会先消耗限流配额、先做鉴权（鉴权要查库/验签，有成本）；② 如果 Auth 因为某种原因放行了（比如公开接口），CSRF 才生效，覆盖面不完整。推荐顺序：**Recovery → CSRF → RateLimit → Auth**。理由：Recovery 最外捕获所有 panic；CSRF 尽早拦截无效请求（最便宜，只验 token）；RateLimit 对「合法形状」的请求限流；Auth 最后做昂贵的身验。**「便宜且能拒绝的检查放前面」是中间件排序的通用原则**。
::debug bash
```bash
# 前端带了 Cookie 但没带 CSRF token
curl -X POST localhost:8080/api/v1/ledger \
  -b 'token=xxx' -d '{"amount":100}'
# 403 Forbidden
```
::ask 这是 bug 还是预期？前端该怎么拿 token？
::ans 是**预期行为**——CSRF 中间件要求写请求带 token。前端需要：① 页面加载时请求 `GET /csrf-token`（或从 Cookie 里读，取决于方案），拿到 token；② 每个写请求带 `X-CSRF-Token` 头。用 `gorilla/csrf` 时，它会把 token 放在名为 `_gorilla_csrf` 的 Cookie 里（HttpOnly），并提供一个 `csrf.TemplateField` / `csrf.Token(r)` 让后端注入到页面或接口。**SPA 场景通常在登录响应里返回 token，或提供一个 `GET /csrf` 接口**——关键是「前端有个稳定途径拿到它」。
::transfer
::scene 设计完整的 CSRF 防护方案，说明 SPA + Cookie 场景怎么落地。
::ask 中间件顺序、token 下发方式、豁免路径分别是什么？
::hint 想「哪些路径不需要 CSRF」（健康检查、登录？）以及为什么。
::ans
**中间件顺序**：`Recovery → CSRF → RateLimit → Auth → mux`。
**token 下发**：`GET /api/v1/csrf` 返回 `{token}`（同时通过 `csrf.Token(r)` 生成），前端存内存，写请求带 `X-CSRF-Token`。
**豁免**：`/healthz`、`/readyz`（GET，无副作用，且编排系统不会带 token）；`/api/v1/login` 通常也豁免（用户还没会话，CSRF 无意义），但**要确保登录接口本身没有副作用**（比如不能「登录即创建资源」）。
**不豁免**：所有写接口（POST/PUT/PATCH/DELETE），包括 logout（防止被强制登出）。
**注意**：`SameSite=Lax` 已经挡住了大部分跨站 POST，CSRF token 是第二道防线。两者都要有，不是二选一。**「有 SameSite 就够了」是常见误解**——Lax 对顶层 GET 导航仍会带 Cookie，且老浏览器支持不一。
::crit `csrf.Protect()` 包住整个路由器，不在单个 handler 上
::crit 顺序为 Recovery → CSRF → RateLimit → Auth，且能说出理由
::crit 有明确的 token 下发途径，前端可稳定获取
::crit 豁免路径只有无副作用的（healthz/readyz），登录豁免有理由

<!--day 14-->
::pre 完成 D1-D13：后端可部署、安全项已配。
::predict bash
```bash
# Vue 前端 build 后由 Nginx 提供，/api 反代到后端
curl -I https://ledger.example.com/
# 200，但页面白屏
```
::ask 白屏最常见的原因是什么？
::ans ① **静态资源 404**：Vue 的路由是 history 模式，直接访问 `/ledger` 时 Nginx 找不到对应文件，必须 `try_files $uri $uri/ /index.html`；② **API base URL 写死成 `localhost:8080`**，部署后浏览器请求自己的 localhost；③ **构建产物路径不对**（`base: '/'` vs `'/app/'`）。白屏时先看浏览器 Console 的 404/网络错误，再看 `index.html` 是否正确返回。**「白屏」= HTML 拿到了但 JS 没跑起来，先看资源加载**。
::predict bash
```bash
# 手机上访问 http://192.168.1.10:8080
# 登录成功，但点「添加账目」没反应
```
::ask 可能原因？
::ans ① **监听地址是 `localhost`**（只回环），手机根本连不上——但这里「登录成功」说明连上了；② **Cookie 的 `Secure`** 导致 http 下 Cookie 不保存，第二个请求变成未登录，前端拿到 401 但没处理（表现为「没反应」）；③ **CORS 预检失败**（如果前端和后端不同源），浏览器的 OPTIONS 被拒；④ 前端错误没提示（catch 了但没展示）。排查：手机连电脑开 Safari/Chrome 远程调试，或后端日志看第二个请求是否 401。**「手机上点了没反应」八成是 401 + 前端没提示**。
::debug bash
```bash
docker compose logs api | tail -20
# 全是 GET /healthz 200
# 没有任何业务请求
```
::ask 前端说「请求发出去了」，日志里却没有，问题在哪？
::ans 请求**没到后端**：① 前端 API base URL 指向了错误的 host/port；② Nginx 反代配置错误（`proxy_pass` 路径多了/少了 `/api` 前缀）；③ 请求被浏览器拦截（CORS 预检失败时，实际请求根本不会发出）；④ 混合内容（https 页面请求 http 接口被浏览器阻止）。排查：浏览器 Network 面板看请求状态（failed / CORS error / 404），以及 `docker compose logs nginx`。**「前端说发了，后端没收到」= 看 Network 面板，不要猜**。
::transfer
::scene 做最终的手机端验收。
::ask 列出验收清单（至少 8 项），并说明每项验证什么。
::hint 覆盖登录、增删改查、统计、预算、导出、刷新、断网。
::ans
| # | 操作 | 验证 |
| 1 | 手机浏览器打开首页 | 静态资源加载、路由正常 |
| 2 | 注册新账号 | 表单校验、错误提示 |
| 3 | 登录 | Cookie 保存（刷新后仍登录） |
| 4 | 添加账目（含中文备注、逗号） | 金额单位正确、CSV 转义 |
| 5 | 列表看到刚添加的 | 分页、排序 |
| 6 | 删除并确认 | 二次确认、列表更新 |
| 7 | 查看月度统计 | 数字与手算一致 |
| 8 | 超预算时看到提示 | budget 标志展示 |
| 9 | 导出 CSV 并用手机打开 | 编码、列对齐 |
| 10 | 关闭浏览器重开 | Cookie 持久化（MaxAge） |
| 11 | 飞行模式下操作 | 错误提示友好，不白屏 |
**第 3、10 项验证 Cookie 生命周期；第 4、9 项验证编码与单位；第 11 项验证错误处理**。全部通过才算「可交付」——这也是整条路线的最终验收。
::crit 手机端完成「登录 → 添加 → 列表 → 统计 → 删改」完整链路
::crit 刷新/重开浏览器后仍保持登录
::crit CSV 在手机上能正确打开，中文不乱码
::crit 断网时有明确错误提示，不白屏、不静默失败
