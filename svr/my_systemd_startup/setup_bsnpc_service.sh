
#/bin


ls -al /etc/systemd/system

#sudo ln -sf /var/www/html/wdaws/bb/svr/restapi/_startup_a_node.sh /etc/systemd/system/_startup_a_node.sh
sudo ln -sf /var/www/html/wdaws/bb/svr/my_systemd_startup/bsnpc.service /etc/systemd/system/bsnpc.service

#sudo cp ./bsnp_a_node.service /etc/systemd/system/bsnp_a_node.service

sudo chmod 777 /etc/systemd/system/bsnpc.service


ls -al /etc/systemd/system




ps aux|grep c.node