## Setup local environment

1. Install Postgres database on your local machine.
2. Clone the repo and change `.env.developement` variables to match your DB credentials.
3. Run `yarn install && yarn dev` in the root folder of the project to start frontend and backend servers.


## Editing schema
Make changes to schema.prisma file, run `npx prisma format`. To create migration file, apply changes to local db and trigger generators run `npm run migrate`. Update seed file if necessary. Note: never delete existing migration files, only ones you create.

## Seed local database
Truncate all tables. Run `npm run seed`


## Setup an infrastructure on Digital Ocean

We are using Digital Ocean App platform to run our servers. Instead of manual configuration we have the `.do/dev.spec.yml` to deploy the infrastructure automatically.

### Useful commands and links:

- CLI https://github.com/digitalocean/doctl
- List `doctl apps list`
- Create `doctl apps create --spec .do/dev.spec.yml`
- Update `doctl apps update APP_UUID_TAKE_FROM_LIST_COMMAND --spec .do/dev.spec.yml`




## Branches

1. **Feature** - Local branch for a single feature development. Merged to the main branch via PR when the feature is ready, tested and the code is reviewed.

2. **Main** - Development branch, all features merged here, stable.

3. **Production** - Self-explanatory.

## Git workflow

It's all start with a task on our Kanban board. 

### Preparation

If you dont have the task and need to create one use this format: [FE/BE][NUMBER_OF_DAYS_TO_COMPLETE][TASK_DESCRIPTION]. For example, `[FE][2] Create a layout for project page`.

If you assigned the task, create a branch through Github with a name in format [TASK_ID]-[FEATURE/BUG/REFACTOR]-[DESCRIPTIVE_BRANCH_NAME]. For example, if your task is `#4 Create a popup` your branch name should be `feature-4-create-popup`. If you don't see the "Create a branch" button, open the issue in a new tab. It should be available in the sidebar.

### Development

While developing, use [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/). Remember that the commit should only include a solution to a single problem and only the code that is needed. Also, try to avoid commits like "typo fix" and include these into the last possible commit. To help you life easier when working with conventional commits, use this extention for VSCode: https://marketplace.visualstudio.com/items?itemName=vivaxy.vscode-conventional-commits.

To edit commits, you can always soft reset the old commits and split them into proper ones. Use the command `git add --patch` if you want to include only certain changes from a file.

If everything is in order and you are happy with the functionality, branch name, and commits, you can make a PR to the Main branch.
