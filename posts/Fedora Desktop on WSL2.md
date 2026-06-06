---
title: 'Fedora Desktop on WSL2'
date: '2026-6-6'
description: '记录了 Fedora Desktop on WSL2 的配置过程，以及遇到的黑屏问题和解决方案'
keywords: 'XRDP, Fedora, WSL'
---
参考：
- https://wsl-ui.octasoft.co.uk/blog/wsl2-fedora-desktop-xrdp
- https://wsl-ui.octasoft.co.uk/blog/wsl2-gui-troubleshooting
---
### fix
#### 重试Step 5
Black screen after login  登录后出现黑屏 -> Fix X11 socket symlink (Step 5)
需要一行一行的输入
```ZSH
[ -L /tmp/.X11-unix ] && echo "Symlink exists - needs fixing"
```

```zsh
[ -L /tmp/.X11-unix ] && sudo rm /tmp/.X11-unix
```

```zsh
sudo mkdir -p /tmp/.X11-unix && sudo chmod 1777 /tmp/.X11-unix
```
-> 黑屏问题依然存在

---
-> 参考：
https://wsl-ui.octasoft.co.uk/blog/wsl2-gui-troubleshooting#black-screen-after-login
---
#### .xsession
```zsh
# For XFCE
echo "startxfce4" > ~/.xsession
```
#### /etc/xrdp/startwm.sh
```sh
  #!/bin/sh
  # xrdp X session start script (c) 2015,2017,2021 mirabilos
  # published under The Miros Licence
  # Rely on /etc/pam.d/xrdp-sesman using pam_env to load both
  # /etc/environment and /etc/default/locale to initialise the
  # locale and the user environment properly.

  if test -r /etc/profile; then
          . /etc/profile
  fi

  if test -r ~/.profile; then
          . ~/.profile
  fi

  unset DBUS_SESSION_BUS_ADDRESS
  unset XDG_RUNTIME_DIR

  startxfce4
```

#### D-Bus未运行
```
sudo service dbus status # 查看状态
```

```
sudo systemctl start dbus # 启动D-Bus
```
#### WSLg环境变量冲突
如果启用了 WSLg，它会设置一些环境变量，这些变量会泄露到你的 XRDP 会话中，导致应用程序尝试连接到错误的显示服务器。
如果您使用 XRDP 连接桌面，请完全禁用 WSLg。创建或编辑 `C:\Users\YourName\.wslconfig`
```
[wsl2]
guiApplications=false
```
然后重启WSL
#### X11 Socket Directory
>[!SUCCESS] 找到你了！！！

即使 `guiApplications=false` ，WSL 的初始化系统仍可能创建指向 `/mnt/wslg/.X11-unix` 的符号链接 `/tmp/.X11-unix` 。由于 WSLg 已禁用，该目标不存在，从而留下一个悬空的符号链接，导致 XRDP 连接中断。

检查
```zsh
❯ ls -la /tmp/.X11-unix
lrwxrwxrwx 1 root root 19 Jun  6 23:31 /tmp/.X11-unix -> /mnt/wslg/.X11-unix
```
如果它显示的是指向 `/mnt/wslg/.X11-unix` 的符号链接，那就是问题所在：
解决方案
```zsh
sudo rm /tmp/.X11-unix
sudo mkdir /tmp/.X11-unix
sudo chmod 1777 /tmp/.X11-unix
sudo systemctl restart xrdp
```
在 `/etc/wsl.conf` 中添加启动命令：
```
[boot]
systemd=true
command=/bin/bash -c "[ -L /tmp/.X11-unix ] && rm /tmp/.X11-unix && mkdir -p /tmp/.X11-unix && chmod 1777 /tmp/.X11-unix"
```
>[!tip]
>这个文件的内容在step5编辑过，所以打开就已经是以上内容

也是终于连上了！

---
### logs
#### step1: XFCE
```zsh
sudo dnf group install -y xfce-desktop # 安装 Fedora 的 XFCE 桌面环境软件组
took 25m22s # 叫我一番好等啊
```
过程中有 Curl error，不过后面应该是自动重试下载成功了，出现 Curl error请不用太担心
#### step2: XRDP
```zsh
sudo dnf install -y xrdp xorgxrdp # 安装 XRDP 相关组件
took 1m10s
```
#### step3:
...

### XRDP XFCE Xorg
>[!question] XRDP XFCE Xorg是什么？之间的关系是什么
XRDP、XFCE、Xorg 是远程图形桌面里常见的三类组件，职责不同。

  XRDP
  XRDP 是远程桌面服务端。它实现了 Microsoft RDP 协议，让你可以用 Windows 远程桌面、Remmina、FreeRDP 等客户端连到 Linux 机器。

  可以理解为：
  远程桌面入口 / RDP 网关

  XFCE
  XFCE 是桌面环境。它提供你看到和操作的图形桌面：面板、窗口管理器、文件管理器、菜单、设置界面等。

  可以理解为：
  Linux 桌面界面本身

  Xorg
  Xorg 是图形显示服务器，属于 X Window System 的实现。它负责底层图形会话：窗口绘制、输入设备、显示输出、应用程序图形交互等。


  它们之间的关系通常是：

  你的电脑上的 RDP 客户端
          |
          | RDP 协议
          v
  XRDP 服务端
          |
          | 启动/连接一个 Linux 图形会话
          |
          v
  XFCE 桌面环境
          |

  更简单地说：

  XRDP = 让你远程连进来
  Xorg = 支撑图形界面运行
  XFCE = 你实际看到的桌面

  在 Linux 远程桌面场景里，常见组合是：

  XRDP + Xorg + XFCE

  因为 XFCE 比 GNOME、KDE 更轻量，和 XRDP 配合通常更稳定、更省资源。XRDP 接收远程连接后，启动一个 Xorg 图形会话，然后在这个会话里运行 XFCE 桌面。

### 快速参考
```bash
# Complete Fedora XRDP setup
sudo passwd $(whoami) # XRDP 登录时通常需要输入 Linux 用户名和密码

sudo dnf group install -y xfce-desktop # 安装 Fedora 的 XFCE 桌面环境软件组
sudo dnf install -y xrdp xorgxrdp # 安装 XRDP 相关组件

sudo sed -i 's/^port=3389/port=3390/' /etc/xrdp/xrdp.ini # 修改 XRDP 配置文件，把监听端口从默认的 3389 改成 3390

sudo sed -i '/^#\[Xorg\]$/,/^#code=/{s/^#//}' /etc/xrdp/xrdp.ini # 把 /etc/xrdp/xrdp.ini 里被注释掉的 [Xorg] 配置段取消注释

[ -L /tmp/.X11-unix ] && sudo rm /tmp/.X11-unix # 如果 /tmp/.X11-unix 是一个符号链接，就删除它

sudo mkdir -p /tmp/.X11-unix && sudo chmod 1777 /tmp/.X11-unix # 重新创建 /tmp/.X11-unix 目录，并设置权限

# 创建当前用户的 ~/.xsession 文件
cat > ~/.xsession << 'EOF'
#!/bin/bash
startxfce4
EOF

chmod +x ~/.xsession # 给 ~/.xsession 添加可执行权限
sudo systemctl enable xrdp xrdp-sesman --now # 启用并立即启动 XRDP 服务

# Connect: mstsc → localhost:3390 → Select "Xorg"
```

### 可能遇到的问题
#### dnf下载不走代理
```bash
song@gcc:~$ sudo dnf --setopt=proxy=http://127.0.0.1:7897 makecache --refresh
Updating and loading repositories:
 Fedora 44 openh264 (From Cisco) - x86_64                                       100% | 490.0   B/s |   5.3 KiB |  00m11s
 Fedora 44 - x86_64 - Updates                                                   100% | 355.7 KiB/s |   9.4 MiB |  00m27s
 Fedora 44 - x86_64                                                             100% | 774.1 KiB/s |  36.7 MiB |  00m49s
Repositories loaded.
Metadata cache created.

# 成功refresh了，问题就是 sudo dnf 没有正确使用你的代理环境
```
写入dnf配置文件 etc/dnf/dnf.conf
```
proxy=http://127.0.0.1:7897
```
#### 远程连接登录后黑屏
见上文