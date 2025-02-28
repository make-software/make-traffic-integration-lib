import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
    {
        entry: './src/index.ts',
        output: {
            filename: 'bundle.esm.js',
            path: path.resolve(__dirname, 'dist'),
            libraryTarget: 'module',
        },
        experiments: {
            outputModule: true,
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js'],
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env',
                                '@babel/preset-react',
                                '@babel/preset-typescript', // Add typescript preset.
                            ],
                        },
                    },
                    exclude: /node_modules/,
                },
            ],
        },
        devtool: 'source-map', // Add source maps
        mode: 'production',
        externals: {
            react: "react",
            "react-dom": "react-dom"
        },
    },
];