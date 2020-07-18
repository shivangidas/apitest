# API test

APIs for getting users in and close to a city

[![Build Status](https://travis-ci.com/shivangidas/apitest.svg?token=KMckoTpBEKUimWY3SsUN&branch=master)](https://travis-ci.com/shivangidas/apitest)

<!-- ![Node.js CI](https://github.com/shivangidas/apitest/workflows/Node.js%20CI/badge.svg) -->

## Install and run:

1. Git clone or download code

   <code>git clone git@github.com:shivangidas/apitest.git</code>

2. Install dependencies

   <code>npm install</code>

3. Start the server

   <code>npm start</code>

4. Call API as http://0.0.0.0:4040/api/v1/distance/50/city/London/users \
   API definition [here][https://github.com/shivangidas/apitest#apis]

## Test:

Run tests using the following command

<code>npm test</code>

## APIs

1.  GET http://0.0.0.0:4040/api/v1/distance/:distance/city/:city/users \
    Get users in and within _distance_ of _city_

    Sample: http://0.0.0.0:4040/api/v1/distance/50/city/London/users \
    Success response: <pre>{"code":"200","url":"/api/v1/distance/50/city/London/users","result":[{"id":266,"first_name":"Ancell","last_name":"Garnsworthy","email":"agarnsworthy7d@seattletimes.com","ip_address":"67.4.69.137","latitude":51.6553959,"longitude":0.0572553},...]}</pre>
    Error responses:
    http://0.0.0.0:4040/api/v1/distance/abc/city/London/users

    <pre>{"errorCode":"400","url":"/api/v1/distance/abc/city/London/users","errorMessage":"Distance cannot be non-numeric"}</pre>

    http://0.0.0.0:4040/api/v1/distance/100/city/Tokyo/users

    <pre>{"errorCode":"400","url":"/api/v1/distance/100/city/Tokyo/users","errorMessage":"City not in Database"}</pre>

    When external API fails

    <pre>{"errorCode":"500","url":"/api/v1/distance/50/city/London/users","errorMessage":"API not reachable"}</pre>

### Extra APIs

2. GET http://0.0.0.0:4040/api/v1/city/:city/users \
   Get users in _city_ (works only for london) \
   Sample: http://0.0.0.0:4040/api/v1/city/London/users \
   Success response:

    <pre>{"code":"200","url":"/api/v1/city/London/users","result":[{"id":135,"first_name":"Mechelle","last_name":"Boam","email":"mboam3q@thetimes.co.uk","ip_address":"113.71.242.187","latitude":-6.5115909,"longitude":105.652983},{"id":396,"first_name":"Terry","last_name":"Stowgill","email":"tstowgillaz@webeden.co.uk","ip_address":"143.190.50.240","latitude":-6.7098551,"longitude":111.3479498},...]}</pre>

3. GET http://0.0.0.0:4040/api/v1/users \
   Get all users \
   Success response: <pre>{"code":"200","url":"/api/v1/users","result":[{"id":1,"first_name":"Maurise","last_name":"Shieldon","email":"mshieldon0@squidoo.com","ip_address":"192.57.232.111","latitude":34.003135,"longitude":-117.7228641},{"id":2,"first_name":"Bendix","last_name":"Halgarth","email":"bhalgarth1@timesonline.co.uk","ip_address":"4.185.73.82","latitude":-2.9623869,"longitude":104.7399789},...]}</pre>

4. GET http://0.0.0.0:4040/api/v1/near/distance/:distance/city/:city/users \
   Get users near _distance_ of _city_ \
   Sample: http://0.0.0.0:4040/api/v1/near/distance/50/city/London/users \
   Success Response: <pre>{"code":"200","url":"/api/v1/near/distance/50/city/London/users","result":[{"id":266,"first_name":"Ancell","last_name":"Garnsworthy","email":"agarnsworthy7d@seattletimes.com","ip_address":"67.4.69.137","latitude":51.6553959,"longitude":0.0572553},{"id":322,"first_name":"Hugo","last_name":"Lynd","email":"hlynd8x@merriam-webster.com","ip_address":"109.0.153.166","latitude":51.6710832,"longitude":0.8078532},{"id":554,"first_name":"Phyllys","last_name":"Hebbs","email":"phebbsfd@umn.edu","ip_address":"100.89.186.13","latitude":51.5489435,"longitude":0.3860497}]}</pre>

## Future work

1. Latitudes and longitudes for cities can be fetched from Google's Geocoding API. Currently using values saved as json in src/data
