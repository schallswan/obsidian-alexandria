import json

def get_min_max_coordinates(geojson_file_path):
    """
    Extracts the minimum and maximum longitude and latitude from a GeoJSON file.

    Args:
        geojson_file_path (str): The path to the GeoJSON file.

    Returns:
        dict: A dictionary containing 'min_lon', 'max_lon', 'min_lat', 'max_lat',
              or None if the file is empty or invalid.
    """
    min_lon, max_lon = float('inf'), float('-inf')
    min_lat, max_lat = float('inf'), float('-inf')

    try:
        with open(geojson_file_path, 'r') as f:
            geojson_data = json.load(f)
    except FileNotFoundError:
        print(f"Error: File not found at {geojson_file_path}")
        return None
    except json.JSONDecodeError:
        print(f"Error: Invalid GeoJSON format in {geojson_file_path}")
        return None

    def _extract_coordinates(geometry):
        nonlocal min_lon, max_lon, min_lat, max_lat
        if 'coordinates' in geometry:
            coords = geometry['coordinates']
            geom_type = geometry['type']

            if geom_type == 'Point':
                lon, lat = coords[0], coords[1]
                min_lon = min(min_lon, lon)
                max_lon = max(max_lon, lon)
                min_lat = min(min_lat, lat)
                max_lat = max(max_lat, lat)
            elif geom_type in ['LineString', 'MultiPoint']:
                for coord_pair in coords:
                    lon, lat = coord_pair[0], coord_pair[1]
                    min_lon = min(min_lon, lon)
                    max_lon = max(max_lon, lon)
                    min_lat = min(min_lat, lat)
                    max_lat = max(max_lat, lat)
            elif geom_type in ['Polygon', 'MultiLineString']:
                for ring_or_line in coords:
                    for coord_pair in ring_or_line:
                        lon, lat = coord_pair[0], coord_pair[1]
                        min_lon = min(min_lon, lon)
                        max_lon = max(max_lon, lon)
                        min_lat = min(min_lat, lat)
                        max_lat = max(max_lat, lat)
            elif geom_type == 'MultiPolygon':
                for polygon in coords:
                    for ring in polygon:
                        for coord_pair in ring:
                            lon, lat = coord_pair[0], coord_pair[1]
                            min_lon = min(min_lon, lon)
                            max_lon = max(max_lon, lon)
                            min_lat = min(min_lat, lat)
                            max_lat = max(max_lat, lat)
            elif geom_type == 'GeometryCollection':
                for geom in coords:
                    _extract_coordinates(geom)

    if 'features' in geojson_data:
        for feature in geojson_data['features']:
            if 'geometry' in feature and feature['geometry'] is not None:
                _extract_coordinates(feature['geometry'])
    elif 'geometry' in geojson_data and geojson_data['geometry'] is not None:
        _extract_coordinates(geojson_data['geometry'])
    else:
        print("No valid geometries found in the GeoJSON data.")
        return None

    if min_lon == float('inf'):  # No coordinates were processed
        return None

    return {
        'min_lon': min_lon,
        'max_lon': max_lon,
        'min_lat': min_lat,
        'max_lat': max_lat
    }

# Get the min and max coordinates
bounds = get_min_max_coordinates("/Users/sarahhall-swan/Downloads/Bouleia Cells 2025-11-14-15-56.geojson")

if bounds:
    print(f"Minimum Longitude: {bounds['min_lon']}")
    print(f"Maximum Longitude: {bounds['max_lon']}")
    print(f"Minimum Latitude: {bounds['min_lat']}")
    print(f"Maximum Latitude: {bounds['max_lat']}")
else:
    print("Could not determine bounds.")
