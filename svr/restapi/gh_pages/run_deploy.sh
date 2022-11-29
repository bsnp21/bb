

echo reponame=$1
cd $1
echo "--">account/README.md
npm init -y 
npm i gh-pages
# modify package.json
sudo vi package.json
npm run deploy
