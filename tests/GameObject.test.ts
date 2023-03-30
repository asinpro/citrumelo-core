import { GameObject } from '../src'
import TestGameObject from './__mock__/TestGameObject'

describe('Game Object tests', () => {
    beforeEach(() => {})

    test('ID grows incrementally', () => {
        const o1 = new GameObject()
        const o2 = new GameObject()

        expect(o1.ID).toBeLessThan(o2.ID)
    })

    test('default naming in GameObject', () => {
        const o1 = new GameObject()
        const o2 = new GameObject()

        expect(o1.name).toMatch(/GameObject_/)
        expect(o1.name).not.toMatch(o2.name)
    })

    test('default naming in GameObject is saved after initialization', () => {
        const o1 = new GameObject()
        const o2 = new GameObject()

        o1.initialize()
        o2.initialize()

        expect(o1.name).toMatch(/GameObject_/)
        expect(o1.name).not.toMatch(o2.name)
    })

    test('set name in GameObject params', () => {
        const name = 'test name'
        const o = new GameObject({ name })
        o.initialize()
        expect(o.name).toBe(name)
    })

    test('GameObject initialization', () => {
        const o = new GameObject()
        expect(o.initialized).toBeFalsy()
        o.initialize()
        expect(o.initialized).toBeTruthy()
    })

    test('GameObject destroy', () => {
        const o = new GameObject()
        o.initialize()
        expect(o.initialized).toBeTruthy()
        o.destroy()
        expect(o.initialized).toBeFalsy()
    })

    test('set params', () => {
        const params = {
            number_value: 37,
            bool_value: true,
            str_value: 'string',
            array_value: [23, true, 'abcf45', [4, 'fgh32']],
        }
        const o = new TestGameObject({ ...params })
        o.initialize()

        expect(o.number_value).toBe(params.number_value)
        expect(o.bool_value).toBe(params.bool_value)
        expect(o.str_value).toBe(params.str_value)
        expect(o.array_value).toBe(params.array_value)
    })

    test('set only defined params', () => {
        const params = {
            bool_value: true,
            str_value: 'string',
        }
        const o = new TestGameObject({ ...params })
        o.initialize()

        expect(o.number_value).toBeUndefined()
        expect(o.bool_value).toBe(params.bool_value)
        expect(o.str_value).toBe(params.str_value)
        expect(o.array_value).toBeUndefined()
    })
})
