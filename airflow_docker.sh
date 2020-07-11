if [ -d SDMM ]; then
  echo "SDMM directory exists"
  rm -rf SDMM
  sudo git clone https://github.ibm.com/CMF-Sokudo/SDMM.git
  else
	sudo git clone https://github.ibm.com/CMF-Sokudo/SDMM.git
fi
cd SDMM/Airflow
docker-compose -f docker-compose-CeleryExecutor.yml up -d
docker exec -it airflow_webserver_1 rm airflow.cfg
docker cp config/airflow.cfg airflow_webserver_1:/usr/local/airflow
docker exec -it airflow_webserver_1 pip install flask_bcrypt
docker restart airflow_webserver_1
docker cp create_user.py airflow_webserver_1:/usr/local/airflow
docker exec -it airflow_webserver_1 python create_user.py