





sudo systemctl enable bsnp_a_node
sudo systemctl start bsnp_a_node


journalctl  -u bsnp_a_node
systemctl status bsnp_a_node.service 

# exit 0. should be correct.