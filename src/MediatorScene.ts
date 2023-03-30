import { GameObject } from './GameObject'
import { IScene } from './SceneManager'
import { List } from './List'
// import { AView } from 'AView.js';

/**
 * The MediatorScene class is very important. It usually contains the logic for a particular scene the game is in.
 * You should never instanciate/extend this class by your own. It's used via a wrapper: Scene or StarlingScene or Away3DScene.
 * There can only ever be one scene running at a time. You should extend the Scene class
 * to create logic and scripts for your levels. You can build one scene for each level, or
 * create a scene that represents all your levels. You can get and set the reference to your active
 * scene via the CitrusEngine class.
 */

// TODO mark as final
export class MediatorScene {
    private _objects = new Set<GameObject>()
    // private _poolObjects: PoolObject[] = [];
    // private _view: AView;
    private _iscene: IScene

    constructor(iscene: IScene) {
        this._iscene = iscene
    }

    /**
     * Called by the Engine.
     */
    public destroy(): void {
        // this._poolObjects.forEach(poolObject => {
        //     poolObject.destroy();
        // });

        // this._poolObjects.length = 0;

        for (const o of this._objects) {
            this.removeImmediately(o)
        }

        // if (this._view) {
        //     this._view.destroy();
        // }

        // this._objects = null;
        // this._poolObjects = null;
        // this._view = null;
    }

    /**
     * Gets a reference to this scene's view manager. Take a look at the class definition for more information about this.
     */
    public get view() {
        return null
        // return this._view;
    }

    // public set view(value: AView) {
    //     this._view = value;
    // }

    /**
     * This method calls update on all the GameObjects that are attached to this scene.
     * The update method also checks for GameObjects that are ready to be destroyed and kills them.
     * Finally, this method updates the View manager.
     */
    public update(timeDelta: number) {
        for (const object of this._objects) {
            if (object.kill) {
                this.removeImmediately(object)
            } else {
                if (object.updateCallEnabled) {
                    object.update(timeDelta)
                }
            }
        }

        // this._poolObjects.forEach(poolObject => {
        //     poolObject.updatePhysics(timeDelta);
        // });

        // Update the scene's view
        // this._view.update(timeDelta);
    }

    public updatePause(timeDelta: Number) {}

    /**
     * Call this method to add a GameObject to this scene. All visible game objects and physics objects
     * will need to be created and added via this method so that they can be properly created, managed, updated, and destroyed.
     * @return The GameObject that you passed in. Useful for linking commands together.
     */
    public add(object: GameObject) {
        if (this._objects.has(object)) {
            throw new Error(`${object.name} + is already added to the scene`)
        }

        // object.citrus_internal:: parentScene = _iscene;

        if (!object.initialized) {
            object.initialize()
        }

        // if (object is APhysicsObject) {
        //     (object as APhysicsObject).addPhysics();
        // }

        // if (object is APhysicsEngine) {
        //     _objects.unshift(object);
        // } else {
        this._objects.add(object)
        // }

        // this._view.addArt(object);

        // object.handleAddedToScene();

        return object
    }

    /**
     * Call this method to add a PoolObject to this scene. All pool objects and  will need to be created
     * and added via this method so that they can be properly created, managed, updated, and destroyed.
     * @param poolObject The PoolObject isGameObjectPool's value must be true to be render through the Scene.
     * @return The PoolObject that you passed in. Useful for linking commands together.
     */
    // public function addPoolObject(poolObject: PoolObject): PoolObject {
    //     if (poolObject.isGameObjectPool) {
    //         poolObject.citrus_internal:: scene = _iscene;
    //         _poolObjects.push(poolObject);
    //
    //         return poolObject;
    //
    //     } else return null;
    // }

    /**
     * removeImmediately instaneously destroys and remove the object from the scene.
     *
     * While using remove() is recommended, there are specific case where this is needed.
     * please use with care.
     */
    public remove(object: GameObject) {
        object.kill = true
    }

    public removeImmediately(object: GameObject) {
        if (object == null) {
            return
        }

        object.kill = true
        this._objects.delete(object)
        // object.handleRemovedFromScene();

        // this._view.removeArt(object);

        object.destroy()
    }

    /**
     * Gets a reference to a GameObject by passing that object's name in.
     * Often the name property will be set via a level editor such as the Flash IDE.
     * @param name The name property of the object you want to get a reference to.
     */
    public getObjectByName(name: string) {
        for (const object of this._objects) {
            if (object.name == name) {
                return object
            }
        }

        // if (this._poolObjects.length > 0) {
        //         poolObject: PoolObject;
        //         found: Boolean = false;
        //         for each(poolObject in _poolObjects)
        //         {
        //                 poolObject.foreachRecycled(function(pobject: *): Boolean {
        //                     if (pobject is GameObject && pobject["name"] == name)
        //                     {
        //                 object = pobject;
        //                 return found = true;
        //             }
        //                     return false;
        //     });
        //
        // if (found)
        //     return object;
        // }
        // }

        return null
    }

    /**
     * This returns a vector of all objects of a particular name. This is useful for adding an event handler
     * to objects that aren't similar but have the same name. For instance, you can track the collection of
     * coins plus enemies that you've named exactly the same. Then you'd loop through the returned vector to change properties or whatever you want.
     * @param name The name property of the object you want to get a reference to.
     */
    public *getObjectsByName(name: string) {
        for (const object of this._objects) {
            if (object.name == name) {
                yield object
            }
        }

        // if (_poolObjects.length > 0) {
        //                 poolObject: PoolObject;
        //                 for each(poolObject in _poolObjects)
        //                 {
        //                         poolObject.foreachRecycled(function(pobject: *): Boolean {
        //                             if (pobject is GameObject && pobject["name"] == name)
        //                             objects.push(pobject as GameObject);
        //                         return false;
        //                     });
        //             }
        //     }
        //
    }

    /**
     * Returns the first instance of a GameObject that is of the class that you pass in.
     * This is useful if you know that there is only one object of a certain time in your scene (such as a "Hero").
     * @param type The class of the object you want to get a reference to.
     */
    public getFirstObjectByType(type: any) {
        for (const object of this._objects) {
            if (object.constructor == type) {
                return object
            }
        }

        //         if (_poolObjects.length > 0) {
        //             poolObject: PoolObject;
        //             found: Boolean = false;
        //             for each(poolObject in _poolObjects)
        //                 {
        //                     poolObject.foreachRecycled(function(pobject: *): Boolean {
        //                         if (pobject is type)
        //                             {
        //                     object = pobject;
        //                     return found = true;
        //                 }
        //                             return false;
        //         });
        //
        //     if (found)
        //         return object;
        // }
        //         }
        //
        return null
    }

    /**
     * This returns a vector of all objects of a particular type. This is useful for adding an event handler
     * to all similar objects. For instance, if you want to track the collection of coins, you can get all objects
     * of type "Coin" via this method. Then you'd loop through the returned array to add your listener to the coins' event.
     * @param type The class of the object you want to get a reference to.
     */
    public *getObjectsByType(type: any) {
        for (const object of this._objects) {
            if (object.constructor == type) {
                yield object
            }
        }

        //         if (_poolObjects.length > 0) {
        //             poolObject: PoolObject;
        //             for each(poolObject in _poolObjects)
        //                 {
        //                     poolObject.foreachRecycled(function(pobject: *): Boolean {
        //                         if (pobject is type)
        //                             objects.push(pobject as GameObject);
        //                     return false;
        //                 });
        //         }
        // }
    }

    /**
     * Destroy all the objects added to the Scene and not already killed.
     * @param except GameObjects you want to save.
     */
    public killAllObjects(...except: GameObject[]) {
        for (const object of this._objects) {
            if (~except.indexOf(object)) {
                object.kill = true
            }
        }
    }

    /**
     * Contains all the objects added to the Scene and not killed.
     */
    public *getAll() {
        for (const o of this._objects) {
            yield o
        }
        // yield* this._objects;
    }
}
