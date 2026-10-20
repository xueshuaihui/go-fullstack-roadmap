<!--day 1 | normal-->
#### 配置的三层来源，优先级从低到高
```
默认值 < 配置文件（yaml） < 环境变量
```
```go
type Config struct {
    Addr      string `yaml:"addr"`
    DBPath    string `yaml:"db_path"`
    JWTSecret string `yaml:"-"`
    LogLevel  string `yaml:"log_level"`
}

func Load() (*Config, error) {
    c := &Config{Addr: ":8080", DBPath: "ledger.db", LogLevel: "info"}   // 1. 默认值
    if b, err := os.ReadFile("config.yaml"); err == nil {
        if err := yaml.Unmarshal(b, c); err != nil { return nil, fmt.Errorf("parse config: %w", err) }
    }
    if v := os.Getenv("ADDR"); v != "" { c.Addr = v }                      // 2. 环境变量覆盖
    if v := os.Getenv("DB_PATH"); v != "" { c.DBPath = v }
    c.JWTSecret = os.Getenv("JWT_SECRET")                                  // 3. 密钥只从环境变量来
    return c, c.validate()
}
```
**默认值让本地开发零配置就能跑**，环境变量让容器部署不用改文件。

#### 为什么密钥不走 yaml
配置文件的常见命运是被提交进仓库、被打进镜像、被复制到聊天里。密钥一旦进 yaml，就等同于公开。**密钥只能来自环境变量或 secrets 挂载。**

#### 配置结构体只解析一次
在 `main` 里 `Load()` 一次，然后把具体字段传给需要的地方（`store.MustOpen(cfg.DBPath)`），不要到处 `os.Getenv`。散落的 `Getenv` 无法被测试、无法被校验、也无法生成配置文档。

#### 环境变量名怎么和 yaml 字段对上

容器部署时你只会改环境变量，所以「`APP_SERVER_PORT` → `server.port`」这条映射规则必须显式约定。若用 viper：

```go
v := viper.New()
v.SetConfigFile(path)
v.SetEnvPrefix("APP")                    // 只认 APP_ 开头
v.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))   // server.port → SERVER_PORT
v.AutomaticEnv()
```

若自己手写（本路线推荐，依赖少、行为可见）：就在 `Load()` 里逐字段写 `if v := os.Getenv("APP_SERVER_PORT"); v != ""`。字段少时手写更清楚，字段多了再上库。

#### 三种类型转换，最容易出问题

| 类型 | 写法 | 坑 |
| :--- | :--- | :--- |
| 整数 | `strconv.Atoi(v)` | 空串转 0；`"8080 "`（带空格）报错 |
| 布尔 | `strconv.ParseBool(v)` | 只有 `1/0/true/false/T/F` 合法，`"yes"` 会报错 |
| 时长 | `time.ParseDuration(v)` | 必须带单位：`30s`、`5m`，`30` 会报错 |

**转换失败必须返回错误、让进程退出**，不要 `_ = err` 忽略后拿到零值——端口变成 0、超时变成 0 秒，故障会推迟到很难排查的地方。

#### `config.example.yaml` 是给协作者看的接口文档

```yaml
# config.example.yaml —— 仓库里提交这一份，真实 config.yaml 进 .gitignore
server:
  port: 8080          # 监听端口；容器里用 APP_SERVER_PORT 覆盖
  read_timeout: 10s   # 带单位
db:
  path: ./ledger.db   # 相对路径会跟着启动目录变，生产用绝对路径
log:
  level: info         # debug | info | warn | error
jwt:
  expire: 2h          # 只配过期时间；密钥走环境变量 JWT_SECRET
```

每个字段都要有注释说明「是什么、怎么覆盖、生产该填什么」。这份文件的价值是：新人 clone 下来 `cp config.example.yaml config.yaml` 就能跑。

#### 报错对照

| 现象 | 原因 | 修法 |
| :--- | :--- | :--- |
| 改了环境变量但没生效 | 变量名没加前缀，或被 yaml 覆盖（顺序写反） | 打印最终生效值，确认覆盖顺序 |
| `port: "8080"` 启动报错 | yaml 里引号让它成了字符串 | 去掉引号；或解析时统一 `Atoi` |
| 容器里能用、本机不行 | 本机 `config.yaml` 存在，容器里没有 | 容器里必须给默认值或挂载配置 |
| 生产连到了本地库 | `db.path` 用了相对路径 | 生产用绝对路径 `/data/ledger.db` |

#### 5 分钟最小验证：三层优先级各验一次

```bash
$ go run .                                  # 用默认值启动，日志里 addr=:8080
$ ADDR=:9090 go run .                       # 日志里 addr=:9090（env 覆盖默认）
$ printf 'addr: ":7070"\n' > /tmp/c.yaml && go run . -config /tmp/c.yaml   # addr=:7070（文件覆盖默认）
$ ADDR=:9090 go run . -config /tmp/c.yaml   # addr=:9090（env 覆盖文件）
```

四条命令的日志地址各不相同，说明优先级真的按「默认 < 文件 < 环境变量」生效。任何一条不符合预期，都是覆盖顺序写反了。

#### 判据
```bash
./api                              # 用默认值启动
ADDR=:9090 ./api                   # 端口被环境变量覆盖
ADDR=:9090 ./api &                 # 日志里应打印最终生效的值
```
再写一个 `config_test.go`，验证「env 覆盖 yaml、yaml 覆盖默认」三层顺序。

::q 为什么密钥不应该放在 yaml 配置文件里？
::a 配置文件通常会被提交到仓库、打进镜像或复制传播，密钥一旦写入就很容易泄漏且难以追溯。环境变量或 secrets 挂载可以做到「配置与密钥分离」，且不落盘到镜像层。
::q 到处直接调用 `os.Getenv` 有什么问题？
::a 无法集中校验（缺失时不知道）、无法在测试中注入、无法生成配置清单、也无法保证类型转换一致。集中到 `Load()` 一次解析成结构体，才能在启动时发现所有配置问题。
::q 为什么要保留默认值？
::a 让本地开发和测试零配置可跑，降低上手成本；同时默认值必须是「安全且可用」的（比如数据库路径、监听地址），不能是空值导致启动失败。

<!--day 2 | normal-->
#### 启动即失败（fail fast）比运行时出错好
```go
func (c *Config) validate() error {
    if c.Addr == "" { return errors.New("ADDR 不能为空") }
    if c.DBPath == "" { return errors.New("DB_PATH 不能为空") }
    if len(c.JWTSecret) < 32 {
        return fmt.Errorf("JWT_SECRET 至少 32 字节，当前 %d", len(c.JWTSecret))
    }
    switch c.LogLevel {
    case "debug", "info", "warn", "error":
    default:
        return fmt.Errorf("未知日志级别: %s", c.LogLevel)
    }
    return nil
}
```
**配置错误必须在进程启动的 100ms 内暴露**，而不是等到第一个请求。容器编排会立刻看到退出码非 0，进入重启或告警流程。

#### 反例：默认值兜底
```go
secret := os.Getenv("JWT_SECRET")
if secret == "" {
    secret = "dev-secret"     // ❌ 生产环境也用了这个
}
```
这类代码会以「看起来正常但完全不安全」的方式上线。正确做法是：**开发环境用 `.env` 显式提供，生产缺失就退出。**

#### 启动日志要能自证配置
```go
slog.Info("config loaded",
    "addr", cfg.Addr,
    "db_path", cfg.DBPath,
    "log_level", cfg.LogLevel,
    "jwt_secret_len", len(cfg.JWTSecret),   // 只打长度，不打值
)
```
部署出问题时，第一件事就是看这行日志确认配置是否如预期。**密钥永远不打值。**

#### 本地开发怎么给密钥：`.env` + 启动脚本

生产用容器注入环境变量，本地不想每次手敲 `JWT_SECRET=... go run .`，就用一个不提交的 `.env`：

```bash
# .env（必须写进 .gitignore）
JWT_SECRET=local-dev-only-please-change-32bytes
DB_PATH=./ledger.db
```

```bash
# 启动时载入，二选一
$ set -a && source .env && set +a && go run .
$ env $(grep -v '^#' .env | xargs) go run .     # 简单粗暴版
```

**`.env` 只能用于本地**。它一旦被提交，就等于把密钥写进了 git 历史——删掉文件也没用，`git log -p` 里还在。发现提交了就必须立刻轮换密钥，而不是 `git rm` 后再提交一次。

#### 生成一个够强的密钥

```bash
$ openssl rand -hex 32      # 64 个 hex 字符 = 32 字节，够 HS256 用
$ openssl rand -base64 32   # 或者 base64，44 字符
```

不要用 `password123`、不要用项目名、不要用「开发时先随便写一个后面再改」——**后面永远不会改**。生成后就写进部署机的环境变量或 secrets，不进仓库。

#### 打码函数：日志里只留可辨认的前缀

```go
func mask(s string) string {
    if len(s) <= 8 { return "***" }
    return s[:4] + "***" + s[len(s)-2:]
}
// mask("a1b2c3d4e5f6") → "a1b2***f6"
```

为什么要留前后各几位：出问题时你能确认「部署的是不是我以为的那把钥匙」，同时又不足以被还原。**只打长度也能验证配置是否加载，但打码能验证「加载的是哪一把」**，在有多套环境时更有用。

#### 校验要放在 `Load()` 里，不要放在 `main` 里散着写

```go
func Load() (*Config, error) {
    c := &Config{ /* 默认值 */ }
    // ... 读文件、读环境变量 ...
    if err := c.validate(); err != nil {
        return nil, fmt.Errorf("invalid config: %w", err)   // 调用方决定怎么退出
    }
    return c, nil
}

func main() {
    cfg, err := config.Load()
    if err != nil {
        slog.Error("config load failed", "err", err)   // 用结构化日志，别用 fmt.Println
        os.Exit(1)
    }
    ...
}
```

`Load()` 返回错误、`main` 决定退出——这样配置校验能被单测覆盖（`TestLoad_MissingSecret`），而不是只能靠「跑一下看看」。

#### 报错对照

| 现象 | 原因 | 修法 |
| :--- | :--- | :--- |
| 容器启动即退出，日志只有一行 | `log.Fatal` 前没打印原因 | 先 `slog.Error("...", "err", err)` 再退出 |
| 环境变量明明设了却是空 | `docker run -e` 写在了镜像名之后 | `-e` 必须在镜像名之前 |
| 本地能跑、容器报密钥太短 | `.env` 没被带进容器 | 容器必须显式 `--env-file` 或编排里声明 |
| `git log -p` 搜到了密钥 | 曾提交过 `.env` 或 yaml | 立即轮换密钥；历史清理是次要的 |

#### 5 分钟最小验证：三种启动都试一次

```bash
$ go build -o api . && ./api                        # 期望：退出码 1，提示 JWT_SECRET 缺失
$ JWT_SECRET=short ./api; echo "exit=$?"            # 期望：提示长度不足，exit=1
$ JWT_SECRET=$(openssl rand -hex 32) ./api          # 期望：正常启动，日志里 jwt_secret_len=64
```

三次的退出码和日志必须和预期一致。「**缺配置时能干净地死**」和「有配置时能正常活」是同一个能力的两面，只测后者等于没测。

#### 判据
```bash
./api                                   # 无 JWT_SECRET → 退出码 1 + 明确提示
JWT_SECRET=short ./api                  # 提示长度不足
JWT_SECRET=$(openssl rand -hex 32) ./api  # 正常启动
```

::q 为什么配置错误要在启动时失败，而不是第一次用到时才报错？
::a 启动时失败能被容器编排立刻发现（退出码非 0、重启策略触发、告警发出），问题在部署阶段就暴露。拖到运行时，表现为随机 500，排查成本高得多。
::q 用默认密钥兜底为什么危险？
::a 默认密钥通常写在代码里、对内公开，任何人都能伪造 token。更糟的是它会掩盖配置缺失，让部署「看起来成功」，实际毫无安全性。
::q 启动日志里为什么只打印密钥长度？
::a 长度足以判断「是否配置了、是否符合最小要求」，而打印明文密钥会让它进入日志系统，构成泄漏。日志经常被更广泛的人访问，密钥不该出现在那里。

<!--day 3 | normal-->
#### 没碰过 Docker？先花 20 分钟把三个词分清

| 概念 | 一句话 | 类比 |
| :--- | :--- | :--- |
| 镜像 image | 只读的「文件系统 + 启动命令」模板，由 Dockerfile 构建出来 | 一个装好系统的安装盘 |
| 容器 container | 镜像的一次运行实例，有自己的进程、网络、可写层 | 用安装盘启动起来的一台机器 |
| 卷 volume | 独立于容器的持久化存储，容器删了数据还在 | 外接硬盘 |

三者的关系决定了一个常见误解：**容器里的写操作不会回到镜像**，容器删掉就没了；要留数据必须挂卷（`-v`）。这也是为什么数据库文件必须放卷里，而不是镜像里。

安装与验证（各平台一条命令的事，别在这上面折腾）：

```bash
# macOS / Windows：装 Docker Desktop，启动后等鲸鱼图标变绿
# Linux（Debian/Ubuntu）：官方脚本或 apt 源，装完把用户加进 docker 组
$ docker version          # 能看到 Client 和 Server 两段才算真的连上了
$ docker run --rm hello-world   # 第一次跑会拉镜像，看到 Hello from Docker! 就成功
```

四条命令覆盖 90% 的日常：

```bash
$ docker build -t ledger-api .            # 按当前目录的 Dockerfile 构建，打标签 ledger-api
$ docker run --rm -p 8080:8080 ledger-api # 前台跑；-p 宿主端口:容器端口；--rm 退出即删
$ docker ps -a                            # 看所有容器（含已退出），重点看 STATUS 和 PORTS
$ docker logs -f <容器ID前3位>            # 看容器内日志，-f 跟随
```

四个新手必遇的报错：

| 报错 | 原因 | 修法 |
| :--- | :--- | :--- |
| `Cannot connect to the Docker daemon` | Docker Desktop 没启动，或当前用户不在 docker 组 | 启动 Desktop；Linux 上 `sudo usermod -aG docker $USER` 后重登 |
| `port is already allocated` | 宿主 8080 被占用（本机可能还跑着 `go run`） | `lsof -i :8080` 杀掉，或换 `-p 8081:8080` |
| `exec format error` | 在 Apple Silicon 上构建了 amd64 镜像却没声明平台 | `docker build --platform linux/arm64`，或部署目标统一 amd64 |
| 容器起来就退出（`Exited (1)`） | 启动即失败，比如缺 `JWT_SECRET` | `docker logs` 看第一行错误——这正是 D2「启动即失败」的价值 |

#### 多阶段构建：编译环境和运行环境分离
```dockerfile
# ---- build ----
FROM golang:1.23-alpine AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /out/api ./cmd/api

# ---- runtime ----
FROM alpine:3.20
RUN apk add --no-cache ca-certificates tzdata && adduser -D -u 10001 app
WORKDIR /app
COPY --from=build /out/api /app/api
COPY --from=build /src/migrations /app/migrations
USER app
EXPOSE 8080
ENTRYPOINT ["/app/api"]
```
四个关键点：
1. **先 `COPY go.mod go.sum` 再 `go mod download`**：依赖层被缓存，改代码不会重新下载依赖。
2. **`CGO_ENABLED=0`**：产出静态二进制，运行镜像不需要 glibc。
3. **`-trimpath -ldflags="-s -w"`**：去掉本地路径信息和符号表，体积更小、也更少泄漏构建环境。
4. **`ca-certificates` + `tzdata`**：不装的话 HTTPS 请求会失败、时区会变成 UTC（对中国用户是 8 小时偏差）。

#### 一定要有 `.dockerignore`
```
node_modules
dist
.git
*.db
.env
```
不写的话 `COPY . .` 会把本地数据库、`.env`、`.git` 全打进镜像——既臃肿又泄漏密钥。

#### 判据
```bash
docker build -t ledger-api .
docker images ledger-api      # 应该在 20–30MB 量级
docker run --rm ledger-api    # 能启动并打印配置日志
```

::q 为什么 `go.mod`/`go.sum` 要单独先 COPY？
::a Docker 按层缓存：依赖文件不变时 `go mod download` 这一层直接复用，改业务代码只需重新编译，构建时间从几分钟降到几秒。如果一起 COPY，任何代码改动都会让依赖重新下载。
::q `CGO_ENABLED=0` 的作用是什么？
::a 禁用 CGO，产出纯静态二进制，不依赖运行时的 libc。这样运行镜像可以用 alpine 甚至 scratch，体积更小、跨环境更稳定。`modernc.org/sqlite` 正是为了不依赖 CGO 才被选用。
::q `.dockerignore` 不写会导致什么？
::a 本地 `.env`、数据库文件、`.git` 目录会被 `COPY . .` 打进镜像，既增大体积，又可能把密钥和历史提交泄漏给任何能拉取镜像的人。

<!--day 4 | normal-->
#### 非 root 运行，不只是「更安全」
```dockerfile
RUN adduser -D -u 10001 app
USER app
```
root 容器里，进程被攻破等于拿到宿主机的高权限（尤其在挂载了目录、共享了网络时）。非 root 用户即使被攻破，破坏范围也被限制。

如果程序需要写数据库文件，**要提前把目录权限给对**：
```dockerfile
RUN mkdir -p /data && chown -R app:app /data
VOLUME /data
```
否则运行时会报 `unable to open database file`，而错误信息往往指向「数据库损坏」，很容易排查错方向。

#### SQLite 的额外注意
- 数据库文件所在目录**必须可写**（SQLite 需要在同目录写 `-wal`、`-shm`、日志文件）。
- 不要用只读挂载，除非确实只读查询。
- 卷的属主问题在容器里很常见：宿主机目录属主是 root，容器内 `app` 用户无法写。

#### 判据
```bash
docker run --rm ledger-api id          # uid=10001，不是 0
docker run --rm -v $(pwd)/data:/data ledger-api   # 能正常写库
ls -l data/ledger.db                    # 属主是 10001
```

#### 基础镜像三选一：alpine / distroless / scratch
| 镜像 | 体积 | 有什么 | 没有什么 | 适合 |
| :--- | :--- | :--- | :--- | :--- |
| `alpine:3.20` | ~7MB | sh、apk、busybox | glibc（用 musl） | 需要进容器排查 |
| `gcr.io/distroless/static` | ~2MB | CA 证书、`/etc/passwd`、时区 | **shell、包管理器** | 生产首选 |
| `scratch` | 0 | 什么都没有 | 连 CA 证书都没有 | 静态编译 + 不需要 HTTPS |

三个新手必踩的点：

1. **`scratch` 里没有 CA 证书**，任何 HTTPS 出站请求都会报 `x509: certificate signed by unknown authority`。要用就先 `COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/`。
2. **`scratch` 里没有 `/etc/passwd`**，`USER 10001` 可以用（数字 UID 不需要 passwd 条目），但某些库会去读它。
3. **alpine 用 musl libc**，如果编译时 `CGO_ENABLED=1`，二进制会依赖 glibc 而跑不起来，报 `no such file or directory`（这个报错极具误导性，它说的不是文件不存在，是动态链接器不存在）。

#### 报错对照
| 现象 | 原因 | 修法 |
| :--- | :--- | :--- |
| `standard_init_linux.go: exec user process caused: no such file or directory` | 镜像里缺动态链接器（CGO 开着 + 基础镜像不匹配） | 编译加 `CGO_ENABLED=0`，或用同 libc 的基础镜像 |
| `permission denied` 打开 `ledger.db` | 数据目录属主是 root，进程是非 root | `chown -R 10001:10001 /data`；挂载时注意宿主机属主 |
| `unable to open database file` | 目录不可写（SQLite 要写 `-wal`/`-shm`） | 目录必须可写，不能只读挂载 |
| `x509: certificate signed by unknown authority` | 用了 `scratch`，没有 CA 证书 | 拷贝 `ca-certificates.crt`，或换 distroless |
| 容器启动即退出，日志为空 | 二进制没找到配置，`log.Fatal` 到 stderr 但没被收 | `docker logs <id>`；确认 `ENTRYPOINT` 路径正确 |

#### 5 分钟最小验证：三个断言，一条命令一个
```bash
docker build -t ledger-api .
docker run --rm ledger-api id                          # 必须 uid=10001
docker run --rm ledger-api ls /                        # distroless 会报找不到 ls —— 正常
docker run --rm -v /tmp/ldata:/data ledger-api         # 挂载空目录，能启动并建库
ls -ln /tmp/ldata                                      # 属主 10001
```
第三条是最容易失败的：`/tmp/ldata` 由 root 创建，容器内 `app` 用户写不进去。**这就是「非 root 化」真正的成本所在**——不是加一行 `USER`，而是把所有需要写的路径的属主都安排好。生产上用 `docker compose` 的 `user:` 或初始化脚本解决，别指望宿主机目录权限刚好合适。

`ls -ln` 的 `-n` 是显示数字 UID，容器里没有用户名映射时比 `ls -l` 更直观。

::q 容器里用 root 运行的实际风险是什么？
::a 进程被攻破后拥有容器内 root 权限，若挂载了宿主机目录或有特权配置，可直接影响宿主机；也可能修改镜像内文件、读取敏感挂载。非 root 用户能把破坏面限制在授权目录内。
::q SQLite 数据库目录不可写时会出现什么错误？
::a 通常是 `unable to open database file`，还可能伴随无法创建 `-wal`/`-shm` 文件。错误信息容易被误读为「数据库损坏」，实际是权限问题。排查时先看目录属主和写权限。
::q 为什么挂载卷的属主问题在容器里特别常见？
::a 宿主机上的目录通常属于宿主用户（或 root），容器内的非 root 用户 uid 不同，没有写权限。需要在 Dockerfile 里创建对应 uid 并 chown，或在启动时调整目录权限。

<!--day 5 | core-->
#### compose 的四个要素
```yaml
services:
  api:
    image: ledger-api:latest
    build: .
    ports:
      - "8080:8080"
    environment:
      DB_PATH: /data/ledger.db
      JWT_SECRET: ${JWT_SECRET:?JWT_SECRET required}
      LOG_LEVEL: info
    volumes:
      - ./data:/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:8080/healthz"]
      interval: 30s
      timeout: 3s
      retries: 3
```
四个要素都不可省：
1. **`environment` 里用 `${VAR:?err}`**：变量缺失时 compose 直接报错退出，而不是传空值进去。
2. **`volumes` 持久化 SQLite**：不挂卷，容器重建数据就没了。
3. **`restart: unless-stopped`**：宿主机重启后自动拉起，但你手动 stop 的不会被强行重启。
4. **`healthcheck`**：让编排系统知道容器「活着但不健康」和「死了」是两回事。

#### `depends_on` 不等于「等它就绪」
```yaml
depends_on:
  db:
    condition: service_healthy   # 需要目标有 healthcheck
```
只写 `depends_on: [db]` 只保证**启动顺序**，不保证 db 已经能接受连接。用 `condition: service_healthy` 才能真正等待。

#### 数据卷的两种写法
- `./data:/data`：绑定挂载，数据在项目目录，便于备份和查看，但依赖宿主机路径。
- `ledger-data:/data`：命名卷，由 Docker 管理，可移植性好，但不易直接访问。

家庭部署用绑定挂载更直观——出问题能直接 `sqlite3 data/ledger.db` 查看。

#### 判据
```bash
docker compose up -d
docker compose ps                  # api 状态 healthy
curl localhost:8080/healthz        # 200
docker compose restart api && curl localhost:8080/ledger -H "Authorization: Bearer $T"
# 数据还在
```

#### 一个会直接冲突的细节：distroless 里没有 wget
上面 healthcheck 用的是 `wget -qO-`。如果你按昨天的建议选了 distroless，容器里**没有 wget，也没有 curl**，healthcheck 会永远失败，`docker compose ps` 一直显示 `unhealthy`，而服务其实是好的。

三种解法，按推荐度：

| 做法 | 写法 | 说明 |
| :--- | :--- | :--- |
| 给程序加子命令 | `test: ["CMD", "/app/api", "healthcheck"]` | 不依赖任何外部工具，最干净 |
| 换 alpine 基础镜像 | `FROM alpine:3.20` | 有 wget，但镜像大 5MB、有 shell |
| 用 TCP 探测 | `test: ["CMD-SHELL", "nc -z localhost 8080"]` | 仍需 nc，且只验证端口不验证业务 |

推荐第一种：给二进制加一个 `healthcheck` 子命令，向自己的 `/healthz` 发一次请求，非 200 就退出 1。**这样镜像可以保持最小，健康检查也不依赖环境。**

#### `env_file` 与 `environment` 的分工
```yaml
services:
  api:
    env_file:
      - .env            # 一堆配置，不进版本库
    environment:
      DB_PATH: /data/ledger.db    # 容器内的路径，写在 compose 里更直观
```
`env_file` 的值会被 `environment` 覆盖。**密钥只放 `.env`，且 `.env` 必须在 `.gitignore` 里**——这是最常见的密钥泄漏路径，比「代码里写死」更隐蔽，因为代码 review 时看不到。

同时 `.env` 里不要有空格和引号：
```
JWT_SECRET=abc123      # ✅
JWT_SECRET = "abc123"  # ❌ 值会变成 ' "abc123"'，验证签名时永远失败
```
compose 的 `.env` 解析规则和 shell 不完全一样，赋值号两边不能有空格。这个坑的表现为「token 永远验证不通过」，但代码和密钥看起来都对。

#### 报错对照
| 现象 | 原因 | 修法 |
| :--- | :--- | :--- |
| `Bind for 0.0.0.0:8080 failed: port is already allocated` | 宿主机上已有进程占用 8080 | `lsof -i :8080` 找到并停掉，或改映射 `"18080:8080"` |
| `service "api" is unhealthy` 但接口能访问 | healthcheck 用的工具镜像里没有（见上） | 改用程序自身的 `healthcheck` 子命令 |
| `JWT_SECRET required` 直接退出 | `${VAR:?}` 生效了，`.env` 没被读到 | `.env` 与 `compose.yaml` 同目录，或显式 `--env-file` |
| 容器重启后数据没了 | 忘了挂卷，SQLite 写在容器可写层 | 加 `volumes: - ./data:/data`，且 `DB_PATH` 指向 `/data` |
| `permission denied` 写 `/data` | 宿主机目录属主与容器内 UID 不一致 | `chown -R 10001:10001 data`（对应 D4 的非 root 用户） |

#### 5 分钟最小验证：一次「销毁重建」，数据必须还在
```bash
docker compose up -d
curl -s -X POST localhost:8080/ledger -H "Authorization: Bearer $T" \
  -d '{"amount":100,"category":"测试","date":"2026-10-19"}'
docker compose down            # 注意：不加 -v，卷不会被删
docker compose up -d
curl -s localhost:8080/ledger -H "Authorization: Bearer $T" | jq '.data.total'   # 必须是 1
```
这条链路验证的是「卷挂对了没有」。`down -v` 会删掉命名卷——**用绑定挂载（`./data:/data`）时 `-v` 也不会删宿主目录**，这也是家庭部署推荐绑定挂载的一个实际理由：手滑一次不至于丢数据。

::q `depends_on` 只写服务名，能保证数据库就绪吗？
::a 不能。它只保证启动顺序（先启动 db 容器，再启动 api 容器），不等待数据库真正可连接。此时 api 启动时连接会失败。需要给 db 配 healthcheck 并用 `condition: service_healthy`。
::q `restart: unless-stopped` 和 `always` 的区别？
::a `always` 在宿主机重启后也会拉起，包括你手动 `stop` 的服务（某些版本会）；`unless-stopped` 会记住「你主动停过」，重启后不拉起。后者更符合「运维意图优先」的预期。
::q 为什么环境变量要用 `${JWT_SECRET:?required}` 这种写法？
::a 缺少变量时 compose 会立刻报错并停止，避免把空密钥传进容器导致「启动成功但完全不安全」。这是把配置校验前移到编排层，比运行时才发现更早。

<!--day 6 | normal-->
#### 迁移不能靠应用启动时自动跑（多实例场景）
单实例家庭部署可以在 `main` 里 `goose.Up`，但更稳的做法是把迁移做成**独立的一次性任务**：
```yaml
services:
  migrate:
    image: ledger-api:latest
    entrypoint: ["/app/migrate"]
    environment:
      DB_PATH: /data/ledger.db
    volumes:
      - ./data:/data
    restart: "no"

  api:
    depends_on:
      migrate:
        condition: service_completed_successfully
```
`service_completed_successfully` 保证迁移成功退出后才启动 api。**迁移失败时 api 不会启动**，避免用旧结构跑新代码。

#### 为什么不用「启动时自动迁移」
1. 多副本同时启动会并发执行迁移，可能冲突。
2. 迁移失败会让应用无法启动，但如果应用已经跑起来一半（比如先监听再迁移），状态会很乱。
3. 无法单独回滚。

#### 迁移命令要能手动执行
```bash
docker compose run --rm migrate status
docker compose run --rm migrate up
docker compose run --rm migrate down 1
```
部署前先 `status`，出问题时能立刻判断「迁移到第几版了」。

#### 判据
```bash
docker compose up migrate    # 退出码 0
docker compose up -d api
docker compose logs migrate  # 看到 "OK 00002_add_budget.sql"
```

#### 一次升级的完整顺序（写进 README，照着做）
```bash
# 1. 备份：先有退路，再改结构
sqlite3 data/ledger.db ".backup 'data/backup-$(date +%F-%H%M).db'"

# 2. 看当前版本，确认没跑过头
docker compose run --rm migrate status

# 3. 迁移（失败就停在这里，api 不会启动）
docker compose up migrate

# 4. 起服务
docker compose up -d api

# 5. 验证
curl -fsS localhost:8080/healthz && curl -fsS localhost:8080/readyz
```
五步里**第 1 步最容易被跳过**。而「迁移把数据改坏了」是唯一无法靠回滚代码修复的事故类型——结构可以 `down`，被 `UPDATE` 覆盖的数据不能。

`.backup` 命令是在线的、一致的（它走 SQLite 的备份 API，会把 WAL 里的内容一起算进去）。直接 `cp` 三个文件在写入进行中可能拿到不一致的快照，这一点阶段三 D10 已经说过。

#### 报错对照
| 现象 | 原因 | 修法 |
| :--- | :--- | :--- |
| `api` 一直不启动，日志无输出 | `depends_on` 用了 `service_started`，migrate 还在跑 | 改 `service_completed_successfully` |
| migrate 成功但 api 报 `no such column` | 两个服务挂的卷不是同一个（路径不同） | 确认 `DB_PATH` 与 volume 一致 |
| `migrate` 容器退出码 1，api 正常启动 | api 没写 `depends_on`，或 compose 版本不支持 condition | 检查 compose 版本；必要时用 `entrypoint.sh` 串行 |
| 迁移重复执行报 `already exists` | `migrate` 服务被重启（`restart: always`） | 必须 `restart: "no"` |
| 备份文件 0 字节 | `.backup` 路径目录不存在，或权限不足 | 先 `mkdir -p`，并确认容器内 UID 可写（D4 的非 root） |

#### 5 分钟最小验证：故意让迁移失败，看 api 会不会起
```bash
# 在 00002 里塞一条明显错误的 SQL（比如引用不存在的表）
echo "ALTER TABLE no_such_table ADD COLUMN x TEXT;" > migrations/00003_broken.sql
docker compose up migrate; echo "migrate exit=$?"     # 非 0
docker compose ps                                      # api 不应处于 running
rm migrations/00003_broken.sql
docker compose up migrate && docker compose up -d api
```
这一步验证的正是 `service_completed_successfully` 有没有生效。**没有它，你会得到一个「表结构是旧的、代码是新的」的运行时**——那种状态下的报错五花八门，而且看起来都不像迁移问题。

::q 为什么推荐把迁移做成独立的 compose 服务，而不是应用启动时自动执行？
::a 多副本场景下并发迁移会互相冲突；迁移失败时应用可能带着错误结构启动；也无法独立回滚或单独重跑。独立服务 + `service_completed_successfully` 让顺序和失败语义都明确。
::q `condition: service_completed_successfully` 相比 `service_started` 的意义？
::a 前者等待容器**成功退出**（退出码 0），保证迁移真的执行完且没出错；后者只等容器启动，迁移可能还在跑或已经失败，api 就带着错误结构启动了。
::q 多实例部署时，为什么迁移不能放在应用启动流程里？
::a 两个实例同时启动会同时执行 `goose.Up`：轻则互相等待 DDL 锁、启动变慢，重则重复执行同一迁移（`table already exists`）导致其中一个实例启动失败、被编排反复重启。正确做法是把迁移作为部署流水线的**独立一步**（在滚动更新之前跑一次），应用只负责「启动时校验结构版本是否符合预期」，不符合就退出。**迁移是运维动作，不是启动副作用。**

<!--day 7 | normal-->
#### 两个探针，两个问题
- **`/healthz`（liveness）**：进程还活着吗？失败 → 重启容器。
- **`/readyz`（readiness）**：能接受流量吗？失败 → 从负载均衡摘掉，但不重启。

混用会出事故：把「数据库连不上」写进 liveness，数据库短暂抖动就会导致容器被反复重启，反而放大故障。

```go
func healthz(w http.ResponseWriter, r *http.Request) {
    w.WriteHeader(http.StatusOK)
    w.Write([]byte(`{"status":"ok"}`))
}

func readyz(db *sql.DB) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        ctx, cancel := context.WithTimeout(r.Context(), time.Second)
        defer cancel()
        if err := db.PingContext(ctx); err != nil {
            w.WriteHeader(http.StatusServiceUnavailable)
            w.Write([]byte(`{"status":"unready"}`))
            return
        }
        w.WriteHeader(http.StatusOK)
        w.Write([]byte(`{"status":"ready"}`))
    }
}
```
**探针必须有超时**，否则数据库挂住时探针也挂住，编排系统无法判断。

#### 探针不应该要求认证
`/healthz`、`/readyz` 必须放在认证中间件之外。套上认证会导致编排系统的探测始终 401，容器被判定不健康——**这是最容易犯的部署错误之一**。

#### 探针设计里三个容易做错的决定
1. **是否检查依赖**。`/readyz` 检查数据库是对的，`/healthz` 绝对不该检查——否则数据库抖一下，编排系统就把所有副本重启一遍。
2. **超时给多少**。探针超时要**小于**编排系统的探测超时（如 compose 的 `timeout: 3s`），否则你的探针还卡着，编排系统已经判定失败。
3. **返回体要不要 JSON**。HEAD 请求可能被探测，某些探测器只看状态码。写 JSON 无害，但不要依赖它。

#### 实现上的一个小陷阱
```go
func readyz(db *sql.DB) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        ctx, cancel := context.WithTimeout(r.Context(), time.Second)
        defer cancel()
        if err := db.PingContext(ctx); err != nil {
            w.WriteHeader(http.StatusServiceUnavailable)
            return
        }
        w.WriteHeader(http.StatusOK)
    }
}
```
- **必须用 `r.Context()` 派生**，这样客户端断开时探测也会结束。
- `defer cancel()` 不能省，否则每次探测泄漏一个定时器。
- `PingContext` 在连接池满时会**排队等待**，所以超时设 1 秒是必要的，别用 `db.Ping()`。

#### 判据
```bash
curl -i localhost:8080/healthz     # 200，无需 token
curl -i localhost:8080/readyz      # 200
# 把 DB_PATH 改错重启 → readyz 503，healthz 仍 200
```

::q liveness 和 readiness 混用会导致什么问题？
::a 若把「数据库不可用」写进 liveness，一次短暂抖动就会让编排系统重启容器，重启期间请求全部失败，故障被放大。liveness 只应反映「进程是否卡死」，依赖健康属于 readiness。
::q 探针为什么必须设置超时？
::a 依赖挂住（比如数据库连接池耗尽）时，Ping 可能长时间不返回。没有超时，探针请求也挂住，编排系统拿不到明确结果，无法做出重启或摘流量的决策。
::q 健康检查接口被认证中间件拦住会怎样？
::a 编排系统没有 token，探测永远返回 401，容器被判定为不健康并不断重启，形成「服务其实是好的但一直在重启」的诡异状态。健康检查必须匿名可访问。

<!--day 8 | core-->
#### 优雅关闭解决的是「正在处理的请求被腰斩」
直接 `kill` 进程时，正在执行的请求会瞬间断开，客户端看到连接重置；数据库写入可能做到一半。优雅关闭要做的是：**停止接受新连接 → 等待在途请求完成 → 释放资源**。

#### 前提：Server 必须有超时
```go
srv := &http.Server{
    Addr:              cfg.Addr,
    Handler:           router,
    ReadHeaderTimeout: 5 * time.Second,
    ReadTimeout:       30 * time.Second,
    WriteTimeout:      30 * time.Second,
    IdleTimeout:       120 * time.Second,
}
```
没有超时的服务器，`Shutdown` 可能永远等不完（有慢连接一直挂着），最终被强制杀死——优雅关闭形同虚设。**超时是优雅关闭的前提，不是可选项。**

#### 关闭顺序：先停服务，再关数据库
```go
ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
defer stop()

go func() {
    if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
        slog.Error("listen", "err", err)
        os.Exit(1)
    }
}()

<-ctx.Done()
slog.Info("shutting down")

shutdownCtx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
defer cancel()

if err := srv.Shutdown(shutdownCtx); err != nil {
    slog.Error("shutdown", "err", err)     // 超时，仍有请求未完成
}
if err := sqlDB.Close(); err != nil {      // 必须在 Shutdown 之后
    slog.Error("close db", "err", err)
}
slog.Info("bye")
```
两条铁律：
1. **`Shutdown` 用新的 ctx**，不能用已经被 cancel 的那个（否则立刻超时）。
2. **`db.Close()` 在 `Shutdown` 之后**。顺序反了，在途请求会拿到已关闭的连接池，直接 500。

#### `Shutdown` 做了什么、没做什么
- 做：关闭监听 socket、停止接受新连接、等待在途请求结束（直到 ctx 超时）。
- 不做：强制中断超时的请求。超时后仍会返回，那些请求会被断开。

#### 判据
```bash
# 起一个故意慢的请求（sleep 3s），同时发 SIGTERM
curl localhost:8080/slow &
kill -TERM $(pgrep api)
# 观察：慢请求正常返回 200，然后进程退出，日志有 "bye"
```

#### `Shutdown` 返回 error 说明什么
```go
if err := srv.Shutdown(shutdownCtx); err != nil {
    slog.Error("shutdown", "err", err)   // 通常是 context.DeadlineExceeded
}
```
返回非 nil 只有一种常见原因：**15 秒到了还有请求没结束**。此时 `Shutdown` 会强制关闭连接，那些请求被腰斩。处理方式不是「把超时调大」，而是先搞清楚是什么请求这么慢——通常是某个查询没有超时控制，或者客户端用了一个永远不结束的连接。

调大超时只是把问题推后：15 秒变成 60 秒，部署时容器还是会被编排系统杀掉（k8s 默认 `terminationGracePeriodSeconds` 是 30 秒，compose 的 `stop_grace_period` 默认 10 秒）。**应用内的超时必须小于编排系统的宽限期**，否则你的优雅关闭永远等不到。

```yaml
# compose 里如果要等更久，两边都要改
services:
  api:
    stop_grace_period: 20s
```
应用内 15 秒 + 编排 20 秒，留 5 秒余量给进程退出的最后清理。

#### 第二个信号会被吞掉
`signal.NotifyContext` 只是把信号转成 ctx cancel，**信号处理函数的注册一直保留到 `stop()` 被调用**。而 `defer stop()` 要等 `main` 返回才执行，所以整个关闭过程中第二次 `SIGTERM` / `Ctrl+C` 仍被捕获、但没有任何代码处理它——**表现为「按了没反应」，用户只能 `kill -9`**。

这在本地开发时尤其烦：改代码重启，`Ctrl+C` 两下没反应。想支持「再按一次强制退出」，就在 cancel 之后立刻 `stop()`，恢复默认行为：

```go
<-ctx.Done()
stop()                          // 恢复默认信号行为：下一个信号直接杀进程
slog.Info("shutting down, press Ctrl+C again to force")
```
这样第二次信号会走 Go 运行时默认路径，进程立刻退出。**代价是它不会再有日志**——这是有意的，用户已经明确要求立即停止。

#### 报错对照
| 现象 | 原因 | 修法 |
| :--- | :--- | :--- |
| 部署时总是等满 30 秒被杀 | 应用没处理 SIGTERM，只能等宽限期结束 | 加 `signal.NotifyContext` + `Shutdown` |
| `shutdown: context deadline exceeded` | 有长请求没结束 | 给 handler 加 `http.TimeoutHandler` 或 ctx 超时 |
| 关闭后立刻收到 502 | 负载均衡还在往这个实例发请求 | 先摘流量（`preStop` / `sleep 5`）再 `Shutdown` |
| 进程退出了但端口还被占用 | 上一个进程没退干净，或 `SO_REUSEADDR` 相关 | `lsof -i :8080` 确认；容器里通常是旧容器还在 |
| `db.Close()` 报 `sql: database is closed` | 有 goroutine 在关库后还在查询 | 确保所有后台任务随 ctx 退出，再关库 |

#### 5 分钟最小验证：三件事一起看
```bash
# 终端 1：起服务
go run . 

# 终端 2：发一个慢请求，同时发信号
curl -s -o /dev/null -w 'slow=%{http_code}\n' localhost:8080/slow &
sleep 0.5
kill -TERM $(pgrep -f 'ledger|go-build')
wait
```
要看三件事：慢请求输出 `slow=200`（不是空、不是 000）；进程在请求结束后**立刻**退出（不是等满 15 秒）；日志顺序是 `shutting down` → 请求完成日志 → `bye`。

如果 `slow=000`，说明 `Shutdown` 直接把连接关了——大概率是 `Shutdown` 用了已 cancel 的 ctx，或者根本没调 `Shutdown` 而是直接 `os.Exit`。

::q 为什么 `srv.Shutdown` 的 ctx 不能复用 `signal.NotifyContext` 返回的那个？
::a 后者在收到信号时已经被 cancel，直接传进去会让 `Shutdown` 立即超时返回，在途请求被强行中断，优雅关闭失效。必须用 `context.WithTimeout(context.Background(), ...)` 新建一个。
::q `db.Close()` 放在 `Shutdown` 之前会怎样？
::a 在途请求仍在执行，它们需要的连接已随 `db.Close()` 释放，后续查询会报 `sql: database is closed`，用户看到 500。必须先等在途请求结束再关数据库。
::q 没有设置 `WriteTimeout` 会有什么后果？
::a 慢客户端可以无限期占用连接（Slowloris 类攻击），`Shutdown` 也可能一直等不完。设置读写超时既是防护，也是让优雅关闭有确定上界的前提。

<!--day 9 | core-->
#### 用实验验证「真的优雅」
```bash
# 终端 1：启动服务
JWT_SECRET=$(openssl rand -hex 32) ./api

# 终端 2：发一个慢请求（用 /slow 或大导出接口）
time curl -s -o /dev/null -w "%{http_code}\n" localhost:8080/ledger/export

# 终端 3：在请求进行中发送信号
pkill -TERM -f '/app/api'
```
预期：
1. 慢请求返回 200（不是连接重置）。
2. 服务日志出现 `shutting down` → 请求完成日志 → `bye`。
3. 进程退出码 0。

#### 三个常见失败现象与原因
| 现象 | 原因 |
| :--- | :--- |
| 请求被重置（curl 报 52/56） | 没调 `Shutdown`，直接 `os.Exit` |
| `Shutdown` 立刻返回且日志报超时 | 用了已 cancel 的 ctx |
| 请求返回 500 `database is closed` | `db.Close()` 在 `Shutdown` 之前 |

#### docker stop 的默认超时
`docker stop` 默认等 10 秒后 `SIGKILL`。如果服务的关闭流程需要更久，要显式配置：
```yaml
services:
  api:
    stop_grace_period: 30s
```
否则你会看到「明明写了优雅关闭，容器还是被强杀」——因为 10 秒不够。

#### 关不掉的三种真实原因
优雅关闭验证失败，几乎都是这三类之一：

| 现象 | 根因 | 排查方式 |
| :--- | :--- | :--- |
| `srv.Shutdown` 一直等到超时 | 有 handler 卡在不会返回的调用上（死循环、无超时的 HTTP 客户端、阻塞的 channel 接收） | 加日志打印每个请求的开始/结束，看哪条请求没结束 |
| 进程立即退出，请求被重置 | `main` 里在 `Shutdown` 之后还有 `os.Exit`，或信号处理只写了 `default` 分支 | 检查是否有 `os.Exit` 绕过了 defer 和等待逻辑 |
| 容器退出码 137 | 关闭耗时超过 `stop_grace_period`（默认 10s）被 SIGKILL | `docker inspect` 看 `State.ExitCode`，调大宽限期或修掉慢 handler |

#### 怎么构造一个「必然卡住」的请求
验证时你需要一个可控的慢 handler：
```go
mux.HandleFunc("GET /slow", func(w http.ResponseWriter, r *http.Request) {
    select {
    case <-time.After(3 * time.Second):
        w.Write([]byte("done"))
    case <-r.Context().Done():
        // 客户端断开或被取消
    }
})
```
注意它监听 `r.Context().Done()`：如果 `Shutdown` 粗暴地中断请求，这里会走到 cancel 分支，你能立刻从日志看出「请求被中断了」。

#### 一个常被忽略的细节：keep-alive 连接
`Shutdown` 会关闭空闲的 keep-alive 连接，但**正在处理请求的连接会保留到请求结束**。所以「服务停了但连接还在」是正常的。如果客户端复用连接池，它下次请求会收到连接关闭并自动重连——**前提是客户端处理了这种情况**，否则会报 `EOF`。

#### 退出前该做的最后三件事
```go
srv.Shutdown(ctx)                 // 1. 停止接新请求
sqlDB.Close()                     // 2. 关连接池
slog.Info("bye", "uptime", time.Since(boot))   // 3. 留一条可搜索的结束日志
```
第三条不是形式主义：**日志里没有 "bye" 就说明进程是被强杀的**，这是区分「正常停机」和「崩溃」最快的信号。

#### 判据
```bash
docker stop api        # 退出码 0，日志完整
docker inspect api --format '{{.State.ExitCode}}'   # 0
```
退出码 137 表示被 SIGKILL（超时强杀），说明关闭时间不够或逻辑有阻塞。

::q `docker stop` 之后容器退出码 137 说明什么？
::a 137 = 128 + 9，表示被 SIGKILL 强制杀死。通常是因为关闭流程超过了 `stop_grace_period`（默认 10 秒），docker 等不及就强杀。需要检查是否有请求未完成或关闭逻辑阻塞，必要时调大宽限期。
::q 为什么验证优雅关闭必须用「在途请求」而不是空跑？
::a 没有在途请求时，`Shutdown` 会立刻返回，看起来「一切正常」，但真正的问题（请求被中断、连接池提前关闭）不会暴露。必须有一个正在执行的慢请求来检验等待逻辑。
::q 关闭过程中新请求会怎样？
::a `Shutdown` 一被调用就关闭监听 socket，新连接直接被拒绝（连接被拒而非 500）。这正是期望行为：负载均衡会把流量摘走，客户端重试到其他实例。

<!--day 10 | normal-->
#### CORS 的本质：浏览器在替用户拦截
跨源请求（协议/域名/端口任一不同）时，浏览器会检查响应头是否允许。**CORS 是浏览器行为，curl 不受影响**——所以「curl 能通、前端报 CORS」是正常现象。

#### 开发期两种解法
1. **Vite 代理**（推荐）：
```ts
// vite.config.ts
server: {
  proxy: { '/api': { target: 'http://localhost:8080', changeOrigin: true, rewrite: p => p.replace(/^\/api/, '') } }
}
```
前端请求 `/api/ledger`，由 dev server 转发，浏览器看到的是同源，没有 CORS 问题。

2. **后端开 CORS**：
```go
w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
w.Header().Set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
w.Header().Set("Access-Control-Allow-Headers", "Content-Type,Authorization")
w.Header().Set("Access-Control-Allow-Credentials", "true")
if r.Method == http.MethodOptions {
    w.WriteHeader(http.StatusNoContent)
    return
}
```
`Allow-Credentials: true` 时 **`Allow-Origin` 不能是 `*`**，必须是具体源（浏览器强制）。这是「带 cookie 的跨源请求失败」最常见的原因。

#### 生产环境：用反向代理做成同源
```
浏览器 → https://ledger.example.com/        → 静态文件
       → https://ledger.example.com/api/... → 反代到 :8080
```
同源就没有 CORS，也不用暴露后端端口。家庭部署可以用 Caddy/Nginx，甚至直接用同一台机器的路径前缀。

#### 预检请求什么时候才会发
不是所有跨源请求都会先发 `OPTIONS`。浏览器把请求分成两类：

- **简单请求**：方法 `GET/HEAD/POST`，且 `Content-Type` 只允许 `text/plain`、`multipart/form-data`、`application/x-www-form-urlencoded`，且没有自定义头。**直接发，不预检**，但响应仍需要 `Allow-Origin`。
- **需要预检**：用了 `PUT/DELETE`、`Content-Type: application/json`、带 `Authorization` 头、或任何自定义头。浏览器先发 `OPTIONS`，拿到允许后才发真正的请求。

账本 API 全是 JSON + `Authorization`，**必然走预检**。所以只处理 `POST` 不处理 `OPTIONS`，前端会看到「请求根本没发出去」——因为它卡在预检那一步。

预检结果可以被缓存：`Access-Control-Max-Age: 600` 表示 10 分钟内同一个「源 + 方法 + 头」组合不再预检。不设的话，每个请求都要多一次往返，接口看起来「慢了一倍」。

#### CORS 报错原文怎么读
| 浏览器报错 | 真正的原因 |
| :--- | :--- |
| `No 'Access-Control-Allow-Origin' header is present` | 服务端没返回该头，或 origin 不匹配（注意末尾斜杠、`http` vs `https`） |
| `The 'Access-Control-Allow-Origin' header has a value '*' that is not equal to the supplied origin` | 用了 `*` 但请求带了 credentials |
| `Request header field authorization is not allowed by Access-Control-Allow-Headers` | `Allow-Headers` 里漏了 `Authorization`（大小写不敏感，但拼写要对） |
| `Response to preflight request doesn't pass access control check` | `OPTIONS` 没返回 2xx，或没带 `Allow-*` 头 |
| `Redirect is not allowed for a preflight request` | 预检被 301/302 重定向了（常见于反代尾斜杠） |

**读报错要读到最后一个词**：浏览器只会告诉你「不允许」，不会告诉你「哪个头不允许」，而上面这些句子的差异就是排查方向。

#### 反向代理要传的两个头
```nginx
location /api/ {
    proxy_pass http://127.0.0.1:8080/;
    proxy_set_header Host              $host;
    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```
- `X-Forwarded-For`：不传的话，服务端看到的客户端 IP 永远是 `127.0.0.1`，限流和审计全部失效。
- `X-Forwarded-Proto`：服务端据此判断原始请求是 https，否则生成的绝对 URL、Set-Cookie 的 `Secure` 判断会错。

Go 侧可以用 `r.Header.Get("X-Forwarded-For")` 取，但**必须只信任来自代理的那一段**，否则伪造这个头就能绕过 IP 限流。

#### 判据
```bash
curl -i -X OPTIONS localhost:8080/ledger \
  -H 'Origin: http://localhost:5173' \
  -H 'Access-Control-Request-Method: POST'
# 204 + 正确的 Allow-* 头
```

#### 5 分钟最小验证：模拟一次真实预检
```bash
curl -i -X OPTIONS localhost:8080/ledger \
  -H 'Origin: http://localhost:5173' \
  -H 'Access-Control-Request-Method: POST' \
  -H 'Access-Control-Request-Headers: content-type,authorization' \
  | grep -i '^access-control\|^HTTP'
```
期望看到 `HTTP/1.1 204`，以及 `Access-Control-Allow-Origin`、`-Methods`、`-Headers` 三行，且 `-Headers` 里**同时包含 `Content-Type` 和 `Authorization`**。少一个，前端就会在控制台看到上面那张表里的第三条。

#### 报错对照（反代部分）
| 现象 | 原因 | 修法 |
| :--- | :--- | :--- |
| 静态页面能开，`/api` 404 | 反代 `proxy_pass` 结尾多/少一个 `/`，路径拼接方式不同 | `proxy_pass http://127.0.0.1:8080/;` 会把 `/api/x` 变成 `/x`；不带 `/` 则保留 `/api/x` |
| 后端日志里客户端 IP 全是 127.0.0.1 | 没传 `X-Forwarded-For` | 加上并只信任代理段 |
| 大文件上传 413 | Nginx `client_max_body_size` 默认 1MB | 调到合理值（账本其实不需要大 body） |
| 前端请求偶发 504 | 后端超时，或反代读超时短于后端处理时间 | 对齐 `proxy_read_timeout` 与后端超时 |

::q 为什么 `curl` 测试正常，前端却报 CORS 错误？
::a CORS 是浏览器实施的安全策略，`curl` 不执行同源检查。浏览器会发预检请求并校验响应头，缺失或不匹配就阻止读取响应。所以必须用浏览器或带 `Origin` 头的请求来验证。
::q `Allow-Credentials: true` 时为什么不能用 `Allow-Origin: *`？
::a 浏览器禁止这种组合：带凭证（cookie）的跨源请求必须明确指定允许的源，否则任意站点都能携带用户 cookie 发请求，等于绕过同源策略。必须回显具体 Origin 并做白名单校验。
::q 生产环境为什么优先用反向代理而不是后端开 CORS？
::a 同源部署彻底消除 CORS 复杂度，还能隐藏后端端口、统一 TLS、统一限流。CORS 是「不得不跨源时」的方案，不是默认选择。

<!--day 11 | normal-->
#### 扫描依赖漏洞，而不是靠印象
```bash
go install golang.org/x/vuln/cmd/govulncheck@latest
govulncheck ./...
```
输出会指出：哪个依赖、哪个 CVE、**你的代码是否真的调用到了漏洞函数**（这是它比其他扫描器有用的地方——只报「可达」的漏洞，噪音小）。

#### 集成到构建前
```bash
govulncheck ./... || exit 1
docker build -t ledger-api .
```
放在构建前，漏洞会挡住发布。放在发布后，就只是「事后知道」。

#### 修复策略
1. **优先升级依赖**：`go get -u ./...` 后跑测试。
2. **无法升级时**，确认代码是否真的走到漏洞路径；如果走不到，记录原因（并在注释里写清）。
3. **标准库漏洞**，升级 Go 版本。

#### 扫描结果怎么读
`govulncheck` 的输出分两类，含义完全不同：
- **你的代码调用了漏洞函数**（有调用栈）→ 真实风险，必须处理。
- **依赖里有漏洞但没有调用路径** → 当前不可达，记录并跟踪，不必立即阻断。

这个区分很重要：它把「升级一切」变成了「只处理真正会执行的代码路径」，否则每跑一次都是几十条告警，最后没人看。

#### 一个实际的取舍
升级依赖可能引入行为变化（尤其 `gorm` 这类大版本）。策略：
```bash
go get -u=patch ./...        # 先只升补丁版本，风险最小
go test ./... -race         # 必须全绿
govulncheck ./...           # 再扫一次
```
补丁升级解决不了时，才考虑次版本/大版本，并单独做一次回归。

#### 判据
```bash
govulncheck ./...
# 输出 "No vulnerabilities found." 才算通过
```
如果有输出，逐条看是不是真的可达；可达就必须处理，不能「先放着」。

#### 顺带把「有没有新版本」也看一遍
`govulncheck` 只报「已知漏洞」，不报「有新版本」。两个命令配合起来用：

```bash
go list -m -u all        # 列出所有依赖及可升级到的版本
go list -m -u -json std  # 标准库当前版本（std 也需要关注，Go 补丁版本会修 CVE）
```
`go list -m -u all` 的输出里，带 `[v1.2.3]` 方括号的就是「有更新」。**不要看到有更新就全升**——Go 的模块版本选择是「最小版本选择」（MVS）：你升一个直接依赖，可能连带把十几个间接依赖一起抬高。升级后必须跑一遍 `go test ./... -race`，因为「小版本不兼容」在 Go 生态里虽少但确实存在。

#### 报错对照
| 现象 | 原因 | 修法 |
| :--- | :--- | :--- |
| `govulncheck: loading packages: ... no required module provides` | 在错误目录跑，或 `go.sum` 不完整 | 在 `go.mod` 所在目录跑；先 `go mod tidy` |
| `no such host` / 超时 | 需要访问 `vuln.go.dev` 的漏洞库 | 检查网络/代理；内网环境需离线镜像 |
| 报了一堆但全是 `your code does not call` | 不可达漏洞 | 记录并跟踪，不必立刻升；但要定期重扫 |
| 升级后编译失败 | 直接依赖的 API 有变动 | 逐个依赖升，别一次性 `go get -u ./...` |

#### 5 分钟最小验证：故意引入一个有漏洞的旧版本
```bash
# 装一个已知有 CVE 的旧版 golang.org/x/text（示例，具体版本以扫描结果为准）
go get golang.org/x/text@v0.3.0
govulncheck ./...
```
它应该报出对应漏洞，并给出一串调用栈，标明「你的代码 -> 哪个函数 -> 漏洞函数」。看完立刻升回去：

```bash
go get golang.org/x/text@latest && go mod tidy && govulncheck ./...
```
这一步的价值是让你**亲眼见过一次真实输出**。第一次在 CI 里看到红色的漏洞报告时，你至少知道该看哪一行、该不该慌。

::q `govulncheck` 和普通的依赖扫描器有什么区别？
::a 它会做「可达性分析」：只有当你代码实际调用到含漏洞的函数时才报告。普通扫描器只看依赖版本，会报大量实际不可达的漏洞，导致告警疲劳。当然，不可达不代表永远安全，升级后行为可能变化。
::q 发现漏洞但暂时无法升级依赖，该怎么办？
::a 先确认代码是否真的走到漏洞路径（`govulncheck` 的调用栈能看出来）。走不到就记录原因和评估结论，并设一个跟踪项；走得到就必须升级或改用替代方案。不能只是「知道了」。
::q 为什么要把扫描放在 `docker build` 之前？
::a 让它成为发布的必经关卡，漏洞会阻断构建。放在之后，镜像已经产出，容易「先发了再说」。安全检查只有前置才有约束力。

<!--day 12 | core-->
#### Cookie 的三个属性，缺一不可
```go
http.SetCookie(w, &http.Cookie{
    Name:     "session",
    Value:    token,
    Path:     "/",
    HttpOnly: true,                      // JS 读不到，防 XSS 窃取
    Secure:   true,                      // 只走 HTTPS
    SameSite: http.SameSiteLaxMode,      // 限制跨站携带
    MaxAge:   7200,
})
```
- **`HttpOnly`**：`document.cookie` 读不到。XSS 仍能「以用户身份发请求」，但偷不走 token 带到别的站点。
- **`Secure`**：明文 HTTP 不发送。本地开发用 `localhost` 时浏览器仍允许（localhost 被视为安全上下文），但要在配置里区分环境。
- **`SameSite`**：`Lax` 允许顶级导航的 GET 携带，阻止跨站 POST；`Strict` 更严，但会让「从外部链接点进来」处于未登录状态。

#### 为什么 `SameSite` 不能替代 CSRF 防护
IETF 明确说明：`Lax` 对「依赖不安全 HTTP 方法的 CSRF」提供了**合理的纵深防御**，但作为通用类别的 CSRF 防御**并不充分**。原因包括：
- 老浏览器不支持 `SameSite`。
- 同站（same-site）不同源（如子域被攻破）仍可发起攻击。
- 某些客户端行为差异。

所以：**`SameSite` 是第一道防线，CSRF token 是第二道。两者是叠加，不是二选一。**

#### Bearer + localStorage 的取舍
- 优点：不需要 CSRF 防护（不会自动携带）。
- 缺点：任何 XSS 都能读走 token，且 token 长期有效时风险更大。

**家庭内网场景，Cookie + CSRF 更安全**——因为 XSS 在自建前端上概率低，而 token 放 localStorage 一旦泄漏就是长期风险。

#### 双提交 Cookie：最省事又够用的 CSRF 方案
不需要在服务端存 token 表：**登录时生成一个随机值，同时写进 Cookie（可被 JS 读）和响应体**；前端把它放进请求头 `X-CSRF-Token`；服务端比对「头里的值」和「Cookie 里的值」是否相同。攻击者的跨站请求能自动带上 Cookie，但**读不到 Cookie 的值，也设不了自定义头**，所以对不上。

```go
// ① 登录成功后，除了 session 再发一个 csrf cookie
csrf := randomHex(32)
http.SetCookie(w, &http.Cookie{
    Name: "csrf", Value: csrf, Path: "/",
    HttpOnly: false,                 // 必须让 JS 读得到
    Secure: true, SameSite: http.SameSiteLaxMode, MaxAge: 7200,
})

// ② 校验中间件：只对「会改变状态」的方法生效
func withCSRF(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        switch r.Method {
        case http.MethodGet, http.MethodHead, http.MethodOptions:
            next.ServeHTTP(w, r); return
        }
        c, err := r.Cookie("csrf")
        if err != nil || subtle.ConstantTimeCompare([]byte(c.Value), []byte(r.Header.Get("X-CSRF-Token"))) != 1 {
            Fail(w, http.StatusForbidden, "CSRF_FAILED", "请求校验失败，请刷新页面")
            return
        }
        next.ServeHTTP(w, r)
    })
}
```
两个细节：**只校验写操作**（GET 不该产生副作用，校验它只会让首屏加载变复杂）；**用 `subtle.ConstantTimeCompare`** 而不是 `==`，避免逐字节比较泄漏时序信息（严格说 CSRF token 的时序攻击价值不大，但这是零成本的好习惯）。

#### 登出必须做的三件事
```go
func (h *Handler) logout(w http.ResponseWriter, r *http.Request) {
    // ① 清 cookie（MaxAge -1）
    http.SetCookie(w, &http.Cookie{Name: "session", Value: "", Path: "/", MaxAge: -1, HttpOnly: true, Secure: true})
    http.SetCookie(w, &http.Cookie{Name: "csrf", Value: "", Path: "/", MaxAge: -1})
    // ② 让服务端 token 失效（改 password 或 bump token_version）
    if err := h.svc.RevokeSession(r.Context(), sessionID(r)); err != nil {
        h.log.Error("revoke", "err", err)   // 记日志但不要阻断登出
    }
    // ③ 返回 204，前端据此清本地状态
    w.WriteHeader(http.StatusNoContent)
}
```
**只清 Cookie 不等于登出**：如果 token 还没过期，攻击者手里那份拷贝仍然有效。所以必须有服务端的吊销依据（`token_version` 自增，或 session 表置为已撤销）。这也是「无状态 JWT 的代价」在阶段四 D8 提过、到部署阶段才真正要面对的问题。

#### 报错对照
| 现象 | 原因 | 修法 |
| :--- | :--- | :--- |
| 登录成功但刷新后又变未登录 | `Secure: true` 但用 http 访问（非 localhost） | 本地用 localhost，或按环境关掉 `Secure` |
| `document.cookie` 里看不到 session | `HttpOnly: true`（这是**正确**行为） | 要看 session 请用 DevTools → Application |
| 所有写接口 403 `CSRF_FAILED` | 前端没带 `X-CSRF-Token`，或读的是 `HttpOnly` 的 session | csrf cookie 必须 `HttpOnly: false`，且前端从它读值 |
| 从外部链接点进来显示未登录 | `SameSite=Strict` 导致的预期行为 | 改成 `Lax` |
| 登出后旧 token 还能用 | 只清了 Cookie，没做服务端吊销 | 加 `token_version` 或 session 撤销 |

#### 5 分钟最小验证：用 curl 走一遍完整会话
```bash
# 登录，把 cookie 存进 jar
curl -s -c /tmp/jar -X POST localhost:8080/login -d '{"email":"a@x.com","password":"correct"}' | jq -r .data.token
CSRF=$(grep csrf /tmp/jar | awk '{print $7}')

# 带 cookie 但不带 CSRF 头 → 必须 403
curl -s -o /dev/null -w 'no-csrf=%{http_code}\n' -b /tmp/jar -X POST localhost:8080/ledger -d '{"amount":100,"category":"x","date":"2026-10-19"}'

# 带 cookie 也带 CSRF 头 → 201
curl -s -o /dev/null -w 'with-csrf=%{http_code}\n' -b /tmp/jar -X POST localhost:8080/ledger \
  -H "X-CSRF-Token: $CSRF" -d '{"amount":100,"category":"x","date":"2026-10-19"}'
```
期望 `403` 和 `201`。**这两个数字一起才证明 CSRF 中间件真的在工作**——只测 201 无法区分「校验通过」和「根本没校验」。

#### 判据
浏览器 DevTools → Application → Cookies：
- `HttpOnly` 打勾
- `Secure` 打勾（HTTPS 下）
- `SameSite` 显示 `Lax`

再用 JS 执行 `document.cookie`，**不应出现** session（但应该出现 `csrf`——它就是要给 JS 读的，两个 cookie 的可见性相反，这正是设计的一部分）。

::q `HttpOnly` 能防住 XSS 吗？
::a 不能完全防住。它只阻止 JS 读取 cookie，攻击者仍可以在页面里以用户身份发起请求（因为 cookie 会自动携带）。它的价值是防止 token 被窃取到外部长期使用，缩小影响范围。
::q 为什么 `SameSite=Lax` 不足以单独防 CSRF？
::a 它依赖浏览器实现（老版本不支持）、对同站不同源无效、且对不同请求方式的处理有差异。IETF 认为它是纵深防御的一层，不能作为唯一机制。CSRF token 校验的是「请求来自我们的页面」，与浏览器行为无关。
::q 选择 Cookie 还是 Bearer + localStorage，核心权衡是什么？
::a Cookie 自动携带，方便但也带来 CSRF 风险（需额外防护），优势是 `HttpOnly` 让 XSS 偷不走 token。localStorage 不会被自动携带、无需 CSRF，但任何 XSS 都能直接读走 token。安全模型不同，不是「哪个更先进」。

<!--day 13 | core-->
#### CSRF 攻击的最小模型
1. 用户已登录 `ledger.example.com`，浏览器持有 cookie。
2. 用户访问了 `evil.com`，页面里有一个自动提交的表单：
```html
<form action="https://ledger.example.com/ledger" method="POST">
  <input name="amount" value="999999">
</form>
<script>document.forms[0].submit()</script>
```
3. 浏览器**自动带上 cookie**，请求合法通过认证，账目被写入。

关键点：攻击者不需要读到响应，只需要「让请求发生」。所以防御的核心是**证明请求来自我们自己的页面**。

#### 双提交 / 同步令牌
`gorilla/csrf` 用同步令牌模式：服务端下发一个随机 token（放在 cookie 或页面里），表单/请求头必须带上同样的值，服务端比对。攻击者的站点无法读取该 token（同源策略），因此无法伪造。

```go
csrfMiddleware := csrf.Protect(
    []byte(csrfKey),                  // 32 字节密钥
    csrf.Secure(true),                // 生产环境 HTTPS
    csrf.SameSite(csrf.SameSiteLaxMode),
    csrf.Path("/"),
)
handler := csrfMiddleware(router)     // 包住整个 router
```

#### 中间件顺序：这是本阶段最容易做错的一处
**`csrf.Protect()` 必须是第一个业务中间件，包裹整个路由器**：
```go
h := router
h = WithAuth(h)
h = WithRateLimit(h)
h = csrfMiddleware(h)      // 包住 router 和 auth
h = WithRecovery(h)        // 最外层
```
推荐顺序：**Recovery → CSRF → RateLimit → Auth**。

为什么 CSRF 要在 Auth 之前、且包住整个 router：
- 放在路由匹配之后，未匹配的路径（`/healthz`、静态文件）会**绕过校验**。
- 放在 Auth 之后，未认证请求会先消耗认证开销；且认证失败的响应路径可能绕过 CSRF 检查。

#### 必须豁免的路径
- `/healthz`、`/readyz`（编排系统探测，没有 token）。
- 静态资源（GET，本来也不校验）。
- 如果前端用 `Authorization: Bearer`，则不需要 CSRF——**但不要两套混用**，会产生「有些接口校验、有些不校验」的混乱。

#### 前端要配合
- 从 cookie 读 `csrf_token`（这个 cookie 不能 `HttpOnly`），放进请求头 `X-CSRF-Token`。
- fetch 要带 `credentials: 'include'`。

#### 判据
```bash
# 不带 token 的 POST 必须 403
curl -i -X POST localhost:8080/ledger -H "Cookie: session=$S" -d '{"amount":100}'
# 403 Forbidden - CSRF token not found

# 带正确 token 通过
curl -i -X POST localhost:8080/ledger -H "Cookie: session=$S; csrf_token=$C" -H "X-CSRF-Token: $C" ...
# 201
```
再确认 `/healthz` 不需要 token 也能 200。

::q 为什么 `csrf.Protect()` 必须包住整个路由器，而不是挂在具体路由上？
::a 挂在路由之后只对匹配到的路径生效，未匹配的路径（健康检查、静态文件、404 处理）会绕过校验。攻击者可利用这些路径做状态变更或探测。包住整个 router 才能保证「所有请求都先过 CSRF」。
::q 中间件顺序为什么是 Recovery → CSRF → RateLimit → Auth？
::a Recovery 最外层才能捕获内层所有 panic；CSRF 紧随其后，尽早拦掉伪造请求，避免它们消耗限流配额和认证开销；RateLimit 对通过校验的请求限流；Auth 最后，只对合法请求做身份验证。
::q 用了 Bearer token 还需要 CSRF 吗？
::a 不需要，因为浏览器不会自动携带 `Authorization` 头，攻击者站点无法让请求「自带凭证」。但不要和 Cookie 方案混用，否则会出现部分接口需要 token、部分不需要的混乱，也容易留下绕过路径。

<!--day 14 | light-->
#### 联调：先打通，再谈体验
1. 前端 `vite.config.ts` 配代理（D10），避免 CORS。
2. 登录后把 token 存起来（Cookie 方案则由浏览器自动管理）。
3. 统一处理 401：`TOKEN_EXPIRED` → 跳登录；`INVALID_TOKEN` → 清凭证。
4. 金额展示：接口拿到的是「分」，除以 100 保留两位。

```ts
const res = await fetch('/api/ledger?limit=20', { credentials: 'include' })
if (res.status === 401) { /* 跳登录 */ }
const body = await res.json()
if (body.code !== 'OK') { /* 按 code 分支 */ }
```

#### 手机验收：这是最终判据
在手机浏览器上完整走一遍：
**登录 → 添加账目 → 列表看到 → 统计正确 → 超预算有标志**

动手前先把地址准备好，别拿 `localhost` 去手机上试：

```bash
ipconfig getifaddr en0                # macOS：拿到局域网 IP，如 192.168.1.23
# Linux: hostname -I | awk '{print $1}'
curl -s -o /dev/null -w '%{http_code}\n' http://192.168.1.23:8080/healthz   # 换成你的 IP
```
第二条必须返回 200。如果本机 curl 通、手机打不开，就按「服务端监听 → 网络可达 → 客户端地址」的顺序查（D14 的第三个问题就是这个）。

四个常见失败点：
- 手机通过局域网 IP 访问，后端只监听 `127.0.0.1` → 连不上（要监听 `0.0.0.0`）。
- HTTPS 未配置，`Secure` cookie 不生效 → 登录状态丢失。
- Cookie 的 `SameSite=Strict` 导致从其他 App 跳转进来时未登录。
- 前端未处理「分 → 元」，显示成 `3550.00`。

#### 阶段与全路线收尾
```bash
go test ./... -race -count=1
govulncheck ./...
docker compose up -d && curl localhost:8080/healthz
docker stop api && docker inspect api --format '{{.State.ExitCode}}'   # 0
```

#### 最后：这条路线真正训练的能力
不是「会写 Go」，而是四件事：
1. **判断力**：知道 `%w` 影响控制流、知道 `OFFSET` 为什么慢、知道 `NewDB` 防的是什么。
2. **安全直觉**：每条查询带 `user_id`、密码只哈希、token 不看 payload。
3. **可运维性**：配置不硬编码、服务能优雅停、依赖无已知漏洞。
4. **验证习惯**：任何结论都要有命令输出或测试结果支撑。

复盘时不要写「我学会了 X」，而是给每一条配一个**你亲手做过的证据**：

| 能力 | 证据（写具体命令或提交） |
| :--- | :--- |
| 判断力 | 「我把 `LIKE '2026-1%'` 的统计结果和半开区间对比，差了 3 倍」 |
| 安全直觉 | 「我把 `WHERE user_id` 删掉后隔离测试变红，再改回来」 |
| 可运维性 | 「`docker stop` 前后对比退出码 0 与 137」 |
| 验证习惯 | 「每次改动都先跑 `./scripts/e2e.sh`，红过 5 次」 |

**写不出证据的，就是没真正做过。** 这份表比任何「学习总结」都更能反映你现在的水平，也直接告诉你下一步该补哪一块。

::q 手机能打开页面但登录后立刻掉线，最可能的原因是什么？
::a 常见于 Cookie 的 `Secure` 属性在 HTTP 下不被浏览器保存，或 `SameSite=Strict` 导致跨站跳转时不携带。也可能是后端监听在 `127.0.0.1` 而非 `0.0.0.0`，或前端把 token 存在内存中，页面刷新即丢失。
::q 为什么把「手机完成完整操作」作为最终验收标准？
::a 它同时检验了网络可达性、HTTPS/Cookie 配置、前端金额换算、后端认证与统计的正确性——是唯一能覆盖「真实使用路径」的检查。桌面 curl 通过不代表手机上能用。
::q 手机连不上本地服务，按顺序先查哪三件事？
::a ① 监听地址：必须是 `:8080`（等价 `0.0.0.0`），写成 `localhost:8080` 只监听回环，手机永远连不上；② 网络与防火墙：手机和电脑在同一 Wi-Fi 网段，系统防火墙放行该端口（macOS 会弹「是否允许接受传入连接」）；③ 前端 baseURL：手机上的 `localhost` 指手机自己，必须换成电脑的局域网 IP（`ipconfig getifaddr en0`）。**三件事的排查顺序是「服务端监听 → 网络可达 → 客户端地址」，反过来会白折腾。**

