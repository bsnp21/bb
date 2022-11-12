
#/bin



ls -al /etc/systemd/system



sudo systemctl stop bsnpc
sudo systemctl disable bsnpc
sudo systemctl daemon-reload

ps aux|grep c.node