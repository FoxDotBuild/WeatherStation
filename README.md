# Easy Secure Scuttlebutt Pub

> `easy-ssb-pub` is an easy-to-host server that runs an SSB "Pub".

![screenshot](screenshot.png)

[Secure Scuttlebutt](https://scuttlebutt.nz) (SSB) is an impressive peer-to-peer network that can be used for metadata, identity, and particularly, messaging. SSB is an ideal protocol for a social network. There is already a social network on SSB, called [Patchwork](https://github.com/ssbc/patchwork).

However, to join the wider SSB network, you must get a dedicated invitation from a "Pub" server. Also, hosting a Pub server is not the easiest task. In order to improve adoption of SSB, this project makes it easy to deploy an SSB Pub. Once the Pub is running, it has a light frontend page where anyone can freely request a fresh invitation.

## How to Get an Invite to the Wider SSB Network

Find a public pub on the [Pub Registry](https://github.com/ssbc/scuttlebot/wiki/Pub-Servers).

## About This Repo

This is a fork of the amazing [easy-ssb-pub](https://github.com/staltz/easy-ssb-pub) repo.

 > Feel free to fork! 🍴

 -- Andre Staltz, original creator of [easy-ssb-pub](https://github.com/staltz/easy-ssb-pub).

 > Don't mind if I do!

 -- Me

## Installation

You will need a server that supports a TCP sockets on ports 80, 8008 and 8007. This means [Heroku](https://heroku.com/) or [Zeit Now](https://zeit.co/now) will *not* work. Recommended services for servers-on-demand: [Digital Ocean Docker Droplet](https://www.digitalocean.com/products/one-click-apps/docker/), [UpCloud](https://upcloud.com/), [Amazon LightSail](https://amazonlightsail.com/), [Vultr](https://vultr.com/), [Linode](https://www.linode.com), etc.

1. Provision a new Ubuntu virtual machine
2. Follow instructions in `install_on_ubuntu.sh`

After the container has been created, stop/start/restart the server using:

```
sudo docker-compose up # Start
```

```
sudo docker-compose down # Stop
```

