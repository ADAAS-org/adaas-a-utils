import { A_Fragment } from '@adaas/a-concept';



export class A_Route<
    _TParams extends Record<string, any> = Record<string, any>,
    _TQuery extends Record<string, any> = Record<string, any>
> extends A_Fragment {

    public url!: string;


    constructor(
        url: string | RegExp,
    ) {
        super();
        this.url = url instanceof RegExp ? url.source : url;
    }

    /**
     * Returns path only without query and hash
     */
    get path(): string {
        const p = this.url.split('?')[0].split('#')[0];


        //  ensure that last char is not /
        //  and remove protocol and domain if present
        if (p.includes('://')) {
            const pathStartIndex = p.indexOf('/', p.indexOf('://') + 3);
            if (pathStartIndex === -1) {
                return '/';
            } else {
                const path = p.slice(pathStartIndex);
                return path.endsWith('/') ? path.slice(0, -1) : path;
            }
        }
        return p.endsWith('/') ? p.slice(0, -1) : p;
    }
    /**
     * Returns array of parameter names in the route path
     */
    get params(): string[] {
        return this.path
            .match(/:([^\/]+)/g)
            ?.map((param) => param.slice(1))
            || [];
    }


    /**
     * Returns protocol based on URL scheme
     */
    get protocol(): string {
        switch (true) {
            case this.url.startsWith('http://'):
                return 'http';
            case this.url.startsWith('https://'):
                return 'https';
            case this.url.startsWith('ws://'):
                return 'ws';
            case this.url.startsWith('wss://'):
                return 'wss';
            default:
                return this.url.includes('://') ? this.url.split('://')[0] : 'http';
        }
    }


    extractParams(url: string): _TParams {
        // Remove query string (anything after ?)
        const cleanUrl = url.split('?')[0];

        const urlSegments = cleanUrl.split('/').filter(Boolean);
        const maskSegments = this.path.split('/').filter(Boolean);

        const params = {};

        for (let i = 0; i < maskSegments.length; i++) {

            const maskSegment = maskSegments[i];
            const urlSegment = urlSegments[i];

            if (maskSegment.startsWith(':')) {
                const paramName = maskSegment.slice(1); // Remove ':' from mask
                params[paramName] = urlSegment;
            } else if (maskSegment !== urlSegment) {
                // If static segments don’t match → fail
                return {} as _TParams;
            }
        }

        return params as _TParams;
    }

    extractQuery(url: string): _TQuery {
        const query: Record<string, string> = {};

        // Take only the part after "?"
        const queryString = url.split('?')[1];
        if (!queryString) return query as _TQuery;

        // Remove fragment (#...) if present
        const cleanQuery = queryString.split('#')[0];

        // Split into key=value pairs
        for (const pair of cleanQuery.split('&')) {
            if (!pair) continue;
            const [key, value = ''] = pair.split('=');
            query[decodeURIComponent(key)] = decodeURIComponent(value);
        }

        return query as _TQuery;
    }



    toString(): string {
        // path can be like /api/v1/users/:id
        // and because of that :id we need to replace it with regex that matches chars and numbers only   
        return `${this.path}`;
        // .replace(/\/:([^\/]+)/g, '\\/([^\/]+)')
    }

    toRegExp(): RegExp {
        return new RegExp(`^${this.path.replace(/\/:([^\/]+)/g, '/([^/]+)')}$`);
    }

    toAFeatureExtension(extensionScope: Array<string> = []): RegExp {
        return new RegExp(`^${extensionScope.length
            ? `(${extensionScope.join('|')})`
            : '.*'
            }\\.${this.path.replace(/\/:([^\/]+)/g, '/([^/]+)')}$`);
    }
}

