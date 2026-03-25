import Outcall "http-outcalls/outcall";
import Text "mo:core/Text";

actor {
  // Store the OpenWeatherMap API key (set by deployer)
  stable var apiKey : Text = "OPENWEATHERMAP_API_KEY";

  // Transform function required by HTTP outcalls
  public query func transform(input : Outcall.TransformationInput) : async Outcall.TransformationOutput {
    Outcall.transform(input);
  };

  // Update the API key (call this after deployment)
  public func setApiKey(key : Text) : async () {
    apiKey := key;
  };

  // Get current weather for a city
  // Returns raw JSON from OpenWeatherMap current weather endpoint
  public func getWeather(city : Text) : async Text {
    let encodedCity = city; // city name URL-encoded by caller if needed
    let url = "https://api.openweathermap.org/data/2.5/weather?q=" # encodedCity # "&appid=" # apiKey # "&units=metric";
    await Outcall.httpGetRequest(url, [], transform);
  };

  // Get 5-day / 3-hour forecast for a city
  public func getForecast(city : Text) : async Text {
    let url = "https://api.openweathermap.org/data/2.5/forecast?q=" # city # "&appid=" # apiKey # "&units=metric&cnt=40";
    await Outcall.httpGetRequest(url, [], transform);
  };

  // Get air quality data by coordinates
  public func getAirQuality(lat : Text, lon : Text) : async Text {
    let url = "http://api.openweathermap.org/data/2.5/air_pollution?lat=" # lat # "&lon=" # lon # "&appid=" # apiKey;
    await Outcall.httpGetRequest(url, [], transform);
  };
};

