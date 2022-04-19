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

// ########################### Tests ###########################

class Eukaryote {
  constructor(radius) {
    this.radius = typeof radius != "undefined" && typeof radius == "number" ? radius * 2 : 1;
    this.hasNucleus = true;
    this.nucleus = {};
    this.hasNanoProbe = false;
    makeMixable(this, Eukaryote);
  }

  #privateRadius = this.radius;
  foo = "Some public property";

  cellImportinTransport(rna) {
    if (typeof rna != "undefined") {
      this.nucleus["importedRna"] = rna;
      return `RNA ${this.nucleus["importedRna"]} was imported`;
    }
  }
}

class Bacteria {
  constructor(radius) {
    this.radius = typeof radius != "undefined" && typeof radius == "number" ? radius : 1;
    this.hasNucleus = false;
    this.toughCellWall = {};
    makeMixable(this, Bacteria);
  }
  createHydrocarbon() {
    console.log("This trait allows consumption of Co2");
  }
  gurgle() {
    return "gurgle";
  }
}

class NanoProbe {
  constructor() {
    this.hasNanoProbe = true;
    this.borgProperty1 = "Some value";
    this.borgCapability1 = function (input) {
      return typeof input == "number" ? input + 1 : input;
    };
    makeMixable(this, NanoProbe);
  }

  beep() {
    return "boop";
  }

  logCellActivity(msg) {
    console.log(msg);
  }
}

// ES6 Class based OOP allows for single-inheritance only
class Animal extends Eukaryote {
  // All the magic happens in the constructor...🔥
  constructor(name, radius) {
    // Pass radius to the superclass's constructor
    super(radius);
    this.name = name;

    /*
     *  Inside the constructor of the child we can now implement multiple-inheritance.
     *  With Polymix, we gain an idiomatic (readable) way to
     *  achieve multiple-inheritance (injection into host class not really inheritance)
     *  in a namespaced (non-colliding) manner.
     */
    Mixin((this.NP = {}), new NanoProbe());
    Mixin((this.Bact = {}), new Bacteria());

    /*
     *  If we wish to play without gaurdrails, we can Mixin to 'this' and risk overwriting
     *  extant methods and properties on the child class.
     */
    Mixin(this, new NanoProbe());

    /*
     *  The general form of Polymix's Mixin pattern is:
     *  Write ancestor classes and include: `makeMixable(this, <AncestorClassName>)` inside the ancestor class's constructor.
     *  The in the descendant class (the child) include: `Mixin(this.<namespace> = {}, new <ChildClassName>() )` in the child class's constructor.
     *  That's it, enjoy easy multiple-inheritance!
     */
  }

  /*
   *  If Mixed-in directly inside the child-class's contructor i.e
   *  Mixin( this, new NanoProbe() ); and NOT Mixin( this.NP = {}, new NanoProbe() );
   *  Then there's a potential method name collision hazard, i.e. later methods of the same name
   *  will overwrite any previous methods sharing that name. By namespacing into a subobject during Mixin
   *  these collisions are avoided.
   */

  identify() {
    // Out of the box inherited methods from Eukaryote... plus all the other classes we pulled in 🔥
    console.log(this);

    // Normal access via template string interpolation.
    console.log(
      `This Animal's name is ${this.name}, its cells have a radius of ${this.radius},
         ${this.cellImportinTransport("CAGTA")}, there is also ${this.foo}`
    );
    // After adding mixins...
    if (this.NP.hasNanoProbe) {
      console.log(
        `Alert!!! WE ARE BORG! ${this.NP.beep()} RESISTANCE IS FUTILE, YOU WILL BE ASSIMILATED!
         But wait, there's more, our Bacterial traits include: ${this.Bact.gurgle()}`
      );
    }
  }
}

var seven = new Animal("Seven", 5);
seven.identify();
