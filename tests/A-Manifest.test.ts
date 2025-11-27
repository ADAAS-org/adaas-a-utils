import { A_Component, A_Entity } from "@adaas/a-concept";
import { A_Manifest } from "../src/lib/A-Manifest/A-Manifest.context";

describe('A_Manifest', () => {
    it('Should deny access to excluded components at component level', () => {
        class UserController extends A_Component {
            get() { return 'user.get'; }
            post() { return 'user.post'; }
        }
        class GuestUser extends A_Component {}
        class RegisteredUser extends A_Component {}

        const manifest = new A_Manifest([
            {
                component: UserController,
                exclude: [GuestUser]
            }
        ]);

        expect(manifest.isAllowed(UserController, 'get').for(GuestUser)).toBe(false);
        expect(manifest.isAllowed(UserController, 'post').for(GuestUser)).toBe(false);
        expect(manifest.isAllowed(UserController, 'get').for(RegisteredUser)).toBe(true);
    });

    it('Should allow access only to included components at component level', () => {
        class AdminController extends A_Component {
            get() { return 'admin.get'; }
            adminPanel() { return 'admin.adminPanel'; }
        }
        class AdminUser extends A_Component {}
        class SuperAdmin extends A_Component {}
        class RegisteredUser extends A_Component {}

        const manifest = new A_Manifest([
            {
                component: AdminController,
                apply: [AdminUser, SuperAdmin]
            }
        ]);

        expect(manifest.isAllowed(AdminController, 'get').for(RegisteredUser)).toBe(false);
        expect(manifest.isAllowed(AdminController, 'get').for(AdminUser)).toBe(true);
        expect(manifest.isAllowed(AdminController, 'adminPanel').for(SuperAdmin)).toBe(true);
    });

    it('Should respect method-level exclusion rules', () => {
        class UserController extends A_Component {
            get() { return 'user.get'; }
            post() { return 'user.post'; }
            delete() { return 'user.delete'; }
        }
        class GuestUser extends A_Component {}
        class RegisteredUser extends A_Component {}
        class AdminUser extends A_Component {}
        class SuperAdmin extends A_Component {}

        const manifest = new A_Manifest([
            {
                component: UserController,
                methods: [
                    {
                        method: 'delete',
                        apply: [AdminUser, SuperAdmin]
                    },
                    {
                        method: 'post',
                        exclude: [GuestUser]
                    }
                ]
            }
        ]);

        expect(manifest.isAllowed(UserController, 'get').for(GuestUser)).toBe(true);
        expect(manifest.isAllowed(UserController, 'post').for(GuestUser)).toBe(false);
        expect(manifest.isAllowed(UserController, 'post').for(RegisteredUser)).toBe(true);
        expect(manifest.isAllowed(UserController, 'delete').for(RegisteredUser)).toBe(false);
        expect(manifest.isAllowed(UserController, 'delete').for(AdminUser)).toBe(true);
    });

    it('Should handle regex patterns for method matching', () => {
        class UserController extends A_Component {
            get() { return 'user.get'; }
            post() { return 'user.post'; }
            put() { return 'user.put'; }
            delete() { return 'user.delete'; }
        }
        class GuestUser extends A_Entity {}
        class RegisteredUser extends A_Entity {}

        const manifest = new A_Manifest([
            {
                component: UserController,
                methods: [
                    {
                        method: /^(post|put|delete)$/,
                        exclude: [GuestUser]
                    }
                ]
            }
        ]);

        expect(manifest.isAllowed(UserController, 'get').for(GuestUser)).toBe(true);
        expect(manifest.isAllowed(UserController, 'post').for(GuestUser)).toBe(false);
        expect(manifest.isAllowed(UserController, 'put').for(GuestUser)).toBe(false);
        expect(manifest.isAllowed(UserController, 'delete').for(GuestUser)).toBe(false);
        expect(manifest.isAllowed(UserController, 'post').for(RegisteredUser)).toBe(true);
    });

    it('Should allow method-level overrides of component-level rules', () => {
        class UserController extends A_Component {
            get() { return 'user.get'; }
            post() { return 'user.post'; }
        }
        class AdminController extends A_Component {
            get() { return 'admin.get'; }
        }
        class GuestUser extends A_Component {}
        class RegisteredUser extends A_Component {}
        class AdminUser extends A_Component {}
        class SuperAdmin extends A_Component {}

        const manifest = new A_Manifest([
            {
                component: UserController,
                exclude: [GuestUser],
                methods: [
                    {
                        method: 'get',
                        apply: [GuestUser, RegisteredUser, AdminUser, SuperAdmin]
                    }
                ]
            },
            {
                component: AdminController,
                apply: [AdminUser, SuperAdmin]
            }
        ]);

        // Method-level rule Should override component-level exclusion
        expect(manifest.isAllowed(UserController, 'get').for(GuestUser)).toBe(true);
        
        // Component-level exclusion Should apply to methods without specific rules
        expect(manifest.isAllowed(UserController, 'post').for(GuestUser)).toBe(false);
        
        // Other component rules Should work independently
        expect(manifest.isAllowed(AdminController, 'get').for(RegisteredUser)).toBe(false);
        expect(manifest.isAllowed(AdminController, 'get').for(AdminUser)).toBe(true);
    });

    it('Should work with isExcluded method', () => {
        class UserController extends A_Component {
            post() { return 'user.post'; }
        }
        class GuestUser extends A_Component {}
        class RegisteredUser extends A_Component {}

        const manifest = new A_Manifest([
            {
                component: UserController,
                exclude: [GuestUser]
            }
        ]);

        expect(manifest.isExcluded(UserController, 'post').for(GuestUser)).toBe(true);
        expect(manifest.isExcluded(UserController, 'post').for(RegisteredUser)).toBe(false);
    });

    it('Should handle empty configuration and allow all by default', () => {
        class UserController extends A_Component {
            get() { return 'user.get'; }
        }
        class GuestUser extends A_Component {}

        const manifest = new A_Manifest([]);

        expect(manifest.isAllowed(UserController, 'get').for(GuestUser)).toBe(true);
    });

    it('Should handle component with no specific rules and allow all by default', () => {
        class UserController extends A_Component {
            get() { return 'user.get'; }
        }
        class GuestUser extends A_Component {}

        const manifest = new A_Manifest([
            {
                component: UserController
                // No apply or exclude rules
            }
        ]);

        expect(manifest.isAllowed(UserController, 'get').for(GuestUser)).toBe(true);
    });

    it('Should apply component-level rules to all methods when no method rules exist', () => {
        class UserController extends A_Component {
            get() { return 'user.get'; }
            post() { return 'user.post'; }
        }
        class GuestUser extends A_Component {}

        const manifest = new A_Manifest([
            {
                component: UserController,
                exclude: [GuestUser]
            }
        ]);

        expect(manifest.isAllowed(UserController, 'get').for(GuestUser)).toBe(false);
        expect(manifest.isAllowed(UserController, 'post').for(GuestUser)).toBe(false);
        expect(manifest.isAllowed(UserController, 'anyMethod').for(GuestUser)).toBe(false);
    });

    it('Should throw error for invalid configuration type', () => {
        expect(() => {
            // @ts-ignore - Testing runtime error
            new A_Manifest("invalid");
        }).toThrow();
    });

    it('Should throw error for non-component constructor in configuration', () => {
        class GuestUser extends A_Component {}

        expect(() => {
            new A_Manifest([
                {
                    // @ts-ignore - Testing runtime error
                    component: "not-a-constructor",
                    exclude: [GuestUser]
                }
            ]);
        }).toThrow();
    });

    it('Should handle multiple method rules for the same component', () => {
        class UserController extends A_Component {
            get() { return 'user.get'; }
            post() { return 'user.post'; }
            put() { return 'user.put'; }
            delete() { return 'user.delete'; }
        }
        class GuestUser extends A_Component {}
        class RegisteredUser extends A_Component {}
        class AdminUser extends A_Component {}

        const manifest = new A_Manifest([
            {
                component: UserController,
                methods: [
                    {
                        method: 'get',
                        apply: [GuestUser, RegisteredUser, AdminUser]
                    },
                    {
                        method: 'post',
                        apply: [RegisteredUser, AdminUser]
                    },
                    {
                        method: 'delete',
                        apply: [AdminUser]
                    }
                ]
            }
        ]);

        expect(manifest.isAllowed(UserController, 'get').for(GuestUser)).toBe(true);
        expect(manifest.isAllowed(UserController, 'post').for(GuestUser)).toBe(false);
        expect(manifest.isAllowed(UserController, 'post').for(RegisteredUser)).toBe(true);
        expect(manifest.isAllowed(UserController, 'delete').for(RegisteredUser)).toBe(false);
        expect(manifest.isAllowed(UserController, 'delete').for(AdminUser)).toBe(true);
        expect(manifest.isAllowed(UserController, 'put').for(GuestUser)).toBe(true); // No rule = allow
    });

    it('Should prioritize exclude rules over apply rules', () => {
        class UserController extends A_Component {
            post() { return 'user.post'; }
        }
        class RegisteredUser extends A_Component {}

        const manifest = new A_Manifest([
            {
                component: UserController,
                apply: [RegisteredUser],
                exclude: [RegisteredUser] // Exclude Should take precedence
            }
        ]);

        expect(manifest.isAllowed(UserController, 'post').for(RegisteredUser)).toBe(false);
    });
});