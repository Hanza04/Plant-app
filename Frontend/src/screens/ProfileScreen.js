import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Switch,
    ScrollView, Alert, Platform, StatusBar, Image
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout, logoutUser } from '../redux/slices/authSlice';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const ProfileScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [avatarUri, setAvatarUri] = useState(user?.avatarUri || null);

    const userName = user?.username || user?.full_name || user?.name || 'Guest User';
    const userEmail = user?.email || 'guest@leafdoctor.com';
    const userInitials = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    const handleEditAvatar = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission required', 'Please allow access to your photos.');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });
        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setAvatarUri(uri);
            try {
                if (user?.uid) {
                    await updateDoc(doc(db, 'users', user.uid), { avatarUri: uri });
                }
            } catch (e) {
                console.log('Avatar update error:', e);
            }
        }
    };

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout', style: 'destructive',
                onPress: async () => {
                    await dispatch(logoutUser());
                    dispatch(logout());
                }
            }
        ]);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1B5E20" />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

                {/* ═══════════════════════════════════════
                    PROFILE CARD — improved
                ═══════════════════════════════════════ */}
                <View style={styles.profileCard}>

                    {/* Tall green banner */}
                    <LinearGradient
                        colors={['#1B5E20', '#2E7D32', '#43A047']}
                        style={styles.cardBanner}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        {/* Decorative blobs */}
                        <View style={styles.dec1} />
                        <View style={styles.dec2} />
                        <View style={styles.dec3} />

                        {/* Back button top-left */}
                        {navigation?.canGoBack() && (
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                                style={styles.backBtn}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="arrow-back" size={20} color="#fff" />
                            </TouchableOpacity>
                        )}

                        {/* Title centered */}
                        <Text style={styles.bannerTitle}>Profile</Text>
                    </LinearGradient>

                    {/* Avatar — larger, bolder ring */}
                    <TouchableOpacity
                        style={styles.avatarRing}
                        onPress={handleEditAvatar}
                        activeOpacity={0.9}
                    >
                        {avatarUri ? (
                            <Image source={{ uri: avatarUri }} style={styles.avatarImg} />
                        ) : (
                            <LinearGradient
                                colors={['#43A047', '#1B5E20']}
                                style={styles.avatarFallback}
                            >
                                <Text style={styles.avatarInitials}>{userInitials}</Text>
                            </LinearGradient>
                        )}
                        <View style={styles.cameraChip}>
                            <Ionicons name="camera" size={13} color="#fff" />
                        </View>
                    </TouchableOpacity>

                    {/* Name + email */}
                    <Text style={styles.userName}>{userName}</Text>
                    <Text style={styles.userEmail}>{userEmail}</Text>

                    {/* Member badge pill */}
                    <View style={styles.memberBadge}>
                        <Ionicons name="leaf" size={12} color="#2E7D32" />
                        <Text style={styles.memberBadgeText}>LeafDoctor Member</Text>
                    </View>

                    {/* Stats row */}
                    <View style={styles.statsRow}>
                        <View style={styles.statCol}>
                            <View style={[styles.statIcon, { backgroundColor: '#E8F5E9' }]}>
                                <Ionicons name="shield-checkmark" size={18} color="#2E7D32" />
                            </View>
                            <Text style={styles.statVal}>Active</Text>
                            <Text style={styles.statLbl}>Status</Text>
                        </View>
                        <View style={styles.statLine} />
                        <View style={styles.statCol}>
                            <View style={[styles.statIcon, { backgroundColor: '#FFFDE7' }]}>
                                <Ionicons name="star" size={18} color="#F9A825" />
                            </View>
                            <Text style={styles.statVal}>Free</Text>
                            <Text style={styles.statLbl}>Plan</Text>
                        </View>
                        <View style={styles.statLine} />
                        <View style={styles.statCol}>
                            <View style={[styles.statIcon, { backgroundColor: '#E3F2FD' }]}>
                                <Ionicons name="notifications" size={18} color="#1976D2" />
                            </View>
                            <Text style={styles.statVal}>On</Text>
                            <Text style={styles.statLbl}>Alerts</Text>
                        </View>
                    </View>
                </View>

                {/* Account Section */}
                <Text style={styles.sectionLabel}>ACCOUNT</Text>
                <View style={styles.menuCard}>
                    <TouchableOpacity style={styles.menuRow} onPress={() => navigation.navigate('EditProfile')} activeOpacity={0.7}>
                        <View style={[styles.menuIcon, { backgroundColor: '#E8F5E9' }]}>
                            <Ionicons name="person-outline" size={18} color="#2E7D32" />
                        </View>
                        <View style={styles.menuTexts}>
                            <Text style={styles.menuTitle}>Edit Profile</Text>
                            <Text style={styles.menuSub}>Update your name & info</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color="#C8E6C9" />
                    </TouchableOpacity>

                    <View style={styles.menuDivider} />

                    <View style={styles.menuRow}>
                        <View style={[styles.menuIcon, { backgroundColor: '#E3F2FD' }]}>
                            <Ionicons name="notifications-outline" size={18} color="#1976D2" />
                        </View>
                        <View style={styles.menuTexts}>
                            <Text style={styles.menuTitle}>Notifications</Text>
                            <Text style={styles.menuSub}>{notificationsEnabled ? 'Enabled' : 'Disabled'}</Text>
                        </View>
                        <Switch
                            value={notificationsEnabled}
                            onValueChange={setNotificationsEnabled}
                            trackColor={{ false: '#E0E0E0', true: '#A5D6A7' }}
                            thumbColor={notificationsEnabled ? '#2E7D32' : '#BDBDBD'}
                        />
                    </View>
                </View>

                {/* Preferences Section */}
                <Text style={styles.sectionLabel}>PREFERENCES</Text>
                <View style={styles.menuCard}>
                    <TouchableOpacity style={styles.menuRow} onPress={() => navigation.navigate('HelpCenter')} activeOpacity={0.7}>
                        <View style={[styles.menuIcon, { backgroundColor: '#FFF3E0' }]}>
                            <Ionicons name="help-circle-outline" size={18} color="#F57C00" />
                        </View>
                        <View style={styles.menuTexts}>
                            <Text style={styles.menuTitle}>Help & Support</Text>
                            <Text style={styles.menuSub}>FAQs and contact us</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color="#C8E6C9" />
                    </TouchableOpacity>

                    <View style={styles.menuDivider} />

                    <TouchableOpacity style={styles.menuRow} onPress={() => navigation.navigate('About')} activeOpacity={0.7}>
                        <View style={[styles.menuIcon, { backgroundColor: '#E0F7FA' }]}>
                            <Ionicons name="information-circle-outline" size={18} color="#0097A7" />
                        </View>
                        <View style={styles.menuTexts}>
                            <Text style={styles.menuTitle}>About LeafDoctor</Text>
                            <Text style={styles.menuSub}>Version 1.0.0</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color="#C8E6C9" />
                    </TouchableOpacity>
                </View>

                {/* Logout */}
                <TouchableOpacity style={styles.logoutRow} onPress={handleLogout} activeOpacity={0.8}>
                    <View style={[styles.menuIcon, { backgroundColor: '#FFEBEE' }]}>
                        <Ionicons name="log-out-outline" size={18} color="#D32F2F" />
                    </View>
                    <Text style={styles.logoutText}>Log Out</Text>
                    <Ionicons name="chevron-forward" size={16} color="#FFCDD2" style={{ marginLeft: 'auto' }} />
                </TouchableOpacity>

                <Text style={styles.version}>LeafDoctor v1.0.0 🌿</Text>
                <View style={{ height: 110 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F1F8F1' },
    scroll: { paddingHorizontal: 16, paddingTop: 0, paddingBottom: 20 },

    // ── Profile Card ──────────────────────────────────────────
    profileCard: {
        backgroundColor: '#fff',
        borderRadius: 28,
        alignItems: 'center',
        marginBottom: 24,
        overflow: 'hidden',
        elevation: 6,
        shadowColor: '#1B5E20',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.13,
        shadowRadius: 16,
        borderWidth: 1,
        borderColor: '#E0F0E0',
    },

    // Banner — tall enough for back btn + title + avatar overlap
    cardBanner: {
        width: '100%',
        height: 130,
        marginBottom: -50,
        overflow: 'hidden',
    },
    dec1: {
        position: 'absolute', width: 200, height: 200, borderRadius: 100,
        backgroundColor: 'rgba(255,255,255,0.06)', top: -80, right: -50,
    },
    dec2: {
        position: 'absolute', width: 120, height: 120, borderRadius: 60,
        backgroundColor: 'rgba(255,255,255,0.05)', bottom: -40, left: -30,
    },
    dec3: {
        position: 'absolute', width: 80, height: 80, borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.04)', top: 10, left: '45%',
    },

    // Back button inside banner
    backBtn: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 52 : 36,
        left: 16,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.18)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },

    // Banner title
    bannerTitle: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 56 : 40,
        alignSelf: 'center',
        fontSize: 18,
        fontWeight: '800',
        color: '#fff',
        letterSpacing: 0.5,
    },

    // Avatar
    avatarRing: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 5,
        borderColor: '#fff',
        marginBottom: 14,
        elevation: 8,
        shadowColor: '#1B5E20',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
    },
    avatarImg: { width: 90, height: 90, borderRadius: 45 },
    avatarFallback: {
        width: 90,
        height: 90,
        borderRadius: 45,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInitials: { fontSize: 34, fontWeight: '900', color: '#fff' },
    cameraChip: {
        position: 'absolute', bottom: 2, right: 2,
        width: 28, height: 28, borderRadius: 14,
        backgroundColor: '#2E7D32',
        justifyContent: 'center', alignItems: 'center',
        borderWidth: 2.5, borderColor: '#fff',
    },

    userName: {
        fontSize: 22,
        fontWeight: '900',
        color: '#1B5E20',
        marginBottom: 4,
        letterSpacing: -0.3,
    },
    userEmail: {
        fontSize: 13,
        color: '#9CAF9C',
        marginBottom: 12,
    },

    // Member badge pill
    memberBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#C8E6C9',
    },
    memberBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#2E7D32',
        marginLeft: 5,
    },

    // Stats
    statsRow: {
        flexDirection: 'row',
        width: '100%',
        borderTopWidth: 1,
        borderTopColor: '#EEF7EE',
        backgroundColor: '#FAFDF9',
        paddingVertical: 16,
        marginBottom: 0,
    },
    statCol: { flex: 1, alignItems: 'center' },
    statIcon: {
        width: 38,
        height: 38,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
    },
    statVal: { fontSize: 12, fontWeight: '800', color: '#1A2E1A', marginBottom: 2 },
    statLbl: { fontSize: 10, color: '#9CAF9C' },
    statLine: { width: 1, backgroundColor: '#E8F5E9', marginVertical: 8 },

    // Section label
    sectionLabel: {
        fontSize: 11, fontWeight: '700', color: '#9CAF9C',
        letterSpacing: 1.5, marginBottom: 8, marginLeft: 4,
    },

    // Menu card
    menuCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#2E7D32',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: '#EEF7EE',
    },
    menuRow: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: 13, paddingHorizontal: 16,
    },
    menuIcon: {
        width: 40, height: 40, borderRadius: 13,
        justifyContent: 'center', alignItems: 'center', marginRight: 13,
    },
    menuTexts: { flex: 1 },
    menuTitle: { fontSize: 14, fontWeight: '700', color: '#1A2E1A', marginBottom: 2 },
    menuSub: { fontSize: 11, color: '#9CAF9C' },
    menuDivider: { height: 1, backgroundColor: '#F0F7F0', marginLeft: 69 },

    // Logout
    logoutRow: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 20, paddingVertical: 13, paddingHorizontal: 16,
        marginBottom: 22,
        borderWidth: 1, borderColor: '#FFEBEE',
        elevation: 2,
        shadowColor: '#D32F2F',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05, shadowRadius: 6,
    },
    logoutText: { fontSize: 14, fontWeight: '700', color: '#D32F2F', marginLeft: 13 },

    version: { textAlign: 'center', color: '#C8DCC8', fontSize: 11 },
});

export default ProfileScreen;