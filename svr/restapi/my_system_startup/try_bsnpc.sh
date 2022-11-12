





sudo systemctl enable bsnpc
sudo systemctl start bsnpc


journalctl  -u bsnpc
systemctl status bsnpc.service 

# exit 0. should be correct.