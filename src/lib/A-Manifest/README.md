# A-Manifest Usage Guide

The `A_Manifest` class provides a flexible configuration system for controlling component access and method permissions using regex patterns. It allows you to include or exclude components for particular methods based on sophisticated rule-based configurations.

## Core Concepts

### 1. **Component-Level Rules**
Apply rules to all methods of a component:

```typescript
const manifest = new A_Manifest([
    {
        component: UserController,
        exclude: [GuestUser] // Guests cannot access any UserController methods
    }
]);
```

### 2. **Method-Level Rules**
Apply specific rules to individual methods:

```typescript
const manifest = new A_Manifest([
    {
        component: UserController,
        methods: [
            {
                method: 'delete',
                apply: [AdminUser, SuperAdmin] // Only admins can delete
            },
            {
                method: 'post',
                exclude: [GuestUser] // Guests cannot create
            }
        ]
    }
]);
```

### 3. **Regex Support**
Use regex patterns for flexible matching:

```typescript
const manifest = new A_Manifest([
    {
        component: UserController,
        methods: [
            {
                method: /^(post|put|delete)$/, // Match mutating operations
                exclude: [GuestUser]
            }
        ]
    }
]);
```

## API Reference

### Constructor
```typescript
new A_Manifest(config: A_UTILS_TYPES__Manifest_Init)
```

Creates a new manifest with the provided configuration.

### isAllowed()
```typescript
isAllowed<T extends A_Component>(
    ctor: T | A_TYPES__Component_Constructor<T>,
    method: string
): A_ManifestChecker
```

Returns a fluent checker to verify if access is allowed.

**Usage:**
```typescript
const allowed = manifest.isAllowed(UserController, 'post').for(GuestUser);
```

### isExcluded()
```typescript
isExcluded<T extends A_Component>(
    ctor: T | A_TYPES__Component_Constructor<T>,
    method: string
): A_ManifestChecker
```

Returns a fluent checker to verify if access is explicitly excluded.

**Usage:**
```typescript
const excluded = manifest.isExcluded(UserController, 'post').for(GuestUser);
```

## Configuration Types

### A_UTILS_TYPES__Manifest_ComponentLevelConfig
```typescript
{
    component: A_TYPES__Component_Constructor<T>,
    methods?: Array<A_UTILS_TYPES__Manifest_MethodLevelConfig<T>>,
    apply?: Array<A_UTILS_TYPES__Manifest_AllowedComponents> | RegExp,
    exclude?: Array<A_UTILS_TYPES__Manifest_AllowedComponents> | RegExp
}
```

### A_UTILS_TYPES__Manifest_MethodLevelConfig
```typescript
{
    method: string | RegExp,
    apply?: Array<A_UTILS_TYPES__Manifest_AllowedComponents> | RegExp,
    exclude?: Array<A_UTILS_TYPES__Manifest_AllowedComponents> | RegExp
}
```

## Rule Precedence

1. **Method-level rules** override component-level rules
2. **Exclude rules** take precedence over apply rules
3. **No rules** = allow by default

## Advanced Examples

### Example 1: Hierarchical Permissions
```typescript
const manifest = new A_Manifest([
    {
        component: UserController,
        exclude: [GuestUser], // Base rule: no access for guests
        methods: [
            {
                method: 'get',
                apply: [GuestUser, RegisteredUser, AdminUser] // Override: guests can read
            },
            {
                method: 'delete',
                apply: [AdminUser] // Only admins can delete
            }
        ]
    }
]);
```

### Example 2: Using Regex for Complex Patterns
```typescript
const manifest = new A_Manifest([
    {
        component: AdminController,
        methods: [
            {
                method: /^admin/, // Methods starting with "admin"
                apply: [SuperAdmin] // Only super admins
            },
            {
                method: /^(get|list)/, // Read operations
                apply: [AdminUser, SuperAdmin] // All admins
            }
        ]
    }
]);
```

### Example 3: Multiple Components
```typescript
const manifest = new A_Manifest([
    {
        component: UserController,
        exclude: [GuestUser]
    },
    {
        component: AdminController,
        apply: [AdminUser, SuperAdmin]
    },
    {
        component: PublicController,
        // No rules = accessible to all
    }
]);
```

## Best Practices

1. **Start with restrictive rules** and add exceptions rather than the opposite
2. **Use component-level rules** for broad access control
3. **Use method-level rules** for fine-grained permissions
4. **Leverage regex patterns** for dynamic method matching
5. **Test your configurations** thoroughly with the provided fluent API

## Error Handling

The manifest will throw `A_ManifestError` for:
- Invalid configuration structure
- Non-component constructors in configuration
- Malformed regex patterns

## Performance Considerations

- Rules are compiled to regex patterns during initialization
- Runtime checks are optimized for fast pattern matching
- Consider the number of rules when designing complex hierarchies