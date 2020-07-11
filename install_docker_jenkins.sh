#Setup in Centos 7

#Install Docker
sudo yum -y update
curl -fsSL https://get.docker.com/ | sh
sudo systemctl start docker
sudo systemctl status docker
sudo systemctl enable docker
sudo usermod -aG docker $(whoami)

#Docker compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.26.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

#GIT
sudo yum -y install git

#Jenkins
docker pull vsuswara/cmf-repo:cmf-jenkins_v1_29062020
docker run -d -v /var/run/docker.sock:/var/run/docker.sock -v $(which docker):/usr/bin/docker -p 8082:8082 -p 50000:50000 --user root --name cmf-jenkins vsuswara/cmf-repo:cmf-jenkins_v1_29062020