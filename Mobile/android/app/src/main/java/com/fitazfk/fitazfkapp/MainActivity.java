package com.fitazfk.fitazfkapp;

import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

import expo.modules.splashscreen.SplashScreen;
import expo.modules.splashscreen.SplashScreenImageResizeMode;
import com.mixpanel.android.mpmetrics.MixpanelAPI;

public class MainActivity extends ReactActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);

    // SplashScreen.show(...) has to be called after super.onCreate(...)
    // Below line is handled by '@expo/configure-splash-screen' command and it's discouraged to modify it manually
    SplashScreen.show(this, SplashScreenImageResizeMode.COVER, false);

    MixpanelAPI mixpanel = MixpanelAPI.getInstance(this, "109211293f4830a3355672d9b84aae74");
  }


    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "main";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected ReactRootView createRootView() {
                return new RNGestureHandlerEnabledRootView(MainActivity.this);
            }
        };
    }
}
