import paho.mqtt.client as mqtt


class MQTT:
    def __init__(self):
        self.client = mqtt.Client()
        self.client.connect("localhost", 1883)
        self.client.loop_start()

    def close(self):
        self.client.loop_stop()
        self.client.disconnect()
