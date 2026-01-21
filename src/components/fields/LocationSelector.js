import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connectToContainer} from 'lib';
import Field from './Field';
import Radio from './Radio';
import {UnconnectedDropdown} from './Dropdown';
import DataSelector from './DataSelector';

const LocationmodeVisible = connectToContainer(UnconnectedDropdown, {
  modifyPlotProps: (props, context, plotProps) => {
    if (!plotProps.fullValue) {
      plotProps.isVisible = true;
      plotProps.fullValue = plotProps.container.locationmode;
      return;
    }
  },
});

const UnconnectedLocationContext = React.createContext({
  localize: PropTypes.func,
  updateContainer: PropTypes.func,
});

class UnconnectedLocation extends Component {
  static contextType = UnconnectedLocationContext;
  render() {
    const {localize: _} = this.context;

    return (
      <>
        <DataSelector label={_('Locations')} attr="locations" />
        <LocationmodeVisible
          label={_('Location Format')}
          attr="locationmode"
          clearable={false}
          options={[
            {label: _('GeoJSON feature'), value: 'geojson-id'},
            {label: _('Country Names'), value: 'country names'},
            {label: _('Country Abbreviations (ISO-3)'), value: 'ISO-3'},
            {
              label: _('USA State Abbreviations (e.g. NY)'),
              value: 'USA-states',
            },
          ]}
        />
      </>
    );
  }
}

UnconnectedLocation.propTypes = {
  attr: PropTypes.string,
  ...Field.propTypes,
};

const Location = connectToContainer(UnconnectedLocation);

const UnconnectedLocationSelectorContext = React.createContext({
  container: PropTypes.object,
  localize: PropTypes.func,
  updateContainer: PropTypes.func,
});

class UnconnectedLocationSelector extends Component {
  static contextType = UnconnectedLocationSelectorContext;
  constructor(props, context) {
    super(props, context);

    this.state = {
      mode: props.container.locations ? 'location' : 'latlon',
    };

    this.setMode = this.setMode.bind(this);
  }

  UNSAFE_componentWillMount() {
    this.setState({
      mode: this.props.container.locations ? 'location' : 'latlon',
    });
  }

  setMode(mode) {
    this.setState({mode: mode});
    this.props.updateContainer(
      mode === 'latlon'
        ? {
            locations: null,
            locationmode: null,
            locationssrc: null,
            locationmodesrc: null,
          }
        : {lat: null, lon: null, latsrc: null, lonsrc: null}
    );
  }

  render() {
    const {mode} = this.state;
    const {
      localize: _,
      container: {type: type},
    } = this.context;

    if (type === 'scattergeo') {
      return (
        <>
          <Field {...this.props} attr={this.props.attr}>
            <Radio
              options={[
                {value: 'latlon', label: _('Lat/Lon')},
                {value: 'location', label: _('Location')},
              ]}
              fullValue={mode}
              updatePlot={this.setMode}
              attr={this.props.attr}
            />
          </Field>
          {mode === 'latlon' ? (
            <>
              <DataSelector label={_('Latitude')} attr="lat" />
              <DataSelector label={_('Longitude')} attr="lon" />
            </>
          ) : (
            <Location attr="type" />
          )}
        </>
      );
    } else if (type === 'choropleth') {
      return <Location attr="type" />;
    } else if (type === 'choroplethmapbox') {
      return <DataSelector label={_('Locations')} attr="locations" />;
    }
    return (
      <>
        <DataSelector label={_('Latitude')} attr="lat" />
        <DataSelector label={_('Longitude')} attr="lon" />
      </>
    );
  }
}

UnconnectedLocationSelector.propTypes = {
  fullValue: PropTypes.any,
  updatePlot: PropTypes.func,
  attr: PropTypes.string,
  ...Field.propTypes,
};

export default connectToContainer(UnconnectedLocationSelector);
