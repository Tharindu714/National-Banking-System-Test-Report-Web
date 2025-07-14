/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 91.30434782608695, "KoPercent": 8.695652173913043};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9130434782608695, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "security_checking http request successful...-0"], "isController": false}, {"data": [1.0, 500, 1500, "security_checking http request successful...-1"], "isController": false}, {"data": [1.0, 500, 1500, "Transfer GET request successful...-0"], "isController": false}, {"data": [1.0, 500, 1500, "Admin Logout http request successful...-0"], "isController": false}, {"data": [0.0, 500, 1500, "Account Creation http GET request successful..."], "isController": false}, {"data": [1.0, 500, 1500, "Transfer GET request successful...-1"], "isController": false}, {"data": [1.0, 500, 1500, "Logout http request successful...-1"], "isController": false}, {"data": [1.0, 500, 1500, "Admin Logout http request successful..."], "isController": false}, {"data": [1.0, 500, 1500, "Transfer GET request successful..."], "isController": false}, {"data": [1.0, 500, 1500, "security_checking http request successful..."], "isController": false}, {"data": [1.0, 500, 1500, "Logout http request successful...-0"], "isController": false}, {"data": [1.0, 500, 1500, "Admin Logout http request successful...-2"], "isController": false}, {"data": [0.0, 500, 1500, "deposit http POST request successful..."], "isController": false}, {"data": [1.0, 500, 1500, "Admin Logout http request successful...-1"], "isController": false}, {"data": [1.0, 500, 1500, "Home access http request successful...-1"], "isController": false}, {"data": [1.0, 500, 1500, "Home access http request successful...-0"], "isController": false}, {"data": [1.0, 500, 1500, "Login http request successful..."], "isController": false}, {"data": [1.0, 500, 1500, "Profile GET request successful...-1"], "isController": false}, {"data": [1.0, 500, 1500, "Logout http request successful..."], "isController": false}, {"data": [1.0, 500, 1500, "index http request successful..."], "isController": false}, {"data": [1.0, 500, 1500, "Home access http request successful..."], "isController": false}, {"data": [1.0, 500, 1500, "Profile GET request successful...-0"], "isController": false}, {"data": [1.0, 500, 1500, "Profile GET request successful..."], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23000, 2000, 8.695652173913043, 1.8655217391304368, 0, 103, 1.0, 2.0, 3.0, 7.0, 779.2647806200237, 3283.850637387769, 167.61868964933083], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["security_checking http request successful...-0", 1000, 0, 0.0, 1.3639999999999997, 0, 48, 1.0, 2.0, 3.0, 11.990000000000009, 33.99163805703797, 17.062208946599135, 6.10787246337401], "isController": false}, {"data": ["security_checking http request successful...-1", 1000, 0, 0.0, 1.2699999999999982, 0, 34, 1.0, 2.0, 3.0, 9.0, 33.99279352777211, 74.3592358420015, 4.879824852131348], "isController": false}, {"data": ["Transfer GET request successful...-0", 1000, 0, 0.0, 3.734000000000007, 1, 100, 2.0, 7.0, 13.0, 36.960000000000036, 34.00897837028976, 23.248325057815265, 5.812081264453816], "isController": false}, {"data": ["Admin Logout http request successful...-0", 1000, 0, 0.0, 0.831000000000001, 0, 20, 1.0, 1.0, 2.0, 8.990000000000009, 33.99857205997348, 19.190600244789717, 4.747847465406453], "isController": false}, {"data": ["Account Creation http GET request successful...", 1000, 1000, 100.0, 0.8029999999999988, 0, 28, 1.0, 1.0, 2.0, 6.0, 34.00088402298459, 42.46790104042705, 4.9805982455543845], "isController": false}, {"data": ["Transfer GET request successful...-1", 1000, 0, 0.0, 1.3129999999999984, 0, 28, 1.0, 2.0, 3.0, 8.980000000000018, 34.01129174886062, 264.6503639208217, 6.410331355009863], "isController": false}, {"data": ["Logout http request successful...-1", 1000, 0, 0.0, 1.2930000000000001, 0, 28, 1.0, 2.0, 3.0, 8.0, 33.9951047049225, 264.5244084851781, 5.610520210089747], "isController": false}, {"data": ["Admin Logout http request successful...", 1000, 0, 0.0, 3.416, 1, 57, 2.0, 6.0, 9.0, 20.99000000000001, 33.9951047049225, 110.6168836687517, 15.736015263802011], "isController": false}, {"data": ["Transfer GET request successful...", 1000, 0, 0.0, 5.130000000000006, 2, 103, 3.0, 9.0, 17.0, 43.0, 34.007821799013776, 287.87089780649546, 12.221560959020573], "isController": false}, {"data": ["security_checking http request successful...", 1000, 0, 0.0, 2.6980000000000026, 1, 52, 2.0, 4.0, 6.0, 16.0, 33.99048266485384, 91.41580982324949, 10.987157970768184], "isController": false}, {"data": ["Logout http request successful...-0", 1000, 0, 0.0, 0.8129999999999994, 0, 24, 1.0, 1.0, 2.0, 8.0, 33.99394907706428, 18.192074310772682, 4.5480185776931705], "isController": false}, {"data": ["Admin Logout http request successful...-2", 1000, 0, 0.0, 1.2610000000000015, 0, 38, 1.0, 2.0, 3.0, 9.0, 33.99857205997348, 74.371876381192, 4.880654387515724], "isController": false}, {"data": ["deposit http POST request successful...", 1000, 1000, 100.0, 2.694000000000003, 1, 42, 2.0, 4.0, 6.0, 14.0, 34.00088402298459, 34.731371765665905, 7.570509333242664], "isController": false}, {"data": ["Admin Logout http request successful...-1", 1000, 0, 0.0, 1.178999999999999, 0, 19, 1.0, 2.0, 3.0, 10.980000000000018, 33.99857205997348, 17.065689491041375, 6.109118417026485], "isController": false}, {"data": ["Home access http request successful...-1", 1000, 0, 0.0, 1.3799999999999983, 0, 48, 1.0, 2.0, 3.0, 11.0, 33.98701695952146, 264.4614757162764, 6.405756126159807], "isController": false}, {"data": ["Home access http request successful...-0", 1000, 0, 0.0, 0.9700000000000008, 0, 29, 1.0, 1.0, 2.949999999999932, 7.0, 33.98586188145732, 23.23252277052746, 4.480557962887439], "isController": false}, {"data": ["Login http request successful...", 1000, 0, 0.0, 1.299999999999999, 0, 21, 1.0, 2.0, 3.0, 8.0, 33.98932735121172, 264.4794534516162, 6.406191580843616], "isController": false}, {"data": ["Profile GET request successful...-1", 1000, 0, 0.0, 1.293999999999999, 0, 20, 1.0, 2.0, 3.0, 9.0, 34.014762406884586, 264.6773699785707, 5.9127223715092345], "isController": false}, {"data": ["Logout http request successful...", 1000, 0, 0.0, 2.1770000000000023, 0, 35, 2.0, 4.0, 6.0, 15.0, 33.99279352777211, 282.69788054932354, 10.158002753416277], "isController": false}, {"data": ["index http request successful...", 1000, 0, 0.0, 1.5039999999999962, 0, 71, 1.0, 2.0, 3.0, 12.0, 33.90060343074107, 263.78907044545394, 4.336893602956132], "isController": false}, {"data": ["Home access http request successful...", 1000, 0, 0.0, 2.429, 1, 49, 2.0, 4.0, 6.0, 20.99000000000001, 33.98470688190314, 287.6752336448598, 10.8857264231096], "isController": false}, {"data": ["Profile GET request successful...-0", 1000, 0, 0.0, 1.3430000000000013, 0, 31, 1.0, 2.0, 3.0, 12.990000000000009, 34.01244855617156, 19.530585694364138, 6.543410513247848], "isController": false}, {"data": ["Profile GET request successful...", 1000, 0, 0.0, 2.710999999999995, 1, 35, 2.0, 4.0, 7.0, 19.99000000000001, 34.01129174886062, 284.18028535473775, 12.455307036936263], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 1000, 50.0, 4.3478260869565215], "isController": false}, {"data": ["403/Not allowed", 1000, 50.0, 4.3478260869565215], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23000, 2000, "500/Internal Server Error", 1000, "403/Not allowed", 1000, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Account Creation http GET request successful...", 1000, 1000, "403/Not allowed", 1000, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["deposit http POST request successful...", 1000, 1000, "500/Internal Server Error", 1000, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
