import { test as base } from '@playwright/test';

type BaseFixtures = {
    testUser: { email: string, password: string },
};

export const test = base.extend<BaseFixtures>({
    testUser: async ({}, use) => {
        const email = process.env.TEST_USER_EMAIL ?? '';
        const password = process.env.TEST_USER_PASSWORD ?? '';
        await use({ email, password });
    },
});

export { expect } from '@playwright/test';
