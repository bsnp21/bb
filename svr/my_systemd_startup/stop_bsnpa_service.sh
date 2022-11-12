
#/bin



ls -al /etc/systemd/system



sudo systemctl stop bsnpa
sudo systemctl disable bsnpa
sudo systemctl daemon-reload

ps aux|grep a.node