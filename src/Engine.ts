import { SceneManager } from './SceneManager';

export class Engine {
    public playing = true;

    private _sceneManager = new SceneManager();

    public get sceneManager() {
        return this._sceneManager;
    }

    /**
     * This is the game loop. It switches scenes if necessary, then calls update on the current scene.
     */
    public update(delta: number) {
        if (this.playing) {
            this._sceneManager.update(delta);
        }
    }

    /**
     * Destroy the Engine
     */
    public destroy() {
        this.sceneManager.destroy();
    }
}
