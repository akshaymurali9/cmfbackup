yum install -y sudo

#Pull AWX and Airflow Files from GIT
if [ -d cmfawxsetup ]; then
  echo "cmfawxsetup directory exists"
  rm -rf cmfawxsetup
  sudo git clone https://github.com/akshaymurali9/cmfawxsetup.git
  else
	sudo git clone https://github.com/akshaymurali9/cmfawxsetup.git
fi

#Transfer pulled files to root
ls -tlr
ls -tlr cmfawxsetup/
cp /var/lib/jenkins/jobs/ALM_Build/workspace/cmfawxsetup/awx_setup.sh /root
cp /var/lib/jenkins/jobs/ALM_Build/workspace/cmfawxsetup/airflow_docker.sh /root
cp /var/lib/jenkins/jobs/ALM_Build/workspace/cmfawxsetup/inventory_docker_config /root


#Loopback and Mongo project DB data setup
if [ -d cmfrepo ]; then
  echo "cmfrepo directory exists"
  rm -rf cmfrepo
  sudo git clone https://github.com/akshaymurali9/cmfrepo.git
  else
	sudo git clone https://github.com/akshaymurali9/cmfrepo.git
fi

#AWX
cd /root
sh awx_setup.sh

#Create a docker network for Loopback and Mongo Containers to interact
docker network create -d bridge cmf-bridge-network

#Pull Loopback and Mongo Images and create Containers
docker pull akshaymurali9/cmfrepo:cmfloopback_new 
docker pull akshaymurali9/cmfrepo:cmfmongo_new 
docker run -d -p 27017:27017 -v /var/lib/jenkins/jobs/ALM_Build/workspace/cmfrepo:/data/db --network=cmf-bridge-network --name cmfmongo akshaymurali9/cmfrepo:cmfmongo_new
docker run -p 3000:3000 --network=cmf-bridge-network --name cmfloopback -d akshaymurali9/cmfrepo:cmfloopback_new 


#Airflow
cd /root
sh airflow_docker.sh
