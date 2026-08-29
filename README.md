# TokenFree · Token 自由攻略

持续更新的大模型智能体 Token 来源攻略，用 GitHub Pages 部署的单页静态站点。

线上地址：<https://xinhanwang.github.io/tokenfree/>
PDF 原版：<https://xinhanwang.github.io/tokenfree/tokenfree-guide.pdf>

## 内容板块

| 板块 | 收录渠道 |
| --- | --- |
| 官方 Agent 工具 | Trae IDE / Trae Work |
| 低价稳定的付费中转站 | AIHub、君的星辰 |
| 无需 L 站账号的公益站 | JustDoWork、KK token、Agent Router、Rawchat |
| 需 L 站账号的公益站 | Anyrouter（含 linux.do 注册方法） |
| 接入教程 | cc-switch 配置 Claude Code / Claude Desktop / Codex |

## 目录结构

```
tokenfree/
├── index.html              # 全部页面内容（单页）
├── tokenfree-guide.pdf     # 原版 PDF，供站内下载
├── .nojekyll               # 跳过 Jekyll 处理
├── README.md
└── assets/
    ├── css/style.css       # 设计令牌 + 深浅色主题 + 组件样式
    ├── js/main.js          # 主题切换、目录高亮、筛选、复制、灯箱、Utterances、不蒜子兜底
    └── img/*.png|jpg       # 17 张攻略截图
```

## 第三方组件

- **Utterances**（评论，基于 GitHub Issues）— 在 `assets/js/main.js` 顶部的 `UTTERANCES_REPO` 指定仓库，滚动到评论区附近才懒加载，主题跟随站点深浅色切换。
  需要在本仓库安装 [utterances GitHub App](https://github.com/apps/utterances)，且仓库为 public、Issues 开启，否则评论无法发布。
- **LikeBtn**（点赞）— `index.html` 的 `.likebtn-wrapper`，通过 `data-*` 属性配置，`data-identifier="tokenfree-home"`。
- **不蒜子**（访客统计）— 页脚三个 `busuanzi_value_*` 元素。主站点较常挂，`main.js` 里有镜像兜底：3.5 秒后若仍未填充数值，依次尝试 `busuanzi.9420.ltd` 与 `bsz.saodiyang.com`。

## 更新内容

内容源是仓库外的 `Token自由攻略(持续更新).md` / `.pdf`。改站点时：

1. 渠道卡片都在 `index.html` 的 `#official` / `#paid` / `#free` / `#linuxdo` 四个 section 里，结构一致，复制一张 `<article class="card">` 改文案即可。
2. 卡片上的 `data-type`（`official` / `free` / `paid`）和 `data-stab`（`ok` / `warn` / `risk`）驱动顶部筛选栏，新增卡片必须带这两个属性；`data-stab` 与卡片右上角的 `badge-ok` / `badge-warn` / `badge-risk` 徽章保持一致。
3. 各渠道的「注册直达」按钮用的是攻略里的**邀请 / 推广链接**，页面顶部和页脚都有相应说明。换号或换链接时记得同步 `index.html` 里对应的 `href`。
4. 新增截图放 `assets/img/`，用 `<figure class="shot"><img loading="lazy">` 包一层就能获得灯箱预览。
5. 更新 PDF 时替换 `tokenfree-guide.pdf`（文件名保持 ASCII，避免链接需要转义）。

本地预览：任意静态服务器指向本目录即可，例如

```bash
npx -y http-server . -p 4173 -c-1
```

## 免责声明

内容整理自个人实测，各站的额度、限流与可用性随时可能调整，请以对应官网公告为准。本站不售卖任何服务，也不为第三方站点的可用性与安全性背书。
