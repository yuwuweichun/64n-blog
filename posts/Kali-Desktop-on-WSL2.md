---
title: 'Kali Desktop on WSL2'
date: '2026-06-07'
description: '记录了 Kali Desktop on WSL2 的配置过程，以及遇到的网络问题和解决方案'
keywords: 'XRDP, Kali, WSL, Kali Undercover mode'
---

参考：
- https://wsl-ui.octasoft.co.uk/blog/wsl2-kali-desktop-winkex

---
## logs
### 通过命令或者WSLUI安装Kali Linux
```
wsl --install -d kali-linux
```
-d 是 --distribution 的缩写，用来指定要安装的 WSL 发行版
也可以省略
### 了解Win-Kex模式
Win-KeX 提供了三种运行 Kali 桌面环境的方式：

| Mode  模式 | Command  命令    | Technology  技术 | Best For  最适合      |
| -------- | -------------- | -------------- | ------------------ |
| Window   | `kex --win -s` | VNC            | 快速测试，基本用法          |
| Seamless | `kex --sl -s`  | VNC            | Windows 桌面上的各个应用程序 |
| **ESM**  | `kex --esm -s` | **RDP**        | 全桌面（推荐）            |

这里我们选择**ESM (Enhanced Session Mode)**，增强会话模式
它使用类似 Hyper-V 增强会话的 RDP 技术
提供剪贴板、音频、共享驱动器等功能，并且性能比 VNC 好得多
### 配置 apt 代理（如果需要）
```bash
sudo tee /etc/apt/apt.conf.d/95proxies >/dev/null <<'EOF'
Acquire::http::Proxy "http://127.0.0.1:7897/";
Acquire::https::Proxy "http://127.0.0.1:7897/";
EOF
```
wsl2网络为镜像模式，然后7897为你的clash代理端口
tee：管道分流器-T型接头
### step 1：安装 Win-Kex
```zsh
sudo apt update
sudo apt install kali-win-kex -y
```
这将安装所有必需的组件：XFCE desktop、XRDP、TigerVNC 和 kex management scripts
```
Download size: 751 MB
Space needed: 2,877 MB
```

>[!note] 64N: 下载过程如果过久，请注意检查网络或代理

安装成功之后，会弹出一个，选择键盘布局的界面，这里选的是默认的第一个，enter
之后会进行Progress，疯狂的setting up
### step 2：修复 X11 Socket（关键）
WSLg 在 `/tmp/.X11-unix` 处创建了一个符号链接，这会破坏 Win-KeX ESM 模式
请在首次启动前修复此问题：
```zsh
sudo rm -f /tmp/.X11-unix
sudo mkdir -p /tmp/.X11-unix
sudo chmod 1777 /tmp/.X11-unix
```
删除、重新创建`/tmp/.X11-unix`并赋予权限

使其永久生效
在 `/etc/wsl.conf` 中添加启动命令：

>[!note] 64N：可选下载vim（kali似乎自带vim）

```
[boot]
systemd=true
command=/bin/bash -c "[ -L /tmp/.X11-unix ] && rm /tmp/.X11-unix && mkdir -p /tmp/.X11-unix && chmod 1777 /tmp/.X11-unix"
```
该操作在 systemd 启动服务之前运行，在 XRDP 尝试使用符号链接之前修复该符号链接。
### step 3：启动 ESM 模式
```zsh
kex --esm -s
```
`-s` 代表启用声音直通

>[!success] 64N
>整个过程相比Fedora要更快速
>图形桌面和Fedora一样，也是X11+XFCE

---
### X11 与 Wayland
都是图形界面的底层显示协议/显示服务器体系
不同的是
X11 是老牌图形系统，兼容性很好；
Wayland 是较新的替代方案，更现代更安全，以及显示架构更简洁。

---
### NetworkManager - masked
```bash
sudo systemctl unmask NetworkManager # 解除对 NetworkManager 服务的“屏蔽”
# Removed '/etc/systemd/system/NetworkManager.service'.
sudo systemctl enable --now NetworkManager # 开机自启和立即启动
# Created symlink ...
sudo nmcli networking on # 通过 NetworkManager 的命令行工具 nmcli 打开全局网络功能

systemctl status NetworkManager # 查看服务状态
nmcli general status # 查看 NetworkManager 管理视角下的总体网络状态
```
### firefox网页无法浏览

>[!warning] 这部分内容很乱

有关网络配置：
https://linux.do/t/topic/2302986
帖子中的情况：
Kali 中只剩 `loopback` 回环网卡，网络不可用。因此当前机器不建议继续使用 mirrored 模式
正常情况
eth：以太网接口
```
eth0
eth1
eth2
```

```bash
sudo vim /etc/NetworkManeger/NetworkManager.conf # 
sudo service networking restart
```

```conf
[ifupdown]
managed=false # 改成true
```
这里我改过之后发现无效，又改回false了

---
排查
```bash
wslinfo --networking-mode # mirrored
ip addr
ip route # default e1 e2
```

```
ping -c 3 8.8.8.8 # 通
ping -c 3 google.com # 通
curl -I https://www.google.com # curl 不通
```

```bash
curl -x http://127.0.0.1:7897 -I https://www.google.com # 通
curl -x socks5h://127.0.0.1:7897 -I https://www.google.com # 不通
```

firefox settings
```
about:config # url输入
```

>[!note] 这里之后就可以正常浏览了，应该是firefox配置代理之后

---
### Kali Undercover mode
**Kali Undercover 模式**是 Kali Linux 的内置功能，可立即将您的桌面界面转换为类似 Windows 10 的外观。该功能专为道德黑客和渗透测试人员设计，使您能够在公共场所（如咖啡馆或客户办公室）工作而不会引起不必要的注意。

>[!info] 此功能仅适用与 XFCE 桌面环境

如何启动？-> 打开终端输入
```
kali-undercover
```
或者在应用程序菜单中搜索启动
如何退出？-> 再执行一次即可，这是一个开关命令

---
### zsh
可以运行zsh，但是`chsh -s "$(which zsh)"`之后`echo $SHELL`还是bash（已重启）
**qterminal/远程桌面启动配置强行指定了 bash** ？
```bash
qterminal --help | grep shell
```
桌面图标/菜单 启动命令写死了 bash ？
```bash
grep -R "qterminal" ~/.local/share/applications /usr/share/applications 2>/dev/null
```
