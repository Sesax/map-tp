import React from 'react'
import GoogleMapReact from 'google-map-react'

import './map.css'

const Map = ({ location, zoomLevel }) => {
    return (
        <div className="map">
            <div className="google-map">
                <GoogleMapReact
                    bootstrapURLKeys={{ key: 'AIzaSyCg0tVV3PBko9QcqK4qqxkM5qSFh4DCHnE' }}
                    defaultCenter={location}
                    defaultZoom={zoomLevel}
                >
                </GoogleMapReact>
            </div>
        </div>
    );
}

export default Map