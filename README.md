# [Old Bus Tracker](https://old-bus-tracker.onrender.com/)

Old Bus Tracker is an application for tracking old, non-HSL-colored buses in the Helsinki region. It uses the [Digitransit's API](https://digitransit.fi/en/developers/apis/1-routing-api/) to provide real-time position updates and route details for the buses. Users can view each bus's progress along its route and see its current location on a map. Bus color information is manually gathered from [kooen202](https://www.kooen202.com/39920).

## Running the App Locally
To set up and run the application on your local machine, follow these steps:
1. **Clone the repistory:**  
`git clone https://github.com/oskarruo/old-bus-tracker.git`
2. **Install Docker (if not already installed):**  
Follow the installation instructions here: [Docker Installation Guide](https://docs.docker.com/engine/install/)
3. **Obtain a Digitransit API key:**  
Sign up and get an API key from: [Digitransit Developer Portal](https://portal-api.digitransit.fi/product#product=digitransit-developer-api)
4. **Create a .env file:**  
In the project's root directory, create a .env file and add your API key as follows:  
`API_KEY=YOUR_DIGITRANSIT_API_KEY`  
5. **Run Docker Compose:**  
In the root directory of the project, execute:  
`docker-compose up --build`
6. **Access the app**  
Once the setup is complete, open a web browser and navigate to: [http://localhost](http://localhost)

## Future developments

- **Automated Testing:** Add test coverage for the application.
- **CI/CD Pipeline:** Set up continuous integration and deployment workflows.
- **New Feature:** Enable pinning or jumping to a specific bus on the map.
- **Bug Fix:** Resolve the "flickering" issue with map symbols.
- **New feature:** Display more vehicle details and provide filtering options based on those details.