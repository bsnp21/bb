


# for ubuntu. 
sudo chmod 777 _startup_a_node.sh
sudo rm /etc/rc6.d/_startup_a_node.sh
sudo ln -sf /var/www/html/wdaws/bb/svr/restapi/_startup_a_node.sh /etc/rc6.d/_startup_a_node.sh
sudo chmod 777 /etc/rc6.d/_startup_a_node.sh

## check
ls -l /etc/rc6.d/


#https://unix.stackexchange.com/questions/83748/the-rc0-d-rc1-d-directories-in-etc#:~:text=2)%20rc0.,d%20is%20for%20reboot.
