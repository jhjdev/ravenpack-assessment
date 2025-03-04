# RavenPack Technical Assessment

A React Native application built for RavenPack's technical assessment. This app demonstrates fetching and displaying posts from the JSONPlaceholder API, with features including:

- Tab-based navigation with modern Feather icons
- Light and dark theme support
- API service for fetching post data
- Clean UI with reusable components

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [pnpm](https://pnpm.io/) (v8 or newer)
- [Xcode](https://developer.apple.com/xcode/) (for iOS development)
- [Android Studio](https://developer.android.com/studio) (for Android development)
- [JDK 17](https://openjdk.java.net/projects/jdk/17/) (for Android development)
- [Ruby](https://www.ruby-lang.org/) (for iOS development)
- [CocoaPods](https://cocoapods.org/) (for iOS development)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ravenpack-assessment.git
   cd ravenpack-assessment
   ```

2. Navigate to the React Native app directory:
   ```bash
   cd RNApp
   ```

3. Install dependencies:
   ```bash
   pnpm install
   ```

### Running on iOS

1. Install CocoaPods dependencies:
   ```bash
   cd ios
   pod install
   cd ..
   ```

2. Start the Metro bundler:
   ```bash
   npx react-native start
   ```

3. In a new terminal, build and run the iOS app:
   ```bash
   npx react-native run-ios
   ```
   This will open the app in the iOS simulator.

### Running on Android

1. Make sure you have an Android emulator running or a device connected.

2. Start the Metro bundler (if not already running):
   ```bash
   npx react-native start
   ```

3. In a new terminal, build and run the Android app:
   ```bash
   npx react-native run-android
   ```
   This will install and launch the app on your emulator or device.

## Project Structure

```
RNApp/
├── android/                 # Android native code
├── ios/                     # iOS native code
├── src/
│   ├── components/          # Reusable UI components
│   ├── contexts/            # React Context providers
│   ├── hooks/               # Custom React hooks
│   ├── navigation/          # Navigation configuration
│   ├── screens/             # App screens
│   ├── services/            # API and other services
│   └── styles/              # Global styles and themes
├── __tests__/               # Test files
├── App.tsx                  # Main App component
└── index.js                 # Entry point
```

## Testing

The project includes Jest tests for the API service. Run the tests with:

```bash
npx jest
```

## Troubleshooting

### iOS Issues

- If you encounter build errors, try cleaning the build:
  ```bash
  cd ios
  xcodebuild clean
  cd ..
  npx react-native run-ios
  ```

### Android Issues

- If you have issues with the app not showing icons, make sure the font files are properly included in the assets:
  ```bash
  mkdir -p android/app/src/main/assets/fonts
  cp node_modules/react-native-vector-icons/Fonts/Feather.ttf android/app/src/main/assets/fonts/
  ```

- If you encounter Gradle build issues, try cleaning the build:
  ```bash
  cd android
  ./gradlew clean
  cd ..
  npx react-native run-android
  ```

## License

This project is part of RavenPack's technical assessment and is not licensed for public use.
