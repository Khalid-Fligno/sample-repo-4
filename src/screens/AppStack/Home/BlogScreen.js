import React from 'react';
import {
  StyleSheet,
  View,
  // ScrollView,
  Text,
  Dimensions,
  Image,
} from 'react-native';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import Loader from '../../../components/Shared/Loader';
import { db } from '../../../../config/firebase';
import fonts from '../../../styles/fonts';
import colors from '../../../styles/colors';

const { width } = Dimensions.get('window');

export default class BlogScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      text: undefined,
    };
  }
  componentDidMount = () => {
    this.fetchText();
  }
  componentWillUnmount = () => {
  }
  fetchText = () => {
    this.setState({ loading: true });
    db.collection('blogs').doc('anRI2lARPNeV8vBUT2i7')
      .get()
      .then(async (doc) => {
        if (doc.exists) {
          this.setState({ text: await doc.data().text, loading: false });
        } else {
          this.setState({ loading: false });
        }
      });
  }
  render() {
    const { loading, text } = this.state;
    const sortedText = text && text.sort((a, b) => {
      return a.id - b.id;
    });
    const textDisplay = sortedText && sortedText.map((paragraph) => (
      <Text
        key={paragraph.id}
        onPress={() => paragraph.url && this.openLink(paragraph.url)}
        style={[
          styles.paragraph,
          paragraph.header && styles.header,
          paragraph.heading && styles.paragraphHeading,
          paragraph.url && styles.link,
        ]}
      >
        {paragraph.value}
      </Text>
    ));
    return (
      <View style={styles.container}>
        <ParallaxScrollView
          outputScaleValue={2}
          backgroundScrollSpeed={2}
          contentBackgroundColor={colors.white}
          parallaxHeaderHeight={width / 2}
          renderBackground={() => (
            <Image
              source={require('../../../../assets/images/homeScreenTiles/home-screen-blog.jpg')}
              width={width}
            />
          )}
        >
          <View style={styles.textContainer}>
            {textDisplay}
          </View>
        </ParallaxScrollView>
        <Loader
          loading={loading}
          color={colors.charcoal.standard}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
  },
  textContainer: {
    padding: 10,
  },
  header: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.charcoal.standard,
    marginBottom: 10,
  },
  paragraphHeading: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.charcoal.dark,
    marginTop: 5,
    marginBottom: 8,
  },
  paragraph: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.charcoal.standard,
    marginBottom: 8,
  },
});
