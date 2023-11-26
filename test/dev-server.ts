/* eslint-disable */
import { DefaultLogger, LogLevel, mergeConfig,DefaultSearchPlugin } from '@vendure/core';
import {
  createTestEnvironment,
  registerInitializer,
  SqljsInitializer,
  testConfig,
} from '@vendure/testing';
import { TestServer } from '@vendure/testing/lib/test-server';
import { compileUiExtensions } from '@vendure/ui-devkit/compiler';
import { initialData } from './initial-data';
import * as path from 'path';
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import {SimplifiedCollectionsPlugin} from '../src';
(async () => {
  let server: TestServer;

  registerInitializer('sqljs', new SqljsInitializer('data'));
  const config = mergeConfig(testConfig, {
    logger: new DefaultLogger({ level: LogLevel.Debug }),
    plugins:[
        SimplifiedCollectionsPlugin,
        DefaultSearchPlugin,
        AdminUiPlugin.init({
            port: 3002,
            route: 'admin',
            app:  compileUiExtensions({
                  outputPath: path.join(__dirname, 'admin-ui'),
                  extensions: [SimplifiedCollectionsPlugin.uiExtensions],
                  devMode: true,
                })
          }),
    ],
    apiOptions: {
      adminApiPlayground: true,
      shopApiPlayground: true,
    },
  });

  ({ server } = createTestEnvironment(config));
  await server.init({
    initialData,
    productsCsvPath: 'test/product-import.csv',
  });
})().catch((err) => {
  console.error(err);
});