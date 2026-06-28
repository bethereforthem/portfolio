import { LayersControl, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import '../lib/leafletIcons'

const { BaseLayer } = LayersControl

const LAYERS = [
  {
    name: 'Street',
    checked: true,
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  {
    name: 'Satellite',
    checked: false,
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution:
      '&copy; <a href="https://www.esri.com/">Esri</a>, Maxar, Earthstar Geographics',
  },
  {
    name: 'Terrain',
    checked: false,
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Style &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
  },
  {
    name: 'Dark',
    checked: false,
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
]

export default function LocationMap({ lat, lng, label, zoom = 13, className = 'w-full h-72 rounded-xl' }) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={zoom}
      scrollWheelZoom={false}
      attributionControl={false}
      className={className}
      style={{ position: 'relative', zIndex: 0 }}
    >
      <LayersControl position="topright">
        {LAYERS.map((layer) => (
          <BaseLayer key={layer.name} checked={layer.checked} name={layer.name}>
            <TileLayer attribution={layer.attribution} url={layer.url} />
          </BaseLayer>
        ))}
      </LayersControl>

      <Marker position={[lat, lng]}>
        <Popup>
          <strong>{label}</strong>
        </Popup>
      </Marker>
    </MapContainer>
  )
}
