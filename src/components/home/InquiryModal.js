import { View, Text, Modal, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { inquiryStyles } from '../../styles/inquiryStyles';  // Assuming this is your stylesheet
import { useUserStore } from '../../services/userStore';   // Assuming this is your store
import { v4 as uuidv4 } from 'uuid';
import "react-native-get-random-values";  // To enable UUID functionality

const InquiryModal = ({ visible, onClose }) => {
    const { setUser, user } = useUserStore();  // Your user store
    const [name, setName] = useState('');
    const [profilePhotoUrl, setProfilePhotoUrl] = useState('');

    // This useEffect is triggered whenever the modal visibility changes
    useEffect(() => {
        if (visible) {
            const storedName = user?.name;
            const storedPhotoUrl = user?.photo;
            setName(storedName || ''); // Default to empty string if no name stored
            setProfilePhotoUrl(storedPhotoUrl || ''); // Default to empty string if no photo URL stored
        }
    }, [visible]);  // Depend on the `visible` prop, so it updates when modal visibility changes

    // Handle saving the user details
    const handleSave = () => {
        if (name && profilePhotoUrl) {
            setUser({
                id: uuidv4(),  // Generate a unique ID using UUID
                name,
                photo: profilePhotoUrl,
            });
            onClose();  // Close the modal
        } else {
            Alert.alert("Please fill in both name and profile photo URL");
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={inquiryStyles.modalContainer}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={inquiryStyles.KeyboardAvoidingView}
                    >
                        <ScrollView contentContainerStyle={inquiryStyles.scrollViewContent}>
                            <View style={inquiryStyles.modalContent}>
                                <Text style={inquiryStyles.modalTitle}>Enter Your Details</Text>

                                {/* Name input */}
                                <TextInput
                                    style={inquiryStyles.input}
                                    onChangeText={setName}  // onChangeText instead of onChange
                                    placeholder="Enter Your Name"
                                    value={name}
                                    placeholderTextColor="#ccc"
                                />

                                {/* Profile photo URL input */}
                                <TextInput
                                    style={inquiryStyles.input}
                                    onChangeText={setProfilePhotoUrl}  // onChangeText instead of onChange
                                    placeholder="Enter Profile Photo URL"
                                    value={profilePhotoUrl}
                                    placeholderTextColor="#ccc"
                                />

                                {/* Buttons to save or cancel */}
                                <View style={inquiryStyles.buttonContainer}>
                                    <TouchableOpacity style={inquiryStyles.button} onPress={handleSave}>
                                        <Text style={inquiryStyles.buttonText}>Save</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[inquiryStyles.button, inquiryStyles.cancelButton]}
                                        onPress={onClose}
                                    >
                                        <Text style={inquiryStyles.buttonText}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default InquiryModal;
