import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import HeaderNormal from "../../components/HeaderNormal";
import { useNavigation } from "@react-navigation/native";

const TermsOfService = () => {
    const navigation = useNavigation();
    const headerOptions = HeaderNormal({
        title: "Terms Of Service",
    }).setHeaderOptions;

    React.useLayoutEffect(() => {
        navigation.setOptions(headerOptions());
    }, [navigation]);
    return (
        <ScrollView style={styles.container}>
            <View style={styles.Allcontent}>
                <View style={styles.content}>
                    <Text style={styles.title}>Terms of Service</Text>
                    <Text style={styles.text}>
                        Welcome to Eposh Booking. These terms and conditions outline the rules and regulations for the use of Eposh Booking's App.
                    </Text>
                    <Text style={styles.text}>
                        By accessing this app, we assume you accept these terms and conditions. Do not continue to use Eposh Booking if you do not agree to all of the terms and conditions stated on this page.
                    </Text>
                    <Text style={styles.subtitle}>License</Text>
                    <Text style={styles.text}>
                        Unless otherwise stated, Eposh Booking and/or its licensors own the intellectual property rights for all material on Eposh Booking. All intellectual property rights are reserved. You may access this from Eposh Booking for your own personal use subjected to restrictions set in these terms and conditions.
                    </Text>
                    <Text style={styles.subtitle}>User Comments</Text>
                    <Text style={styles.text}>
                        Parts of this app offer an opportunity for users to post and exchange opinions and information in certain areas of the website. Eposh Booking does not filter, edit, publish or review Comments prior to their presence on the app. Comments do not reflect the views and opinions of Eposh Booking, its agents, and/or affiliates.
                    </Text>
                    <Text style={styles.subtitle}>Hyperlinking to our Content</Text>
                    <Text style={styles.text}>
                        The following organizations may link to our App without prior written approval: Government agencies; Search engines; News organizations; Online directory distributors may link to our App in the same manner as they hyperlink to the Websites of other listed businesses.
                    </Text>
                    <Text style={styles.subtitle}>iFrames</Text>
                    <Text style={styles.text}>
                        Without prior approval and written permission, you may not create frames around our App that alter in any way the visual presentation or appearance of our App.
                    </Text>
                    <Text style={styles.subtitle}>Content Liability</Text>
                    <Text style={styles.text}>
                        We shall not be hold responsible for any content that appears on your App. You agree to protect and defend us against all claims that is rising on your App.
                    </Text>
                    <Text style={styles.subtitle}>Your Privacy</Text>
                    <Text style={styles.text}>
                        Please read Privacy Policy.
                    </Text>
                    <Text style={styles.subtitle}>Reservation of Rights</Text>
                    <Text style={styles.text}>
                        We reserve the right to request that you remove all links or any particular link to our App. You approve to immediately remove all links to our App upon request.
                    </Text>
                    <Text style={styles.subtitle}>Removal of links from our App</Text>
                    <Text style={styles.text}>
                        If you find any link on our App that is offensive for any reason, you are free to contact and inform us any moment. We will consider requests to remove links but we are not obligated to or so or to respond to you directly.
                    </Text>
                    <Text style={styles.subtitle}>Disclaimer</Text>
                    <Text style={styles.text}>
                        To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our app and the use of this app.
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F2F5',
        padding: 10,
    },
    Allcontent: {
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        elevation: 5,
        borderColor: "#CCCCCC",
        borderWidth: 1,
    },
    content: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        color: '#444',
    },
    text: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'justify',
        color: '#555',
    },
});

export default TermsOfService;
