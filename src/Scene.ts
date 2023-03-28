import { IScene } from "./SceneManager";
import { MediatorScene } from "./MediatorScene";
import { GameObject } from "./GameObject";

export class Scene implements IScene {
    /**
     * Get a direct references to the Game Engine in your State.
     */
    // private _ce: GameEngine;

    private _realScene: MediatorScene;

    // private _input: Input;

    private _initialized: boolean = false;

    public playing = false;

    constructor() {
        // _ce = GameEngine.getInstance();
        this._realScene = new MediatorScene(this);
    }

    /**
     * Called by the Engine.
     */
    public destroy() {
        this._realScene.destroy();
    }

    /**
     * Gets a reference to this state's view manager. Take a look at the class definition for more information about this.
     */
    public get view() {
        return this._realScene.view;
    }

    public get initialized() {
        return this._initialized;
    }

    public preload(): boolean {
        // this._realScene.view = this.createView();
        // this._input = _ce.input;
        return false;
    }

    public onPreloadComplete(event: any) {
        this.initialize();
        // this._ce.sceneManager.destroyPreviousScenes();
        this.playing = true;
    }

    /**
     * You'll most definitely want to override this method when you create your own State class. This is where you should
     * add all your GameObjects and pretty much make everything. Please note that you can't successfully call add() on a
     * state in the constructur. You should call it in this initialize() method.
     */
    public initialize() {
        console.log('Init scene');
    }

    /**
     * This method calls update on all the GameObjects that are attached to this state.
     * The update method also checks for GameObjects that are ready to be destroyed and kills them.
     * Finally, this method updates the View manager.
     */
    public update(timeDelta: number) {
        this._realScene.update(timeDelta);
    }

    /**
     * This method is called when the Scene is paused (it does not update objects or views)
     */
    public updatePause(timeDelta: number) {
        this._realScene.updatePause(timeDelta);
    }

    /**
     * Call this method to add a GameObject to this state. All visible game objects and physics objects
     * will need to be created and added via this method so that they can be properly created, managed, updated, and destroyed.
     * @return The GameObject that you passed in. Useful for linking commands together.
     */
    public add(object: GameObject) {
        return this._realScene.add(object);
    }

    /**
     * Call this method to add a PoolObject to this state. All pool objects and  will need to be created
     * and added via this method so that they can be properly created, managed, updated, and destroyed.
     * @param poolObject The PoolObject isGameObjectPool's value must be true to be render through the State.
     * @return The PoolObject that you passed in. Useful for linking commands together.
     */
    // public addPoolObject(poolObject: PoolObject) {
    //     return this._realScene.addPoolObject(poolObject);
    // }

    /**
     * When you are ready to remove an object from getting updated, viewed, and generally being existent, call this method.
     * Alternatively, you can just set the object's kill property to true. That's all this method does at the moment.
    /*/
    public remove(object: GameObject) {
        this._realScene.remove(object);
    }

    /**
     * removeImmediately instaneously destroys and remove the object from the state.
     *
     * While using remove() is recommended, there are specific case where this is needed.
     * please use with care.
     *
     * Warning:
     * - can break box2D if called directly or indirectly in a collision listener.
     * - effects unknown with nape.
     */
    public removeImmediately(object: GameObject) {
        this._realScene.removeImmediately(object);
    }

    /**
     * Gets a reference to a GameObject by passing that object's name in.
     * Often the name property will be set via a level editor.
     * @param name The name property of the object you want to get a reference to.
     */
    public getObjectByName(name: string) {
        return this._realScene.getObjectByName(name);
    }

    /**
     * This returns a vector of all objects of a particular name. This is useful for adding an event handler
     * to objects that aren't similar but have the same name. For instance, you can track the collection of
     * coins plus enemies that you've named exactly the same. Then you'd loop through the returned vector to change properties or whatever you want.
     * @param name The name property of the object you want to get a reference to.
     */
    public getObjectsByName(name: string) {
        return this._realScene.getObjectsByName(name);
    }

    /**
     * Returns the first instance of a GameObject that is of the class that you pass in.
     * This is useful if you know that there is only one object of a certain time in your state (such as a "Hero").
     * @param type The class of the object you want to get a reference to.
     */
    public getFirstObjectByType(type: any) {
        return this._realScene.getFirstObjectByType(type);
    }

    /**
     * This returns a vector of all objects of a particular type. This is useful for adding an event handler
     * to all similar objects. For instance, if you want to track the collection of coins, you can get all objects
     * of type "Coin" via this method. Then you'd loop through the returned array to add your listener to the coins' event.
     * @param type The class of the object you want to get a reference to.
     */
    public getObjectsByType(type: any) {
        return this._realScene.getObjectsByType(type);
    }

    /**
     * Destroy all the objects added to the State and not already killed.
     * @param except GameObjects you want to save.
     */
    public killAllObjects(...except: GameObject[]) {
        this._realScene.killAllObjects(...except);
    }

    /**
     * Contains all the objects added to the State and not killed.
     */
    public get objects() {
        return this._realScene.objects;
    }

    /**
     * Override this method if you want a state to create an instance of a custom view.
     */
    private createView() {
        // return new SpriteView(this);
    }
}
