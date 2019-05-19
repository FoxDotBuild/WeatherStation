# Weather Station
This weather station gets a reading of both the temperature and humidity and publishes it to a database that has a [Kappa Architecture](http://milinda.pathirage.org/kappa-architecture.com/).

[Secure Scuttlebutt](https://ssbc.github.io/scuttlebutt-protocol-guide/) is the Kappa Architecture implementation used to store sensor readings. Sensor readings are propogated via [data mule](https://en.wikipedia.org/wiki/Data_mule) rather than by a data link.

When applied to [IoT](https://en.wikipedia.org/wiki/Internet_of_things) SSB can make for a reliable and convenient way to transport data securely when traditional networking infrastructure is scarce.

![weather_report.png](weather_report.png)
![enclosure.jpg](enclosure.jpg)
## Project TODOs

 - [X] Install latest Raspian
 - [X] Setup an Open WiFi AP. [Maybe just use this one](https://github.com/billz/raspap-webgui).
 - [ ] Install latest node version
 - [ ] Install latest `ssb-server` and setup systemd stuff for said `ssb-server`.
 - [ ] Setup systemd stuff for custom weather station code.
 - [ ] Re-write everything in `src/` to use `ssb-client` and the latest (promise-based) `node-dht-sensor`.
 
## Hardware

 * Raspberry Pi 3 B
 * Tiny RTC DS1307
 * DHT22 Humidity and Temperature Sensor
 ### Wiring Diagram
  ![schematic.png](schematic.png)
  
## Software
 ### Clone Repo Somewhere on Pi
  ```
  git clone https://github.com/FoxDotBuild/WeatherStation.git
  ```
 ### [Install NodeJS](https://www.instructables.com/id/Install-Nodejs-and-Npm-on-Raspberry-Pi/)
  ```
  # Download [Node version 10.15.3 armV6] (https://nodejs.org/en/download/releases)
  # Extract the archive
  sudo tar -C /opt -Jxf node-v10.15.3-linux-arm6l.tar.xz
  
  # Change directory to /opt/
  cd /opt/
  
  # Symbolically link node
  sudo ln -s node-v10.15.3.linux-armv6l node
  
  # Setup path to node
  export PATH="$PATH:/opt/node-v10.15.3-linux-arm6l/bin"
  # Test path
  which node
  ```
 ### Install [ssb-server](https://github.com/ssbc/ssb-server)
  ```
  # install ssb-server
  sudo /opt/node-v10.15.3-linux-armv6l/bin/npm install -g ssb-server
  
  # Also consider installing by
  sudo -i
  npm install -g ssb-server
  ```
 ### Setup Realtime clock
  ```
  # Load RTC Module
  sudo modprobe rtc-ds1307

  # Config i2c bus to use RTC
  echo ds1307 0x68 | sudo tee /sys/class/i2c-adapter/i2c-1/new_device

  # Read the clock
  sudo hwclock -r
  ```
  ### Install [raspAP](https://github.com/billz/raspap-webgui)
  #### Prerequisites
  Start with a clean install of the [latest release of Raspbian](https://www.raspberrypi.org/downloads/raspbian/) (currently Stretch). Raspbian Stretch Lite is recommended.

  1. Update Raspbian, including the kernel and firmware, followed by a reboot:
  ```
  sudo apt-get update
  sudo apt-get dist-upgrade
  sudo reboot
  ```
  2. Set the WiFi country in raspi-config's **Localisation Options**: `sudo raspi-config`

  3. If you have an older Raspberry Pi without an onboard WiFi chipset, the [**Edimax Wireless 802.11b/g/n nano USB adapter**](https://www.edimax.com/edimax/merchandise/merchandise_detail/data/edimax/global/wireless_adapters_n150/ew-7811un) is an excellent option – it's small, cheap and has good driver support.

  With the prerequisites done, you can proceed with either the Quick installer or Manual installation steps below.

  #### Quick installer
  Install RaspAP from your RaspberryPi's shell prompt:
  ```sh
  wget -q https://git.io/voEUQ -O /tmp/raspap && bash /tmp/raspap
  ```
  The installer will complete the steps in the manual installation (below) for you.

  After the reboot at the end of the installation the wireless network will be
  configured as an access point as follows:
  * IP address: 10.3.141.1
    * Username: admin
    * Password: secret
  * DHCP range: 10.3.141.50 to 10.3.141.255
  * SSID: `raspi-webgui`
  * Password: ChangeMe

  **Note:** As the name suggests, the Quick Installer is a great way to quickly setup a new AP. However, it does not automagically detect the unique configuration of your RPi. Best results are obtained by connecting an RPi to ethernet (`eth0`) or as a WiFi client, also known as managed mode, with `wlan0`. For the latter, refer to [this FAQ](https://github.com/billz/raspap-webgui/wiki/FAQs#how-do-i-prepare-the-sd-card-to-connect-to-wifi-in-headless-mode). Please [read this](https://github.com/billz/raspap-webgui/wiki/Reporting-issues) before reporting an issue.
  
## Starting
 If everything installed correctly then just run
 ```
 ssb-server start
 ```
 and keep it open.
 
 In a different terminal:
 ```
 # Run index.js in /mini/
 node index.js
 
 # alternate way
 sudo /opt/node-v10.15.3-linux-armv61/bin/node index.js
 ```
## Syncing Data

 * Venture off into the woods, find the weather station.
 * Connect to the device's exposed WiFi network using a smart phone.
 * Open [Manyverse](https://play.google.com/store/apps/details?id=se.manyver) up on your phone.
 * Once Manyverse syncs with the weather station, go home.
 * Open Manyverse on your home WiFi, syncing with other peers.
 * Done! The weather report has now been "gossiped" to other peers on the network.

---
## See Also

 * [SBOT API Docs](https://scuttlebot.io/) - Provides a Javascript API to SSB.
 * [Patchwork](https://github.com/ssbc/patchwork) - A non-trivial SSB app.
 
## Attribution

The code is a heavily gutted version of [easy-ssb-pub](https://github.com/staltz/easy-ssb-pub).
