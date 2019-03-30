# Remove old (possibly broke) docker versions
sudo apt-get remove docker docker-engine docker.io

# Install docker
sudo apt-get install apt-transport-https ca-certificates curl software-properties-common --yes
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu xenial stable" --yes
sudo apt-get update --yes
sudo apt-get install docker-ce --yes
sudo docker run hello-world # Should run!

# Install docker-compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.22.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

git clone https://github.com/rickcarlino/easy-ssb-pub --depth=5 --branch=master

cd easy-ssb-pub

snap install micro --classic
cp .env.example .env
# Most important setup step- read the file that
# you are about to open, follow the instructions within.
# NOTHING WILL WORK WITHOUT THIS STEP!
micro .env

sudo docker-compose run easy-ssb-pub npm install
sudo docker-compose up
