const withNotificationFix = (config) => {
  return {
    ...config,
    android: {
      ...config.android,
      manifest: {
        ...config.android?.manifest,
        "xmlns:tools": "http://schemas.android.com/tools",
        application: {
          ...config.android?.manifest?.application,
          "meta-data": [
            {
              "android:name": "com.google.firebase.messaging.default_notification_color",
              "android:resource": "@color/notification_icon_color",
              "tools:replace": "android:resource"
            }
          ]
        }
      }
    },
    mods: {
      ...config.mods,
      android: {
        ...config.mods?.android,
        manifest: (manifest) => {
          // Add any necessary manifest modifications here
          return manifest;
        }
      }
    }
  };
};

module.exports = withNotificationFix;
