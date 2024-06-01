// app.test.ts
import { describe, it, expect } from '@jest/globals';
import { sum } from '../../app';
import connection from '../../db/connection';

beforeAll(async() => {
    await connection
})

describe("Testando dois valores", () => {
    it("Deve somar dois valores", () => {
        const resultado = sum(1, 2);
        expect(resultado).toBe(3);
    });
});
