





sudo systemctl enable bsnp
sudo systemctl start bsnp


journalctl  -u bsnp
systemctl status bsnp.service 

# exit 0. should be correct.