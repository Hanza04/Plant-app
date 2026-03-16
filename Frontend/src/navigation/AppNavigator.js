import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import PlantNavigator from './PlantNavigator';
import PlantAssistantScreen from '../screens/tools/PlantAssistantScreen';
import ProfileNavigator from './ProfileNavigator';
import FertilizerCalculatorScreen from '../screens/tools/FertilizerCalculatorScreen';
import HistoryScreen from '../screens/HistoryScreen';
import DiseaseLibraryScreen from '../screens/DiseaseLibraryScreen';
import CustomTabBar from '../components/CustomTabBar';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    elevation: 0,
                    backgroundColor: 'transparent',
                    borderTopWidth: 0,
                }
            }}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Scan" component={PlantNavigator} />
            <Tab.Screen name="Tools" component={FertilizerCalculatorScreen} />
            <Tab.Screen name="Chat" component={PlantAssistantScreen} />
            {/* ✅ SWAPPED: Profile now in tab bar instead of History */}
            <Tab.Screen name="Profile" component={ProfileNavigator} />

            {/* Hidden screens */}
            <Tab.Screen
                name="History"
                component={HistoryScreen}
                options={{ tabBarButton: () => null }}
            />
            <Tab.Screen
                name="DiseaseLibrary"
                component={DiseaseLibraryScreen}
                options={{ tabBarButton: () => null }}
            />
        </Tab.Navigator>
    );
};

export default AppNavigator;