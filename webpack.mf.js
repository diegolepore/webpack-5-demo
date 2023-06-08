const path = require('path')
const parts = require('./webpack.parts')
const { merge } = require('webpack-merge')
const { component, mode } = require("webpack-nano/argv");

const cssLoaders = [parts.autoprefix(), parts.tailwind()] // autoprefix(tailwind(input))

const commonConfig = ({ outputPath = '/dist' } = {}) => {
  return merge([
    { 
    //   entry: [path.join(__dirname, "src", "bootstrap.js")],
      output: { publicPath: "/" }
    },

    parts.clean(),
    parts.loadJavaScript(),
    // parts.loadImages({ limit: 15000 }),
    // parts.page({ title: 'Module Federation' }),
    
    // parts.federateModule({
    //     name: "app",
    //     remotes: {},
    //     shared: {
    //         react: { singleton: true },
    //         "react-dom": { singleton: true },
    //     },
    // })
  ])
}

const configs = {
    development: merge(
        { entry: ["webpack-plugin-serve/client"] },
        // parts.devServer()
    ),
    production: {}
}

const shared = {
    react: { singleton: true },
    "react-dom": { singleton: true },
  };

const componentConfigs = {
app: merge(
    {
        entry: [path.join(__dirname, "src", "bootstrap.js")],
        output: {
            chunkFilename: 'chunk.[id].js',
            path: path.resolve(process.cwd(), 'dist')
        }
    },
    parts.page({ title: 'App' }),
    parts.devServer({ port: 3000 }),
    parts.loadJavaScript(),
    parts.extractCSS({ loaders: cssLoaders }),
    parts.federateModule({
        name: "app",
        remotes: { mf: "mf@/mf.js" },
        shared,
    })
),
header: merge(
    {
        entry: [path.join(__dirname, "src", "header.js")],
        output: {
            chunkFilename: 'chunk.[id].js',
            path: path.resolve(process.cwd(), 'distMf')
        }
    },
    parts.loadJavaScript(),
    parts.extractCSS({ loaders: cssLoaders }),
    parts.devServer({ port: 3005 }),
    parts.federateModule({
        name: "mf",
        filename: "mf.js",
        exposes: { "./header": "./src/header" },
        shared,
    })
),
};
  
if (!component) throw new Error("Missing component name");
  

// module.exports = merge(commonConfig(), configs[mode], { mode })

module.exports = merge(
    commonConfig,
    configs[mode],
    { mode },
    componentConfigs[component]
  );