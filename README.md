# Weather Station Project

## What's Here?
 * `dht2.ino` - Firmware for Arduino (uses DHT22 temp sensor).
 
## What Boards + Sensors?
 * Raspberry Pi Zero W
 * Tiny RTC DS1307
 * DHT22 Humidity and Temperature Sensor

## Relevant RTC Setup
 * sudo modprobe rtc-ds1307 //Load RTC Module
 * echo ds1307 0x68 | sudo tee /sys/class/i2c-adapter/i2c-1/new_device
 * sudo hwclock -r //Read the clock

## README

 * [SBOT API Docs](https://scuttlebot.io/)
 * [Patchwork](https://github.com/ssbc/patchwork)
