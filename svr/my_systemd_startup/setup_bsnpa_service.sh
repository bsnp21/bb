
#/bin


ls -al /etc/systemd/system

#sudo ln -sf /var/www/html/wdaws/bb/svr/restapi/_startup_a_node.sh /etc/systemd/system/_startup_a_node.sh
sudo ln -sf /var/www/html/wdaws/bb/svr/my_systemd_startup/bsnpa.service /etc/systemd/system/bsnpa.service

#sudo cp ./bsnp_a_node.service /etc/systemd/system/bsnp_a_node.service

sudo chmod 777 /etc/systemd/system/bsnpa.service


ls -al /etc/systemd/system


sudo systemctl enable bsnpa
sudo systemctl start bsnpa
sudo systemctl daemon-reload

ps aux|grep a.node