import React, { Component } from 'react';
import PropTypes from 'prop-types'
import connectLayout from '../utils/connectLayout';

const WrapperManager = ({ item, WrappedComponent, ...props }) => WrappedComponent ? (
  <WrappedComponent data-id={item.id} {...item.props}>
    {item.children.map(cId => <Wrapper key={cId} id={cId} />)}
  </WrappedComponent>
) : null;

WrapperManager.propTypes = {
  item: PropTypes.object.isRequired,
  WrappedComponent: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func
  ])
}

const mapStateToProps = ({ layoutState, layoutExtras }, { id }) => {
  const item = layoutState.getItem(id);
  const WrappedComponent = layoutExtras.wrapperCache.getWrapped(item.type);
  return {
    item,
    WrappedComponent
  };
};

const Wrapper = connectLayout(mapStateToProps)(WrapperManager)

Wrapper.propTypes = {
  id: PropTypes.string.isRequired
}

export default Wrapper;