import { SceneManager } from '../src/SceneManager';
import { Scene } from '../src';
import { getInstance } from './helpers';
jest.mock('../src/Scene');

describe('SceneManager tests', () => {
    let sceneManager: SceneManager;

    beforeEach(() => {
        //@ts-ignore
        Scene.mockClear();
        sceneManager = new SceneManager();
    });

    test('SceneManager should not have scene by default', () => {
        expect(sceneManager.scene).toBeUndefined();
    });

    test('SceneManager should always return actual scene', () => {
        const scene = new Scene();
        const newScene = new Scene();
        const futureScene = new Scene();

        sceneManager.scene = scene;
        expect(sceneManager.scene).toEqual(scene);
        sceneManager.update(1);
        expect(sceneManager.scene).toEqual(scene);

        sceneManager.scene = newScene;
        expect(sceneManager.scene).toEqual(newScene);
        sceneManager.update(1);
        expect(sceneManager.scene).toEqual(newScene);

        sceneManager.futureScene = futureScene;
        expect(sceneManager.scene).toEqual(newScene);
        sceneManager.update(1);
        expect(sceneManager.scene).toEqual(futureScene);
    });

    test('SceneManager should always return future scene if it is set', () => {
        const futureScene = new Scene();
        const newFutureScene = new Scene();

        sceneManager.futureScene = futureScene;
        expect(sceneManager.futureScene).toEqual(futureScene);
        sceneManager.update(1);
        expect(sceneManager.futureScene).toEqual(futureScene);

        sceneManager.futureScene = newFutureScene;
        expect(sceneManager.futureScene).toEqual(futureScene);
        sceneManager.update(1);
        expect(sceneManager.futureScene).toEqual(newFutureScene);
    });

    test('SceneManager should reset future scene after new scene setting', () => {
        const newScene = new Scene();
        const futureScene = new Scene();

        sceneManager.futureScene = futureScene;
        expect(sceneManager.scene).toBeUndefined();
        expect(sceneManager.futureScene).toEqual(futureScene);
        sceneManager.update(1);
        expect(sceneManager.scene).toEqual(futureScene);
        expect(sceneManager.futureScene).toEqual(futureScene);

        sceneManager.scene = newScene;
        expect(sceneManager.scene).toEqual(futureScene);
        expect(sceneManager.futureScene).toEqual(futureScene);
        sceneManager.update(1);
        expect(sceneManager.scene).toEqual(newScene);
        expect(sceneManager.futureScene).toBeNull();
    });

    test('SceneManager should initialize scene in next frame', () => {
        sceneManager.scene = new Scene();
        const mockScene = getInstance(Scene);
        const mockSceneInit = mockScene.initialize;

        expect(mockSceneInit).not.toHaveBeenCalled();
        sceneManager.update(1);
        expect(mockSceneInit).toHaveBeenCalledTimes(1);
    });

    test('SceneManager should initialize future scene in next frame', () => {
        sceneManager.futureScene = new Scene();
        const mockScene = getInstance(Scene);
        const mockSceneInit = mockScene.initialize;

        expect(mockSceneInit).not.toHaveBeenCalled();
        sceneManager.update(1);
        expect(mockSceneInit).toHaveBeenCalledTimes(1);
    });

    test('Destroyed SceneManager should destroy all initialized scenes', () => {
        const scene = new Scene();
        const mockScene = getInstance(Scene, 0);
        const mockSceneInit = mockScene.initialize;
        const mockSceneDestroy = mockScene.destroy;
        const futureScene = new Scene();
        const mockFutureScene = getInstance(Scene, 1);
        const mockFutureSceneInit = mockFutureScene.initialize;
        const mockFutureSceneDestroy = mockFutureScene.destroy;

        sceneManager.scene = scene;
        sceneManager.update(1);
        expect(mockSceneInit).toHaveBeenCalledTimes(1);

        sceneManager.futureScene = futureScene;
        sceneManager.update(1);
        expect(mockFutureSceneInit).toHaveBeenCalledTimes(1);

        sceneManager.destroy();
        expect(mockSceneDestroy).toHaveBeenCalledTimes(1);
        expect(mockFutureSceneDestroy).toHaveBeenCalledTimes(1);
    });

    test('SceneManager should update actual scene', () => {
        sceneManager.scene = new Scene();
        sceneManager.update(1);
        const mockScene = getInstance(Scene);
        const mockSceneUpdate = mockScene.update;

        sceneManager.update(2);
        expect(mockSceneUpdate).toHaveBeenCalledTimes(2);
    });

    test('SceneManager should update future scene if it is set', () => {
        sceneManager.futureScene = new Scene();
        sceneManager.update(1);
        const mockScene = getInstance(Scene);
        const mockSceneUpdate = mockScene.update;

        sceneManager.update(2);
        expect(mockSceneUpdate).toHaveBeenCalledTimes(2);
    });
});
