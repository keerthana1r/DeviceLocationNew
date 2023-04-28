let map;
let userMarker;
const aedIcon = "aed-icon.png";
const aedIconGreen = "aed-icon-green.png";

const allLocations = [
  {
    lat: 28.407945984784263,
    lng: 77.1165467236218,
    name: "AED 1",
    status: "Working",
    address:
      "Reception, 3A, 3rd Floor, Optum Global Advantage, International Tech Park Gurugram",
  },
  {
    lat: 28.40726040753197,
    lng: 77.11703320021923,
    name: "AED 2",
    status: "Working",
    address:
      "Caferaria, 5th Floor, Stryker Global Technology Center, International Tech Park Gurugram",
  },
  {
    lat: 28.40625064816643,
    lng: 77.11638947005999,
    name: "AED 3",
    status: "Working",
    address:
      "Reception, Ground Floor, ITPG Sports Arena, International Tech Park Gurugram",
  },
  {
    lat: 28.40601472169394,
    lng: 77.11425443169855,
    name: "AED 4",
    status: "Working",
    address: "Reception, Ground Floor, Citadens Paras Square, Alahawas",
  },
  {
    lat: 28.40857213663377,
    lng: 77.11377163407913,
    name: "AED 5",
    status: "Not Working",
    address:
      "Main Entrance, Ground Floor, Arcade Cricket Academy, Ireo Cricket Ground",
  },
  {
    lat: 28.40857213663377,
    lng: 77.1138038205871,
    name: "AED 6",
    status: "Not Working",
    address: "Main entrance, Ground Floor, Phoenix Tennis Academy, Alahawas",
  },
  {
    lat: 28.40924215026731,
    lng: 77.11726923461093,
    name: "AED 7",
    status: "Not Working",
    address:
      "Reception,4th Floor, Johnsons Control, International Tech Park Gurugram",
  },
  {
    lat: 28.410383994722114,
    lng: 77.11577792640871,
    name: "AED 8",
    status: "Not Working",
    address:
      "Cafetaria, 5A, 5rd Floor, Software one India, International Tech Park Gurugram",
  },
  {
    lat: 13.35209307245631,
    lng: 74.79333562540025,
    name: "AED 9",
    status: "Working",
    address:
      "Front Entrance, Ground Floor, Academic Block 1, Manipal Institute of Technology",
  },
  {
    lat: 13.351743299193053,
    lng: 74.79328923955707,
    name: "AED 10",
    status: "Working",
    address:
      "Reception, Ground Floor, MIT Library, Manipal Institute of Technology",
  },
  {
    lat: 13.351367198344537,
    lng: 74.79270555103045,
    name: "AED 11",
    status: "Working",
    address:
      "New Lecture Hall, 1st Floor, Academic Block 5, Manipal Institute of Technology",
  },
  {
    lat: 13.353664076063442,
    lng: 74.78981318695902,
    name: "AED 12",
    status: "Working",
    address:
      "Main Entrance, Ground Floor, Emergency Unit Manipal, Kasturba Hospital Manipal",
  },
  {
    lat: 13.354114037719183,
    lng: 74.79005392256965,
    name: "AED 13",
    status: "Not Working",
    address:
      "Front Entrance,Ground Floor, Manipal College of Dental Sciences, MAHE",
  },
  {
    lat: 13.3530168694712,
    lng: 74.79030732847558,
    name: "AED 14",
    status: "Not Working",
    address: "Front Entrance, Ground Floor, Canara Mall, Manipal",
  },
  {
    lat: 13.355544047292376,
    lng: 74.78958512163997,
    name: "AED 15",
    status: "Not Working",
    address: "Reception, Ground Floor, Marena Sports Center, MAHE",
  },
  {
    lat: 13.35343601298784,
    lng: 74.79344956172072,
    name: "AED 16",
    status: "Not Working",
    address:
      "Cafetaria, 2nd Floor, Academic Block 3, Manipal Institute of Technology",
  },
  // {
  //   lat: 10.016599071352845,
  //   lng: 76.36126622875468,
  //   name: "AED 17",
  //   status: "Working",
  //   address: "Kakkanad Address 1",
  // },
  // {
  //   lat: 10.015706926912236,
  //   lng: 76.35865699384245,
  //   name: "AED 18",
  //   status: "Working",
  //   address: "Kakkanad Address 2",
  // },
  // {
  //   lat: 10.01704985473074,
  //   lng: 76.35975579684184,
  //   name: "AED 19",
  //   status: "Not Working",
  //   address: "Kakkanad Address 3",
  // },
  // {
  //   lat: 10.014550547744108,
  //   lng: 76.36141793592989,
  //   name: "AED 20",
  //   status: "Not Working",
  //   address: "Kakkanad Address 4",
  // },
];

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    mapTypeControlOptions: {
      position: google.maps.ControlPosition.LEFT_BOTTOM,
    },
    center: { lat: 28.4089, lng: 77.1162 },
    zoom: 15,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
    ],
  });

  createMarkers(allLocations);
  requestUserLocation();
  createLocationControl(map);
}

function createMarkers(locations) {
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer({ map: map });

  locations.forEach((location) => {
    const marker = new google.maps.Marker({
      position: new google.maps.LatLng(location.lat, location.lng),
      map: map,
      icon: location.status == "Working" ? aedIconGreen : aedIcon,
    });

    marker.addListener("click", () => {
      if (userMarker) {
        const userLocation = userMarker.getPosition();
        const destination = { lat: location.lat, lng: location.lng };

        Promise.all([
          getTravelTime(
            directionsService,
            userLocation,
            destination,
            google.maps.TravelMode.WALKING,
            directionsRenderer
          ),
          getTravelTime(
            directionsService,
            userLocation,
            destination,
            google.maps.TravelMode.DRIVING,
            directionsRenderer
          ),
        ]).then(([walkingDuration, drivingDuration]) => {
          const infoWindowContent = `
            <h3>${location.name}</h3>
            <p style="color: ${
              location.status === "Working" ? "green" : "red"
            }">Status: <span >${location.status}</span></p>
            <p>Address: ${location.address}</p>
            <p>&#x1F6B6; Time to reach (walking): ${walkingDuration}</p>
            <p>&#x1F697; Time to reach (driving): ${drivingDuration}</p>`;
          const infoWindow = new google.maps.InfoWindow({
            content: infoWindowContent,
          });

          infoWindow.open(map, marker);
        });
      }
    });
  });
}

function getTravelTime(
  directionsService,
  origin,
  destination,
  travelMode,
  directionsRenderer
) {
  return new Promise((resolve, reject) => {
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: travelMode,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          const duration = result.routes[0].legs[0].duration.text;
          if (travelMode === google.maps.TravelMode.WALKING) {
            directionsRenderer.setDirections(result);
          }
          resolve(duration);
        } else {
          reject(`Directions request failed due to ${status}`);
        }
      }
    );
  });
}

function requestUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showUserLocation, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    });
  } else {
    alert("Geolocation is not supported by your browser.");
  }
}
function showUserLocation(position) {
  const userLocation = {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
  };

  if (userMarker) {
    userMarker.setMap(null);
  }

  userMarker = new google.maps.Marker({
    position: userLocation,
    map: map,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: "#4285F4",
      fillOpacity: 1,
      strokeColor: "white",
      strokeWeight: 1,
      scale: 7,
    },
    zIndex: google.maps.Marker.MAX_ZINDEX + 1,
  });

  map.panTo(userLocation);
}

function handleError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      alert("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occurred.");
      break;
  }
}

function createLocationControl(map) {
  const locationControlDiv = document.createElement("div");
  locationControlDiv.id = "location-control";
  locationControlDiv.title = "Center map on your location";

  locationControlDiv.addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          map.panTo(userLocation);
        },
        (error) => {
          alert("Error: " + error.message);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  });

  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(
    locationControlDiv
  );
}
