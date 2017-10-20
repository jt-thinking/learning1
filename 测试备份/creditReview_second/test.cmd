call  newman run 经营情况相关接口.postman_collection.json   -e test_environment.json  --export-environment test_environment.json -r junit
rem 经营情况相关接口
call newman run 资产负债接口.postman_collection.json   -e test_environment.json  --export-environment test_environment.json -r junit  
rem 资产负债相关接口
call newman run 签约放款接口.postman_collection.json   -e test_environment.json  --export-environment test_environment.json -r junit
rem 签约放款接口
call newman run 客户引入、客户特殊业务接口.postman_collection.json   -e test_environment.json  --export-environment test_environment.json -r junit
rem 客户引入、客户特殊业务接口
call newman run 个人授信相关.postman_collection.json   -e test_environment.json  --export-environment test_environment.json -r junit