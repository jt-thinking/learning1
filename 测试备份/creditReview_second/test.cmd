call  newman run ��Ӫ�����ؽӿ�.postman_collection.json   -e test_environment.json  --export-environment test_environment.json -r junit
rem ��Ӫ�����ؽӿ�
call newman run �ʲ���ծ�ӿ�.postman_collection.json   -e test_environment.json  --export-environment test_environment.json -r junit  
rem �ʲ���ծ��ؽӿ�
call newman run ǩԼ�ſ�ӿ�.postman_collection.json   -e test_environment.json  --export-environment test_environment.json -r junit
rem ǩԼ�ſ�ӿ�
call newman run �ͻ����롢�ͻ�����ҵ��ӿ�.postman_collection.json   -e test_environment.json  --export-environment test_environment.json -r junit
rem �ͻ����롢�ͻ�����ҵ��ӿ�
call newman run �����������.postman_collection.json   -e test_environment.json  --export-environment test_environment.json -r junit
rem �����������

call newman run A�ͻ�����ӿ�.postman_collection.json   -e test_environment.json  --export-environment test_environment.json -r junit
rem A�ͻ�����ӿ�

call newman run area-controller.postman_collection.json   -e test_environment.json  --export-environment test_environment.json -r junit
rem ����������ѯ
