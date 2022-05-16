import React, { useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Text,
  Animated
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { DotIndicator } from 'react-native-indicators';
import PropTypes from 'prop-types';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';
import progressBar from '../../styles/progressBar';

const Loader = ({
  loading,
  overlayColor,
  setDownloadInfo,
  downloadInfo,
  progressive
}) => {

  const progressDownload = () => {
    for (const progress of Array(101).keys()) {
      setDownloadInfo({
        progress: Math.floor((progress * 100) / progress),
        loaded: progress,
        total: progress,
        completed: false,
      });
    }
  }

  useEffect(() => {
    progressDownload();
  }, [])

  console.log('downloadInfo: ', downloadInfo)

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <Spinner
          visible
          animation="fade"
          size="small"
          overlayColor={overlayColor}
        >
          <View style={styles.contentContainer}>
            {
              progressive ?
                <>
                  <View style={progressBar.bar}>
                    <Animated.View style={[
                      StyleSheet.absoluteFill, {
                        backgroundColor: colors.black,
                        borderRadius: 20,
                        width: `${downloadInfo.progress}%`
                      }
                    ]} />
                  </View>
                  <Text style={styles.loaderText}>Downloading {downloadInfo.progress}%</Text>
                </>
                :
                <View style={styles.dotIndicatorContainer}>
                  <DotIndicator
                    color={colors.themeColor.color}
                    count={3}
                    size={10}
                  />
                </View>
            }
          </View>
        </Spinner>
      </View>
    );
  }
  return null;
};

Loader.propTypes = {
  loading: PropTypes.bool.isRequired,
  color: PropTypes.string,
  overlayColor: PropTypes.string,
  text: PropTypes.string,
};

Loader.defaultProps = {
  overlayColor: 'rgba(0, 0, 0, 0.6)',
  color: colors.white,
  text: undefined,
};

const styles = StyleSheet.create({
  loaderContainer: {
    position: 'absolute',
    flex: 1,
    backgroundColor: colors.white,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotIndicatorContainer: {
    height: 50,
  },
  loaderText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.bold,
    justifyContent: 'flex-start',
  },
});

export default Loader;
