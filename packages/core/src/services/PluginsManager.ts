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

        this.userPlugins = await this.httpClient.getPlugins();
    }

    initPluginScripts = async () => {
        if (this.isScriptsUploaded) {
            return
        }

        await this.loadPlugins()

        const scriptLoadPromises: Promise<any>[] = [];
        this.userPlugins.forEach(plugin => {
            if (plugin.resources === undefined) {
                plugin.resources = [];
            }
            plugin.resources.forEach(url => {
                const script = document.createElement('script');
                script.src = url;
                script.async = true; // Load scripts asynchronously
                document.head.appendChild(script);

                // Create a promise that resolves when the script is loaded
                const scriptLoadPromise = new Promise((resolve, reject) => {
                    script.onload = resolve;
                    script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
                });

                scriptLoadPromises.push(scriptLoadPromise);
            });
        });

        // Wait for all scripts to load
        await Promise.all(scriptLoadPromises);

        // Init scripts after all are loaded
        this.userPlugins.forEach(plugin => {
            if ((window as any)[plugin.scriptClassname]) {
                (window as any)[plugin.scriptClassname + "Instance"] = new (window as any)[plugin.scriptClassname](this.appKey, this.apiUrl);
            } else {
                return Promise.reject(new Error(`Plugin ID: ${plugin.id} Name:${plugin.name} scriptClassname is not provided`))
            }
            if (plugin.scriptInitEndpoint !== undefined && plugin.scriptInitEndpoint !== '') {
                (window as any)[plugin.scriptClassname + "Instance"][plugin.scriptInitEndpoint]();
            }
        });

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
}