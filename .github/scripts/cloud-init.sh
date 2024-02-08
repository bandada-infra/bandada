#!/bin/sh

set -eux
trap 'poweroff' TERM EXIT INT

Repo=$(curl http://169.254.169.254/latest/meta-data/tags/instance/Repo)
Branch=$(curl http://169.254.169.254/latest/meta-data/tags/instance/Branch)

Local_IP=$(curl http://169.254.169.254/latest/meta-data/local-ipv4)

# Install pkgs
apt-get update
apt-get install -y net-tools
for pkg in docker.io docker-doc docker-compose podman-docker containerd runc; do sudo apt-get remove $pkg; done
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
usermod -aG docker ubuntu

su -P ubuntu -c "git clone -b $Branch --single-branch https://github.com/ntampakas/$Repo.git /home/ubuntu/$Repo"
su -P ubuntu -c "cp /home/ubuntu/$Repo/apps/api/.env.example /home/ubuntu/$Repo/apps/api/.env"
su -P ubuntu -c "sed -i 's/\(DB_TYPE=\).*/\1postgres/' /home/ubuntu/$Repo/apps/api/.env"
su -P ubuntu -c "sed -i 's/\(DB_URL=\).*/\1postgres:\/\/root:helloworld\@postgres:5432\/bandada/' /home/ubuntu/$Repo/apps/api/.env"

su -P ubuntu -c "rm /home/ubuntu/$Repo/apps/{client,dashboard}/.env.production /home/ubuntu/$Repo/apps/{client,dashboard}/.env.staging"
su -P ubuntu -c "sed -i 's/localhost/$Local_IP/g' /home/ubuntu/$Repo/apps/{client,dashboard}/.env.local"

su -P ubuntu -c "cd /home/ubuntu/$Repo ; docker compose up -d"

sleep 6h
