git := "Choose your branch name [main] ? "

branc = $(shell bash -c 'read -p $(git) talk; echo $$talk')
branch:
		git branch $(branc)

check = $(shell bash -c 'read -p $(git) talk; echo $$talk')
checkout:
		git checkout $(check)

delet = $(shell bash -c 'read -p $(git) talk; echo $$talk')
delete:
		git branch -D $(delet)

commit:
		git add .
		npm run commit

pul = $(shell bash -c 'read -p $(git) talk; echo $$talk')
pull:
		git pull origin $(pul)

pus = $(shell bash -c 'read -p $(git) talk; echo $$talk')
push:
		git push origin $(pus)
