#!/usr/bin/env node
const Mixin = Object.assign;
function makeMixable(ctx, className) {
  /* Automatically enumerates functions of a class and adds them as properties under this of that class's constructor.
   *  Which makes these methods accessible via the Mixin pattern.
   */
  Object.getOwnPropertyNames(className.prototype).forEach((method) => {
    if (typeof method != "undefined" && method !== "constructor") {
      ctx[method] = ctx[method];
    }
  });
}
function listMethodsOf(obj) {
  if (typeof obj !== "undefined") {
    try {
      return Object.getOwnPropertyNames(obj).filter((item) => typeof obj[item] === "function");
    } catch (error) {
      return `The variable ${obj} passed to listMethodsOf() was undefined or not set\nThe following error was found: ${error}`;
    }
  } else {
    return `The variable ${obj} passed to listMethodsOf() was undefined or not set`;
  }
}

// ########################### Example of configurable multiple inheritance ###########################
class Ancestor {
  constructor(initVars) {
    // Sundry initialization example with existence checks etc...
    this.foo = initVars["foo"] = initVars.hasOwnProperty("foo") ? initVars.foo : false;
    this.otherProperty = "I'm some configuration details...";

    // General OOP pitfall note:
    // Every child class and potentialls any Mixin can overwrite this property (examples shown in each class)
    this.lastPropertyToSetup = "Ok, all done with constructor stuff";

    // At the end of the constructor invoke Polymix's makeMixable function to make this class mixable
    // ==============================================================================================
    makeMixable(this, Ancestor);
  }
  // More run of the mill class stuff...
  #privatePropertyBar = "Hehe! Nobody outside the class can see or touch me!!!";

  // Some public method of the class
  speak(bat) {
    if (typeof bat !== "undefined") {
      console.log(bat);
    }
    // Make chainable
    return this;
  }
}

class Beeper {
  constructor(initVars) {
    // Sundry initialization example with existence checks etc...
    this.beeperConfPropertyFoo = initVars.hasOwnProperty("beeperConfPropertyFoo") ? initVars.beeperConfPropertyFoo : false;
    this.bar = "A bar obviously...";
    this.bat = "A beeper bat";

    // Private field one-time initialization usage example (results visible via mixed in public fields)
    this.resultOfMathWithInaccessibleVariable = (5 * this.#inaccessiblevariable);
    this.resultOfStringManipulationWithInaccessiblStringVar = `${this.#hiddenPrefixVar}_${this.beeperConfPropertyFoo}`

    // Beeper (the class) has no property set on it's this called lastPropertyToSetup, so it cannot overwrite
    // any same named property on any ancestor class it inherits from (default behavior) or if mixed in without namespacing
    // any host class it is mixed into.

    // At the end of the constructor invoke Polymix's makeMixable function to make this class mixable
    // ==============================================================================================
    makeMixable(this, Beeper);
  }

  /* Any private properties or methods aren't usable with the Mixin pattern i.e. Object.assign
  *  thus they're unmixable as they require a direct child class to be instantiated
  *  Results of calculations or string manipulations done inside the constructor and results set to a public field
  *  during initialization (one-time) .e. on this, ARE visible by public methods that's the extent of private field usefullness
  *  for the mixin pattern.
  *  See this.#hiddenPrefixVar in the constructor of this class for an example of such one-shot init-time operations.
  */
  #inaccessiblevariable = 3;
  #hiddenPrefixVar = "secretPrefix";

  beep(frequency) {
    if (typeof frequency !== "undefined" && typeof frequency === "number") {
      console.log(`Beeping at frequency ${frequency}!`);
    }
    // Make chainable
    return this;
  }
}

class LaserShark {
  constructor(initVars) {
    // Sundry initialization example with existence checks etc...
    if (initVars.hasOwnProperty("laserWavelength") && typeof initVars.laserWavelength === "number") {
      this.laserWavelength = initVars.laserWavelength;
    } else {
      this.laserWavelength = false;
      console.log("This LaserShark can't Lase!");
    }
    this.bar = "A shark bar";
    this.bat = "A shark bat";

    // ============================================ Pitfall example ============================================
    // Try running this file with and without commenting the following line to observe un-namespaced Mixin collision pitfalls.
    this.lastPropertyToSetup = "If you Mixed in LaserShark without a namespace on the host class, lastPropertyToSetup got overwritten. Otherwise this is just a namespaced string in a field.";

    // At the end of the constructor invoke Polymix's makeMixable function to make this class mixable
    // ==============================================================================================
    makeMixable(this, LaserShark);
  }

  bite(something) {
    if (typeof something !== "undefined") {
      console.log(`Chomping down on something with contents: ${something}`);
    } else {
      console.log("You told this LaserShark to bite, without giving it a target to bite...");
    }

    // Make this LaserShark method chainable...
    return this;
  }
}

// ES6 Class based OOP allows for single-inheritance only
class KillerApp extends Ancestor {
  // It's showtime! 🔥
  constructor(ancestorInitVars) {
    // Pass initVars to the superclass's constructor
    super(ancestorInitVars);

    //Killer app regular init config properties
    this.fee = "fee";
    this.fye = "fye";
    this.foeh = "foeh";
    /* The lastPropertyToSetup is an example of the child class overwriting the Ancestor class's lastPropertyToSetup property
    *  If you Mixin a class without defining a this.<subobject> namespace (shown below) the mixin will overwrite the child class's
    *  lastPropertyToSetup property (or any property of the same name).
    *
    *  Child classes overwrite extant ancestor properties of the same name
    */
    // Try running this file with and without commenting the following line to observe child class property collision
    // this.lastPropertyToSetup = "This will overwrite the Ancestor class's lastPropertyToSetup, un-namespaced Mixins can overwrite me too...";

    // MULTIPLE INHERITANCE VIA MIXINS MADE EASY.
    // =========================================
    /*
     *  Inside the constructor of the child we can now implement multiple-inheritance.
     *  With Polymix, we gain an idiomatic (readable) way to
     *  achieve multiple-inheritance in a namespaced (non-colliding) manner.
     */
    // We can dynamically configure our Mixin instance classes too!
    const beeperInitVars     = { beeperConfPropertyFoo : "boopmode" };
    const laserSharkInitVars = { laserWavelength       : 450        };

    // Then just Mix them in with Polymix's Mixin function;
    Mixin( this.Beeper = {}     , new Beeper(beeperInitVars)         );
    Mixin( this.LaserShark = {} , new LaserShark(laserSharkInitVars) );

    /*
     *  If we wish to play without gaurdrails, we can Mixin to 'this' and risk overwriting
     *  extant methods and properties on the child class.
     */

    // ============================================ Pitfall example ============================================
    // Try running this file with and without commenting the following line to observe un-namespaced Mixin collision pitfalls.
    // Mixin( this, new LaserShark(laserSharkInitVars) );

    /*
     *  The general form of Polymix's Mixin pattern is:
     *  Write ancestor classes and include: `makeMixable(this, <AncestorClassName>)` inside the ancestor class's constructor.
     *  The in the descendant class (the child) include: `Mixin(this.<namespace> = {}, new <ChildClassName>() )` in the child class's constructor.
     *  That's it, enjoy easy multiple-inheritance!
     */
  }

  /*
   *  If Mixed-in directly inside the child-class's contructor i.e
   *  Mixin( this, new <className>() ); and NOT Mixin( this.NP = {}, new <className>() );
   *  Then there's a potential method name collision hazard, i.e. later methods of the same name
   *  will overwrite any previous methods sharing that name. By namespacing into a subobject during Mixin
   *  these collisions are avoided.
   */

  showCapabilities() {
    // Out of the box inherited methods from Ancestor... plus all the other classes we Mixed in 🔥
    console.log(this);
  }
}

// Setup Ancestor initVars config (optional but shown for example)
const killerAppAncestorInitVars = { foo: "barBatBaz" };
const snapSharkApp = new KillerApp(killerAppAncestorInitVars);

// Observe the customized class using classical single inheritance plus
// multiple inheritance via Polymix's Mixin functions. Polymorphism made safe and easy!
snapSharkApp.showCapabilities();


