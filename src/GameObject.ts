let last_id = 0;

export class GameObject {
    public readonly ID: number;

    /**
     * A name to identify easily an objet. You may use duplicate name if you wish.
     */
    public name!: string;

    /**
     * Set it to true if you want to remove, clean and destroy the object.
     */
    public kill = false;

    /**
     * This property prevent the <code>update</code> method to be called by the enter frame, it will save performances.
     * Set it to true if you want to execute code in the <code>update</code> method.
     */
    public updateCallEnabled = false;

    /**
     * Added to the Engine's render list via the Scene and the add method.
     */
    public type = "classicObject";

    protected _initialized: Boolean = false;
    // protected var _ce:CitrusEngine;
    // protected var _parentScene : IScene;

    /**
     * The time elasped between two update call.
     */
    // protected var _timeDelta:Number;

    /**
     * Every Citrus Object needs a name. It helps if it's unique, but it won't blow up if it's not.
     * Also, you can pass parameters into the constructor as well. Hopefully you'll commonly be
     * creating CitrusObjects via an editor, which will parse your shit and create the params object for you.
     * @param name Name your object.
     * @param params Any public properties or setters can be assigned values via this object.
     *
     */
    constructor(private _params?: Object) {
        // this._ce = CitrusEngine.getInstance(); // set shortcut to CE.

        this.ID = last_id++;

        if (!this._params?.hasOwnProperty('name')) {
            this.name = `GameObject_${this.ID}`;
        }
    }

    public initialize(poolObjectParams?: Object): void {
        // if (poolObjectParams) {
        // 	this._params = poolObjectParams;
        // }

        if (this._params)
            this.setParams(this, this._params);
        else
            this._initialized = true;

    }

    /**
    * handleAddedToScene is called once the object is added to its parent scene.
    * at that time, everything necessary (such as the art object) for it to run, is setup.
    */
    // public function handleAddedToScene() : void {
    // }

    /**
     * handleRemovedFromScene is called once the object is removed from its parent scene,
     * but before its destruction. if the object is a pool object, its called everytime the object
     * is disposed back to the pool.
     */
    // public function handleRemovedFromScene() : void {
    // }

    /**
     * Seriously, dont' forget to release your listeners, signals, and physics objects here. Either that or don't ever destroy anything.
     * Your choice.
     */
    public destroy() {
        this._initialized = false;
        // this._params = null;
    }

    /**
     * The current state calls update every tick. This is where all your per-frame logic should go. Set velocities,
     * determine animations, change properties, etc.
     * @param timeDelta This is a ratio explaining the amount of time that passed in relation to the amount of time that
     * was supposed to pass. Multiply your stuff by this value to keep your speeds consistent no matter the frame rate.
     */
    public update(timeDelta: Number) {
        // this._timeDelta = timeDelta;
    }

    /**
     * The initialize method usually calls this.
     */
    public setParams(object: Record<string, any>, params: Record<string, any>): void {
        for (const param in params) {
            object[param] = params[param];
        }
        this._initialized = true;
    }
    //
    // citrus_internal function set parentScene(scene : IScene) : void {
    // 	_parentScene = scene;
    // }
    //
    // public function get parentScene() : IScene {
    // 	return _parentScene;
    // }

    public get initialized() {
        return this._initialized;
    }

    public toString() {
        return `GameObject $ID: ${this.ID} name: ${this.name}  type: ${this.type}`;
    }
}
