import './jest.setup';
import { A_Context, A_Scope } from '@adaas/a-concept';
import { A_Logger } from '@adaas/a-utils/lib/A-Logger/A-Logger.component';
import { A_Polyfill } from '@adaas/a-utils/lib/A-Polyfill/A-Polyfill.component';
import { config } from 'dotenv';
config();
jest.retryTimes(0);

describe('A-Polyfill Tests', () => {
    let testScope: A_Scope;
    let polyfill: A_Polyfill;

    beforeEach(async () => {
        testScope = new A_Scope({
            components: [A_Polyfill, A_Logger],
        });
        polyfill = testScope.resolve(A_Polyfill);
        await polyfill.load();
    });

    describe('Basic Component Tests', () => {
        it('Should create A-polyfill component', async () => {
            expect(polyfill).toBeInstanceOf(A_Polyfill);
        });

        it('Should detect environment correctly', () => {
            const env = A_Context.environment;
            expect(env).toMatch(/^(server|browser)$/);
            expect(env).toBe('server');
        });
    });

    describe('FS Polyfill Tests', () => {
        it('Should return fs polyfill', async () => {
            const fs = await polyfill.fs();
            expect(fs).toBeDefined();
            expect(fs.readFileSync).toBeDefined();
            expect(fs.existsSync).toBeDefined();
            expect(fs.createReadStream).toBeDefined();
        });

        it('Should check if file exists', async () => {
            const fs = await polyfill.fs();
            const exists = fs.existsSync('./package.json');
            expect(typeof exists).toBe('boolean');
            expect(exists).toBe(true); // package.json should exist
        });

        it('Should read file content', async () => {
            const fs = await polyfill.fs();
            const content = fs.readFileSync('./package.json', 'utf8');
            expect(typeof content).toBe('string');
            expect(content.length).toBeGreaterThan(0);
        });
    });

    describe('Crypto Polyfill Tests', () => {
        it('Should return crypto polyfill', async () => {
            const crypto = await polyfill.crypto();
            expect(crypto).toBeDefined();
            expect(crypto.createTextHash).toBeDefined();
            expect(crypto.createFileHash).toBeDefined();
        });

        it('Should create text hash', async () => {
            const crypto = await polyfill.crypto();
            const hash = await crypto.createTextHash('test content', 'sha256');
            expect(hash).toBeDefined();
            expect(typeof hash).toBe('string');
            expect(hash).toContain('sha256-');
        });

        it('Should create file hash', async () => {
            const crypto = await polyfill.crypto();
            const hash = await crypto.createFileHash('./package.json', 'sha256');
            expect(hash).toBeDefined();
            expect(typeof hash).toBe('string');
            expect(hash).toContain('sha256-');
        });

        it('Should create consistent hashes for same content', async () => {
            const crypto = await polyfill.crypto();
            const hash1 = await crypto.createTextHash('test', 'sha256');
            const hash2 = await crypto.createTextHash('test', 'sha256');
            expect(hash1).toBe(hash2);
        });
    });

    describe('HTTP Polyfill Tests', () => {
        it('Should return http polyfill', async () => {
            const http = await polyfill.http();
            expect(http).toBeDefined();
            expect(http.request).toBeDefined();
            expect(http.get).toBeDefined();
            expect(http.createServer).toBeDefined();
        });

        it('Should create http request object', async () => {
            const http = await polyfill.http();

            let req;

            const response = await new Promise((resolve, reject) => {
                req = http.request(
                    {
                        hostname: "jsonplaceholder.typicode.com",
                        path: "/posts/1",
                        method: "GET",
                        port: 80,
                    },
                    (res) => {
                        let data = "";

                        // Collect response chunks
                        res.on("data", (chunk) => {
                            data += chunk;
                        });

                        // When finished, resolve promise
                        res.on("end", () => {
                            try {
                                resolve(data);
                            } catch (err) {
                                reject(err);
                            }
                        });
                    }
                );

                req.on('error', (err) => {
                    reject(err);
                });

                // Important: send the request
                req.end();
            });

            // Parse and validate response
            const json = JSON.parse(response as string);

            expect(json).toBeDefined();
            expect(json).toHaveProperty("id", 1);
            expect(typeof json.title).toBe("string");

            expect(req).toBeDefined();
            expect(req.end).toBeDefined();
            expect(req.write).toBeDefined();
            expect(req.on).toBeDefined();
            // Don't actually make the request in tests
        });
    });

    describe('HTTPS Polyfill Tests', () => {
        it('Should return https polyfill', async () => {
            const https = await polyfill.https();
            expect(https).toBeDefined();
            expect(https.request).toBeDefined();
            expect(https.get).toBeDefined();
            expect(https.createServer).toBeDefined();
        });

        it('Should create https request object', async () => {
            const https = await polyfill.https();
            let req;

            const response = await new Promise((resolve, reject) => {
                req = https.request(
                    {
                        hostname: "jsonplaceholder.typicode.com",
                        path: "/posts/1",
                        method: "GET",
                    },
                    (res) => {
                        let data = "";

                        // Collect response chunks
                        res.on("data", (chunk) => {
                            data += chunk;
                        });

                        // When finished, resolve promise
                        res.on("end", () => {
                            try {
                                resolve(data);
                            } catch (err) {
                                reject(err);
                            }
                        });
                    }
                );

                req.on('error', (err) => {
                    reject(err);
                });

                // Important: send the request
                req.end();
            });

            // Parse and validate response
            const json = JSON.parse(response as string);

            expect(json).toBeDefined();
            expect(json).toHaveProperty("id", 1);
            expect(typeof json.title).toBe("string");

            expect(req).toBeDefined();
            expect(req.end).toBeDefined();
            expect(req.write).toBeDefined();
            expect(req.on).toBeDefined();
        });
    });

    describe('Path Polyfill Tests', () => {
        it('Should return path polyfill', async () => {
            const path = await polyfill.path();
            expect(path).toBeDefined();
            expect(path.join).toBeDefined();
            expect(path.resolve).toBeDefined();
            expect(path.dirname).toBeDefined();
            expect(path.basename).toBeDefined();
            expect(path.extname).toBeDefined();
        });

        it('Should join paths correctly', async () => {
            const path = await polyfill.path();
            const joined = path.join('/', 'home', 'user', 'file.txt');
            expect(joined).toBe('/home/user/file.txt');
        });

        it('Should get dirname correctly', async () => {
            const path = await polyfill.path();
            const dir = path.dirname('/home/user/file.txt');
            expect(dir).toBe('/home/user');
        });

        it('Should get basename correctly', async () => {
            const path = await polyfill.path();
            const base = path.basename('/home/user/file.txt');
            expect(base).toBe('file.txt');
        });

        it('Should get extension correctly', async () => {
            const path = await polyfill.path();
            const ext = path.extname('/home/user/file.txt');
            expect(ext).toBe('.txt');
        });

        it('Should check if path is absolute', async () => {
            const path = await polyfill.path();
            expect(path.isAbsolute('/home/user')).toBe(true);
            expect(path.isAbsolute('relative/path')).toBe(false);
        });

        it('Should parse path correctly', async () => {
            const path = await polyfill.path();
            const parsed = path.parse('/home/user/file.txt');
            expect(parsed.dir).toBe('/home/user');
            expect(parsed.base).toBe('file.txt');
            expect(parsed.ext).toBe('.txt');
            expect(parsed.name).toBe('file');
        });
    });

    describe('URL Polyfill Tests', () => {
        it('Should return url polyfill', async () => {
            const url = await polyfill.url();
            expect(url).toBeDefined();
            expect(url.parse).toBeDefined();
            expect(url.format).toBeDefined();
            expect(url.resolve).toBeDefined();
            expect(url.URL).toBeDefined();
            expect(url.URLSearchParams).toBeDefined();
        });

        it('Should parse URL correctly', async () => {
            const url = await polyfill.url();
            const parsed = url.parse('https://example.com:8080/path?query=value#fragment');
            expect(parsed.protocol).toBe('https:');
            expect(parsed.hostname).toBe('example.com');
            expect(parsed.port).toBe('8080');
            expect(parsed.pathname).toBe('/path');
        });

        it('Should resolve URLs correctly', async () => {
            const url = await polyfill.url();
            const resolved = url.resolve('https://example.com/path/', 'file.html');
            expect(resolved).toBe('https://example.com/path/file.html');
        });

        it('Should work with URL constructor', async () => {
            const url = await polyfill.url();
            const urlObj = new url.URL('https://example.com/path');
            expect(urlObj.hostname).toBe('example.com');
            expect(urlObj.pathname).toBe('/path');
        });
    });

    describe('Buffer Polyfill Tests', () => {
        it('Should return buffer polyfill', async () => {
            const buffer = await polyfill.buffer();
            expect(buffer).toBeDefined();
            expect(buffer.from).toBeDefined();
            expect(buffer.alloc).toBeDefined();
            expect(buffer.concat).toBeDefined();
            expect(buffer.isBuffer).toBeDefined();
        });

        it('Should create buffer from string', async () => {
            const buffer = await polyfill.buffer();
            const buf = buffer.from('hello world', 'utf8');
            expect(buf).toBeDefined();
            expect(buf.length).toBeGreaterThan(0);
        });

        it('Should allocate buffer', async () => {
            const buffer = await polyfill.buffer();
            const buf = buffer.alloc(10);
            expect(buf).toBeDefined();
            expect(buf.length).toBe(10);
        });

        it('Should concatenate buffers', async () => {
            const buffer = await polyfill.buffer();
            const buf1 = buffer.from('hello ');
            const buf2 = buffer.from('world');
            const combined = buffer.concat([buf1, buf2]);
            expect(combined).toBeDefined();
            expect(combined.length).toBe(buf1.length + buf2.length);
        });

        it('Should identify buffers', async () => {
            const buffer = await polyfill.buffer();
            const buf = buffer.from('test');
            expect(buffer.isBuffer(buf)).toBe(true);
            expect(buffer.isBuffer('not a buffer')).toBe(false);
        });
    });

    describe('Process Polyfill Tests', () => {
        it('Should return process polyfill', async () => {
            const process = await polyfill.process();
            expect(process).toBeDefined();
            expect(process.env).toBeDefined();
            expect(process.argv).toBeDefined();
            expect(process.platform).toBeDefined();
            expect(process.version).toBeDefined();
            expect(process.cwd).toBeDefined();
        });

        it('Should have environment variables', async () => {
            const process = await polyfill.process();
            expect(typeof process.env).toBe('object');
            expect(process.env).not.toBeNull();
        });

        it('Should have argv array', async () => {
            const process = await polyfill.process();
            expect(Array.isArray(process.argv)).toBe(true);
        });

        it('Should have platform string', async () => {
            const process = await polyfill.process();
            expect(typeof process.platform).toBe('string');
        });

        it('Should have working cwd function', async () => {
            const process = await polyfill.process();
            const cwd = process.cwd();
            expect(typeof cwd).toBe('string');
            expect(cwd.length).toBeGreaterThan(0);
        });

        it('Should have nextTick function', async () => {
            const process = await polyfill.process();
            expect(typeof process.nextTick).toBe('function');

            return new Promise<void>((resolve) => {
                let called = false;
                process.nextTick(() => {
                    called = true;
                    expect(called).toBe(true);
                    resolve();
                });
            });
        });
    });

    describe('Integration Tests', () => {
        it('Should work with all polyfills simultaneously', async () => {
            const [fs, crypto, http, https, path, url, buffer, process] = await Promise.all([
                polyfill.fs(),
                polyfill.crypto(),
                polyfill.http(),
                polyfill.https(),
                polyfill.path(),
                polyfill.url(),
                polyfill.buffer(),
                polyfill.process()
            ]);

            expect(fs).toBeDefined();
            expect(crypto).toBeDefined();
            expect(http).toBeDefined();
            expect(https).toBeDefined();
            expect(path).toBeDefined();
            expect(url).toBeDefined();
            expect(buffer).toBeDefined();
            expect(process).toBeDefined();
        });

        it('Should handle file operations with path utilities', async () => {
            const fs = await polyfill.fs();
            const path = await polyfill.path();

            const filePath = path.join('.', 'package.json');
            const exists = fs.existsSync(filePath);
            expect(exists).toBe(true);

            if (exists) {
                const content = fs.readFileSync(filePath, 'utf8');
                expect(content.length).toBeGreaterThan(0);
                expect(content).toContain('"name"');
            }
        });

        it('Should create hash of existing file using multiple polyfills', async () => {
            // Create a fresh polyfill instance to avoid interference
            const freshScope = new A_Scope({
                components: [A_Polyfill, A_Logger]
            });
            const freshPolyfill = freshScope.resolve(A_Polyfill);

            // Only initialize the needed polyfills
            const crypto = await freshPolyfill.crypto();
            const path = await freshPolyfill.path();
            const fs = await freshPolyfill.fs();

            const filePath = path.resolve('./package.json');


            const exists = fs.existsSync(filePath);

            if (exists) {
                const hash = await crypto.createFileHash(filePath, 'sha256');
                expect(hash).toBeDefined();
                expect(hash).toContain('sha256-');
            } else {
                // If package.json doesn't exist, create a test with text hash instead
                const hash = await crypto.createTextHash('test content', 'sha256');
                expect(hash).toBeDefined();
                expect(hash).toContain('sha256-');
            }
        });
    });

    describe('Error Handling Tests', () => {
        it('Should handle non-existent file gracefully', async () => {
            const fs = await polyfill.fs();
            const exists = fs.existsSync('./non-existent-file.txt');
            expect(exists).toBe(false);
        });

        it('Should handle invalid hash algorithms gracefully', async () => {
            const crypto = await polyfill.crypto();

            try {
                await crypto.createTextHash('test', 'invalid-algorithm');
                // If it doesn't throw, it should still return a string
            } catch (error) {
                // Error is expected for invalid algorithms
                expect(error).toBeDefined();
            }
        });

        it('Should handle malformed URLs gracefully', async () => {
            const url = await polyfill.url();
            const parsed = url.parse('not-a-valid-url');

            // Should return an object even for invalid URLs
            expect(typeof parsed).toBe('object');
        });
    });
});