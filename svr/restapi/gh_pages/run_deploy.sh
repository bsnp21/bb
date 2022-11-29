

echo reponame=$1
cd $1
echo "./myoj/e_Note(e_Note.json)">account/README.md
npm init -y 
npm i gh-pages
# modify package.json
sudo vi package.json
npm run deploy
