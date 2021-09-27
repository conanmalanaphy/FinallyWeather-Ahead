import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

interface WeatherData {
  currentDate: string;
  timePoint: string;
  cloudCover: string;
  seeing: string;
  transparency: string;
  liftedIndex: string;
  rh2m: string;
  wind10mDir: string;
  wind10mSpeed: string;
  temp2m: string;
  precType: string;
}

function DateFormat(input: any) {
  let dateString = "";
  let currentDate = new Date();
  dateString = input.substring(0, input.length - 2);
  currentDate = new Date(
    dateString.slice(0, 4) +
      "-" +
      dateString.slice(4, 6) +
      "-" +
      dateString.slice(6)
  );

  return currentDate;
}

let CloudCoverPercentage: { [key: string]: any } = {
  1: "0%-6%",
  2: "6%-19%",
  3: "19%-31%",
  4: "31%-44%",
  5: "44%-56%",
  6: "56%-69%",
  7: "69%-81%",
  8: "81%-94%",
  9: "94%-100%",
};

//astronomical seeing, measured in arcseconds ("), refers to the degradation of the image of an
//astronomical object due to turbulent airflows in the Earth's atmosphere. A seeing of 1.0" is good
//enough for average astronomical sites.
let SeeingArcsecondRange: { [key: string]: any } = {
  1: `<0.5"`,
  2: `0.5"-0.75"`,
  3: `0.75"-1"`,
  4: `1"-1.25"`,
  5: `1.25"-1.5"`,
  6: `1.5"-2"`,
  7: `2"-2.5"`,
  8: `>2.5"`,
};

let TransparencyRange: { [key: string]: any } = {
  1: "<0.3",
  2: "0.3-0.4",
  3: "0.4-0.5",
  4: "0.5-0.6",
  5: "0.6-0.7",
  6: "0.7-0.85",
  7: "0.85-1",
  8: ">1",
  9: "94%-100%",
};

let LiftedIndexRange: { [key: string]: any } = {
  "-10": "<-7: Extremely unstable, violent thunderstorms, tornadoes possible",
  "-6": "-7 to -5: Very unstable, thunderstorms likely, some severe with lifting mechanism",
  "-4": "-5 to -3: Unstable, thunderstorms likely, some severe with lifting mechanism",
  "-1": "-3 to 0: Slightly unstable, thunderstorms possible, with lifting mechanism",
  2: "0 to 4: Mostly stable conditions, thunderstorms not likely",
  6: "4 to 8: Stable conditions, thunderstorms not likely",
  10: "8 to 11: Very stable conditions, thunderstorms not likely",
  15: ">11: Extremely stable conditions, thunderstorms highly unlikely",
};

let RelativeHumidityRange: { [key: string]: any } = {
  "-4": "0%-5%",
  "-3": "5%-10%",
  "-2": "10%-15%",
  "-1": "15%-20%",
  "0": "20%-25%",
  1: "25%-30%",
  2: "30%-35%",
  3: "30%-35%",
  4: "35%-40%",
  5: "40%-45%",
  6: "45%-50%",
  7: "50%-55%",
  8: "50%-55%",
  9: "55%-60%",
  10: "60%-65%",
  11: "65%-70%",
  12: "70%-75%",
  13: "75%-80%",
  14: "80%-85%",
  15: "85%-90%",
  16: "100%",
};

let WindDirRange: { [key: string]: any } = {
  N: "North",
  NE: "North East",
  E: "East",
  SE: "South East",
  S: "South",
  SW: "South West",
  W: "West",
  NW: "North West",
};
let WindSpeed: { [key: string]: any } = {
  1: "Below 0.3m/s (calm)",
  2: "0.3-3.4m/s (light)",
  3: "3.4-8.0m/s (moderate)",
  4: "8.0-10.8m/s (fresh)",
  5: "10.8-17.2m/s (strong)",
  6: "17.2-24.5m/s (gale)",
  7: "24.5-32.6m/s (storm)",
  8: "Over 32.6m/s (hurricane)",
};

interface newd {
  currentDate: string;
  timepoint: string;
  cloudcover: number;
  seeing: string;
  transparency: string;
  lifted_index: string;
  rh2m: string;
  wind10m: {
    direction: string;
    speed: string;
  };
  temp2m: string;
  prec_type: string;
}

function Weather({ value }: any) {
  const [weatherData, setWeatherData] = useState<WeatherData>();

  useEffect(() => {
    axios
      .get(
        `https://www.7timer.info/bin/astro.php?${value.prop}&ac=0&unit=metric&output=json&tzshift=0`
      )
      .then((result) => {
        const data = result.data;
        let dataObject: newd = data.dataseries[0];

        let weatherData = {
          currentDate: DateFormat(data.init).toDateString(),
          timePoint: parseInt(data.init.slice(8)) + dataObject.timepoint,
          cloudCover: CloudCoverPercentage[dataObject.cloudcover],
          seeing: SeeingArcsecondRange[dataObject.seeing],
          transparency: TransparencyRange[dataObject.transparency],
          liftedIndex: LiftedIndexRange[dataObject.lifted_index],
          rh2m: RelativeHumidityRange[dataObject.rh2m],
          wind10mDir: WindDirRange[dataObject.wind10m.direction],
          wind10mSpeed: WindSpeed[dataObject.wind10m.speed],
          temp2m: dataObject.temp2m,
          precType:
            dataObject.prec_type.charAt(0).toUpperCase() +
            dataObject.prec_type.slice(1),
        };
        setWeatherData(weatherData);
      });
  }, [value]);
  return (
    <div className="App-header">
      {weatherData && (
        <>
          <div style={{ fontSize: "50px" }}>{value.name}</div>
          <div style={{ fontSize: "75px" }}>{weatherData.temp2m}°C</div>
          <div>Precipitation Type: {weatherData.precType}</div>
          <div>{weatherData.currentDate}</div>
          <div>Time: {weatherData.timePoint}:00</div>
          <div>Astronomical Seeing: {weatherData.seeing}</div>
          <div>Transparency: {weatherData.transparency}</div>
          <div>Lifted Index: {weatherData.liftedIndex}</div>
          <div>Relative humidity at 2m: {weatherData.rh2m}</div>
          <div>Wind direction: {weatherData.wind10mDir}</div>
          <div>Wind speed: {weatherData.wind10mSpeed}</div>
          <div>Cloud cover: {weatherData.cloudCover}</div>
        </>
      )}
    </div>
  );
}

export default Weather;
