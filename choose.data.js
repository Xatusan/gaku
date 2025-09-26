/* choose.data.js — optimized + normalized
 * - Paste your raw CLASSES array into the marked section below.
 * - This file exposes:
 *     window.CLASSES       (normalized array)
 *     window.ABILITY_COSTS (complete cost table: seeds + auto-completed)
 */

(function () {
  'use strict';

  // -------------------------------
  // 0) Small utilities
  // -------------------------------
  function slugify(s) {
    return String(s || '')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  function pick(obj, keys, def) {
    var out = {}, k;
    for (var i = 0; i < keys.length; i++) {
      k = keys[i]; out[k] = (obj && obj[k] != null) ? obj[k] : def;
    }
    return out;
  }
  function isNonEmptyArray(a){ return Array.isArray(a) && a.length > 0; }

  // -------------------------------
  // 1) PASTE YOUR RAW CLASSES HERE
  //    Replace [] with your full array from choosefallback.html
  //    It’s fine if fields are named flavor/description/desc, etc.
  // -------------------------------
  window.CLASSES_RAW = [
    // ============================
    // PASTE HERE: your entire CLASSES array (the [...] from choosefallback.html)
    // Example to show structure (REMOVE this example once you paste yours):
    // {
    //   "class":"warrior",
    //   "name":"Warrior",
    //   "slug":"warrior",
    //   "img":"warrior.jpg",
    //   "flavor":"Brave melee fighter.",
    //   "base":{"STR":10,"AGI":8,"END":9,"SPC":6,"INT":5,"WIS":7},
    //   "abilities":["Fury","Wild Hit","War Cry"]
    // }
    // ============================
  ];

  // -------------------------------
  // 2) Normalizer (makes fields consistent)
  // -------------------------------
  function normalizeOne(raw) {
    var name = raw.name || raw.className || raw.title || '—';
    var slug = raw.slug || slugify(raw.class || name);
    var img  = raw.img || (slug ? (slug + '.jpg') : '');
    var desc = raw.flavor || raw.description || raw.desc || '';
    var base = raw.base || {};
    var abilities = Array.isArray(raw.abilities) ? raw.abilities.slice() : [];

    // Ensure base stats with defaults
    var baseFixed = {
      STR: +base.STR || 0,
      AGI: +base.AGI || 0,
      END: +base.END || 0,
      SPC: +base.SPC || 0,
      INT: +base.INT || 0,
      WIS: +base.WIS || 0
    };

    return {
      class: raw.class || slug,
      name: name,
      slug: slug,
      img: img,
      flavor: desc,
      base: baseFixed,
      abilities: abilities
    };
  }

  function normalizeClasses(list) {
    var out = [];
    if (!Array.isArray(list)) return out;
    for (var i = 0; i < list.length; i++) out.push(normalizeOne(list[i]));
    return out;
  }

  // -------------------------------
  // 3) Ability cost seeds (hand-tuned)
  //    Add/adjust here if you have exact design values.
  // -------------------------------
  var COST = {
    MP: function(n){ return { type:'MP', cost:n }; },
    STA:function(n){ return { type:'STA',cost:n }; },
    LP: function(n){ return { type:'LP', cost:n }; }
  };

  var SEED_COSTS = {
    // Warrior / melee-like
    'Fury': COST.STA(5),
    'Wild Hit': COST.STA(7),
    'War Cry': (function(){ var c = COST.STA(7); c.alt = COST.MP(7); return c; })(),
    'Challenge': (function(){ var c = COST.STA(5); c.alt = COST.MP(5); return c; })(),
    'Steadfast': (function(){ var c = COST.STA(5); c.alt = COST.MP(5); return c; })(),
    'Heroic Note': (function(){ var c = COST.MP(7); c.alt = COST.STA(7); return c; })(),

    // Pyro / elemental
    'Flame Snap': COST.MP(5),
    'Fire Flicker': COST.MP(3),
    'Cinder Puff': COST.MP(5),
    'Ember Glint': COST.MP(3),

    // Storm
    'Spark': COST.MP(3),
    'Chain Spark': COST.MP(7),
    'Breeze': COST.MP(3),
    'Breezy Flow': COST.MP(5),

    // Cryo
    'Frost Pebble': COST.MP(3),
    'Icicle': COST.MP(5),
    'Cold Gust': COST.MP(7),
    'Cool Mist': COST.MP(5),

    // Crystal
    'Shard': COST.MP(5),
    'Shard Guard': COST.MP(5),
    'Shard Shield': COST.MP(7),
    'Shard Spike': COST.MP(10),

    // Blood
    'Blood Gift': (function(){ var c=COST.MP(5); c.alt=COST.LP(4); return c; })(),
    'Drain': (function(){ var c=COST.MP(7); c.alt=COST.LP(5); return c; })(),
    'Sanguine Burst': (function(){ var c=COST.MP(10); c.alt=COST.LP(7); return c; })(),

    // Samurai / weapon arts
    'Iaijutsu': COST.STA(7),
    'Focus': COST.STA(4),
    'Calm Strike': COST.STA(5),
    'Sword Slash': COST.STA(5),
    'Curve Slash': COST.STA(7),
    'Thrust': COST.STA(5),
    'Jab': COST.STA(3),
    'Stand Firm': COST.STA(4),

    // Spear / drake
    'Spear Swipe': COST.STA(7),
    'Drake Jab': (function(){ var c=COST.STA(5); c.alt=COST.MP(5); return c; })(),
    'Scale Armor': (function(){ var c=COST.STA(4); c.alt=COST.MP(4); return c; })(),
    'Drake Roar': (function(){ var c=COST.STA(7); c.alt=COST.MP(7); return c; })(),

    // Acrobat / rogue-like
    'Kunai Toss': COST.STA(4),
    'Smoke Puff': COST.MP(5),
    'Soft Step': COST.STA(4),
    'Shadow Dagger': COST.STA(5),
    'Shadow Veil': COST.MP(6),
    'Shadow Step': COST.STA(7),
    'Somersault Strike': COST.STA(6),
    'Spin Kick': COST.STA(5),
    'Flip': COST.STA(4),
    'Chain Throw': COST.STA(5),
    'Chain Whip': COST.STA(6),
    'Chain Bind': COST.STA(7),

    // Guardian / defense
    'Guard Stance': COST.STA(4),

    // Spirit / shaman
    'Ancestor Whisper': COST.MP(5),
    'Spirit Pulse': COST.MP(5),
    'Spirit Friend': COST.MP(7),
    "Ancestor's Aid": COST.MP(10),
    'Totem Place': COST.MP(5),
    'Spirit Chant': COST.MP(5),
    'Great Totem': COST.MP(10),

    // Fate / trickster
    'Minor Rain': COST.MP(5),
    'Glimpse': COST.MP(3),
    'Coin Toss': COST.MP(3),
    'Hint': COST.MP(5),
    'Bend Fate': COST.MP(10),

    // Rune / mind
    'Rune Spark': COST.MP(5),
    'Rune Dull': COST.MP(5),
    'Rune Pop': COST.MP(7),
    'Rune Guard': COST.MP(7),
    'Sleep Mist': COST.MP(7),
    'Mirage': COST.MP(5),
    'Walk in Dream': COST.MP(7),
    'Mind Glance': COST.MP(3),

    // Druid / beast
    'Summon Companion': COST.MP(10),
    'Beast Instinct': COST.MP(5),
    'Big Beast': COST.MP(13),
    'Thorn Whip': COST.MP(5),
    'Beast Form (Small)': COST.MP(7),
    'Tree Form': COST.MP(10),
    'Swarm Rush': COST.MP(7),
    'Crawling Cover': COST.MP(5),
    'Insect Pulse': COST.MP(5),
    'Claw Swipe': COST.STA(5),
    'Howl': COST.STA(6),
    'Wolf Form': COST.STA(10),

    // Dragon knight
    'Dragon Breath': (function(){ var c=COST.STA(10); c.alt=COST.MP(10); return c; })(),
    'Dragon Scales': (function(){ var c=COST.STA(7);  c.alt=COST.MP(7);  return c; })(),
    'Mighty Breath': (function(){ var c=COST.STA(13); c.alt=COST.MP(13); return c; })(),

    // Bard / alchemy / gadgets / holy
    'Song of War': COST.MP(5),
    'Jeer Song': COST.MP(5),
    'Throw Potion': COST.MP(5),
    'Quick Mix': COST.MP(5),
    'Big Flask': COST.MP(10),
    'Spark Shot': COST.MP(5),
    'Gadget': COST.MP(5),
    'Toy Drone': COST.MP(10),
    'Purify Bolt': COST.MP(5),
    'Resistance Field': COST.MP(7),
    'Seal Mark': COST.MP(7),

    // Blood Knight (examples)
    'Blade Sacrifice': (function(){ var c=COST.STA(5); c.alt=COST.LP(4); return c; })(),
    'Blood Shackles': (function(){ var c=COST.MP(7); c.alt=COST.LP(5); return c; })(),
    'Blood Rush': (function(){ var c=COST.STA(7); c.alt=COST.LP(5); return c; })()
  };

  // -------------------------------
  // 4) Auto-complete costs for unknown abilities (heuristics)
  //    So every ability gets a cost even if not in SEED_COSTS.
  // -------------------------------
  var STA_KEYWORDS = ['Slash','Jab','Thrust','Kick','Strike','Step','Stance','Throw','Whip','Bind','Flip','Howl','Roar','Armor','Form','Claw','Breath','Scales','Guard','Kunai','Spear','Iaijutsu','Focus','Calm','Stand','Punch','Dash'];
  var MP_KEYWORDS  = ['Spirit','Ancestor','Totem','Rune','Sleep','Mirage','Dream','Mind','Summon','Beast','Tree','Swarm','Insect','Mist','Song','Note','Bolt','Field','Seal','Shield','Guard','Spark','Flame','Fire','Ember','Ice','Frost','Cinder','Breeze','Glimpse','Hint','Coin','Magic','Drone','Gadget','Purify','Crystal','Shard'];
  function looksSTA(name){
    for (var i=0;i<STA_KEYWORDS.length;i++) if (name.indexOf(STA_KEYWORDS[i])>=0) return true;
    return false;
  }
  function looksMP(name){
    for (var i=0;i<MP_KEYWORDS.length;i++) if (name.indexOf(MP_KEYWORDS[i])>=0) return true;
    return false;
  }
  function autoCostForAbility(name){
    if (/blood/i.test(name)) return (function(){ var c=COST.MP(7); c.alt=COST.LP(5); return c; })();
    if (looksSTA(name)) return COST.STA(5);
    if (looksMP(name))  return COST.MP(5);
    return COST.MP(5); // safe default
  }

  function completeAbilityCosts(classes, seed) {
    var out = {};
    // clone seeds
    for (var k in seed) if (Object.prototype.hasOwnProperty.call(seed,k)) out[k] = seed[k];
    // scan abilities from classes
    for (var i=0;i<classes.length;i++){
      var abs = classes[i].abilities || [];
      for (var j=0;j<abs.length;j++){
        var name = String(abs[j] || '').trim();
        if (!name) continue;
        if (!out[name]) out[name] = autoCostForAbility(name);
      }
    }
    return out;
  }

  // -------------------------------
  // 5) Build final exports
  // -------------------------------
  var normalized = normalizeClasses(window.CLASSES_RAW);
  window.CLASSES = normalized;

  // costs: seeds + auto-completed
  window.ABILITY_COSTS = completeAbilityCosts(window.CLASSES, SEED_COSTS);

  // Debug logs (console)
  try {
    console.log('[choose.data] classes:', window.CLASSES.length);
    // Count abilities
    var abSet = {};
    for (var i=0;i<window.CLASSES.length;i++){
      var a = window.CLASSES[i].abilities || [];
      for (var j=0;j<a.length;j++){ abSet[a[j]] = true; }
    }
    var totalAbilities = Object.keys(abSet).length;
    var totalCosts = Object.keys(window.ABILITY_COSTS || {}).length;
    console.log('[choose.data] unique abilities:', totalAbilities, ' / costs entries:', totalCosts);
  } catch(e) {}

})();
