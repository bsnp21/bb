
#/bin



ls -al /etc/systemd/system


sudo systemctl enable bsnpa
sudo systemctl start bsnpa
sudo systemctl daemon-reload

ps aux|grep a.node