cd localmysql
docker rm mysql
docker-compose down --rmi all
docker-compose build --no-cache
docker-compose up -d

cd ../localredis
docker rm redis
docker-compose build --no-cache
docker-compose up -d

cd ../../backend/src
go run main.go local

