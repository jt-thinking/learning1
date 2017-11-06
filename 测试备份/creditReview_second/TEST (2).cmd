call newman run area-controller.postman_collection.json   -e test_environment.json  --export-environment test_environment.json -r junit
rem A客户详情接口