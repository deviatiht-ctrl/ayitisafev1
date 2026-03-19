import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, SafeAreaView, StatusBar, Alert, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from '../i18n/useTranslation';
import { colors, fonts } from '../theme';

const RELATIONSHIPS = ['family', 'friend', 'neighbor', 'colleague'];

export default function EmergencyContactsScreen({ navigation }) {
  const { t } = useTranslation();
  const [contacts, setContacts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('family');
  const [isPrimary, setIsPrimary] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    const data = await AsyncStorage.getItem('emergencyContacts');
    if (data) setContacts(JSON.parse(data));
  };

  const saveContacts = async (newContacts) => {
    await AsyncStorage.setItem('emergencyContacts', JSON.stringify(newContacts));
    setContacts(newContacts);
  };

  const openAddModal = () => {
    setEditingContact(null);
    setName('');
    setPhone('');
    setRelationship('family');
    setIsPrimary(contacts.length === 0);
    setModalVisible(true);
  };

  const openEditModal = (contact, index) => {
    setEditingContact(index);
    setName(contact.name);
    setPhone(contact.phone);
    setRelationship(contact.relationship);
    setIsPrimary(contact.isPrimary);
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert(t('error'), t('contactName') + ' & ' + t('contactPhone') + ' obligatwa');
      return;
    }
    let newContacts = [...contacts];
    const newContact = { name, phone, relationship, isPrimary };
    
    if (isPrimary) {
      newContacts = newContacts.map(c => ({ ...c, isPrimary: false }));
    }
    
    if (editingContact !== null) {
      newContacts[editingContact] = newContact;
    } else {
      if (newContacts.length >= 5) {
        Alert.alert(t('error'), t('maxContacts'));
        return;
      }
      newContacts.push(newContact);
    }
    
    saveContacts(newContacts);
    setModalVisible(false);
  };

  const handleDelete = (index) => {
    Alert.alert(t('deleteContact'), t('deleteConfirm'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('delete'),
        style: 'destructive',
        onPress: () => {
          const newContacts = contacts.filter((_, i) => i !== index);
          saveContacts(newContacts);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('emergencyContacts')}</Text>
        <TouchableOpacity onPress={openAddModal} style={styles.addBtn}>
          <Ionicons name="add" size={24} color={colors.accent} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {contacts.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={60} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>{t('noContacts')}</Text>
            <Text style={styles.emptyText}>{t('addFirst')}</Text>
            <TouchableOpacity style={styles.addFirstBtn} onPress={openAddModal}>
              <Ionicons name="add-circle" size={20} color="#FFF" />
              <Text style={styles.addFirstText}>{t('addContact')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.subtitle}>{t('maxContacts')}</Text>
            {contacts.map((contact, index) => (
              <TouchableOpacity
                key={index}
                style={styles.contactCard}
                onPress={() => openEditModal(contact, index)}
              >
                <View style={styles.contactIcon}>
                  <Ionicons name="person" size={24} color={colors.accent} />
                </View>
                <View style={styles.contactInfo}>
                  <View style={styles.contactHeader}>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    {contact.isPrimary && (
                      <View style={styles.primaryBadge}>
                        <Text style={styles.primaryText}>{t('primaryContact')}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.contactPhone}>{contact.phone}</Text>
                  <Text style={styles.contactRelation}>{t(contact.relationship)}</Text>
                </View>
                <TouchableOpacity onPress={() => handleDelete(index)} style={styles.deleteBtn}>
                  <Ionicons name="trash-outline" size={20} color={colors.danger} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingContact !== null ? t('edit') : t('addContact')}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>{t('contactName')}</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder={t('contactName')}
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.label}>{t('contactPhone')}</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="+509 XXXX-XXXX"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>{t('relationship')}</Text>
            <View style={styles.relationRow}>
              {RELATIONSHIPS.map((rel) => (
                <TouchableOpacity
                  key={rel}
                  style={[styles.relationBtn, relationship === rel && styles.relationBtnActive]}
                  onPress={() => setRelationship(rel)}
                >
                  <Text style={[styles.relationText, relationship === rel && styles.relationTextActive]}>
                    {t(rel)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.primaryRow}
              onPress={() => setIsPrimary(!isPrimary)}
            >
              <Ionicons
                name={isPrimary ? 'checkbox' : 'square-outline'}
                size={24}
                color={isPrimary ? colors.accent : '#9CA3AF'}
              />
              <Text style={styles.primaryLabel}>{t('primaryContact')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>{t('save')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E2E8F0',
  },
  backBtn: { padding: 4 },
  headerTitle: { fontFamily: fonts.semiBold, fontSize: 18, color: colors.primary },
  addBtn: { padding: 4 },
  scroll: { padding: 20, paddingBottom: 40 },
  subtitle: { fontFamily: fonts.regular, fontSize: 13, color: '#64748B', marginBottom: 16 },
  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyTitle: { fontFamily: fonts.semiBold, fontSize: 18, color: colors.primary, marginTop: 16 },
  emptyText: { fontFamily: fonts.regular, fontSize: 14, color: '#64748B', marginTop: 4 },
  addFirstBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.accent,
    paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, marginTop: 24,
  },
  addFirstText: { fontFamily: fonts.semiBold, fontSize: 14, color: '#FFF' },
  contactCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
    borderRadius: 14, padding: 16, marginBottom: 12,
  },
  contactIcon: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFF7ED',
    justifyContent: 'center', alignItems: 'center',
  },
  contactInfo: { flex: 1, marginLeft: 12 },
  contactHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  contactName: { fontFamily: fonts.semiBold, fontSize: 16, color: colors.primary },
  primaryBadge: { backgroundColor: colors.accent, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  primaryText: { fontFamily: fonts.medium, fontSize: 10, color: '#FFF' },
  contactPhone: { fontFamily: fonts.regular, fontSize: 14, color: '#64748B', marginTop: 2 },
  contactRelation: { fontFamily: fonts.regular, fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  deleteBtn: { padding: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontFamily: fonts.bold, fontSize: 20, color: colors.primary },
  label: { fontFamily: fonts.medium, fontSize: 13, color: '#64748B', marginTop: 12, marginBottom: 6 },
  input: {
    backgroundColor: '#F4F6F9', borderRadius: 12, padding: 14,
    fontFamily: fonts.regular, fontSize: 15, color: colors.primary,
  },
  relationRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  relationBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, backgroundColor: '#F4F6F9' },
  relationBtnActive: { backgroundColor: colors.accent },
  relationText: { fontFamily: fonts.medium, fontSize: 13, color: '#64748B' },
  relationTextActive: { color: '#FFF' },
  primaryRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 16 },
  primaryLabel: { fontFamily: fonts.regular, fontSize: 14, color: colors.primary },
  saveBtn: {
    backgroundColor: colors.accent, borderRadius: 14, height: 50,
    justifyContent: 'center', alignItems: 'center', marginTop: 24,
  },
  saveBtnText: { fontFamily: fonts.semiBold, fontSize: 16, color: '#FFF' },
});
