# Weather Station Project

This is a weather station that uses [Secure Scuttlebutt](https://ssbc.github.io/scuttlebutt-protocol-guide/) to store sensor readings. Sensor readings are propogated via [data mule](https://en.wikipedia.org/wiki/Data_mule) rather than by a data link.

![weather_report.png](weather_report.png)
![enclosure.jpg](enclosure.jpg)

## Hardware Used

 * Raspberry Pi Zero W
 * Tiny RTC DS1307
 * DHT22 Humidity and Temperature Sensor

## See Also

 * [SBOT API Docs](https://scuttlebot.io/) - Provides a Javascript API to SSB.
 * [Patchwork](https://github.com/ssbc/patchwork) - A non-trivial SSB app.

## Project TODOs

 - [ ] Setup hostapd/dnsmasq as an Open WiFi AP. [Maybe just use this one](https://github.com/billz/raspap-webgui).
 - [ ] Setup autostart (`systemd`, [probably](https://www.raspberrypi.org/documentation/linux/usage/systemd.md) for boot up.

## Hardware Setup

 * [Install NodeJS](https://www.instructables.com/id/Install-Nodejs-and-Npm-on-Raspberry-Pi/)
 * Setup Realtime clock (see appendix)

## Syncing Data

 * Venture off into the woods, find the weather station.
 * Connect to the device's exposed WiFi network using a smart phone.
 * Open [Manyverse](https://play.google.com/store/apps/details?id=se.manyver) up on your phone.
 * Once Manyverse syncs with the weather station, go home.
 * Open Manyverse on your home WiFi, syncing with other peers.
 * Done! The weather report has now been "gossiped" to other peers on the network.

---

# Appendix: Realtime Clock Setup

```
# Load RTC Module
sudo modprobe rtc-ds1307

# Config i2c bus to use RTC
echo ds1307 0x68 | sudo tee /sys/class/i2c-adapter/i2c-1/new_device

# Read the clock
sudo hwclock -r
```

## Attribution

The code is a heavily gutted version of [easy-ssb-pub](https://github.com/staltz/easy-ssb-pub).
