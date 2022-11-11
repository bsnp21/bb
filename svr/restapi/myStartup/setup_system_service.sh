



ls -al /etc/systemd/system

#sudo ln -sf /var/www/html/wdaws/bb/svr/restapi/_startup_a_node.sh /etc/systemd/system/_startup_a_node.sh
sudo ln -sf /var/www/html/wdaws/bb/svr/restapi/myStartup/bsnp_a_node.service /etc/systemd/system/bsnp_a_node.service

#sudo cp ./bsnp_a_node.service /etc/systemd/system/bsnp_a_node.service

sudo chmod 777 /etc/systemd/system/bsnp_a_node.service


ls -al /etc/systemd/system