import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

export default class CustomModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const { isVisible, onDismiss, children } = this.props;
    return (
      <Modal isVisible={isVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.contentContainer}>
            {children}
          </View>
          <Button
            title="Ok, got it!"
            onPress={onDismiss}
            containerViewStyle={styles.buttonContainer}
            buttonStyle={styles.button}
            textStyle={styles.buttonText}
          />
        </View>
      </Modal>
    );
  }
}

CustomModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: colors.white,
    borderRadius: 4,
  },
  contentContainer: {
    margin: 15,
  },
  buttonContainer: {
    margin: 15,
  },
  button: {
    backgroundColor: colors.violet.standard,
    borderRadius: 4,
  },
  buttonText: {
    fontFamily: fonts.standard,
    fontSize: 14,
  },
});
