#FOR Centos AWX Setup

#Install Python 3 and other relevant dependencies
sudo yum -y install git apt-transport-https wget gnupg python3 python3-pip python-dev tree libpq-dev
sudo yum -y install libselinux-python3.x86_64

#PIP3 Docker files for python3 
sudo pip3 install docker
sudo pip3 install docker-compose

#Check Status of installation of docker modules for python3
sudo pip3 freeze

#Install Ansible
sudo yum -y install epel-release
sudo yum -y repolist
sudo yum install ansible -y

#Check ansible version running :
sudo ansible --version

#Download the AWX package from the Github repository at any folder (assuming logged in as root user).
if [ -d awx_setup ]; then
	echo "awx_setup directory exists"
	rm -rf awx_setup
	sudo mkdir awx_setup
  else
	sudo mkdir awx_setup
fi
cd awx_setup
sudo git clone -b 11.2.0 https://github.com/ansible/awx.git ## Where x.y.z is the version of a stable release(I used 11.2.0)

#Install AWX using the Ansible Playbook.

#Using Docker : Follow instruction guidelines given in GIT Readme file for pre-install steps under Docker Compose (https://github.com/ansible/awx/blob/11.2.0/INSTALL.md#docker-compose)

#Saving a file in local with the config needed (inventory_docker_config) at same folder as that of the shell script, which can be copied to the inventory

cat /root/inventory_docker_config > awx/installer/inventory

#Clearing IP Tables . Sometimes face this IP Table error 
sudo iptables -t filter -F
sudo iptables -t filter -X

#Restart docker after clearing IP table cache
systemctl restart docker

#After pre-install steps are complete
cd awx/installer
sudo ansible-playbook -i inventory install.yml

#Wait the AWX installation to finish.

#Open your browser and enter the IP address of your Ansible server.
#The following URL was entered in the Browser:

#http://<IP_Of_Server>:80 -- Port can be found by checking info of the container.(docker ps)

echo "Ansible Installation Completed! Please hit http://<IP_Of_Server>:80 -- Port can be found by checking info of the container.(docker ps) for AWX UI and login with default user: admin and password: password"