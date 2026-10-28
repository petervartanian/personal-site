/* Pure helpers shared by the explorer and its regression checks. */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.AIBDExplorer = api;
})(typeof window === 'undefined' ? globalThis : window, function () {
  'use strict';
  function validDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return '';
    var date = new Date(value + 'T00:00:00Z');
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value ? value : '';
  }
  function inDateRange(date, from, to) {
    if (!from && !to) return true;
    date = validDate(date);
    return !!date && (!from || date >= from) && (!to || date <= to) && !(from && to && from > to);
  }
  function caseIds(value) {
    return Array.from(new Set(String(value || '').split(',').map(function (id) {
      id = id.trim();
      return /^\d{4,}$/.test(id) ? 'AIBD-' + id : id;
    }).filter(function (id) { return /^AIBD-\d{4,}$/.test(id); })));
  }
  function csvCell(value) {
    value = String(value == null ? '' : value);
    // A spreadsheet must treat source text as text, including formula-like names.
    if (/^[\s]*[=+@-]/.test(value) || /^[\t\r\n]/.test(value)) value = "'" + value;
    return '"' + value.replace(/"/g, '""') + '"';
  }
  function csv(headers, rows) {
    return '\uFEFF' + [headers].concat(rows).map(function (row) { return row.map(csvCell).join(','); }).join('\r\n');
  }
  function aggregate(rows, group) {
    var years = Object.create(null), categories = new Set(), undated = 0;
    rows.forEach(function (row) {
      var date = validDate(row.date);
      if (!date) { undated += 1; return; }
      var year = date.slice(0, 4), category = row[group] || 'Unspecified';
      if (!years[year]) years[year] = { year: year, total: 0, groups: Object.create(null) };
      years[year].total += 1;
      years[year].groups[category] = (years[year].groups[category] || 0) + 1;
      categories.add(category);
    });
    return { years: Object.keys(years).sort().map(function (year) { return years[year]; }), categories: Array.from(categories).sort(), undated: undated };
  }
  return { validDate: validDate, inDateRange: inDateRange, caseIds: caseIds, csv: csv, aggregate: aggregate };
});
