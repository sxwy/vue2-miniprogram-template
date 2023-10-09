# vue2-miniprogram-template

uni-app + Vue2 + TypeScript + uView2 项目模板

- xxx（正式）
- xxx（测试）

## 技术栈

- 依赖管理：Yarn
- 编程语言：HTML + TypeScript + Scss
- 开发框架：uni-app + Vue2
- 组件库：uView2
- 公共库：暂无

## 开发环境

- Node.js 16.18.0
- Visual Studio Code

  - [Auto Close Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-close-tag)
  - [Auto Rename Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag)
  - [Better Comments](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments)
  - [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
  - [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)
  - [Vue Language Features (Vetur)](https://marketplace.visualstudio.com/items?itemName=octref.vetur)

    ps：如果有安装 Volar，需要禁用扩展 Volar

## 开发规范

参照 [前端开发规范](https://sxwy.github.io/standard/)

### 分支管理

分支介绍

- master：生产环境
- prod：生产环境
- rc：预发环境
- alpha：测试环境
- release/z.z.z：发布版本分支 —— z.z.z 对应产品发布的版本号
- feature/abc：功能分支 —— abc 按开发的功能取名
- bugfix/id：问题修复分支 —— id 对应 tapd id
- hotfix/id：线上问题修复分支 —— 同上

应用场景

- 开发新版本：

  1. 基于 master 建立版本开发分支 feature/x.x.x

- 新版本提测：将版本开发分支 feature/x.x.x 合并到 cicd_test 分支
- 测试问题修复：

  1. 基于版本开发分支 feature/x.x.x 建立问题修复分支 bugfix/id
  2. 修复完成后将问题修复分支 bugfix/id 合并到版本开发分支 feature/x.x.x
  3. 将版本开发分支 feature/x.x.x 合并到测试 cicd_test 分支

- 预发提测：

  1. 基于 master 建立版本发布分支 release/z.z.z

     ps：新版本根据需求情况设定版本号，通常新功能只修改大版本号和中间版本号，小版本号留给问题修复使用。

  2. 将版本开发分支 feature/x.x.x 合并到版本发布分支 release/z.z.z
  3. 升级项目版本号，并编写版本说明
  4. 将版本发布分支 release/z.z.z 合并到 cicd_rc 分支

- 生产部署：

  1. 将版本发布分支 release/z.z.z 合并到 cicd_prod 分支
  2. 删除版本发布分支和开发分支 feature/x.x.x 和 release/z.z.z

- 线上问题修复：基于 master 建立线上问题修复分支 hotfix/id

  - 提测：将线上问题修复分支 hotfix/id 合并到 test 分支
  - 上线：参照预发提测和生产部署，发布一个小版本号

代码检测

- 为了规范大家的代码规范，提交时会校验大家的代码规范，可以用 prettier 进行格式化
- 可运行以下命令校验或修复代码格式（如代码格式有问题，则会提交不了代码！）

```shell
yarn lint   # 校验代码格式
yarn format # 修正代码格式
```

### 提交信息

参照[《约定式提交规范》](https://www.conventionalcommits.org/zh-hans/v1.0.0/)，（如提交格式有问题，则会提交不了代码！）

- 功能

  ```
  feat: message

  description
  ```

  ps：由于还没有统一的模块划分可以先不设置 scope

- 问题

  ```
  fix(tapd bug id): message

  description
  ```

- 其他：docs、style、perf 等

### 项目结构

```shell
├── .husky                            # git hooks 执行脚本
├── .vscode                           # vscode 配置
├── public                            # 静态文件
├── src                               # 源代码
│   ├── api                           # api
│   ├── components                    # 通用组件
│   ├── constants                     # 常量
│   ├── mixins                        # 公用注入文件
│   ├── mock                          # 模拟数据
│   ├── packages                      # 子包页面
│   ├── pages                         # 主包页面
│   ├── services                      # 请求协议
│   ├── static                        # 静态资源
│   ├── store                         # store
│   ├── types                         # ts 类型
│   ├── utils                         # 公共方法
│   ├── App.vue                       # 根组件
│   ├── main.ts                       # 主入口
│   ├── manifest.json                 # uni-app 跨端配置
│   ├── pages.json                    # uni-app 路由配置
│   ├── uni.scss                      # uni-app 全局 scss 文件
├── .cicd                             # cicd 触发文件
├── .commitlintrc.js                  # commitlint 配置
├── .editorconfig                     # 编辑器配置
├── .eslintignore                     # eslint 忽略配置
├── .eslintrc.js                      # eslint 配置
├── .gitignore                        # git 忽略配置
├── .lintstagedrc.js                  # git 提交校验配置
├── .npmrc                            # npm 配置
├── .nvmrc                            # nvm 配置
├── .prettierignore                   # prettier 忽略配置
├── .prettierrc.js                    # prettier 配置
├── .stylelintignore                  # stylelint 忽略配置
├── .stylelintrc.js                   # stylelint 配置
├── babel.config.js                   # babel 配置
├── package.json                      # 项目配置
├── postcss.config.js                 # postcss 配置
├── README.md                         # 开发说明
├── tsconfig.json                     # ts 配置
├── vue.config.js                     # 项目构建配置
└── yarn.lock                         # 项目版本锁
```

#### 接口封装

`src/api` 只针对服务和该服务下的全局公共接口封装，特定业务的接口封装放在对应的业务模块里。

- 命名以驼峰 abcApi 格式定义，abc 指服务名
- 接口对应的基础域名统一配置在 `@/constants/api` 下

#### 公共组件

`src/components` 只封装全局公共的组件，特定业务的复用组件放在对应的业务模块里。

- 全局公共组件命名统一添加前缀 `c-`，且使用小写字母，多个单词以连字符号拼接，例如：`c-date-picker`
- 全局公共组件结构参照 uni-app 的 easycom 规范，即以 `src/components/c-xxx/c-xxx.vue` 的形式组织

  > c 代表是 common

  ps：使用公共组件的时候可以不需要 import 导入

#### 页面路由

```shell
./src/pages/demo
├── components ########################## 业务公共组件
│   └── DemoCard.vue #################### 业务公共组件
├── utils ############################### 业务工具函数
├── list.vue ############################ 路由页面组件（列表）
├── detail.vue ########################## 路由页面组件（详情）
├── index.vue ########################### 路由页面组件（入口）
├── service.ts ########################## 业务接口封装
```

- 按业务模块划分 pages 的目录结构，路由路径命名格式如下所示

  1. 使用小写字母命名路由路径，多个单词的使用中划线(`-`)连接；
  2. 针对某项业务的列表、详情，命名统一为 `xxx/list`、`xxx/detail`

- 每个路由子路径下可以维护属于自己模块的公共组件、工具函数、类型定义和接口请求封装
- 路由页面组件统一采用小写字母命名，多个单词的使用中划线(`-`)连接，例如 `list.vue`
- 路由模块的公共 components 下的组件采用帕斯卡命名法（即多个单词首字母都是大写），例如：`DemoCard.vue`

  ps：这么做的目的是与 uni-app 的第三方库和全局公共组件做区分，以便快速识别和区分组件。

- 路由模块的公共 utils 下的工具函数采用驼峰命名法
- 路由模块的接口封装在该模块下的公共接口 `service.ts` 中

### 静态资源

静态资源命名格式：`模块_类别_功能_状态.扩展名`，例如：`home_pic_ad_1.jpg`

- 模块：是哪个模块使用到，例如：user，report，product 等，如果是公共的图标就 common
- 类别：什么类型的，例如：bg 表示背景，icon 表示图标，btn 表示按钮，pic 表示图片，photo 表示照片
- 功能：什么功能，例如：report_icon_star
- 状态：例如：`report_icon_star_half`

ps：图片资源都需要使用 [tinypng](https://tinypng.com/) 压缩优化。

### 编程语言

#### CSS

- CSS 选择器遵循 [BEM](http://getbem.com/) 规范命名 CSS 选择器

  - 前缀：全局公共组件需要添加前缀 `c-`，其他组件可以不用前缀
  - 驼峰：某个块或者某个子元素有多个单词时使用驼峰命名
  - \_\_：双中划线用来连接块和块的子元素
  - \_：单下划线用来描述一个块或者块的子元素的一种状态

  例如：

  - 全局公共组件： `c-demo`，`c-demo__child`，`c-demo__child_active`
  - 非全局组件：`demo`,`demo__child`，`demo__child_active`

- 尽量少用预处理器的嵌套选择器，以免生成后代选择器。

#### TypeScript

- 依赖引入顺序：第三方依赖放在最顶部，其他层模块放中间，本地模块放后面
- 除非有多个模块复用，否则各个业务模块的服务端接口封装直接放在各个子模块中即可，一般不需要放到根目录的 api 下
- 为了减少重复的类型定义，需要在 src/types 下定义各个业务模型的 TS 类型，相当于后端数据库的表设计，然后可由各个路由页面模块的 types 复用，扩展出视图类型

## 开发说明

1. 在命令行启动编译服务

   ```shell
   yarn             # 安装依赖
   yarn serve:mock  # 开发模拟环境
   yarn serve:alpha # 开发测试环境
   yarn serve:rc    # 开发预发环境
   yarn serve:prod  # 开发正式环境
   yarn build:mock  # 打包模拟环境
   yarn build:alpha # 打包测试环境
   yarn build:rc    # 打包预发环境
   yarn build:prod  # 打包正式环境
   ```

2. 使用微信开发者工具打开目录 `dist/dev/mp-weixin`

## 发布说明

### 测试环境

1. 功能 feature 分支合并到 cicd_test 分支，等待自动化部署，即可到小程序管理后台查看体验版

### 预发环境

1. 从 master 新建 release 分支，并填写对应版本信息，再把功能分支合并到 release，最后 release 合并到 cicd_rc，等待自动化部署，即可到小程序管理后台查看体验版

### 正式环境

1. 把预发环境的 release 分支合并到 cicd_prod，等待自动化部署，即可到小程序管理后台查看体验版
2. 上线后，记得让管理员把对应的 release 分支合并到 master 分支
