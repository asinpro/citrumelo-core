import { GameObject } from './GameObject'

export interface IScene {
    // get view(): AView;

    preload(): boolean
    onPreloadComplete(event: any): void
    initialize(): void
    destroy(): void

    get playing(): boolean
    set playing(value: boolean)

    update(timeDelta: number): void
    updatePause(timeDelta: number): void

    add(object: GameObject): GameObject
    remove(object: GameObject): void
    removeImmediately(object: GameObject): void
    killAllObjects(...except: GameObject[]): void

    getObjectByName(name: string): GameObject | null
    getObjectsByName(name: string): Generator<GameObject>
    getFirstObjectByType(type: any): GameObject | null
    getObjectsByType(type: any): Generator<GameObject>
    getAll(): Generator<GameObject>
}

export class SceneManager {
    private _scene!: IScene
    private _newScene: IScene | null = null
    private _sceneTransitionning: IScene | null = null
    private _futureScene: IScene | null = null

    public destroy() {
        this._scene?.destroy()
    }

    public update(delta: number) {
        //Change scenes if it has been requested
        if (this._newScene) {
            this._scene?.destroy()

            this._scene = this._newScene
            this._newScene = null

            if (this._futureScene) {
                this._futureScene = null
            } else {
                this._scene.initialize()
            }
        }

        if (this._sceneTransitionning) {
            this._futureScene = this._sceneTransitionning
            this._sceneTransitionning = null

            this._futureScene.initialize()
        }

        //Update the scene
        this._scene.update(delta)
        this._futureScene?.update(delta)
    }

    /**
     * A reference to the active game scene. Actually, that's not entirely true. If you've recently changed scenes and a tick
     * hasn't occurred yet, then this will reference your new scene; this is because actual scene-changes only happen pre-tick.
     * That way you don't end up changing scenes in the middle of a scene's tick, effectively fucking stuff up.
     *
     * If you had set up a futureScene, accessing the scene it wil return you the futureScene to enable some objects instantiation
     * (physics, views, etc).
     */
    public get scene() {
        if (this._futureScene) {
            return this._futureScene
        } else if (this._newScene) {
            return this._newScene
        }
        return this._scene
    }

    /**
     * We only ACTUALLY change scenes on enter frame so that we don't risk changing scenes in the middle of a scene update.
     * However, if you use the scene getter, it will grab the new one for you, so everything should work out just fine.
     */
    public set scene(value: IScene) {
        this._newScene = value
    }

    /**
     * Get a direct access to the futureScene. Note that the futureScene is really set up after an update so it isn't
     * available via scene getter before a scene update.
     */
    public get futureScene() {
        return this._futureScene || this._sceneTransitionning
    }

    /**
     * The futureScene variable is useful if you want to have two scenes running at the same time for making a transition.
     * Note that the futureScene is added with the same index than the scene, so it will be behind unless the scene runs
     * on Starling and the futureScene on the display list (which is absolutely doable).
     */
    public set futureScene(value: IScene | null) {
        this._sceneTransitionning = value
    }
}
