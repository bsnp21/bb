
#/bin



ls -al /etc/systemd/system



sudo systemctl stop bsnpa
sudo systemctl disable bsnpa
sudo systemctl daemon-reload


journalctl -u bsnpa -f


echo "stop a.node.js systemd service"
ps aux|grep a.node