import {PluginProcessMethod, Plugin} from "../types";
import {HttpClient} from "./HttpClient";

export class PluginsManager {
    private isScriptsUploaded = false;
    private userPlugins: Plugin[] = [];

    constructor(
        private apiUrl: string,
        private appKey: string,
        private httpClient: HttpClient,
    ) {
    }

    loadPlugins = async (): Promise<void> => {
        if (this.userPlugins.length > 0) {
            return;
        }

        return this.httpClient.getPlugins().then(
            (plugins) => {
                this.userPlugins = plugins.data || [];
            },
            (error) => {
                return Promise.reject(new Error(`Failed to load plugins: ${error.message}`));
            }
        )
    }

    initPluginScripts = async () => {
        if (this.isScriptsUploaded) {
            return;
        }

        await this.loadPlugins();

        const head = document.head;

        const pluginPromises = this.userPlugins.map((plugin) => {
            const resources = plugin.resources ?? [];

            // chain loads for this plugin
            let chain = Promise.resolve();

            resources.forEach((url) => {
                chain = chain.then(
                  () =>
                    new Promise<void>((resolve, reject) => {
                        let el: HTMLScriptElement | HTMLLinkElement;

                        if (url.includes('.css')) {
                            const link = document.createElement('link');
                            link.rel = 'stylesheet';
                            link.type = 'text/css';
                            link.href = url;
                            link.onload = () => resolve();
                            link.onerror = () =>
                              reject(new Error(`Failed to load stylesheet: ${url}`));
                            el = link;
                        } else {
                            const script = document.createElement('script');
                            script.src = url;
                            // ❗ do NOT set script.async = true here
                            script.onload = () => resolve();
                            script.onerror = () =>
                              reject(new Error(`Failed to load script: ${url}`));
                            el = script;
                        }

                        head.appendChild(el);
                    })
                );
            });

            // after this plugin's resources are loaded in order, init plugin class
            chain = chain.then(() => {
                const clsName = plugin.scriptClassname;
                const Ctor = (window as any)[clsName];
                if (!Ctor) {
                    throw new Error(
                      `Plugin ID: ${plugin.id} Name: ${plugin.name} class not found: ${clsName}`
                    );
                }

                const instanceName = clsName + 'Instance';
                (window as any)[instanceName] = new Ctor(this.appKey, this.apiUrl);

                if (plugin.scriptInitEndpoint) {
                    (window as any)[instanceName][plugin.scriptInitEndpoint]();
                }
            });

            return chain;
        });

        await Promise.all(pluginPromises);

        this.isScriptsUploaded = true;
    };


    getProcessEndpointByID = (id: number): PluginProcessMethod => {
        const plugin = this.userPlugins.find(one => one.id === id);
        if (!plugin) {
            throw new Error(`Plugin ${id} is not found`);
        }

        if (!(window as any)[plugin.scriptClassname + "Instance"]) {
            throw new Error(`Class ${plugin.scriptClassname + "Instance"} not found`);
        }


        return (window as any)[plugin.scriptClassname + "Instance"][plugin.scriptProcessEndpoint]
    }

    hasVerifyEndpointByID = (id: number): boolean => {
        const plugin = this.userPlugins.find(one => one.id === id);
        if (!plugin) {
            throw new Error(`Plugin ${id} is not found`);
        }

        return !!plugin.scriptVerifyEndpoint;
    }

    getVerifyEndpointByID = (id: number): PluginProcessMethod => {
        const plugin = this.userPlugins.find(one => one.id === id);
        if (!plugin) {
            throw new Error(`Plugin ${id} is not found`);
        }

        if (!(window as any)[plugin.scriptClassname + "Instance"]) {
            throw new Error(`Class ${plugin.scriptClassname + "Instance"} not found`);
        }

        if (plugin.scriptVerifyEndpoint == "" || plugin.scriptVerifyEndpoint == null) {
            throw new Error(`Plugin ${id} does not have verify endpoint`);
        }

        return (window as any)[plugin.scriptClassname + "Instance"][plugin.scriptVerifyEndpoint]
    }
}