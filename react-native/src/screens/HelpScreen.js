import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../i18n/useTranslation';
import { colors, fonts } from '../theme';

export default function HelpScreen({ navigation }) {
  const { t } = useTranslation();
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    { q: t('faq1Q'), a: t('faq1A') },
    { q: t('faq2Q'), a: t('faq2A') },
    { q: t('faq3Q'), a: t('faq3A') },
    { q: t('faq4Q'), a: t('faq4A') },
  ];

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('helpSupport')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* FAQ Section */}
        <Text style={styles.sectionTitle}>{t('faq')}</Text>
        <View style={styles.card}>
          {faqs.map((faq, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.faqItem, index > 0 && styles.faqBorder]}
              onPress={() => toggleFaq(index)}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{faq.q}</Text>
                <Ionicons
                  name={expandedFaq === index ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#9CA3AF"
                />
              </View>
              {expandedFaq === index && (
                <Text style={styles.faqAnswer}>{faq.a}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Contact Support */}
        <Text style={styles.sectionTitle}>{t('contactSupport')}</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.contactRow}
            onPress={() => Linking.openURL('mailto:support@ayitisafe.com')}
          >
            <View style={styles.contactIcon}>
              <Ionicons name="mail" size={22} color={colors.accent} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>{t('supportEmail')}</Text>
            </View>
            <Ionicons name="open-outline" size={18} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.contactRow, styles.contactBorder]}
            onPress={() => Linking.openURL('https://wa.me/50912345678')}
          >
            <View style={[styles.contactIcon, { backgroundColor: '#DCF8C6' }]}>
              <Ionicons name="logo-whatsapp" size={22} color="#25D366" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>WhatsApp</Text>
              <Text style={styles.contactValue}>+509 1234-5678</Text>
            </View>
            <Ionicons name="open-outline" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={colors.accent} />
          <Text style={styles.infoText}>
            Nou disponib 24/7 pou ede ou. Tanpri voye yon mesaj ak detay pwoblèm ou a.
          </Text>
        </View>
      </ScrollView>
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
  scroll: { padding: 20, paddingBottom: 40 },
  sectionTitle: { fontFamily: fonts.semiBold, fontSize: 16, color: colors.primary, marginBottom: 12, marginTop: 8 },
  card: {
    backgroundColor: '#FFF', borderRadius: 16, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  faqItem: { padding: 16 },
  faqBorder: { borderTopWidth: 1, borderTopColor: '#F4F6F9' },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQuestion: { fontFamily: fonts.medium, fontSize: 14, color: colors.primary, flex: 1, paddingRight: 8 },
  faqAnswer: { fontFamily: fonts.regular, fontSize: 14, color: '#64748B', marginTop: 10, lineHeight: 20 },
  contactRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  contactBorder: { borderTopWidth: 1, borderTopColor: '#F4F6F9' },
  contactIcon: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF7ED',
    justifyContent: 'center', alignItems: 'center',
  },
  contactInfo: { flex: 1, marginLeft: 12 },
  contactLabel: { fontFamily: fonts.regular, fontSize: 12, color: '#64748B' },
  contactValue: { fontFamily: fonts.medium, fontSize: 15, color: colors.primary, marginTop: 2 },
  infoBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: '#FFF7ED',
    borderRadius: 12, padding: 14,
  },
  infoText: { fontFamily: fonts.regular, fontSize: 13, color: colors.primary, flex: 1, lineHeight: 18 },
});
