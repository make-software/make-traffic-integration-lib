import {fileURLToPath} from 'url';
import {dirname} from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
    {
        entry: './src/index.ts',  // Entry point to your TypeScript code
        output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'dist'),
            library: 'taskManagerLib',  // Name of the global variable
            libraryTarget: 'var',       // Ensures global variable exposure
        },
        resolve: {
            extensions: ['.ts', '.js'],
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
            ],
        },
        mode: 'production',
    },
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
            extensions: ['.ts', '.js'],
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
            ],
        },
        mode: 'production',
    }
];
