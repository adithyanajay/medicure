# MediCure Emergency Call Feature

The Emergency Call feature in MediCure allows users to quickly send their live location to emergency services when they need immediate medical assistance.

## Features

1. **Live Location Sharing**: Uses the device's GPS to get precise location coordinates.
2. **Confirmation Dialog**: Prevents accidental emergency alerts with a confirmation popup.
3. **District-Based Routing**: Uses Google Maps Geocoding API to determine the user's district.
4. **SMS Alerts**: Sends SMS with Google Maps link to the appropriate emergency contact number.
5. **Direct Call Option**: Allows users to directly call emergency services if preferred.

## Implementation Details

### Frontend (React Native)

The frontend implementation uses:

- `expo-location` for accessing the device's location
- Confirmation modal with clear UI for emergency situations
- Error handling with fallback to direct calling

### Backend (FastAPI)

The backend implementation uses:

- Google Maps Geocoding API for district identification
- Twilio API for sending SMS alerts
- District-based routing to send alerts to the right emergency contacts

## Setup Requirements

### Frontend Setup

1. Install the required package:
```bash
npm install expo-location
```

2. Make sure location permissions are requested in your app

### Backend Setup

1. Install the required Python packages:
```bash
pip install googlemaps twilio
```

2. Add the following environment variables to your `.env` file:
```
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

3. Configure the emergency contacts map in the backend based on your requirements

## Usage

1. Navigate to the Emergency tab in the app
2. Press the emergency button
3. Confirm the alert in the popup dialog
4. The app will send your location to emergency services in your district

## Extending the Feature

The current implementation can be extended with:

1. **Multiple Emergency Contacts**: Add support for notifying multiple contacts
2. **Real-Time Tracking**: Implement periodic location updates
3. **User-Defined Contacts**: Allow users to set their own emergency contacts
4. **Push Notifications**: Add notifications for delivery status
5. **Enhanced Location Data**: Include additional medical information with the alert

## Security Considerations

- Ensure proper handling of location permissions
- Implement rate limiting to prevent abuse
- Use secure connections (HTTPS) for API calls
- Consider encrypting sensitive location data 