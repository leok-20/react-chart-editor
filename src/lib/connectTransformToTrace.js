import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {getDisplayName} from '../lib';
import {EDITOR_ACTIONS} from './constants';

export default function connectTransformToTrace(WrappedComponent) {
  const TransformConnectedComponentContext = React.createContext({
    container: PropTypes.object,
    fullContainer: PropTypes.object,
    data: PropTypes.array,
    onUpdate: PropTypes.func,
    updateContainer: PropTypes.func,
    getValObject: PropTypes.func,
  });

  const TransformConnectedComponentChildContext = React.createContext({
    updateContainer: PropTypes.func,
    deleteContainer: PropTypes.func,
    container: PropTypes.object,
    fullContainer: PropTypes.object,
    getValObject: PropTypes.func,
  });

  class TransformConnectedComponent extends Component {
    static contextType = TransformConnectedComponentContext;
    constructor(props, context) {
      super(props, context);

      this.deleteTransform = this.deleteTransform.bind(this);
      this.updateTransform = this.updateTransform.bind(this);
      this.setLocals(props, context);
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
      this.setLocals(nextProps, nextContext);
    }

    setLocals(props, context) {
      const {transformIndex} = props;
      const {container, fullContainer} = context;

      const transforms = container.transforms || [];
      const fullTransforms = fullContainer.transforms || [];
      this.container = transforms[transformIndex];
      this.fullContainer = fullTransforms[transformIndex];
    }

    getChildContext() {
      return {
        getValObject: (attr) =>
          !this.context.getValObject ? null : this.context.getValObject(`transforms[].${attr}`),
        updateContainer: this.updateTransform,
        deleteContainer: this.deleteTransform,
        container: this.container,
        fullContainer: this.fullContainer,
      };
    }

    updateTransform(update) {
      const newUpdate = {};
      const {transformIndex} = this.props;
      for (const key in update) {
        const newkey = `transforms[${transformIndex}].${key}`;
        newUpdate[newkey] = update[key];
      }
      this.context.updateContainer(newUpdate);
    }

    deleteTransform() {
      if (this.context.onUpdate) {
        this.context.onUpdate({
          type: EDITOR_ACTIONS.DELETE_TRANSFORM,
          payload: {
            traceIndex: this.context.fullContainer.index,
            transformIndex: this.props.transformIndex,
          },
        });
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  TransformConnectedComponent.displayName = `TransformConnected${getDisplayName(WrappedComponent)}`;

  TransformConnectedComponent.propTypes = {
    transformIndex: PropTypes.number.isRequired,
  };

  const {plotly_editor_traits} = WrappedComponent;
  TransformConnectedComponent.plotly_editor_traits = plotly_editor_traits;

  return TransformConnectedComponent;
}
