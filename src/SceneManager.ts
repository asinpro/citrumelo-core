import { GameObject } from "./GameObject";

export enum SceneManagerMode {
    /**
    * In this mode, the StateManager will, at maximum, have 3 states running at the same time.
    * One main state, One state to transition to, and a possible Pause state that will be on top.
    */
    SINGLE_MODE = "singleMode",
    /**
    * In this mode, the StateManager will allow you to define what happens with running states.
    * You ask it to create states and it will run them.
    */
    USER_MODE = "userMode",
}

export interface IScene {
    destroy(): void;

    // get view(): AView;

    preload(): boolean;

    onPreloadComplete(event: any): void;

    initialize(): void;

    get playing(): boolean;
    set playing(value: boolean);

    update(timeDelta: number): void;

    updatePause(timeDelta: number): void;

    add(object: GameObject): GameObject;

    remove(object: GameObject): void;

    removeImmediately(object: GameObject): void;

    getObjectByName(name: string): GameObject;

    getFirstObjectByType(type: any): GameObject;

    getObjectsByType(type: any): GameObject[];
}

class SceneManagerSceneData {
    public preloading = false;
    // public transitionTween: EazeTween;
    // public onTransitionComplete: Function;

    constructor(
        public name: string,
        public scene: IScene,
        public args?: any[],
        public transition?: string,
        public transitionTime?: number) {
    }

    public destroy() {
        // this.transitionTween?.kill();
        // this.transitionTween = null;
        this.scene.destroy();
    }

    public get type() {
        return this.scene.constructor;
    }

    // public clone() {
    //     return new SceneManagerSceneData(this.name, this.scene, this.args, this.transition, this.transitionTime);
    // }
}

function removeSceneManagerSceneDataFromArray(st: SceneManagerSceneData, v: SceneManagerSceneData[]) {
    let i = v.indexOf(st);
    if (i > -1) {
        v.splice(i, 1);
    }
}

export class SceneManager {
    private _lastCreatedScene: SceneManagerSceneData;

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
    // protected definedscenes: Vector.<SceneManagerSceneData>;
    // protected definedsceneNames: Array = [];
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
        //
        // definedscenes = new Vector.<SceneManagerSceneData>();
        // runningscenes = new Vector.<SceneManagerSceneData>();
        // scenesToCreate = new Vector.<SceneManagerSceneData>();
        // scenesToDestroy = new Vector.<SceneManagerSceneData>();
        //
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
    // public function add(name : String, type : Class, params : Object = null) : void {
    // 	if (name == null || type == null)
    // 		return;
    //
    // 	if (getDefinedSceneDataByName(name, false) != null)
    // 		return;
    //
    // 	var sceneData : SceneManagerSceneData = new SceneManagerSceneData(name, type);
    //
    // 	if (params != null) {
    // 		if ("args" in params && params.args is Array)
    // 			sceneData.args = params.args;
    // 		if ("transition" in params)
    // 			sceneData.transition = params.transition;
    // 		if ("transitionTime" in params)
    // 			sceneData.transitionTime = params.transitionTime;
    // 		if ("onTransitionComplete" in params)
    // 			sceneData.onTransitionComplete = params.onTransitionComplete;
    // 	}
    //
    // 	definedsceneNames.push(name);
    // 	definedscenes.push(sceneData);
    // }

    /**
     * Starts a new scene by name.
     * if destroy is true, every currently running scene will be destroyed.
     * if arguments for transition are set, this scene will come in via a transition,
     * by default, after a transition, every scene is destroyed except for the one who's transition is over.
     */
    // public function start(name : String, destroy : Boolean = true, transition : String = null, transitionTime : Number = Number.NaN, onTransitionComplete : Function = null) : IScene {
    // 	var sceneData : SceneManagerSceneData = getDefinedSceneDataByName(name);
    // 	if (sceneData == null)
    // 		return null;
    //
    // 	if (destroy)
    // 		destroyAllButRunning();
    //
    // 	if (transition != null)
    // 		sceneData.transition = transition;
    //
    // 	if (transitionTime >= 0)
    // 		sceneData.transitionTime = transitionTime;
    //
    // 	if (onTransitionComplete != null)
    // 		sceneData.onTransitionComplete = onTransitionComplete;
    //
    // 	return startsceneTransition(sceneData);
    // }
    //
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
    // protected function getDefinedSceneDataByName(name : String, clone : Boolean = true) : SceneManagerSceneData {
    // 	for each (var sceneData : SceneManagerSceneData in definedscenes)
    // 		if (sceneData.name == name)
    // 			if (clone)
    // 				return sceneData.clone();
    // 			else
    // 				return sceneData;
    // 	return null;
    // }

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
    // protected function createscene(sceneData : SceneManagerSceneData) : IScene {
    // 	var scene : IScene = createObjectWithArgs(sceneData.type, sceneData.args);
    // 	sceneData.scene = scene;
    // 	return scene;
    // }

    /**
     * this creates the transition and starts it if it exists.
     * in any case the scene is then queued up in scenesToCreate.
     */
    // protected function startsceneTransition(sceneData : SceneManagerSceneData) : IScene {
    // 	var transition : String = sceneData.transition;
    // 	var transitionTime : Number = sceneData.transitionTime;
    // 	var scene : IScene = createscene(sceneData);
    //
    // 	if (scene == null)
    // 		return null;
    //
    // 	if (SceneTransition.exists(transition)) {
    // 		switch (transition) {
    // 			case SceneTransition.TRANSITION_FADEOUT :
    // 			case SceneTransition.TRANSITION_FADEIN :
    // 				sceneData.transitionTween = new EazeTween(scene, false);
    // 				sceneData.transitionTween.from(transitionTime, {alpha:0}).easing(Linear.easeNone);
    // 				break;
    // 			case SceneTransition.TRANSITION_MOVEINLEFT :
    // 				sceneData.transitionTween = new EazeTween(scene, false);
    // 				sceneData.transitionTween.from(transitionTime, {x:-_ce.screenWidth}).easing(Linear.easeNone);
    // 				break;
    // 			case SceneTransition.TRANSITION_MOVEINRIGHT :
    // 				sceneData.transitionTween = new EazeTween(scene, false);
    // 				sceneData.transitionTween.from(transitionTime, {x:_ce.screenWidth}).easing(Linear.easeNone);
    // 				break;
    // 			case SceneTransition.TRANSITION_MOVEINDOWN :
    // 				sceneData.transitionTween = new EazeTween(scene, false);
    // 				sceneData.transitionTween.from(transitionTime, {y:_ce.screenHeight}).easing(Linear.easeNone);
    // 				break;
    // 			case SceneTransition.TRANSITION_MOVEINUP :
    // 				sceneData.transitionTween = new EazeTween(scene, false);
    // 				sceneData.transitionTween.from(transitionTime, {y:-_ce.screenHeight}).easing(Linear.easeNone);
    // 				break;
    // 		}
    //
    // 		sceneData.transitionTween.updateNow();
    // 		sceneData.transitionTween.onComplete(function() : void {
    // 			switch (_sceneManagerMode) {
    // 				case SceneManagerMode.SINGLE_MODE:
    // 					destroyAllButRunningExcept(sceneData);
    // 					break;
    // 			}
    //
    // 			if (sceneData.onTransitionComplete != null)
    // 				sceneData.onTransitionComplete();
    //
    // 			sceneData.transition = null;
    // 			sceneData.transitionTime = NaN;
    // 			sceneData.onTransitionComplete = null;
    // 			sceneData.transitionTween = null;
    // 		});
    // 	}
    //
    // 	scenesToCreate.unshift(sceneData);
    // 	return scene;
    // }
    //
    // public function destroyPreviousScenes():void {
    // 	destroyAllButRunningExcept(lastCreatedscene);
    // }

    /**
     * Destroy all but running scenes except specific by scene data.
     */
    // protected function destroyAllButRunningExcept(sceneData : SceneManagerSceneData) : void {
    // 	for each (var std : SceneManagerSceneData in scenesToCreate) {
    // 		if (std == sceneData)
    // 			continue;
    // 		removesceneFromCE(sceneData);
    // 	}
    // 	scenesToCreate.length = 0;
    //
    // 	for each (var rscene : SceneManagerSceneData in runningscenes)
    // 		if (scenesToDestroy.indexOf(rscene) == -1)
    // 			scenesToDestroy.unshift(rscene);
    // 	removeSceneManagerSceneDataFromVector(sceneData, scenesToDestroy);
    // }

    // protected function createObjectWithArgs(type : Class, args : Array = null) : IScene {
    // 	if (args == null)
    // 		return new type() as IScene;
    // 	else if (args.length == 1)
    // 		return new type(args[0]) as IScene;
    // 	else if (args.length == 2)
    // 		return new type(args[0], args[1]) as IScene;
    // 	else if (args.length == 3)
    // 		return new type(args[0], args[1], args[2]) as IScene;
    // 	else if (args.length == 4)
    // 		return new type(args[0], args[1], args[2], args[3]) as IScene;
    // 	else
    // 		return null;
    // }

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
        if (!this._lastCreatedScene) {
            return null;
        }

        return this._lastCreatedScene.scene;
    }

    public setCurrentScene(value: IScene): void {
        this.destroyAllButRunning();

        if (value == null) {
            return;
        }

        this._lastCreatedScene = new SceneManagerSceneData("scene(anonymous)", value);
        // TODO rid off unshift
        this._scenesToCreate.unshift(this._lastCreatedScene);
    }

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
