'use strict';

var dailystats = {
  name: 'dailystats'
  , label: 'Daily Stats'
  , pluginType: 'report'
};

function init () {
  return dailystats;
}

module.exports = init;

dailystats.html = function html (client) {
  var translate = client.translate;
  var ret =
    '<h2>' + translate('Daily stats report') + '</h2>' +
    '<div id="dailystats-report"></div>';
  return ret;
};

dailystats.css =
  '#dailystats-placeholder .tdborder {' +
  '  width:80px;' +
  '  border: 1px #ccc solid;' +
  '  margin: 0;' +
  '  padding: 1px;' +
  '  text-align:center;' +
  '}' +
  '#dailystats-placeholder .inlinepiechart {' +
  '  width: 2.2in;' +
  '  height: 0.9in;' +
  '}';

dailystats.report = function report_dailystats (datastorage, sorteddaystoshow, options) {
  var Nightscout = window.Nightscout;
  var client = Nightscout.client;
  var translate = client.translate;
  var report_plugins = Nightscout.report_plugins;

  var ss = require('simple-statistics');

  var todo = [];
  var report = $('#dailystats-report');
  var minForDay, maxForDay, sum;

  report.empty();
  var table = $('<table class="centeraligned">');
  report.append(table);
  var thead = $('<tr/>');
  $('<th></th>').appendTo(thead);
  $('<th>' + translate('Date') + '</th>').appendTo(thead);
  $('<th>' + translate('Low') + '</th>').appendTo(thead);
  $('<th>' + translate('Normal') + '</th>').appendTo(thead);
  $('<th>' + translate('High') + '</th>').appendTo(thead);
  $('<th>' + translate('Readings') + '</th>').appendTo(thead);
  $('<th>' + translate('Min') + '</th>').appendTo(thead);
  $('<th>' + translate('Max') + '</th>').appendTo(thead);
  $('<th>' + translate('Average') + '</th>').appendTo(thead);
  $('<th>' + translate('StDev') + '</th>').appendTo(thead);
  $('<th>' + translate('25%') + '</th>').appendTo(thead);
  $('<th>' + translate('Median') + '</th>').appendTo(thead);
  $('<th>' + translate('75%') + '</th>').appendTo(thead);
  $('<th>' + translate('TDD') + '</th>').appendTo(thead);
  thead.appendTo(table);

  sorteddaystoshow.forEach(function(day) {
    var tr = $('<tr>');

    var daysRecords = datastorage[day].statsrecords;

    if (daysRecords.length === 0) {
      $('<td/>').appendTo(tr);
      $('<td class="tdborder" style="width:160px">' + report_plugins.utils.localeDate(day) + '</td>').appendTo(tr);
      $('<td  class="tdborder"colspan="10">' + translate('No data available') + '</td>').appendTo(tr);
      table.append(tr);
      return;
    }

    minForDay = daysRecords[0].sgv;
    maxForDay = daysRecords[0].sgv;
    sum = 0;

    var stats = daysRecords.reduce(function(out, record) {
      record.sgv = parseFloat(record.sgv);
      if (record.sgv < options.targetLow) {
        out.lows++;
      } else if (record.sgv < options.targetHigh) {
        out.normal++;
      } else {
        out.highs++;
      }
      if (minForDay > record.sgv) {
        minForDay = record.sgv;
      }
      if (maxForDay < record.sgv) {
        maxForDay = record.sgv;
      }
      sum += record.sgv;
      return out;
    }, {
      lows: 0
      , normal: 0
      , highs: 0
    });
    var average = sum / daysRecords.length;
    
    //Adding calculations for TDD
    var to = moment(day).add(1, 'days');
    var from = moment(day);
    var dt = moment(from); 
    
    
    
    
    var tddSum = 0;
  var basalSum = 0;
  var baseBasalSum = 0;
  var bolusSum = 0;
    
     data.netBasalPositive = [];
    data.netBasalNegative = [];
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].forEach(function(hour) {
      data.netBasalPositive[hour] = 0;
      data.netBasalNegative[hour] = 0;
    });

    profile.loadData(datastorage.profiles);

    profile.updateTreatments(datastorage.profileSwitchTreatments, datastorage.tempbasalTreatments, datastorage.combobolusTreatments);

    
    
        var bolusInsulin = 0;
    var baseBasalInsulin = 0;
    var positiveTemps = 0;
    var negativeTemps = 0;
    
    
     data.treatments.forEach(function(treatment) {
      // Calculate bolus stats
      if (treatment.insulin) {
        bolusInsulin += treatment.insulin;
      }
      // Combo bolus part
      if (treatment.relative) {
        bolusInsulin += treatment.relative;
      }
       
       
               var date = dt.format('x');
        var hournow = dt.hour();
        var basalvalue = profile.getTempBasal(date);
        // Calculate basal stats
        baseBasalInsulin += basalvalue.basal * 5 / 60; // 5 minutes part
        var tempPart = (basalvalue.tempbasal - basalvalue.basal) * 5 / 60;
        if (tempPart > 0) {
          positiveTemps += tempPart;
          data.netBasalPositive[hournow] += tempPart;
        }
        if (tempPart < 0) {
          negativeTemps += tempPart;
          data.netBasalNegative[hournow] += tempPart;
        }

        if (!_.isEqual(lastbasal, basalvalue)) {
          linedata.push({ d: date, b: basalvalue.totalbasal });
          notemplinedata.push({ d: date, b: basalvalue.basal });
          if (basalvalue.combobolustreatment && basalvalue.combobolustreatment.relative) {
            tempbasalareadata.push({ d: date, b: basalvalue.tempbasal });
            basalareadata.push({ d: date, b: 0 });
            comboareadata.push({ d: date, b: basalvalue.totalbasal });
          } else if (basalvalue.treatment) {
            tempbasalareadata.push({ d: date, b: basalvalue.totalbasal });
            basalareadata.push({ d: date, b: 0 });
            comboareadata.push({ d: date, b: 0 });
          } else {
            tempbasalareadata.push({ d: date, b: 0 });
            basalareadata.push({ d: date, b: basalvalue.totalbasal });
            comboareadata.push({ d: date, b: 0 });
          }
        }
        lastbasal = basalvalue;
      }
    }
       
        console.log('Insulin for day: ' + day + ' bolus: ' + bolusInsulin + ' basebasal: ' + baseBasalInsulin + ' positiveTemps: ' + positiveTemps + ' negativeTemps: ' + negativeTemps);
       var totalBasalInsulin = baseBasalInsulin + positiveTemps + negativeTemps;
    var totalDailyInsulin = bolusInsulin + baseBasalInsulin + positiveTemps + negativeTemps;
       
       
    
    // TDD calc ends
    
    

    var bgValues = daysRecords.map(function(r) { return r.sgv; });
    $('<td><div id="dailystat-chart-' + day.toString() + '" class="inlinepiechart"></div></td>').appendTo(tr);

    $('<td class="tdborder" style="width:160px">' + report_plugins.utils.localeDate(day) + '</td>').appendTo(tr);
    $('<td class="tdborder">' + Math.round((100 * stats.lows) / daysRecords.length) + '%</td>').appendTo(tr);
    $('<td class="tdborder">' + Math.round((100 * stats.normal) / daysRecords.length) + '%</td>').appendTo(tr);
    $('<td class="tdborder">' + Math.round((100 * stats.highs) / daysRecords.length) + '%</td>').appendTo(tr);
    $('<td class="tdborder">' + daysRecords.length + '</td>').appendTo(tr);
    $('<td class="tdborder">' + minForDay + '</td>').appendTo(tr);
    $('<td class="tdborder">' + maxForDay + '</td>').appendTo(tr);
    $('<td class="tdborder">' + average.toFixed(1) + '</td>').appendTo(tr);
    $('<td class="tdborder">' + ss.standard_deviation(bgValues).toFixed(1) + '</td>').appendTo(tr);
    $('<td class="tdborder">' + ss.quantile(bgValues, 0.25).toFixed(1) + '</td>').appendTo(tr);
    $('<td class="tdborder">' + ss.quantile(bgValues, 0.5).toFixed(1) + '</td>').appendTo(tr);
    $('<td class="tdborder">' + ss.quantile(bgValues, 0.75).toFixed(1) + '</td>').appendTo(tr);
    $('<td class="tdborder">' + totalDailyInsulin.toFixed(1) + '</td>').appendTo(tr);

    table.append(tr);
    var inrange = [
      {
        label: translate('Low')
        , data: Math.round(stats.lows * 1000 / daysRecords.length) / 10
      }
      , {
        label: translate('In Range')
        , data: Math.round(stats.normal * 1000 / daysRecords.length) / 10
      }
      , {
        label: translate('High')
        , data: Math.round(stats.highs * 1000 / daysRecords.length) / 10
      }
    ];
    $.plot(
      '#dailystat-chart-' + day.toString()
      , inrange, {
        series: {
          pie: {
            show: true
          }
        }
        , colors: ['#f88', '#8f8', '#ff8']
      }
    );
  });

  setTimeout(function() {
    todo.forEach(function(fn) {
      fn();
    });
  }, 50);
};
