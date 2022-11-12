
#/bin



ls -al /etc/systemd/system


sudo systemctl enable bsnpc
sudo systemctl start bsnpc
sudo systemctl daemon-reload

journalctl -u bsnpc

ps aux|grep c.node