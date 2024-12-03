type ResolveEvent = {
    url: string;
    context: {
        format: string;
        importAttributes: Record<string, any>;
    };
}

type ResolvedEvent = {
    specifier: string;
    context: {
        conditions: string[];
        importAttributes: Record<string, any>;
        parentURL: string;
    };
    result: {
        url: string;
        format: string;
    };
    took: number;
}

type LoadEvent = {
    specifier: string;
    context: {
        conditions: string[];
        importAttributes: Record<string, any>;
        parentURL: string;
    };
}

type LoadedEvent = {
    url: string;
    context: {
        format: string;
        importAttributes: Record<string, any>;
    };
    result: {
        format: string;
        responseURL: string;
    };
    took: number;
}

export type RegisterOptions = {
    onResolve?: (e: ResolveEvent) => void;
    onResolved?: (e: ResolvedEvent) => void;
    onLoad?: (e: LoadEvent) => void;
    onLoaded?: (e: LoadedEvent) => void;
};
