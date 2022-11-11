


# for ubuntu. 
sudo chmod 777 _startup_a_node.sh
sudo rm /etc/rc6.d/_startup_a_node.sh
sudo ln -sf /var/www/html/wdaws/bb/svr/restapi/_startup_a_node.sh /etc/rc6.d/_startup_a_node.sh
sudo chmod 777 /etc/rc6.d/_startup_a_node.sh