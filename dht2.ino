#include "DHT.h"
#define DHTPIN 2 
#define DHTTYPE DHT22   // DHT 22  (AM2302), AM2321
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
}

void loop() {
  delay(2000);
  float h = dht.readHumidity();
  float f = dht.readTemperature(true);
  if (isnan(h) || isnan(f)) {
    Serial.println(F("null"));
    return;
  }
  
  float hif = dht.computeHeatIndex(f, h);

  Serial.print(F("["));
  Serial.print(h);
  Serial.print(F(","));
  Serial.print(hif);
  Serial.println(F("]"));
}
