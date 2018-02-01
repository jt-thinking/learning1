call  newman run 经营情况相关接口.postman_collection.json   -e test_environment.postman_environment.postman_environment.json  --export-environment test_environment.postman_environment.postman_environment.json -r junit
rem 经营情况相关接口
call newman run 资产负债接口.postman_collection.json   -e test_environment.postman_environment.json  --export-environment test_environment.postman_environment.json -r junit  
rem 资产负债相关接口
call newman run 签约放款接口.postman_collection.json   -e test_environment.postman_environment.json  --export-environment test_environment.postman_environment.json -r junit
rem 签约放款接口
call newman run 客户引入、客户特殊业务接口.postman_collection.json   -e test_environment.postman_environment.json  --export-environment test_environment.postman_environment.json -r junit
rem 客户引入、客户特殊业务接口
call newman run 个人授信相关.postman_collection.json   -e test_environment.postman_environment.json  --export-environment test_environment.postman_environment.json -r junit
rem 个人授信相关

call newman run A客户详情接口.postman_collection.json   -e test_environment.postman_environment.json  --export-environment test_environment.postman_environment.json -r junit
rem A客户详情接口

call newman run area-controller.postman_collection.json   -e test_environment.postman_environment.json  --export-environment test_environment.postman_environment.json -r junit
rem 行政区划查询

call newman run notice-info-controller.postman_collection.json   -e test_environment.postman_environment.json  --export-environment test_environment.postman_environment.json -r junit
rem 公告相关

call newman run 黑名单相关.postman_collection.json   -e test_environment.postman_environment.json  --export-environment test_environment.postman_environment.json -r junit
rem 黑名单相关


call newman run 特殊业务.postman_collection.json   -e test_environment.postman_environment.json  --export-environment test_environment.postman_environment.json -r junit
rem 特殊业务


call newman run loan-change-info-controller.postman_collection.json   -e test_environment.postman_environment.json  --export-environment test_environment.postman_environment.json -r junit
rem loan-change-info-controller

call newman run cust-workbench-controller.postman_collection.json   -e test_environment.postman_environment.json  --export-environment test_environment.postman_environment.json -r junit
rem 客户经理工作台


call newman run loan-urge-info-controller.postman_collection.json   -e test_environment.postman_environment.json  --export-environment test_environment.postman_environment.json -r junit
rem 催款信息

