var TYPE = {};

TYPE.ANALOG = "analog"
TYPE.DIGITAL = "digital"
TYPE.BAROMETRIC_PRESSURE = "bp"     // Barometric pressure
TYPE.BATTERY = "batt"               // Battery
TYPE.LUMINOSITY = "lum"             // Luminosity
TYPE.PROXIMITY = "prox"             // Proximity
TYPE.RELATIVE_HUMIDITY = "rel_hum"  // Relative Humidity
TYPE.TEMPERATURE = "temp"           // Temperature
TYPE.VOLTAGE = "voltage"            // Voltage

var UNIT = {};
UNIT.UNDEFINED = "null"
UNIT.PASCAL = "pa"          // Pascal
UNIT.HECTOPASCAL = "hpa"    // Hectopascal
UNIT.PERCENT = "p"          // % (0 to 100)
UNIT.RATIO = "r"            // Ratio
UNIT.VOLTS = "v"            // Volts
UNIT.LUX = "lux"            // Lux
UNIT.CENTIMETER = "cm"      // Centimeter
UNIT.METER = "m"            // Meter
UNIT.DIGITAL = "d"          // Digital (0/1)
UNIT.FAHRENHEIT = "f"       // Fahrenheit
UNIT.CELSIUS = "c"          // Celsius
UNIT.KELVIN = "k"           // Kelvin
UNIT.MILLIVOLTS = "mv"      // Millivolts

module.exports = {
    TYPE:TYPE,
    UNIT:UNIT
}