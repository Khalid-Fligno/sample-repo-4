#!/bin/bash

./gradlew ${1:-installDevMinSdkDevKernelDebug} --stacktrace && adb shell am start -n com.fitazfk.fitazfkapp/host.exp.exponent.MainActivity
