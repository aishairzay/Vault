// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

//module.exports = getDefaultConfig();

module.exports = {
    ...defaultConfig,
    transformer: {
        ...defaultConfig.transformer,
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: true,
            },
        })
    },
    resolver: {
        ...defaultConfig.resolver,
        extraNodeModules: require('node-libs-react-native'),
    }
}
