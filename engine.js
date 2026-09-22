/* GiftLoop engine - pure functions for birthdays, idea ranking and repeat detection. */
(function (root) {
  'use strict';
  var DAY = 86400000;

  function toDate(iso) {
    var d = new Date(iso + (iso.length === 10 ? 'T00:00:00Z' : ''));
    if (isNaN(d.getTime())) throw new Error('bad date: ' + iso);
    return d;
  }
  function iso(d) { return d.toISOString().slice(0, 10); }

  // next occurrence of a month/day birthday on or after nowISO.
  // Feb 29 birthdays land on Feb 28 in non-leap years.
  function nextBirthday(month, day, nowISO) {
    var now = toDate(nowISO);
    var y = now.getUTCFullYear();
    for (var i = 0; i < 2; i++) {
      var d = new Date(Date.UTC(y + i, month - 1, day));
      if (d.getUTCMonth() !== month - 1) d = new Date(Date.UTC(y + i, month, 0)); // clamp (Feb 29 -> Feb 28)
      if (d >= now) return iso(d);
    }
    return iso(new Date(Date.UTC(y + 1, month - 1, day)));
  }

  function daysUntil(futureISO, nowISO) {
    return Math.round((toDate(futureISO) - toDate(nowISO)) / DAY);
  }

  function tokens(text) {
    return (String(text).toLowerCase().match(/[a-z0-9']+/g) || [])
      .filter(function (w) { return w.length > 3; });
  }

  // repeat risk: past gifts sharing >=40% of the idea's distinctive tokens
  function repeatRisk(ideaText, pastGifts) {
    var it = tokens(ideaText);
    if (!it.length) return [];
    var hits = [];
    pastGifts.forEach(function (g) {
      var gt = tokens(g);
      if (!gt.length) return;
      var shared = it.filter(function (w) { return gt.indexOf(w) !== -1; });
      if (shared.length / it.length >= 0.4) hits.push({ gift: g, shared: shared });
    });
    return hits;
  }

  // ideas: {text, rating 1-5, added (ISO)}. Best first: rating desc, then newest.
  function rankIdeas(ideas) {
    return ideas.slice().sort(function (a, b) {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return (b.added || '') < (a.added || '') ? -1 : 1;
    });
  }

  // people: {name, month, day}. Upcoming birthdays sorted by days away.
  function upcoming(people, nowISO) {
    return people.filter(function (p) { return p.month && p.day; })
      .map(function (p) {
        var nb = nextBirthday(p.month, p.day, nowISO);
        return { person: p, date: nb, daysAway: daysUntil(nb, nowISO) };
      })
      .sort(function (a, b) { return a.daysAway - b.daysAway; });
  }

  var api = { nextBirthday: nextBirthday, daysUntil: daysUntil, repeatRisk: repeatRisk, rankIdeas: rankIdeas, upcoming: upcoming };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.GiftLoop = api;
})(typeof window !== 'undefined' ? window : this);
