# SelectMarkets-BackEnd
## Board flow - MeisterTask
__Backlog__: New cards are created and waiting to be selected.
__Sprint__: Cards to be done in the current sprint.
__Developing__: Cards in development.
__Code review__: Cards reviwed, ready to go to hml.
__Hml__: Cards deployed in homolog server.
__Tested__: Cards tested and ready for the prd deployment.
__Sprint (x)__: Deployed and closed cards on that sprint. We created a new column for each sprint.

## Development flow
1. Get a card in the sprint section of the board.
2. Move to developing and start the development proccess.
3. Create a new branch based on master, following the instructions below.
4. Commit the code and created the pull requests.
5. Complete the pull request after approved review.
- Review other dev's pull request.

## BRANCHS: 
master ***(prd server version)***
dev ***(hml server version - ready to be tested)***
sprint-{sprint_number} ***(tested and approved hml)***
feature/{card_code}-{short_description}
fix/{card_code}-{short_description}
hotfix/{card_code}-{short_description}
refact/{card_code}-{short_description}
mgmt/{card_code}-{short_description}
update/{card_code}-{short_description}

## Card development
#### Start development
When you'll start a new card, go to master branch, fetch and create the card's branch based on master
```
git checkout master
git pull
git checkout -b {new_branch_name}
```

* In case of dependent branches you have to clone the branch that has the code that you need.
* For exemple, you're going to develop recovery email so you need the SES integration, that still isn't in master. So you'll clone the feature/{card_code}-ses_integration.

-----
#### Develop finished
When the development is done, commit your code in the card's branch.
```
git add .
git commit -m "{short_description}"
git push origin {branch_name}
```
Then open two Pull Requests:
 {card_branch} -> dev
 {card_branch} -> {current_sprint_branch}

#### Code review
After the pull requests are created, other dev must review the code and approve to complete the merge to dev and create the deploy to hml enviroment.

The pull request to the current sprint branch are completed by the Scrum Master or Tech Lead after the card passed the tests.

#### Deployment stage - repo management
In the end of the sprint we merge the current sprint branch into master to make the prod deploy and create the new version release.