import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';
import MapView, { Marker, Polygon, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Zone, zones, safeRoutes } from '../lib/mock-data';

export function InteractiveMap({
    onZoneSelect,
    selectedZone,
    showRoute,
    activeFilter,
}: {
    onZoneSelect: (zone: Zone) => void;
    selectedZone: Zone | null;
    showRoute: boolean;
    activeFilter: string;
}) {
    const mapRef = useRef<MapView>(null);

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'critical': return 'rgba(239, 68, 68, 0.4)'; // #EF4444
            case 'warning': return 'rgba(245, 158, 11, 0.4)'; // #F59E0B
            case 'safe': return 'rgba(34, 197, 94, 0.4)'; // #22C55E
            default: return 'rgba(156, 163, 175, 0.4)';
        }
    };

    const getRiskStrokeColor = (risk: string) => {
        switch (risk) {
            case 'critical': return '#EF4444';
            case 'warning': return '#F59E0B';
            case 'safe': return '#22C55E';
            default: return '#9CA3AF';
        }
    };

    const filteredZones = zones.filter((zone) => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'danger') return zone.risk === 'critical' || zone.risk === 'warning';
        if (activeFilter === 'safe') return zone.risk === 'safe';
        return true; // routes
    });

    const activeRoute = safeRoutes[0];

    useEffect(() => {
        if (selectedZone && mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: selectedZone.center[0],
                longitude: selectedZone.center[1],
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            });
        }
    }, [selectedZone]);

    const initialRegion = {
        latitude: 18.5392,
        longitude: -72.3388,
        latitudeDelta: 0.2,
        longitudeDelta: 0.2,
    };

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
                initialRegion={initialRegion}
                customMapStyle={mapStyle}
                showsUserLocation={true}
            >
                {activeFilter !== 'routes' &&
                    filteredZones.map((zone) => (
                        <Polygon
                            key={zone.id}
                            coordinates={zone.coordinates.map((c) => ({ latitude: c[0], longitude: c[1] }))}
                            fillColor={getRiskColor(zone.risk)}
                            strokeColor={getRiskStrokeColor(zone.risk)}
                            strokeWidth={2}
                            tappable
                            onPress={() => onZoneSelect(zone)}
                        />
                    ))}

                {selectedZone && (
                    <Marker
                        coordinate={{ latitude: selectedZone.center[0], longitude: selectedZone.center[1] }}
                        title={selectedZone.name}
                        description={selectedZone.lastIncident}
                    />
                )}

                {(showRoute || activeFilter === 'routes') && (
                    <Polyline
                        coordinates={activeRoute.coordinates.map((c) => ({ latitude: c[0], longitude: c[1] }))}
                        strokeColor="#3B82F6"
                        strokeWidth={4}
                    />
                )}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

const mapStyle = [
    { "elementType": "geometry", "stylers": [{ "color": "#242f3e" }] },
    { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] },
    { "elementType": "labels.text.stroke", "stylers": [{ "color": "#242f3e" }] },
    { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
    { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#38414e" }] },
    { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#212a37" }] },
    { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#9ca5b3" }] },
    { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#746855" }] },
    { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#1f2835" }] },
    { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#f3d19c" }] },
    { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#2f3948" }] },
    { "featureType": "transit.station", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
    { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#17263c" }] },
    { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#515c6d" }] },
    { "featureType": "water", "elementType": "labels.text.stroke", "stylers": [{ "color": "#17263c" }] }
];
