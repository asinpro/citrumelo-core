import { SceneManagerMode, IScene, SceneManagerSceneData, Class, SceneTransition } from './types';

function removeSceneManagerSceneDataFromArray(st: SceneManagerSceneData, v: SceneManagerSceneData[]) {
    let i = v.indexOf(st);
    if (i > -1) {
        v.splice(i, 1);
    }
}

export class SceneManager {
    private _lastCreatedScene!: SceneManagerSceneData;

    private _definedscenes: SceneManagerSceneData[] = [];
    private _runningScenes: SceneManagerSceneData[] = [];
    private _scenesToCreate: SceneManagerSceneData[] = [];
    private _scenesToDestroy: SceneManagerSceneData[] = [];

    /**
     * Dispatched with a scene object, when that scene is added (visually) to CE.
     */
    // public onsceneAdded: Signal1;
    /**
     * Dispatched with a scene object, when that scene is removed/destroyed.
     */
    // public onsceneRemoved: Signal1;
    private _definedsceneNames: string[] = [];
    // protected _ce: CitrusEngine;
    // protected _transitionQueue: Array;

    /**
     * names of scenes that describe levels.
     * levels defined here can be navigated using startLevelProgression, nextLevel, gotoLevel, previousLevel.
     */
    // protected levelProgression: Array = [];
    /**
     * current level index (in levelProgression)
     */
    // protected currentLevel: int = -1;

    constructor(
        private _sceneManagerMode = SceneManagerMode.SINGLE_MODE,
    ) {
        // onsceneAdded = new Signal1(IScene);
        // onsceneRemoved = new Signal1(IScene);

        // _transitionQueue = [];
        // _ce = CitrusEngine.getInstance();
        // _ce.onPlayingChange.add(handlePlayingChanged);
    }

    /**
     * pause/resumes transitions when CE is paused/resumed
     */
    // public function handlePlayingChanged(playing : Boolean) : void {
    //     for each (var sceneData : SceneManagerSceneData in runningscenes) {
    //         if (sceneData.transitionTween != null && sceneData.transitionTween.isStarted) {
    //             if (!playing) {
    //                 sceneData.transitionTween.pause();
    //             } else
    //                 sceneData.transitionTween.resume();
    //         }
    //     }
    // }

    /**
     * add a scene to the scene manager, defined by a name and a type (Class).
     * the params object can hold additional information such as arguments to pass when the scene is constructed.
     */
    public add(name: string, type: Class<any>, params?: Record<string, any>): void {
        if (name == null || type == null)
            return;

        if (this.getDefinedSceneDataByName(name, false)) {
            return;
        }

        const sceneData = new SceneManagerSceneData(name, type);

        if (params) {
            if ('args' in params && params.args) {
                sceneData.args = params.args;
            }
            if ('transition' in params) {
                sceneData.transition = params.transition;
            }
            if ('transitionTime' in params) {
                sceneData.transitionTime = params.transitionTime;
            }
            if ('onTransitionComplete' in params) {
                sceneData.onTransitionComplete = params.onTransitionComplete;
            }
        }

        this._definedsceneNames.push(name);
        this._definedscenes.push(sceneData);
    }

    /**
     * Starts a new scene by name.
     * if destroy is true, every currently running scene will be destroyed.
     * if arguments for transition are set, this scene will come in via a transition,
     * by default, after a transition, every scene is destroyed except for the one who's transition is over.
     */
    public start(name: string, destroy: boolean = true, transition?: SceneTransition, transitionTime: number = 0, onTransitionComplete?: Function) {
        const sceneData = this.getDefinedSceneDataByName(name);
        if (!sceneData) {
            return null;
        }

        if (destroy)
            this.destroyAllButRunning();

        if (transition) {
            sceneData.transition = transition;
        }

        if (transitionTime >= 0) {
            sceneData.transitionTime = transitionTime;
        }

        if (onTransitionComplete) {
            sceneData.onTransitionComplete = onTransitionComplete;
        }

        return this.startSceneTransition(sceneData);
    }

    // public function stop(name : String):IScene {
    // 	var sceneData : SceneManagerSceneData = getRunningSceneDataByName(name);
    // 	if (sceneData == null)
    // 		return null;
    //
    // 	if(sceneData.scene != null)
    // 		scenesToDestroy.unshift(sceneData);
    //
    // 	return sceneData.scene;
    // }
    //
    // public function setSceneArgs(name:String,args:Array):void {
    // 	var sceneData : SceneManagerSceneData = getDefinedSceneDataByName(name,false);
    // 	if(sceneData != null) {
    // 		sceneData.args = args;
    // 	}
    // }

    /**
     * get SceneManagerSceneData from the definedscenes list. (scene definition)
     */
    private getDefinedSceneDataByName(name: string, clone: boolean = true) {
        for (const sceneData of this._definedscenes) {
            if (sceneData.name === name) {
                if (clone) {
                    return sceneData.clone();
                } else {
                    return sceneData;
                }
            }
        }
        return null;
    }

    /**
     * get SceneManagerSceneData from the running scenes list.
     */
    // protected function getRunningSceneDataByName(name : String) : SceneManagerSceneData {
    // 	for each (var sceneData : SceneManagerSceneData in runningscenes)
    // 		if (sceneData.name == name)
    // 				return sceneData;
    // 	return null;
    // }

    /**
     * creates the scene object , set it in the SceneManagerSceneData, and returns it.
     */
    protected createScene(sceneData: SceneManagerSceneData) {
        const scene = this.createObjectWithArgs(sceneData.type, sceneData.args);
        sceneData.scene = scene;
        return scene;
    }

    /**
     * this creates the transition and starts it if it exists.
     * in any case the scene is then queued up in scenesToCreate.
     */
    protected startSceneTransition(sceneData: SceneManagerSceneData) {
        const transition = sceneData.transition;
        const transitionTime = sceneData.transitionTime;
        const scene = this.createScene(sceneData);

        if (transition !== undefined) {
            switch (transition) {
                case SceneTransition.TRANSITION_FADEOUT:
                case SceneTransition.TRANSITION_FADEIN:
                    sceneData.transitionTween = new EazeTween(scene, false);
                    sceneData.transitionTween.from(transitionTime, { alpha: 0 }).easing(Linear.easeNone);
                    break;
                case SceneTransition.TRANSITION_MOVEINLEFT:
                    sceneData.transitionTween = new EazeTween(scene, false);
                    sceneData.transitionTween.from(transitionTime, { x: -_ce.screenWidth }).easing(Linear.easeNone);
                    break;
                case SceneTransition.TRANSITION_MOVEINRIGHT:
                    sceneData.transitionTween = new EazeTween(scene, false);
                    sceneData.transitionTween.from(transitionTime, { x: _ce.screenWidth }).easing(Linear.easeNone);
                    break;
                case SceneTransition.TRANSITION_MOVEINDOWN:
                    sceneData.transitionTween = new EazeTween(scene, false);
                    sceneData.transitionTween.from(transitionTime, { y: _ce.screenHeight }).easing(Linear.easeNone);
                    break;
                case SceneTransition.TRANSITION_MOVEINUP:
                    sceneData.transitionTween = new EazeTween(scene, false);
                    sceneData.transitionTween.from(transitionTime, { y: -_ce.screenHeight }).easing(Linear.easeNone);
                    break;
            }

            sceneData.transitionTween.updateNow();
            sceneData.transitionTween.onComplete(() => {
                switch (this._sceneManagerMode) {
                    case SceneManagerMode.SINGLE_MODE:
                        this.destroyAllButRunningExcept(sceneData);
                        break;
                }

                if (sceneData.onTransitionComplete != null)
                    sceneData.onTransitionComplete();

                sceneData.transition = null;
                sceneData.transitionTime = NaN;
                sceneData.onTransitionComplete = null;
                sceneData.transitionTween = null;
            });
        }

        this._scenesToCreate.unshift(sceneData);
        return scene;
    }

    // public function destroyPreviousScenes():void {
    // 	destroyAllButRunningExcept(lastCreatedscene);
    // }

    /**
     * Destroy all but running scenes except specific by scene data.
     */
    protected destroyAllButRunningExcept(sceneData: SceneManagerSceneData) {
        for (const std of this._scenesToCreate) {
            if (std == sceneData) {
                continue;
            }
            this.removeSceneFromEngine(sceneData);
        }
        this._scenesToCreate.length = 0;

        for (const rscene of this._runningScenes)
        if (this._scenesToDestroy.indexOf(rscene) == -1) {
            this._scenesToDestroy.unshift(rscene);
        }
        removeSceneManagerSceneDataFromArray(sceneData, this._scenesToDestroy);
    }

    protected createObjectWithArgs(type: Class<any>, ...args: any[]) {
        if (args.length == 1) {
            return new type(args[0]) as IScene;
        } else if (args.length == 2) {
            return new type(args[0], args[1]) as IScene;
        } else if (args.length == 3) {
            return new type(args[0], args[1], args[2]) as IScene;
        } else if (args.length == 4) {
            return new type(args[0], args[1], args[2], args[3]) as IScene;
        }
        return new type() as IScene;
    }

    /**
     * Get the name of a scene object, as defined in sceneManager when the scene definition was added with sceneManager.add()
     */
    // public function getSceneName(scene : IScene) : String {
    // 	var sceneData : SceneManagerSceneData;
    //
    // 	for each (sceneData in runningscenes)
    // 		if (sceneData.scene == scene)
    // 			return sceneData.name;
    //
    // 	for each (sceneData in scenesToCreate)
    // 		if (sceneData.scene == scene)
    // 			return sceneData.name;
    //
    // 	for each (sceneData in scenesToDestroy)
    // 		if (sceneData.scene == scene)
    // 			return sceneData.name;
    //
    // 	return null;
    // }

    /**
     * sets a sequence of level names to be used with startLevelProgression,gotoLevel,nextLevel,previousLevel
     */
    // public function setLevelNames(names : Array) : void {
    // 	levelProgression = names;
    // }

    /**
     * if level names are set with setLevelNames, this will start the first scene in the list of levels.
     */
    // public function startLevelProgression() : void {
    // 	currentLevel = 0;
    // 	start(levelProgression[currentLevel]);
    // }

    /**
     * if level names are set with setLevelNames, this will get the level name from the list and start the corresponding scene.
     */
    // public function gotoLevel(level : int = 0) : Boolean {
    // 	if (level > -1 && level < levelProgression.length - 1) {
    // 		start(levelProgression[currentLevel]);
    // 		return true;
    // 	}
    // 	return false;
    // }

    /**
     * if level names are set with setLevelNames, this will go to the next level of the list. (stops at the end)
     */
    // public function nextLevel() : Boolean {
    // 	if (currentLevel + 1 > levelProgression.length - 1)
    // 		return false;
    // 	currentLevel++;
    // 	start(levelProgression[currentLevel]);
    // 	return true;
    // }

    /**
     * if level names are set with setLevelNames, this will go to the previous level of the list. (stops at the beginning)
     */
    // public function previousLevel() : Boolean {
    // 	if (currentLevel - 1 < 0)
    // 		return false;
    // 	currentLevel--;
    // 	start(levelProgression[currentLevel]);
    // 	return true;
    // }

    public destroy() {
        this._scenesToCreate.forEach(sceneData => this.removeSceneFromEngine(sceneData));
        this._scenesToCreate.length = 0;

        this._runningScenes.forEach(sceneData => this.removeSceneFromEngine(sceneData));
        this._runningScenes.length = 0;

        this.collectScenes();
    }

    public update(timeDelta: number) {
        this._runningScenes.forEach(sceneData => {
            if (sceneData.scene) {
                if (sceneData.scene.playing) {
                    sceneData.scene.update(timeDelta);
                } else {
                    sceneData.scene.updatePause(timeDelta);
                }
            }
        });

        // _ce.onPostUpdate.dispatch();

        this.collectScenes();
        this.createScenes();
    }

    public getCurrentScene() {
        return this._lastCreatedScene?.scene;
    }

    // public setCurrentScene(value: IScene): void {
    //     this.destroyAllButRunning();
    //
    //     if (value == null) {
    //         return;
    //     }
    //
    //     this._lastCreatedScene = new SceneManagerSceneData("scene(anonymous)", value);
    //     // TODO rid off unshift
    //     this._scenesToCreate.unshift(this._lastCreatedScene);
    // }

    private collectScenes() {
        if (this._scenesToDestroy.length > 0) {
            this._scenesToDestroy.forEach(sceneData => {
                this.removeSceneFromEngine(sceneData);
                removeSceneManagerSceneDataFromArray(sceneData, this._runningScenes);
            });
            this._scenesToDestroy.length = 0;
        }
    }

    private createScenes() {
        this._scenesToCreate.forEach(sceneData => {
            this._runningScenes.push(sceneData);
            this.addSceneToEngine(sceneData);
        });
        this._scenesToCreate.length = 0;
    }

    /**
        * Destroy all but running scenes.
        */
    private destroyAllButRunning() {
        this._scenesToCreate.forEach(sceneData => {
            this.removeSceneFromEngine(sceneData);
        });
        this._scenesToCreate.length = 0;

        this._runningScenes.forEach(rscene => {
            if (this._scenesToDestroy.indexOf(rscene) < 0) {
                this._scenesToDestroy.unshift(rscene);
            }
        });
        this._runningScenes.length = 0;
    }

    private removeSceneFromEngine(sceneData: SceneManagerSceneData) {
        sceneData.scene.playing = false;
        sceneData.destroy();
        // _ce.removeScene(sceneData.scene);
        // onsceneRemoved.dispatch(sceneData.scene);
        // sceneData.scene = null;
    }

    private addSceneToEngine(sceneData: SceneManagerSceneData) {
        this._lastCreatedScene = sceneData;

        // _ce.addSceneOver(sceneData.scene);

        if (sceneData.scene.preload()) {
            sceneData.preloading = true;
            sceneData.scene.playing = false;
        } else {
            // sceneData.transitionTween?.start();
            sceneData.scene.initialize();
            sceneData.scene.playing = true;
        }

        // this.onsceneAdded.dispatch(sceneData.scene);
    }

}
