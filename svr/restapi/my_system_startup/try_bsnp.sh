





sudo systemctl enable bsnpa
sudo systemctl start bsnpa


journalctl  -u bsnpa
systemctl status bsnpa.service 

# exit 0. should be correct.