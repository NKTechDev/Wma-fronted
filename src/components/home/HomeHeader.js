import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Image, StyleSheet, Modal } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // Correct import for FontAwesome from react-native-vector-icons
import { useUserStore } from '../../services/userStore';
import { useNavigation } from '@react-navigation/native'; // React Navigation for screen transitions
import InquiryModal from './InquiryModal';


const HomeHeader = () => {
    const [visible, setVisible] = useState(false);
    const { user } = useUserStore(); // Accessing user from Zustand store
    const navigation = useNavigation(); // Navigation hook

    useEffect(() => {
        const checkUserName = () => {
            const storedName = user?.name;
            if (!storedName) {
                setVisible(true);  // Show modal if name is not set
            }
        };

        // Only call checkUserName when `user` changes
        checkUserName();

        // Debug log to check user avatar and name
        console.log('User:', user);
    }, [user]);

    const handleUserIconPress = () => {
        setVisible(true); // Show the modal when user icon is pressed
    };

    const handleMeetingCodePress = () => {
        // Navigate to JoinMeetScreen when meeting code is clicked
        if (user?.name) {
            navigation.navigate('JoinMeetScreen');  // Replace 'JoinMeetScreen' with your actual screen name
        } else {
            setVisible(true);  // Show modal if user name is not set
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.row}>
                {/* Menu Button */}
                <TouchableOpacity style={styles.menuButton}>
                    <FontAwesome name="bars" size={25} color="black" /> {/* Slightly smaller icon */}
                </TouchableOpacity>

                {/* Centered Meeting Code Text (now clickable to navigate) */}
                <TouchableOpacity style={styles.meetingCodeButton} onPress={handleMeetingCodePress}>
                    <Text style={styles.meetingCodeText}>Enter Meeting Code</Text>
                </TouchableOpacity>

                {/* Circle User Icon */}
                <TouchableOpacity style={styles.userIcon} onPress={handleUserIconPress}>
                    {user?.avatar ? (
                        <Image source={{ uri: user.avatar }} style={styles.userImage} />
                    ) : (
                        <FontAwesome name="user-circle" size={35} color="black" /> 
                    )}
                </TouchableOpacity>
            </View>

            {/* Inquiry Modal */}
            <InquiryModal visible={visible} onClose={() => setVisible(false)} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 12,  // Reduced padding for a more compact layout
        paddingVertical: 8,  // Reduced padding for a more compact layout
    },
    menuButton: {
        padding: 8,  // Slightly reduced padding
    },
    meetingCodeButton: {
        flex: 1,
        paddingVertical: 6,  // Slightly smaller padding
        alignItems: 'center',
    },
    meetingCodeText: {
        fontSize: 14,  // Smaller font size
        fontWeight: '600',  // Slightly lighter weight for a professional look
        textAlign: 'center',
    },
    userIcon: {
        padding: 8,  // Reduced padding for a cleaner look
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    userImage: {
        width: 35,  // Slightly smaller image
        height: 35, // Fixed height for circular avatar
        borderRadius: 17.5, // Circular border with smaller size
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
    },
    modalCloseText: {
        fontSize: 16,
        color: 'blue',
    },
});

export default HomeHeader;
