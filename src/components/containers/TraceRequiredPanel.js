import PanelEmpty from './PanelEmpty';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {LayoutPanel} from './derived';

const TraceRequiredPanelContext = React.createContext({
  fullData: PropTypes.array,
  localize: PropTypes.func,
  setPanel: PropTypes.func,
});

class TraceRequiredPanel extends Component {
  static contextType = TraceRequiredPanelContext;
  hasTrace() {
    return this.context.fullData.filter((trace) => trace.visible).length > 0;
  }

  render() {
    const {localize: _} = this.context;
    const {children, ...rest} = this.props;

    if (!this.props.visible) {
      return null;
    }

    return this.hasTrace() ? (
      <LayoutPanel {...rest}>{children}</LayoutPanel>
    ) : (
      <PanelEmpty heading={_("Looks like there aren't any traces defined yet.")}>
        <p>
          {_('Go to the ')}
          <a onClick={() => this.context.setPanel('Structure', 'Traces')}>{_('Traces')}</a>
          {_(' panel under Structure to define traces.')}
        </p>
      </PanelEmpty>
    );
  }
}

TraceRequiredPanel.propTypes = {
  children: PropTypes.node,
  visible: PropTypes.bool,
};

TraceRequiredPanel.defaultProps = {
  visible: true,
};

export default TraceRequiredPanel;
