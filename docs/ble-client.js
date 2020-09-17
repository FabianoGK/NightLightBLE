class NightLightBLE {
    constructor() {
      this.device = null;
      this.led1Characteristic = null;
      this.led2Characteristic = null;
      this.onDisconnected = this.onDisconnected.bind(this);
    }
  
    /* the LED characteristic providing on/off capabilities */
    async setLedCharacteristic() {
      const service = await this.device.gatt.getPrimaryService("00001523-1212-efde-1523-785feabcd123");

      const led1Characteristic = await service.getCharacteristic("00001525-1212-efde-1523-785feabcd123");
      const led2Characteristic = await service.getCharacteristic("00001526-1212-efde-1523-785feabcd123");
  
      this.led1Characteristic = led1Characteristic;
      this.led2Characteristic = led2Characteristic;
    }
  
    /* request connection to a BLE device */
    async request() {
      let options = {
        //acceptAllDevices: true
        filters: [
          {
            // name: "Nordic_Blinky"
            services: [ "00001523-1212-efde-1523-785feabcd123" ]
          }
        ],
      };
      if (navigator.bluetooth == undefined) {
        alert("Your browser does not support Web BLE!");
        return;
      }
      this.device = await navigator.bluetooth.requestDevice(options);
      if (!this.device) {
        throw "No device selected";
      }
      this.device.addEventListener("gattserverdisconnected", this.onDisconnected);
    }
  
    /* connect to device */
    async connect() {
      if (!this.device) {
        return Promise.reject("Device is not connected.");
      }
      await this.device.gatt.connect();
    }
  
    /* read LED state */
    async readLed1() {
      var array = await this.led1Characteristic.readValue();
      return array.getUint8();
    }
  
    async readLed2() {
      var array = await this.led2Characteristic.readValue();
      return array.getUint8();
    }
  
    /* change LED state */
    async writeLed1(data) {
      await this.led1Characteristic.writeValue(Uint8Array.of(data));
    }

    async writeLed2(data) {
      await this.led2Characteristic.writeValue(Uint8Array.of(data));
    }
  
    /* disconnect from peripheral */
    disconnect() {
      if (!this.device) {
        return Promise.reject("Device is not connected.");
      }
      return this.device.gatt.disconnect();
    }
  
    /* handler to run when device successfully disconnects */
    onDisconnected() {
      location.reload();
    }
  }