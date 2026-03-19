import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import MapView, { Polygon, Polyline, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { BlurView } from 'expo-blur';
import { colors, fonts, spacing, borderRadius, shadows } from '../theme';
import { zones, safeRouteCoordinates, alerts } from '../data/mockData';
import { useAppStore } from '../store/appStore';
import ZoneInfoCard from '../components/ZoneInfoCard';
import LiveAlertBanner from '../components/LiveAlertBanner';
import FilterChips from '../components/FilterChips';

const { width, height } = Dimensions.get('window');

const INITIAL_REGION = {
  latitude: 18.9712,
  longitude: -72.2852,
  latitudeDelta: 1.2,
  longitudeDelta: 1.2,
};

const PORT_AU_PRINCE = {
  latitude: 18.5392,
  longitude: -72.3288,
  latitudeDelta: 0.15,
  longitudeDelta: 0.15,
};

export default function MapScreen({ navigation }) {
  const mapRef = useRef(null);
  const { activeFilter, setActiveFilter, selectedZone, setSelectedZone, showAlertBanner, setShowAlertBanner } = useAppStore();
  const [showRoute, setShowRoute] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Animate to Port-au-Prince on mount
    const timer = setTimeout(() => {
      mapRef.current?.animateCamera({
        center: { latitude: PORT_AU_PRINCE.latitude, longitude: PORT_AU_PRINCE.longitude },
        pitch: 50,
        heading: 0,
        altitude: 3000,
        zoom: 13,
      }, { duration: 2000 });
    }, 500);

    // Request location permission
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords);
      }
    })();

    return () => clearTimeout(timer);
  }, []);

  // Auto-dismiss alert banner
  useEffect(() => {
    if (!showAlertBanner) {
      const timer = setTimeout(() => setShowAlertBanner(true), 30000);
      return () => clearTimeout(timer);
    }
  }, [showAlertBanner]);

  const filteredZones = zones.filter((zone) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'danger') return zone.risk === 'critical';
    if (activeFilter === 'safe') return zone.risk === 'safe';
    if (activeFilter === 'routes') return false;
    return true;
  });

  const getZoneOpacity = (risk) => {
    switch (risk) {
      case 'critical': return 0.35;
      case 'warning': return 0.3;
      case 'safe': return 0.25;
      default: return 0.3;
    }
  };

  const handleZonePress = (zone) => {
    setSelectedZone(zone);
    setShowRoute(false);
    mapRef.current?.animateToRegion({
      ...zone.center,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    }, 500);
  };

  const handleViewRoute = () => {
    setShowRoute(true);
    setSelectedZone(null);
  };

  return (
    <View style={styles.container}>
      {/* Live Alert Banner */}
      {showAlertBanner && (
        <LiveAlertBanner
          message="Alèt — Tire tande nan Delmas 18"
          severity="critical"
          onDismiss={() => setShowAlertBanner(false)}
        />
      )}

      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : null}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass
        showsBuildings
        showsTraffic
        mapType="standard"
      >
        {/* Zone Polygons */}
        {filteredZones.map((zone) => (
          <Polygon
            key={zone.id}
            coordinates={zone.coordinates}
            fillColor={`${zone.color}${Math.round(getZoneOpacity(zone.risk) * 255).toString(16).padStart(2, '0')}`}
            strokeColor={zone.color}
            strokeWidth={2}
            tappable
            onPress={() => handleZonePress(zone)}
          />
        ))}

        {/* Zone Markers */}
        {filteredZones.map((zone) => (
          <Marker
            key={`marker-${zone.id}`}
            coordinate={zone.center}
            onPress={() => handleZonePress(zone)}
          >
            <View style={[styles.markerContainer, { borderColor: zone.color }]}>
              <View style={[styles.markerDot, { backgroundColor: zone.color }]} />
              <Text style={styles.markerBadge}>{zone.incidentCount}</Text>
            </View>
          </Marker>
        ))}

        {/* Safe Route Polyline */}
        {(showRoute || activeFilter === 'routes') && (
          <Polyline
            coordinates={safeRouteCoordinates}
            strokeColor={colors.accent}
            strokeWidth={4}
            lineDashPattern={[8, 6]}
            lineCap="round"
          />
        )}
      </MapView>

      {/* Top Bar */}
      <View style={styles.topBar}>
        {/* Logo */}
        <View style={styles.logo}>
          <Text style={styles.logoText}>AyitiSafe</Text>
        </View>

        {/* Search Bar */}
        <BlurView intensity={80} style={styles.searchContainer}>
          <Ionicons name="search" size={18} color={colors.textLight} />
          <TextInput
            placeholder="Trouve yon wout san danje..."
            placeholderTextColor={colors.textLight}
            style={styles.searchInput}
          />
        </BlurView>

        {/* Icons */}
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => navigation.navigate('Alerts')}
        >
          <Ionicons name="notifications-outline" size={22} color={colors.text} />
          <View style={styles.notificationDot} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name="person-outline" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <FilterChips
          activeFilter={activeFilter}
          onSelect={setActiveFilter}
        />
      </View>

      {/* Zoom Controls */}
      <View style={styles.zoomControls}>
        <TouchableOpacity
          style={styles.zoomButton}
          onPress={() => {
            mapRef.current?.getCamera().then((camera) => {
              mapRef.current?.animateCamera({ ...camera, zoom: camera.zoom + 1 });
            });
          }}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.zoomButton}
          onPress={() => {
            mapRef.current?.getCamera().then((camera) => {
              mapRef.current?.animateCamera({ ...camera, zoom: camera.zoom - 1 });
            });
          }}
        >
          <Ionicons name="remove" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Report')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Zone Info Card */}
      {selectedZone && (
        <ZoneInfoCard
          zone={selectedZone}
          onClose={() => setSelectedZone(null)}
          onViewRoute={handleViewRoute}
          onReport={() => navigation.navigate('Report')}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  topBar: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logo: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    ...shadows.medium,
  },
  logoText: {
    color: '#FFFFFF',
    fontFamily: fonts.bold,
    fontSize: 14,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.text,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.small,
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
  },
  filterContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 110 : 90,
    left: spacing.lg,
    right: spacing.lg,
  },
  zoomControls: {
    position: 'absolute',
    right: spacing.lg,
    top: '50%',
    transform: [{ translateY: -50 }],
    gap: spacing.sm,
  },
  zoomButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium,
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.large,
  },
  markerContainer: {
    width: 40,
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  markerBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.accent,
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: fonts.bold,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
});
