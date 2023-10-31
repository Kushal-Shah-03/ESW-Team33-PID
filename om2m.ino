#include <ThingSpeak.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <HTTPClient.h>


unsigned long my_time=millis();
const char *ssid = "Redmi K50i";
const char *pass = "1 2 3 4 ";

const char *server = "mqtt3.thingspeak.com";

const char *mqttUserName = "Dh4sKRw3HCgxBjstNzUlLzA";

const char *mqttPass = "yr0hiryD+bAS9TS3AC9ziNtJ";

const char *clientID = "Dh4sKRw3HCgxBjstNzUlLzA";

long writeChannelID = 2308331;
char *writeAPIKey = "0GXKRFPJU0TCDPGB";

int port = 1883;

WiFiClient client;

// OM2M
#define CSE_IP "192.168.197.43"
#define CSE_PORT 5089
#define HTTPS false
#define OM2M_ORGIN "admin:admin"
#define OM2M_MN "/~/in-cse/in-name/"
#define OM2M_AE "DC-Motor-RPM"
#define OM2M_DATA_CONT "RPM/Data"

PubSubClient mqttClient(client);

int fieldsToPublish[8] = { 1, 0, 0, 0, 0, 0, 0, 0 };  // Change to allow multiple fields.
float dataToPublish[8];

int motor1Pin1 = 27;
int motor1Pin2 = 26;
int enable1Pin = 14;
int HES = 2;

// Setting PWM properties
const int freq = 30000;
const int pwmChannel = 0;
const int resolution = 8;
int dutyCycle = 200;

volatile int count = 0;
long prevT = 0;
volatile int prev_det = 1;
volatile int totalcount = 0;
float prev_error = 0;
float eintergral = 0;

int prev_pwr = 160;
float rpm = 0;
void incCounter() {
  // volatile int detect = digitalRead(HES);
  // if (detect == 0 && prev_det == 1) {
  //   prev_det = 0;
  // Serial.print("hi");
  // count++;
  if (my_time<millis()-100)
  {
    totalcount++;
    my_time=millis();
  }
  // }
  // if (detect == 1) {
  //   prev_det = 1;
  // }
}
void mqttPublish(long pubChannelID, float dataArray[], int fieldArray[]) {
  int index = 0;
  String dataString = "";

  // updateRSSIValue();  // Make sure the stored value is updated.

  //
  while (index < 8) {

    // Look at the field array to build the posting string to send to ThingSpeak.
    if (fieldArray[index] > 0) {

      dataString += "&field" + String(index + 1) + "=" + String(dataArray[index]);
    }
    index++;
  }

  Serial.println(dataString);

  // Create a topic string and publish data to ThingSpeak channel feed.
  String topicString = "channels/" + String(pubChannelID) + "/publish";
  mqttClient.publish(topicString.c_str(), dataString.c_str());
  Serial.println("Published to channel " + String(pubChannelID));
  // delay(1000);
}

void om2mUpload(float dataArray[], int fieldArray[])
{
  int index = 0;
  String data = "";

    while (index < 8) {
      // Look at the field array to build the posting string to send to ThingSpeak.
      if (fieldArray[index] > 0) {

        // dataString += "&field" + String(index + 1) + "=" + String(dataArray[index]);
        data="[" + String(dataArray[index]) + "]";
      }
      index++;
    }

  String server="http://" + String() + CSE_IP + ":" + String() + CSE_PORT + String()+OM2M_MN;

  // // Serial.println(data);
  http.begin(server + String() + OM2M_AE + "/" + "RPM/Data" + "/");

  http.addHeader("X-M2M-Origin", OM2M_ORGIN);
  http.addHeader("Content-Type", "application/json;ty=4");
  http.addHeader("Content-Length", "100");

  String label = "RPM";

  String req_data = String() + "{\"m2m:cin\": {"

    + "\"con\": \"" + data + "\","

    + "\"rn\": \"" + "cin_"+String(i) + "\","

    + "\"lbl\": \"" + label + "\","

    + "\"cnf\": \"text\""

    + "}}";

  int code = http.POST(req_data);
  http.end();
  Serial.println(code);
}

void setup() {
  // sets the pins as outputs:
  pinMode(motor1Pin1, OUTPUT);
  pinMode(motor1Pin2, OUTPUT);
  // pinMode(enable1Pin, OUTPUT);
  pinMode(HES, INPUT);

  // configure LED PWM functionalitites
  ledcSetup(pwmChannel, freq, resolution);

  // attach the channel to the GPIO to be controlled
  ledcAttachPin(enable1Pin, pwmChannel);

  digitalWrite(motor1Pin1, HIGH);
  digitalWrite(motor1Pin2, LOW);
  ledcWrite(pwmChannel, 160);

  Serial.begin(115200);

  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.println("Connecting to WiFi...");
    delay(1000);
  }
  Serial.println("WiFi Connected!");
  mqttClient.setServer(server, port);
  ThingSpeak.begin(client);

  // testing
  Serial.print("Testing DC Motor...");

  attachInterrupt(digitalPinToInterrupt(HES), incCounter, CHANGE);
}

void loop() {
  // Move DC motor forward with increasing speed
  float target = 80;
  // long dt = millis() - prevT;
  // detachInterrupt(0);
  // rpm = 60 * 1000 / (millis() - prevT) * count;
  // prevT = millis();
  // count = 0;
  // attachInterrupt(digitalPinToInterrupt(HES), incCounter, RISING);
  // Serial.print("RPM: ");
  // Serial.println(rpm);
  // int detect=digitalRead(HES);
  // if(detect==0 && prev_det==1)
  // {
  //   prev_det=0;
  //   count++;
  // }
  // if(detect==1)
  // {
  //   prev_det=1;
  // // }
  // if (count < 6) {
  //   totalcount = totalcount + count / 2;
  //   count = 0;
  // } else {
  //   Serial.print("bakwas");
  //   Serial.println(count);
  //   totalcount = totalcount + 2;
  //   count = 0;
  // }

  if (totalcount > 5) {
    detachInterrupt(0);
    rpm = 60 * 1000000 / (micros() - prevT) * totalcount;
    // prevT = micros();
    totalcount = 0;
    attachInterrupt(digitalPinToInterrupt(HES), incCounter, CHANGE);

    Serial.print("RPM: ");
    Serial.println(rpm);
    float error = target - rpm;
    float kp = 5;
    float ki = 0.001;
    float kd = 0.25;
    long currT = micros();
    float dt = (currT - prevT) / 1000000.0;
    prevT = currT;
    Serial.print("DT: ");
    Serial.println(dt);
    float dedt = error - prev_error;
    dedt = dedt / dt;
    Serial.print("DEDT: ");
    Serial.println(dedt);
    eintergral = eintergral + error * dt;
    float output = kp * error + ki * eintergral + kd * dedt;
    prev_error = error;
    // if (output < 0) {
    //   eintergral = 0;
    //   output = prev_pwr;
    // }
    if (output < -255) {
      output = -255;
    }
    if (output > 500) {
      output = 500;
    }
    if (output <= 0) {
      Serial.print("pit:");
      Serial.println(output);
      output = (prev_pwr - 160) * output / 255 + prev_pwr;
    } else {
      output = (255 - prev_pwr) * output / 500 + prev_pwr;
    }
    int outputabs = (int)abs(output);
    Serial.print("Power: ");
    Serial.println(outputabs);
    if (outputabs > 255) {
      outputabs = 255;
    }
    prev_pwr = outputabs;
    // if (output < 0) {
    //   setMotor(outputabs, 0);
    // } else {

    // detachInterrupt(0);
    // Serial.println("Hi Above");
    Serial.print(outputabs);
    ledcWrite(pwmChannel, outputabs);
    // delay(15);
    // Serial.println("Hi Below");

    // attachInterrupt(digitalPinToInterrupt(HES), incCounter, CHANGE);
    // }
    while (mqttClient.connected() == NULL) {
      Serial.println("Connecting to mqtt...");
      mqttClient.connect(clientID, mqttUserName, mqttPass);
      delay(1000);
    }
    mqttClient.loop();

    dataToPublish[0] = rpm;

    mqttPublish(writeChannelID,
                dataToPublish, fieldsToPublish);

    om2mUpload(dataToPublish, fieldsToPublish);

  }


  //   Serial.println(totalcount);
  // delay(100);
}

void setMotor(int speed, int dir) {
  if (dir == 1) {
    digitalWrite(motor1Pin1, HIGH);
    digitalWrite(motor1Pin2, LOW);
  } else {
    digitalWrite(motor1Pin1, LOW);
    digitalWrite(motor1Pin2, HIGH);
  }
  Serial.println("Hi Above");
  Serial.print(speed);
  ledcWrite(pwmChannel, speed);
  Serial.println("Hi Below");
}