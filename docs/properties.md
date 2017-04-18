#### Sample fiveby-config.json
```json
{
  "implicitWait": 5000,
  "hubUrl": "http://127.0.0.1:4444/wd/hub",
  "browsers": {
    "chrome": 1
  },
  "environment": "staging",
  "properties": {
    "serviceVersion": {
      "development,staging": "1.0.0",
      "production": "2.0.0",
      "production.dc1": "3.0.0",
      "production.*.az1": "4.0.0"
    }
  }
}
```
#### Sample Usage
```javascript
properties = propertyService.get('default'); //default is the namespace for properties set in fiveby-config.json

// environment = 'staging'  or  environment = 'development'
properties.get('serviceVersion') // 1.0.0

// environment = 'production.dc1'
properties.get('serviceVersion') // 3.0.0

// environment = 'production.dc2'
properties.get('serviceVersion') // 2.0.0

// environment = 'production.dc1.az1'
properties.get('serviceVersion') // 4.0.0
```
