/* Search uses public field answers. Filters and the chosen sort remain separate. */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.AIBDSearch = api;
})(typeof window === 'undefined' ? globalThis : window, function () {
  'use strict';

  function normalize(value) {
    return String(value == null ? '' : value).replace(/№/g, ' ').normalize('NFKD')
      .replace(/\p{M}/gu, '').replace(/\b(?:[A-Za-z]\.){2,}/g, function (word) { return word.replace(/\./g, ''); })
      .toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  }

  // Equivalent country names already used by the site's geography lookup.
  // Regions such as California and Hong Kong are deliberately not synonyms
  // for a whole country. Exact quoted phrases do not use these alternatives.
  var ALIASES = {
    usa: ['usa', 'us', 'united states'], us: ['us', 'usa', 'united states'],
    uk: ['uk', 'united kingdom'], uae: ['uae', 'united arab emirates'],
    czechia: ['czechia', 'czech republic'],
    turkiye: ['turkiye', 'turkey'], turkey: ['turkey', 'turkiye'],
    drc: ['drc', 'democratic republic of the congo']
  };

  function parse(query) {
    var terms = [], seen = Object.create(null), match;
    var parts = /"([^"]*)"|"([^"]+)$|([^"]+)/g;
    query = String(query || '').replace(/[“”]/g, '"');
    while ((match = parts.exec(query))) {
      var phrase = match[3] === undefined;
      var value = normalize(phrase ? (match[1] === undefined ? match[2] : match[1]) : match[3]);
      (phrase ? [value] : value.split(' ')).forEach(function (word) {
        var key = (phrase ? 'p:' : 'w:') + word;
        if (!word || seen[key]) return;
        seen[key] = true;
        terms.push({ text: word, phrase: phrase, alternatives: phrase ? [word] : ALIASES[word] || [word] });
      });
    }
    return terms;
  }

  function contains(value, term) {
    var padded = ' ' + value + ' ';
    return term.alternatives.some(function (part) { return padded.indexOf(' ' + part + ' ') !== -1; });
  }

  function prepare(data) {
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Invalid search index');
    var records = Object.create(null);
    if (data.version === 2) {
      if (!Array.isArray(data.labels) || !Array.isArray(data.values) || !data.records) throw new Error('Invalid search index');
      var values = data.values.map(function (value) { return { text: String(value), normalized: normalize(value) }; });
      Object.keys(data.records).forEach(function (id) {
        records[id] = data.records[id].map(function (pair) {
          if (!values[pair[1]] || typeof data.labels[pair[0]] !== 'string') throw new Error('Invalid search field');
          return { label: data.labels[pair[0]], value: values[pair[1]] };
        });
      });
    } else {
      // A cached index from the previous release stays searchable during deploy.
      Object.keys(data).forEach(function (id) { records[id] = [field('Text', String(data[id]))]; });
    }
    return records;
  }

  function field(label, text) {
    return { label: label, value: { text: text, normalized: normalize(text) } };
  }

  function match(fields, terms) {
    if (!terms.length) return [];
    if (!fields || !terms.every(function (term) { return fields.some(function (item) { return contains(item.value.normalized, term); }); })) return null;
    return fields.map(function (item, position) {
      return { field: item, position: position, terms: terms.filter(function (term) { return contains(item.value.normalized, term); }) };
    }).filter(function (item) { return item.terms.length; }).sort(function (a, b) {
      // Prefer the field that explains the most words. When tied, show an
      // actual field answer before repeating the title that is already visible.
      return b.terms.length - a.terms.length || Number(a.field.label === 'Title') - Number(b.field.label === 'Title') || a.position - b.position;
    });
  }

  function excerpt(text, terms, limit) {
    limit = limit || 180;
    text = text.replace(/\s+/g, ' ').trim();
    if (text.length <= limit) return text;
    // Find the matching passage in the original text. Tracking character
    // offsets keeps accents and punctuation intact in the displayed excerpt.
    var normalized = '', offsets = [];
    for (var i = 0; i < text.length;) {
      var character = String.fromCodePoint(text.codePointAt(i));
      var part = character.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase();
      for (var j = 0; j < part.length; j++) {
        var letter = /[\p{L}\p{N}]/u.test(part[j]) ? part[j] : ' ';
        if (letter === ' ' && (!normalized || normalized.endsWith(' '))) continue;
        normalized += letter; offsets.push(i);
      }
      i += character.length;
    }
    var at = -1;
    terms.some(function (term) {
      return term.alternatives.some(function (value) {
        at = (' ' + normalized + ' ').indexOf(' ' + value + ' ');
        return at !== -1;
      });
    });
    var start = at < 0 ? 0 : Math.max(0, (offsets[at] || 0) - 45);
    if (start) { var space = text.indexOf(' ', start); if (space !== -1 && space < start + 24) start = space + 1; }
    var end = Math.min(text.length, start + limit);
    if (end < text.length) { var last = text.lastIndexOf(' ', end); if (last > start + limit / 2) end = last; }
    return (start ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
  }

  function explain(matches) {
    if (!matches || !matches.length) return null;
    var best = matches[0], covered = new Set(best.terms), also = [];
    matches.slice(1).forEach(function (item) {
      if (item.terms.some(function (term) { return !covered.has(term); })) {
        item.terms.forEach(function (term) { covered.add(term); });
        if (also.indexOf(item.field.label) === -1) also.push(item.field.label);
      }
    });
    return { label: best.field.label, text: excerpt(best.field.value.text, best.terms), also: also };
  }

  var EVIDENCE = { found: 4, studied: 3, reported: 2, claimed: 1 };
  function value(row, key) {
    if (key === 'depth' || key === 'sources') {
      var number = Number(row[key]);
      return row[key] === '' || row[key] == null || !Number.isFinite(number) ? null : number;
    }
    if (key === 'evidence') return EVIDENCE[row.evidence] || null;
    if (key === 'date') return row.date || null;
    return normalize(row[key] || '') || null;
  }
  function compareValue(a, b, direction) {
    if (a === null || b === null) return a === b ? 0 : a === null ? 1 : -1;
    return (a < b ? -1 : a > b ? 1 : 0) * -direction;
  }
  function compareRows(a, b, key, direction) {
    key = key || 'depth';
    var order = compareValue(value(a, key), value(b, key), direction);
    if (order) return order;
    var ties = key === 'depth' ? ['evidence', 'date'] : key === 'date' ? ['evidence', 'depth'] : ['depth', 'evidence', 'date'];
    for (var i = 0; i < ties.length; i++) {
      if (ties[i] === key) continue;
      order = compareValue(value(a, ties[i]), value(b, ties[i]), 1);
      if (order) return order;
    }
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  }

  return { normalize: normalize, parse: parse, prepare: prepare, field: field, match: match, explain: explain, compareRows: compareRows };
});
