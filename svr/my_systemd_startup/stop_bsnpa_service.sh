
#/bin



ls -al /etc/systemd/system



sudo systemctl stop bsnpa
sudo systemctl disable bsnpa
sudo systemctl daemon-reload

journalctl -u bsnpa

ps aux|grep a.node