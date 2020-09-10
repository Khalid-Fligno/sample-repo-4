import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import fonts from '../../styles/fonts';
import colors from '../../styles/colors';

const { width } = Dimensions.get('window');

export default class ImageModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const {
      imageModalVisible,
      toggleImageModal,
      color,
      imageSource,
    } = this.props;
    return (
      <Modal
        isVisible={imageModalVisible}
        animationIn="fadeIn"
        animationInTiming={400}
        animationOut="fadeOut"
        animationOutTiming={600}
      >
        <View style={styles.imageModalContainer}>
          <View style={styles.imageModalImageContainer}>
            <ScrollView
              bounces={false}
              bouncesZoom={false}
              maximumZoomScale={2}
              minimumZoomScale={1}
            >
              <FastImage
                style={styles.imageStyle}
                source={imageSource}
              />
            </ScrollView>
          </View>
          <View style={styles.imageModalButtonContainer}>
            <TouchableOpacity
              title="DONE"
              onPress={toggleImageModal}
              style={[
                styles.modalButton,
                color === 'coral' && styles.modalButtonCoral,
                color === 'violet' && styles.modalButtonViolet,
                color === 'blue' && styles.modalButtonBlue,
                color === 'green' && styles.modalButtonGreen,
                color === 'red' && styles.modalButtonRed,
              ]}
            >
              <Text style={styles.modalButtonText}>
                DONE
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

ImageModal.propTypes = {
  imageModalVisible: PropTypes.bool.isRequired,
  toggleImageModal: PropTypes.func.isRequired,
  color: PropTypes.string,
  imageSource: PropTypes.objectOf(PropTypes.string).isRequired,
};

ImageModal.defaultProps = {
  color: undefined,
};

const styles = StyleSheet.create({
  imageModalContainer: {
    flexShrink: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 4,
    overflow: 'hidden',
  },
  imageModalImageContainer: {
    width: '100%',
    backgroundColor: colors.grey.standard,
  },
  imageStyle: {
    width: width - 30,
    height: (width - 30) * 1.33,
  },
  imageModalButtonContainer: {
    backgroundColor: colors.white,
    width: '100%',
  },
  modalButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.charcoal.standard,
    height: 50,
    width: '100%',
  },
  modalButtonCoral: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.themeColor.color,
    height: 50,
    width: '100%',
  },
  modalButtonViolet: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.violet.standard,
    height: 50,
    width: '100%',
  },
  modalButtonBlue: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.blue.standard,
    height: 50,
    width: '100%',
  },
  modalButtonGreen: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.green.standard,
    height: 50,
    width: '100%',
  },
  modalButtonRed: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.red.standard,
    height: 50,
    width: '100%',
  },
  modalButtonText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
    marginTop: 3,
  },
});
