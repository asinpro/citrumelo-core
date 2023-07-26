import { GameObject, IScene } from '../../dist/types';

export default class TestScene implements IScene {
    private _playing = true;

    preload(): boolean {
        return false;
    }
    onPreloadComplete(event: any): void {}
    initialize(): void {}
    destroy(): void {}
    get playing(): boolean {
        return this._playing;
    }
    set playing(value: boolean) {
        this._playing = value;
    }
    update(timeDelta: number): void {}
    updatePause(timeDelta: number): void {}
    add(object: GameObject): GameObject {}
    remove(object: GameObject): void {}
    removeImmediately(object: GameObject): void {}
    killAllObjects(...except: GameObject[]): void {}
    getObjectByName(name: string): GameObject | null {
        return null;
    }
    *getObjectsByName(name: string): Generator<GameObject, any, unknown> {}
    getFirstObjectByType(type: any): GameObject | null {
        return null;
    }
    *getObjectsByType(type: any): Generator<GameObject, any, unknown> {}
    *getAll(): Generator<GameObject, any, unknown> {}
}
