// @flow
import React from 'react';

type Props = {
  plugins: Array<Function>
};

type Plugin = {
  Name: string,
  Provider: ?Function,
  Wrapper: ?Function,
  Component: ?Function,
  reducer: ?Function,
  middleware: ?Function,
}

const processPlugins = (props: Props): Object => {
  let RootProvider = ({ children }) => React.Children.only(children);
  let wrappers = [];
  let reducers = {};
  let middlewares = [];
  let plugins = [];
  let names = new Set();
  props.plugins.forEach((pluginFactory, idx) => {
    if (typeof pluginFactory !== 'function') {
      console.error(`Error at plugins[${idx}]: Expected plugin to be a function, instead got a ${typeof pluginFactory}`)
      return;
    }
    const plugin = pluginFactory(props);
    plugins.push(plugin)
    if (names.has(plugin.Name)) {
      console.error(`Plugin name conflict. More than one plugin with the name "${plugin.Name}". Ensure you are not using multiple copies of one plugin.`);
    } else {
      names.add(plugin.Name);
    }
    if (plugin.Wrapper) wrappers.push(plugin.Wrapper);
    if (plugin.Provider) RootProvider = plugin.Provider(RootProvider);
    if (plugin.reducer) reducers[plugin.Name] = plugin.reducer;
    if (plugin.middleware) middlewares.push(plugin.middleware);
  });
  return {
    RootProvider,
    wrappers,
    reducers,
    middlewares,
    plugins
  };
};

export default processPlugins;