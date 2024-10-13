import React, { useEffect, useRef } from 'react';

const HarvardMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    const initializeMap = () => {
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 42.3744, lng: -71.1169 }, // Harvard University coordinates
        zoom: 14,
        mapId: 'DEMO_MAP_ID', // Optional: Replace with your own Map ID
      });

      const locations = [
        { lat: 42.3770, lng: -71.1167, title: 'Harvard Yard' },
        { lat: 42.3736, lng: -71.1097, title: 'Harvard Art Museums' },
        { lat: 42.3761, lng: -71.1122, title: 'Harvard Science Center' },
      ];

      locations.forEach((location) => {
        // Create an <img> element for the flag icon
        const flagIcon = document.createElement('img');
        flagIcon.src = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
        flagIcon.className = 'flag-icon';

        const marker = new google.maps.marker.AdvancedMarkerElement({
          position: location,
          title: location.title,
          map: map,
          content: flagIcon, // Pass the DOM node directly
        });

        marker.addListener('click', () => {
          alert(`You clicked on ${location.title}`);
        });
      });
    };

    if (window.google) {
      initializeMap();
    } else {
      window.initMap = initializeMap;
    }
  }, []);

  return (
    <div
      ref={mapRef}
      style={{ width: '80vw', height: '100vh', position: 'right-align', top: 0, left: 0 }}
    />
  );
};

export default HarvardMap;
