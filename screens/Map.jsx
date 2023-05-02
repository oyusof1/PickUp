import { Component } from "react";
import MapView from "react-native-maps";

export default class Map extends Component {
  render() {
    return (
      <MapView
        style={{ flex: 1 }}
        region={{
          latitude: this.props.coords[1],
          longitude: this.props.coords[0],
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
      />
    );
  }
}
