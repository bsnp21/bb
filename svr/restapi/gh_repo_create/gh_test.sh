echo $1
############   sudo -S gh repo create ${username} --private --clone   ## sudo cause gh to create repo on previos git account. 
#######################################################################################################
gh repo create bsnpghrepolist/$1 --public --clone    ## must remove sudo for third pary github account. 
#######################################################################################################
if [ -d "$1" ]; then
    sudo -S chmod 777 -R $1
    sudo -S chmod 777 $1/.git/config
    sudo -S cp $1/.git/config $1/.git/config_bak
    sudo -S cat  $1/.git/config
    ls -al
    #####################################
    cd $1
    sudo -S echo '--' > .salts
    sudo -S git add .salts
    sudo -S git add *
    sudo -S git commit -m "test:$1"
    sudo -S git branch -M main
    ################### sudo -S git remote add origin https://github.com/bsnp21/${username}.git
    sudo -S git remote add origin ${this.m_sponser.git_repo_user_url_private(false)}
    git push -u origin main   ##error for sudo
    sudo -S cat  ./.git/config
else 
    echo $1 nonexisistance
fi