> An awesome project based on Ts.ED framework

## Getting started
 
```batch
# install dependencies
$ yarn install

# serve
$ yarn start

# build for production
$ yarn build
$ yarn start:prod
```
 
 ## PM2
```sh
pm2 startup
pm2 start npm --name server-base-ts-dev  -- run "start" 
pm2 start npm --name server-base-ts-prod  -- run "start:prod" 
pm2 save
```