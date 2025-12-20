## 🚀 手动部署（生产环境）

### 适用场景

- GitHub Actions 不稳定
- 网络环境复杂
- 需要快速、可控发布

### 发布命令（Mac 本地执行）

```bash
tar --exclude=.git \
    --exclude=node_modules \
    --exclude=.github \
    -czf /tmp/weather-server.tgz . \
&& scp -i ~/.ssh/gh_actions_deploy \
    /tmp/weather-server.tgz \
    root@123.57.172.165:/tmp/weather-server.tgz \
&& ssh -i ~/.ssh/gh_actions_deploy root@123.57.172.165 '
set -e
cd /opt/weather-server
tar -xzf /tmp/weather-server.tgz -C /opt/weather-server
npm ci --omit=dev
pm2 reload 0 --update-env
pm2 save
echo "✅ backend deployed: $(date)"
'
```
