import { SceneManager } from '../src/SceneManager';
import { Engine } from '../src';
import { getInstance } from './helpers';
jest.mock('../src/SceneManager');

describe('Engine tests', () => {
    let engine: Engine;

    beforeEach(() => {
        //@ts-ignore
        SceneManager.mockClear();
        engine = new Engine();
    });

    test('Engine should create scene manager', () => {
        expect(SceneManager).toHaveBeenCalledTimes(1);
        expect(engine.sceneManager).toBeDefined();
    });

    test('Destroyed Engine should destroy scene manager', () => {
        engine.destroy();

        const mockSceneManager = getInstance(SceneManager);
        const mockSceneDestroy = mockSceneManager.destroy;
        expect(mockSceneDestroy).toHaveBeenCalledTimes(1);
    });

    test('Engine should be play by default', () => {
        expect(engine.playing).toBeTruthy();
    });

    test('Engine should update scene manager', () => {
        engine.update(1);

        const mockSceneManager = getInstance(SceneManager);
        const mockSceneUpdate = mockSceneManager.update;
        expect(mockSceneUpdate).toHaveBeenCalledWith(1);
        expect(mockSceneUpdate).toHaveBeenCalledTimes(1);
    });

    test('Stopped Engine should not update scene manager', () => {
        engine.playing = false;

        const mockSceneManager = getInstance(SceneManager);
        const mockSceneUpdate = mockSceneManager.update;
        expect(mockSceneUpdate).toHaveBeenCalledTimes(0);
    });
});
