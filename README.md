# TokenFree · Token 自由攻略

持续更新的大模型智能体 Token 来源攻略，用 GitHub Pages 部署的单页静态站点。

线上地址：<https://wangxinhan.cn/tokenfree/>（`https://xinhanwang.github.io/tokenfree/` 会 301 跳到这里）
Markdown 原文：[tokenfree-guide.md](tokenfree-guide.md)
PDF 原版：<https://wangxinhan.cn/tokenfree/tokenfree-guide.pdf>

## 共同维护

欢迎大家通过提 **issue** 或者 **PR** 提交渠道：

- 发现某站失效、额度调整，或者有新渠道 → [开一个 issue](https://github.com/XinhanWang/tokenfree/issues/new)。
- 会改 HTML 的话 → 直接照着 `index.html` 里现有 `<article class="card">` 的结构提 PR。

## 内容板块

| 板块 | 收录渠道 |
| --- | --- |
| 官方 Agent 工具 | Trae Code（原 Trae IDE）/ Trae Work |
| 低价稳定的付费中转站 | AIHub、君的星辰 |
| 无需 L 站账号的公益站 | JustDoWork、KK token、Agent Router、Rawchat |
| 需 L 站账号的公益站 | Anyrouter（含 linux.do 注册方法） |
| 接入教程 | cc-switch 配置 Claude Code / Claude Desktop / Codex |

## 目录结构

```
tokenfree/
├── index.html              # 全部页面内容（单页）
├── tokenfree-guide.md      # Markdown 原文（图片指向 assets/img，可在 GitHub 直接阅读）
├── tokenfree-guide.pdf     # 原版 PDF，供站内下载
├── sitemap.xml             # 站点地图
├── robots.txt              # 爬虫规则（见下方说明）
├── .nojekyll               # 跳过 Jekyll 处理
├── README.md
└── assets/
    ├── css/style.css       # 设计令牌 + 深浅色主题 + 组件样式
    ├── js/main.js          # 主题切换、目录高亮、筛选、复制、灯箱、Utterances、不蒜子兜底
    └── img/*.png|jpg       # 17 张攻略截图
```

## SEO 与站点配置

站点的规范地址（canonical）是 **`https://wangxinhan.cn/tokenfree/`** —— `xinhanwang.github.io/tokenfree/`
会被 GitHub 301 跳到自定义域名，所以 `index.html` 的 canonical / `og:url`、`sitemap.xml`、`robots.txt`
统一用自定义域名，避免把会重定向的 URL 交给爬虫。

- `sitemap.xml` — 列出首页与两份原文（`.md` / `.pdf`）。放在子目录里依然有效，把
  `https://wangxinhan.cn/tokenfree/sitemap.xml` 直接提交到 Google Search Console / 必应站长即可。
- `robots.txt` — 爬虫**只读取域名根目录**的 robots.txt（`https://wangxinhan.cn/robots.txt`，
  由 `XinhanWang.github.io` 仓库控制），所以本仓库这份对现在的项目页不生效，属于「换成独立域名后即可用」的预置文件。
  根仓库的 robots.txt 已于 2026-08-29 补上 `Sitemap: https://wangxinhan.cn/tokenfree/sitemap.xml`
  （robots.txt 允许多条 `Sitemap` 行），爬虫从域名根目录即可发现本站的 sitemap。
- **没有 `CNAME` 文件**，这是有意的：自定义域名 `wangxinhan.cn` 已经绑在 `XinhanWang.github.io` 仓库上，
  同一账号下两个仓库不能绑同一个域名（Pages 会报 *domain already taken*）。
  若以后要给本站独立域名，新建一个子域（例如 `token.wangxinhan.cn`）并在 DNS 加
  `CNAME token → xinhanwang.github.io`，再把该子域写进本仓库的 `CNAME`，同时同步
  `index.html` 的 canonical / `og:url`、`sitemap.xml` 与 `robots.txt` 里的地址。

## 第三方组件

- **Utterances**（评论，基于 GitHub Issues）— 在 `assets/js/main.js` 顶部的 `UTTERANCES_REPO` 指定仓库，滚动到评论区附近才懒加载，主题跟随站点深浅色切换。
  需要在本仓库安装 [utterances GitHub App](https://github.com/apps/utterances)，且仓库为 public、Issues 开启，否则评论无法发布。
- **LikeBtn**（点赞）— `index.html` 的 `.likebtn-wrapper`，通过 `data-*` 属性配置，`data-identifier="tokenfree-home"`。
- **不蒜子**（访客统计）— 页脚三个 `busuanzi_value_*` 元素。主站点较常挂，`main.js` 里有镜像兜底：3.5 秒后若仍未填充数值，依次尝试 `busuanzi.9420.ltd` 与 `bsz.saodiyang.com`。

## 更新内容

内容源是仓库外的 `Token自由攻略(持续更新).md` / `.pdf`，仓库内的 `tokenfree-guide.md` 是它的发布版（图片路径改成了 `assets/img/`）。改站点时：

1. 渠道卡片都在 `index.html` 的 `#official` / `#paid` / `#free` / `#linuxdo` 四个 section 里，结构一致，复制一张 `<article class="card">` 改文案即可。
2. 卡片上的 `data-type`（`official` / `free` / `paid`）和 `data-stab`（`ok` / `warn` / `risk`）驱动顶部筛选栏，新增卡片必须带这两个属性；`data-stab` 与卡片右上角的 `badge-ok` / `badge-warn` / `badge-risk` 徽章保持一致。
3. 各渠道的「注册直达」按钮用的是攻略里的**邀请 / 推广链接**，页面顶部和页脚都有相应说明。换号或换链接时记得同步 `index.html` 里对应的 `href`。
4. 新增截图放 `assets/img/`，用 `<figure class="shot"><img loading="lazy">` 包一层就能获得灯箱预览。
5. `tokenfree-guide.pdf` 由 `tokenfree-guide.md` 生成，改完 `.md` 重新跑一遍即可（脚本在仓库外的
   `tools/build-pdf.mjs`：无头 Edge/Chrome 打印 A4，链接是可点击的 `/Link` 注解，AFF 链接不会丢）：

   ```bash
   node tools/build-pdf.mjs tokenfree/tokenfree-guide.md tokenfree/tokenfree-guide.pdf
   ```

   文件名保持 ASCII，避免链接需要转义。
6. 接入教程里请求地址的规则是：**Codex 加 `/v1`，Claude 不加**，改文案时别把这两者混掉。

本地预览：任意静态服务器指向本目录即可，例如

```bash
npx -y http-server . -p 4173 -c-1
```

## 免责声明

内容整理自个人实测，各站的额度、限流与可用性随时可能调整，请以对应官网公告为准。本站不售卖任何服务，也不为第三方站点的可用性与安全性背书。
