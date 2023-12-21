# Base Server | Typescript | Node JS 

```sh
sudo npm install --force 

```

```sh
sudo npm run-script  build
```

### start:prod || start 
```sh
pm2 startup
pm2 start npm --name serverDev  -- run "start" 
pm2 start npm --name serverProd  -- run "start:prod" 
pm2 save
``` 

