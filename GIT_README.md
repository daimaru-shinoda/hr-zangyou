# github 登録

github にプライベートリポジトリ作成
git の URL を控える
`git@github.com:[user-name]/[repogitory-name].git`

```
git init

git add .

git commit -m "first commit"

git remote add origin [git url]

git push --set-upstream origin main
```

これで`git push`, `git pull`ができるようになる
