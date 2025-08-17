import { AllSuiNS, SuiNs, Domain } from "@mysten/sui-ns";

export class Storage {
    private domains: Domain[] = [];

    constructor() {
        this.load();
    }

    async load() {
        const { domains } = await chrome.storage.local.get("domains");
        if (domains) {
            this.domains = domains;
        }
    }

    async save() {
        await chrome.storage.local.set({ domains: this.domains });
    }

    addDomain(domain: Domain) {
        this.domains.push(domain);
        this.save();
    }

    getDomains(): Domain[] {
        return this.domains;
    }
}
