import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, borderRadius } from '../theme';

const typeIcons = {
  shooting: 'flame',
  kidnapping: 'person-remove',
  accident: 'car',
  barricade: 'warning',
  protest: 'people',
  patrol: 'shield-checkmark',
  road_hazard: 'alert-circle',
  flood: 'water',
};

const severityColors = {
  critical: { bg: 'rgba(239,68,68,0.08)', border: colors.danger, badge: colors.danger },
  warning: { bg: 'rgba(245,158,11,0.08)', border: colors.warning, badge: colors.warning },
  safe: { bg: 'rgba(34,197,94,0.08)', border: colors.safe, badge: colors.safe },
};

const severityLabels = {
  critical: 'KRITIK',
  warning: 'ATANSYON',
  safe: 'SEKIRITE',
};

export default function AlertCard({ alert, onViewOnMap, onShare, style }) {
  const sev = severityColors[alert.severity] || severityColors.warning;
  const icon = typeIcons[alert.type] || 'alert-circle';
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const hasPhotos = alert.photos && alert.photos.length > 0;

  const openPhoto = (photo) => {
    setSelectedPhoto(photo);
    setShowPhotoModal(true);
  };

  return (
    <View style={[styles.card, { backgroundColor: sev.bg, borderLeftColor: sev.border }, style]}>
      <View style={styles.row}>
        {/* Icon */}
        <View style={[styles.iconCircle, { backgroundColor: sev.border + '18' }]}>
          <Ionicons name={icon} size={20} color={sev.border} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={2}>{alert.title}</Text>
            <View style={[styles.badge, { backgroundColor: sev.badge }]}>
              <Text style={styles.badgeText}>{severityLabels[alert.severity]}</Text>
            </View>
          </View>

          <View style={styles.locationRow}>
            <Ionicons name="location" size={12} color={colors.textLight} />
            <Text style={styles.locationText}>{alert.location}, {alert.street}</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaText}>Poste {alert.time}</Text>
            <View style={styles.aiRow}>
              <Ionicons name="sparkles" size={12} color={colors.accent} />
              <Text style={[styles.metaText, { color: colors.accent }]}>IA: {alert.aiScore}%</Text>
            </View>
          </View>

          {/* Photos Section */}
          {hasPhotos && (
            <View style={styles.photosRow}>
              {alert.photos.slice(0, 3).map((photo, index) => (
                <TouchableOpacity key={index} onPress={() => openPhoto(photo)}>
                  <Image source={{ uri: photo }} style={styles.photoThumb} />
                </TouchableOpacity>
              ))}
              {alert.photos.length > 3 && (
                <View style={styles.morePhotos}>
                  <Text style={styles.morePhotosText}>+{alert.photos.length - 3}</Text>
                </View>
              )}
              <View style={styles.photosBadge}>
                <Ionicons name="camera" size={10} color="#FFF" />
                <Text style={styles.photosBadgeText}>{alert.photos.length}</Text>
              </View>
            </View>
          )}

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionBtn} onPress={onViewOnMap} activeOpacity={0.7}>
              <Ionicons name="map-outline" size={14} color={colors.primary} />
              <Text style={styles.actionText}>Wè sou Kat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={onShare} activeOpacity={0.7}>
              <Ionicons name="share-outline" size={14} color={colors.primary} />
              <Text style={styles.actionText}>Pataje Alèt</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Photo Modal */}
      <Modal visible={showPhotoModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.closeModalBtn} 
            onPress={() => setShowPhotoModal(false)}
          >
            <Ionicons name="close-circle" size={36} color="#FFF" />
          </TouchableOpacity>
          {selectedPhoto && (
            <Image 
              source={{ uri: selectedPhoto }} 
              style={styles.fullPhoto} 
              resizeMode="contain"
            />
          )}
          {hasPhotos && (
            <ScrollView 
              horizontal 
              style={styles.photoStrip}
              showsHorizontalScrollIndicator={false}
            >
              {alert.photos.map((photo, index) => (
                <TouchableOpacity key={index} onPress={() => setSelectedPhoto(photo)}>
                  <Image 
                    source={{ uri: photo }} 
                    style={[
                      styles.stripThumb,
                      selectedPhoto === photo && styles.stripThumbActive
                    ]} 
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    padding: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: 4,
  },
  title: {
    flex: 1,
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.text,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: '#FFFFFF',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  locationText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textLight,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  aiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textLight,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: 32,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFFFF',
  },
  actionText: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.primary,
  },
  photosRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.md,
    position: 'relative',
  },
  photoThumb: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  morePhotos: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  morePhotosText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: '#FFF',
  },
  photosBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.accent,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  photosBadgeText: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: '#FFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeModalBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  fullPhoto: {
    width: '90%',
    height: '60%',
  },
  photoStrip: {
    position: 'absolute',
    bottom: 40,
    paddingHorizontal: 20,
  },
  stripThumb: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  stripThumbActive: {
    borderColor: colors.accent,
  },
});
