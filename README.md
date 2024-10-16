# [https://old-bus-tracker.onrender.com/](https://old-bus-tracker.onrender.com/)

# Old Bus Tracker

Old bus tracker is an application for tracking old non-HSL colored buses in the Helsinki region. It uses [Digitransit's API](https://digitransit.fi/en/developers/apis/1-routing-api/) to get position updates and route details. The user can see each buses progress on their route, and their location on a map. The bus color information is manually acquired from [kooen202](https://www.kooen202.com/39920).

## Running the app locally
1. Clone the repistory with  
`git clone https://github.com/oskarruo/old-bus-tracker.git`
2. Install Docker if you do not already have it  
[https://docs.docker.com/engine/install/](https://docs.docker.com/engine/install/)
3. Get a Digitransit API key from  
[https://portal-api.digitransit.fi/product#product=digitransit-developer-api](https://portal-api.digitransit.fi/product#product=digitransit-developer-api)
4. Create a .env file in the project root folder and set your API_KEY  
`API_KEY=YOUR_DIGITRANSIT_API_KEY`  
5. Run docker-compose in the project root folder  
`docker-compose up --build`
6. The app is now running and can be accessed in a browser at  
`localhost`

## Future developments

- Tests
- CI/CD pipeline
- Feature: Pinning/Jumping to a bus on the map
- Fix: Fixing the "flickering" effect on the map symbols
- Feature: Adding more vehicle information and (maybe) filtering based on it